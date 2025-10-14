import { Router } from "express";
import FlowInstance from "../models/FlowInstance.model.js";
import FlowAndPoint from "../models/FlowAndPoint.model.js";
import mongoose from "mongoose";
import { sendApprovalRequestEmail } from "../utils/emailService.js";
import Department from "../models/Department.model.js";
import generateGlobalIndex from "../utils/generateGlobalIndex.js";
import DownloadedProcess from "../models/DownloadedProcess.model.js";
import generateExcelFile from "../utils/generateExcelFile.js";
import UserRefrensi from "../models/User.model.js";
import checkOperator from "../utils/checkingOperator.js";
import ExcelJS from "exceljs";

const router = Router();

export async function checkDuplidateGlobalIndex(globalIndex) {
  const duplicatedGlobalIndex = await FlowInstance.findOne({
    globalIndex: globalIndex,
  }).lean();

  if (duplicatedGlobalIndex) {
    return true;
  } else {
    return false;
  }
}

//flow instance untuk start flow baru dengan template yang dipilih
router.post("/request/new", async (req, res) => {
  const {
    instanceTitle,
    flowTemplateId,
    overallStatus,
    requestData,
    selectedAuthorized,
  } = req.body;

  if (!selectedAuthorized?.length) {
    return res.status(400).json({
      message: "selectedAuthorized setidaknya satu diisi.",
    });
  }

  // 1. Validasi awal untuk keberadaan data utama
  if (!instanceTitle || !flowTemplateId || !overallStatus || !requestData) {
    return res.status(400).json({
      message:
        "instanceTitle, flowTemplateId, overallStatus, dan requestData wajib diisi.",
    });
  }

  try {
    const userId = req.user._id;
    const globalIndex = await generateGlobalIndex(req, "globalIndex");

    //cari department saya
    const myDepartment = await Department.findOne({
      org: req.user.org,
      members: { $in: [userId] },
    });

    const isDeparmentInclude = await FlowAndPoint.findOne({
      _id: flowTemplateId,
      org: req.user.org,
      allowedDepartmentToRequest: { $in: [myDepartment._id] },
    }).lean();

    const isUserPrivateInclude = await FlowAndPoint.findOne({
      _id: flowTemplateId,
      org: req.user.org,
      allowedSpecificUserToRequest: { $in: [userId] },
    });

    const template = await FlowAndPoint.findOne({
      _id: flowTemplateId,
      org: req.user.org,
    }).populate([
      { path: "request" }, // Populate dokumen Input di dalam array request
      { path: "status.authorized" }, // Populate user refrensi jika perlu
    ]);

    if (!template) {
      return res.status(400).json({ message: "Flow template tidak ditemukan" });
    }
    //validasi apakah si user boleh untuk buat request
    if (template.isAllowanceModeRequest) {
      if (template.mode === "private") {
        if (!isUserPrivateInclude) {
          return res.status(400).json({
            message:
              "Flow template ini private dan anda tidak memiliki autorisasi untuk melakukan request ini",
          });
        }
      }
      if (template.mode == "department") {
        if (!isDeparmentInclude) {
          return res.status(400).json({
            message:
              "Departmement anda tidak terdaftar untuk melakukan request ini",
          });
        }
      }
    }
    // 3. PENYELESAIAN MASALAH UTAMA: Gunakan loop `for...of` untuk validasi
    // Loop `for...of` akan 'menunggu' (pause) pada setiap `await` di dalamnya.
    // Kita juga langsung menggunakan hasil populate, tidak perlu query ke DB lagi.
    for (const inputField of template.request) {
      // `inputField` sekarang adalah dokumen 'Input' yang lengkap, bukan hanya ID.
      if (!inputField.isNullable) {
        // Cek jika field yang wajib diisi tidak ada di requestData atau nilainya kosong
        const value = requestData[inputField._id.toString()];
        if (value === undefined || value === null || value === "") {
          // Berikan pesan error yang lebih jelas menggunakan judul dari template
          return res.status(400).json({
            message: `Input '${
              inputField.title || inputField._id
            }' wajib diisi.`,
          });
        }
      }
    }

    // 4. PENINGKATAN: Inisialisasi array `statuses` untuk FlowInstance baru
    // Berdasarkan `status` dari `flowTemplate`
    const statusesFromTemplate = template.status.map((s) => ({
      statusTitle: s.title,
      statusDesc: s.desc,
      requirementsData: {}, // Default kosong
      completed: false,
      verdict: "pending",
      isPrivateAuthorized: template.isPrivateRequest,
    }));

    // 5. Jika semua validasi berhasil, buat instance baru
    const flowInstance = await FlowInstance.create({
      instanceTitle: instanceTitle,
      flowTemplate: flowTemplateId,
      requestedBy: userId,
      requestData: requestData,
      overallStatus: overallStatus,
      statuses: statusesFromTemplate, // Tambahkan status yang sudah diinisialisasi
      currentStatusIndex: 0, // Mulai dari index 0
      org: req.user.org,
      globalIndex: globalIndex,
    });

    // --- Start Email Notification Logic for First Approver (yang dipilih) ---
    try {
      if (flowInstance.overallStatus === "in-progress") {
        let nextApprovers = selectedAuthorized;
        console.log(selectedAuthorized);

        nextApprovers = await UserRefrensi.find({
          _id: { $in: nextApprovers }, // langsung pakai array ID
        });

        if (nextApprovers.length > 0) {
          await sendApprovalRequestEmail(
            nextApprovers,
            flowInstance,
            req?.user?.username || "System (Initial Request)"
          );
        }
      }

      // --- End Email Notification Logic ---
      return res
        .status(201) // Gunakan 201 Created untuk resource baru
        .json({ message: "Flow instance berhasil dibuat", data: flowInstance });
    } catch (emailError) {
      return res.status(500).json({
        message: "Terjadi kesalahan saat mengirim email",
        error: emailError,
      });
    }
  } catch (error) {
    // Tangani kemungkinan error duplikasi `instanceTitle` jika ada unique index
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Instance dengan judul '${instanceTitle}' sudah ada.`,
        error: error,
      });
    }
    console.log("Error saat membuat flow instance:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//untuk edit flow yg telah dibuat
router.put("/edit/:instanceId", async (req, res) => {
  const { instanceId } = req.params;
  const { instanceTitle, overallStatus, requestData } = req.body;

  try {
    const flowInstance = await FlowInstance.findOneAndUpdate(
      { _id: instanceId, org: req.user.org },
      {
        instanceTitle,
        overallStatus,
        requestData,
      }
    );

    return res.json({
      message: "Flow instance berhasil diupdate",
      data: flowInstance,
    });
  } catch (error) {
    console.log("Error saat mengupdate flow instance:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

//light mode list
router.get("/getFlowInstanceList/:instanceId?", async (req, res) => {
  const { instanceId } = req.params;
  const {
    flowTemplateCategory,
    overallStatus,
    requestedBy,
    requestDate,
    isMyRequestOnly,
    isMyDepartmentOnly,
    limit = "10",
    page = "1",
    search,
    verboseSearch,
  } = req.query;

  const isMyRequest = isMyRequestOnly === "true";
  const isMyDept = isMyDepartmentOnly === "true";
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const pageNum = Math.max(1, parseInt(page) || 1);

  try {
    if (verboseSearch === "true") {
      const keyword = search || "";
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 25;
      const skipNum = (pageNum - 1) * limitNum;
      const pipeline = [
        {
          $addFields: {
            combinedText: {
              $function: {
                body: function (reqData, statuses) {
                  return JSON.stringify(reqData) + JSON.stringify(statuses);
                },
                args: ["$requestData", "$statuses"],
                lang: "js",
              },
            },
          },
        },
        { $match: { combinedText: { $regex: keyword, $options: "i" } } },
        { $skip: skipNum },
        { $limit: limitNum },
        { $project: { _id: 1 } },
      ];
      const matchedDocs = await FlowInstance.aggregate(pipeline);
      const ids = matchedDocs.map((doc) => doc._id);
      if (ids.length === 0) {
        return res.json({ data: [] });
      }
      const results = await FlowInstance.find({ _id: { $in: ids } })
        .populate("requestedBy", "username")
        .populate({
          path: "flowTemplate",
          select: "title desc _id",
          populate: [
            { path: "request", model: "Input" },
            { path: "status.requirements", model: "Input" },
            {
              path: "status.authorized",
              model: "UserRefrensi",
              select: "_id username",
            },
          ],
        })
        .select("-requestData logics status")
        .sort({ createdAt: -1 });

      return res.json({ data: results });
    }

    // Ambil authorized templates (dipakai bila perlu)
    const authorizedTemplateIds = await FlowAndPoint.find({
      org: req.user.org,
      "status.authorized": req.user._id,
    }).distinct("_id");

    // Ambil dept templates hanya jika tab dept dipilih
    let deptTemplateIds = [];
    if (isMyDept) {
      const myDept = await Department.findOne({
        org: req.user.org,
        members: req.user._id,
      });
      if (myDept) {
        deptTemplateIds = await FlowAndPoint.find({
          org: req.user.org,
          allowedDepartmentToRequest: myDept._id,
        }).distinct("_id");
      }
      // jika myDept tidak ada -> deptTemplateIds tetap []
      if (!deptTemplateIds.length) {
        // no templates for this department => result pasti kosong
        return res.status(200).json({ data: [], totalPage: 0, totalData: 0 });
      }
    }

    // Jika user kirim requestedBy sebagai username atau id -> resolve ke ObjectId
    let requestedById = null;
    if (requestedBy) {
      if (mongoose.isValidObjectId(requestedBy)) {
        requestedById = new mongoose.Types.ObjectId(requestedBy);
      } else {
        const userRef = await UserRefrensi.findOne({
          username: requestedBy,
          org: req.user.org,
        }).select("_id");
        if (userRef) requestedById = userRef._id;
      }
    }

    // Build initial query berdasarkan tab
    // Tab precedence: isMyRequest -> isMyDept -> all
    let finalQuery = { org: req.user.org };

    if (instanceId) {
      finalQuery._id = new mongoose.Types.ObjectId(instanceId);
    } else if (isMyRequest) {
      // Tab "My Request" — forced requestedBy = me (override requestedBy param)
      finalQuery.requestedBy = new mongoose.Types.ObjectId(req.user._id);
    } else if (isMyDept) {
      // Tab "My Department" — hanya templates yg diijinkan dept
      finalQuery = {
        ...finalQuery,
        $or: [
          { flowTemplate: { $in: deptTemplateIds } },
          { flowTemplate: { $in: authorizedTemplateIds } },
        ],
      };
    } else {
      // Tab "All" — mulai dengan org saja (tampil semua dalam org)
      // If you want "all" to be restricted to authorizedTemplateIds, change this behaviour.
    }

    // Setelah tab, apply filters yang lebih sempit
    // 1) flowTemplateCategory (intersect dengan existing flowTemplate if exists)
    if (
      flowTemplateCategory &&
      mongoose.isValidObjectId(flowTemplateCategory)
    ) {
      const tplId = new mongoose.Types.ObjectId(flowTemplateCategory);
      if (finalQuery.flowTemplate) {
        // sudah ada flowTemplate (misal dari dept) -> jadi intersection
        // convert to $and to combine properly
        finalQuery = {
          $and: [finalQuery, { flowTemplate: tplId }],
          org: req.user.org,
        };
      } else {
        finalQuery.flowTemplate = tplId;
      }
    }

    // 2) overallStatus
    if (overallStatus) {
      if (finalQuery.$and) {
        finalQuery = {
          $and: [...finalQuery.$and, { overallStatus }],
          org: req.user.org,
        };
      } else {
        finalQuery.overallStatus = overallStatus;
      }
    }

    // 3) requestedBy (hanya apply kalau bukan tab "My Request", karena tab My Request sudah override)
    if (!isMyRequest && requestedById) {
      if (finalQuery.$and) {
        finalQuery = {
          $and: [...finalQuery.$and, { requestedBy: requestedById }],
          org: req.user.org,
        };
      } else {
        finalQuery.requestedBy = requestedById;
      }
    }

    // 4) requestDate -> filter createdAt range
    if (requestDate) {
      const start = new Date(requestDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(requestDate);
      end.setHours(23, 59, 59, 999);
      const dateCond = { createdAt: { $gte: start, $lte: end } };

      if (finalQuery.$and) {
        finalQuery = {
          $and: [...finalQuery.$and, dateCond],
          org: req.user.org,
        };
      } else {
        finalQuery = { ...finalQuery, ...dateCond };
      }
    }

    // 5) search — terakhir. (simple search: instanceTitle & globalIndex)
    if (search && String(search).trim() !== "") {
      const regex = new RegExp(String(search).trim(), "i");
      const searchCond = {
        $or: [
          { instanceTitle: { $regex: regex } },
          { globalIndex: { $regex: regex } },
        ],
      };

      if (finalQuery.$and) {
        finalQuery = {
          $and: [...finalQuery.$and, searchCond],
          org: req.user.org,
        };
      } else {
        // jika finalQuery punya beberapa key, combine dengan $and
        const keys = Object.keys(finalQuery).filter((k) => k !== "org");
        if (keys.length > 0) {
          const existing = { ...finalQuery };
          delete existing.org;
          finalQuery = { org: req.user.org, $and: [existing, searchCond] };
        } else {
          finalQuery = { ...finalQuery, ...searchCond };
        }
      }
    }

    // lakukan count dan fetch (tanpa populate di count)
    const totalData = await FlowInstance.countDocuments(finalQuery);
    const totalPage = Math.ceil(totalData / limitNum);

    const flowInstanceList = await FlowInstance.find(finalQuery)
      .populate("requestedBy", "username")
      .populate({
        path: "flowTemplate",
        select: "title desc _id status",
        populate: [
          { path: "request", model: "Input" },
          { path: "status.requirements", model: "Input" },
          {
            path: "status.authorized",
            model: "UserRefrensi",
            select: "_id username",
          },
        ],
      })
      .select("-requestData")
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    return res
      .status(200)
      .json({ data: flowInstanceList, totalPage, totalData });
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ message: "Terjadi kesalahan server", error: error.message });
  }
});

//ini lengkap dapatin template nya beserta instance flow nya
router.get("/flowInstanceById/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      message: "Id diperlukan",
    });
  }

  try {
    const flowInstance = await FlowInstance.findOne({
      _id: id,
      org: req.user.org,
    })
      .populate({
        path: "flowTemplate",
        populate: [
          { path: "request", model: "Input" },
          { path: "status.requirements", model: "Input" },
          {
            path: "status.authorized",
            model: "UserRefrensi",
            select: "_id username displayName",
          },
        ],
      })
      .populate("statuses.completedBy", "username")
      .populate("requestedBy", "username");

    //jika currentStatusIndex saat ini memliki logic jumpTo maka merge authorized dengan status.authorized dengan target status jumpTo
    const currentLogicIdx = flowInstance.flowTemplate.logics.findIndex(
      (logic) =>
        flowInstance.flowTemplate.status[
          flowInstance.currentStatusIndex
        ].requirements.some(
          (requirement) => String(requirement._id) === logic.requirementId
        )
    );

    if (currentLogicIdx != -1) {
      const currentLogic = flowInstance.flowTemplate.logics[currentLogicIdx];
      const jumpToStatusUuidExtracted = flowInstance.flowTemplate.status.find(
        (status) => String(status?.uuid) === currentLogic.jumpToStatusUuid
      );

      flowInstance.flowTemplate.status[
        flowInstance.currentStatusIndex
      ].authorized = [
        ...flowInstance.flowTemplate.status[flowInstance.currentStatusIndex]
          .authorized,
        ...jumpToStatusUuidExtracted.authorized,
      ];
    }

    //untuk mencegah error karena flowTemplate status bertambah
    let isDiff = false;
    if (
      flowInstance.statuses.length != flowInstance.flowTemplate.status.length
    ) {
      for (let i = 0; i < flowInstance.flowTemplate.status.length; i++) {
        // Jika status belum ada, buat baru
        if (!flowInstance.statuses[i]) {
          flowInstance.statuses[i] = {
            statusTitle: flowInstance.flowTemplate.status[i].title,
            statusDesc: flowInstance.flowTemplate.status[i].desc,
            requirementsData: {},
            completed: false,
            verdict: "pending",
            isPrivateAuthorized: false,
          };
        } else {
          // Update status yang sudah ada
          flowInstance.statuses[i].statusTitle =
            flowInstance.flowTemplate.status[i].title;
          flowInstance.statuses[i].statusDesc =
            flowInstance.flowTemplate.status[i].desc;
        }
      }

      await flowInstance.save();
      isDiff = true;
    }

    return res.json({
      message: isDiff
        ? "Terjadi perbedaan status dengan template dan telah disesuikan"
        : "berhasil mengambil data flow instance",
      data: flowInstance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//submit maju 1 step atau maju berdasarkan logic jika ada
router.post("/submitStatusFulfillment/:instanceId", async (req, res) => {
  const { statuses: currentIndexStatusResponse, selectedAuthorized } = req.body;

  const instanceId = req.params.instanceId;

  if (!selectedAuthorized?.length) {
    return res
      .status(400)
      .json({ message: "Gagal, selectedAuthorized kosong" });
  }

  if (
    !selectedAuthorized?.length &&
    currentIndexStatusResponse.verdict === "approved"
  ) {
    return res.status(400).json({
      message: "selectedAuthorized setidaknya satu diisi.",
    });
  }

  if (!currentIndexStatusResponse) {
    return res.status(400).json({ message: "Gagal, status data tidak ada" });
  }

  try {
    const userId = req.user._id;

    const flowInstance = await FlowInstance.findOne({
      _id: instanceId,
      org: req.user.org,
    })
      .populate({
        path: "flowTemplate",
        populate: [
          { path: "request", model: "Input" },
          { path: "status.requirements", model: "Input" },
          {
            path: "status.authorized",
            model: "UserRefrensi",
            select: "_id username email",
          },
        ],
      })
      .populate({
        path: "statuses",
        populate: [
          {
            path: "authorizedUsers",
            model: "UserRefrensi",
            select: "_id username",
          },
        ],
      });

    if (!flowInstance) {
      return res.status(400).json({
        message: "gagal, tidak ditemukan data instance ",
      });
    }

    if (flowInstance.overallStatus != "in-progress") {
      if (flowInstance.overallStatus != "draft") {
        return res.status(400).json({
          message:
            "Gagal, overall status tidak public, ubah daft menjadi in-progress pada request nya",
        });
      }

      return res.status(400).json({
        message:
          "Gagal, overall status tidak berlaku untuk diisi karena bukan in-progress",
      });
    }

    //ambil instance requirement untuk meriksa verdict, isPrivateAuthorized
    const currentStatusIndex = flowInstance.currentStatusIndex;
    const requirementInstance = flowInstance.statuses[currentStatusIndex];

    //ambil template requirement untuk meriksa authorizedUsers
    const requirementsTemplate =
      flowInstance.flowTemplate.status[currentStatusIndex];

    const isAuthorizedUser = requirementsTemplate.authorized.some((user) =>
      user._id.equals(userId)
    );
    if (!isAuthorizedUser) {
      return res
        .status(400)
        .json({ message: "Gagal, anda tidak berhak menyelesaikan ini" });
    }

    const verdictOfRequirement = currentIndexStatusResponse.verdict;
    if (!verdictOfRequirement) {
      return res
        .status(400)
        .json({ message: "Gagal, anda perlu memutuskan lanjut atau tidak" });
    }

    //validasi body.status[$].requirements apakah semua sudah di isi yg
    if (verdictOfRequirement == "approved") {
      for (const requirement of requirementsTemplate.requirements) {
        const filled =
          currentIndexStatusResponse?.requirementsData?.[
            requirement._id?.toString()
          ] ?? currentIndexStatusResponse?.requirementsData?.[requirement._id];

        if (!requirement.isNullable && !filled) {
          return res.status(400).json({
            message: `Input '${
              requirement.title || requirement._id
            }' wajib diisi.`,
          });
        }
      }
    }

    flowInstance.statuses = flowInstance.statuses.map((status, index) => {
      if (index === currentStatusIndex) {
        return {
          ...status.toObject(), // penting! convert dari mongoose Document ke plain object
          requirementsData: currentIndexStatusResponse.requirementsData,
          completed: true,
          completedBy: userId,
          verdict: verdictOfRequirement,
          completedAt: new Date(),
          rejectedReason:
            verdictOfRequirement === "rejected"
              ? currentIndexStatusResponse?.rejectedReason
              : null,
        };
      }
      return status;
    });

    if (verdictOfRequirement === "rejected") {
      flowInstance.overallStatus = "rejected";
    }

    if (verdictOfRequirement === "approved") {
      if (currentStatusIndex == flowInstance.flowTemplate.status.length - 1) {
        flowInstance.overallStatus = "completed";
      } else {
        // ✅ Periksa apakah ada logics yang relevan untuk status saat ini
        const currentStatus =
          flowInstance.flowTemplate.status[flowInstance.currentStatusIndex];
        const relevantLogics = flowInstance.flowTemplate?.logics?.filter(
          (logic) => {
            // Hanya ambil logics yang requirementId-nya ada di status saat ini
            return currentStatus.requirements.some(
              (requirement) => String(requirement._id) === logic.requirementId
            );
          }
        );

        if (relevantLogics && relevantLogics.length > 0) {
          // ✅ Gunakan relevantLogics yang sudah difilter
          const matchingLogicRequirement = relevantLogics[0]; // Ambil logic pertama yang relevan

          //extract jawaban saat ini
          const actual =
            flowInstance.statuses[currentStatusIndex].requirementsData[
              matchingLogicRequirement?.requirementId
            ];

          //mulai logic routing
          if (matchingLogicRequirement?.logicType === "jumpTo") {
            console.log(
              actual,
              matchingLogicRequirement.value,
              matchingLogicRequirement.operator
            );
            const actualToCheck =
              typeof actual === "object" ? JSON.stringify(actual) : actual;
            const isOperatorSatisfied = checkOperator({
              actual: actualToCheck,
              operator: matchingLogicRequirement.operator,
              expected: matchingLogicRequirement.value,
            });
            if (isOperatorSatisfied) {
              const targetLogicIndex =
                flowInstance.flowTemplate.status.findIndex(
                  (status) =>
                    status.uuid === matchingLogicRequirement.jumpToStatusUuid
                );
              flowInstance.currentStatusIndex = targetLogicIndex;
              // return res.status(400).json({
              //   message: "berhasil memenuhi logic jumpTo",
              //   targetLogicIndex,
              // });
            } else {
              // return res.status(400).json({
              //   message: "gagal memenuhi logic jumpTo",
              // });
              flowInstance.currentStatusIndex += 1;
            }
          } else if (matchingLogicRequirement?.logicType === "completedIf") {
            const isOperatorSatisfied = checkOperator({
              actual,
              operator: matchingLogicRequirement.operator,
              expected: matchingLogicRequirement.value,
            });
            if (isOperatorSatisfied) {
              flowInstance.overallStatus = "completed";
              flowInstance.currentStatusIndex =
                flowInstance.flowTemplate.status.length;

              // return res.status(400).json({
              //   message: "berhasil memenuhi logic completedIf",
              // });
            } else {
              // return res.status(400).json({
              //   message: "gagal memenuhi logic completedIf",
              // });
              flowInstance.currentStatusIndex += 1;
            }
          } else if (matchingLogicRequirement?.logicType === "rejectedIf") {
            const isOperatorSatisfied = checkOperator({
              actual,
              operator: matchingLogicRequirement.operator,
              expected: matchingLogicRequirement.value,
            });
            if (isOperatorSatisfied) {
              flowInstance.overallStatus = "rejected";
              // return res.status(400).json({
              //   message: "berhasil memenuhi logic rejectedIf",
              // });
            } else {
              // return res.status(400).json({
              //   message: "gagal memenuhi logic rejectedIf",
              // });
              flowInstance.currentStatusIndex += 1;
            }
          } else if (matchingLogicRequirement?.logicType === "preventNextIf") {
            const isOperatorSatisfied = checkOperator({
              actual,
              operator: matchingLogicRequirement.operator,
              expected: matchingLogicRequirement.value,
            });
            if (isOperatorSatisfied) {
              return res.status(403).json({
                message:
                  "logic preventNextIf terpenuhi, anda tidak boleh mengisi input demikian: " +
                  actual,
              });
            } else {
              // return res.status(400).json({
              //   message: "gagal memenuhi logic preventNextIf",
              // });
              flowInstance.currentStatusIndex += 1;
            }
          } else {
            return res.status(400).json({
              message: "Terdapat logicType yang tidak dikenali ",
            });
          }
        } else {
          flowInstance.currentStatusIndex += 1;
        }
      }
    }

    await flowInstance.save();

    // --- Start Email Notification Logic ---
    if (verdictOfRequirement === "approved") {
      try {
        // The `flowInstance` variable has the `flowTemplate` populated with authorized users (including email).

        // 1. Notify users who were skipped on the step that was just completed.
        // const completedStatusTemplate =
        //   flowInstance.flowTemplate.status[currentStatusIndex]; // Use the original index
        // const skippedUsers = completedStatusTemplate.authorized.filter(
        //   (user) => !user._id.equals(userId)
        // );

        // if (skippedUsers.length > 0) {
        //   await sendSkippedUserNotification(
        //     skippedUsers,
        //     flowInstance,
        //     req.user.username,
        //     flowInstance._id
        //   );
        // }

        // 2. Notify the next approvers if the flow is not yet complete.
        if (flowInstance.overallStatus === "in-progress") {
          let nextApprovers = selectedAuthorized;

          nextApprovers = await UserRefrensi.find({
            _id: { $in: nextApprovers }, // langsung pakai array ID
          });

          if (nextApprovers.length > 0) {
            await sendApprovalRequestEmail(
              nextApprovers,
              flowInstance,
              req?.user?.username
            );
          }
        }
      } catch (emailError) {
        // Log the error but don't fail the request
        console.error("Email notification failed:", emailError);
      }
    }
    // --- End Email Notification Logic ---

    return res.json({
      message:
        "berhasil menyelesaikan proses anda, proses " +
        requirementInstance.statusTitle +
        "telah selesai.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Gagal, Internal server error" });
  }
});

router.put("/rollback/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const flowInstance = await FlowInstance.findOne({
      _id: id,
      org: req.user.org,
    }).populate({
      path: "flowTemplate",
      select: "status.authorized",
      populate: [
        {
          path: "status.authorized",
          model: "UserRefrensi",
          select: "_id username email",
        },
      ],
    });

    if (!flowInstance) {
      return res.status(400).json({ message: "request tidak ditemukan" });
    }

    if (
      flowInstance.overallStatus == "in-progress" &&
      flowInstance.currentStatusIndex == 0
    ) {
      return res.status(400).json({
        message:
          "gagal: proses telah di paling awal email telah dikirim sebelumnya",
      });
    }

    flowInstance.overallStatus = "in-progress";
    flowInstance.currentStatusIndex = 0;
    flowInstance.statuses = flowInstance.statuses.map((status) => {
      status.completed = false;
      status.completedBy = null;
      status.completedAt = null;
      status.rejectedReason = null;
      status.requirementsData = null;
      status.verdict = "pending";
      return status;
    });
    await flowInstance.save();

    await sendApprovalRequestEmail(
      flowInstance.flowTemplate.status[0].authorized,
      flowInstance,
      req.user.username
    );

    return res.json({
      message: "Berhasil mengupdate, prosess kembali ke awal",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

router.put("/undo/:id", async (req, res) => {
  const { targetStatusIndex } = req.body;

  if (targetStatusIndex === undefined) {
    return res.status(400).json({ message: "status tujuan tak boleh kosong" });
  }

  try {
    // Ambil instance + otorisasi
    const flowInstance = await FlowInstance.findOne({
      _id: req.params.id,
      org: req.user.org,
    }).populate({
      path: "flowTemplate",
      select: "status.authorized",
      populate: [
        {
          path: "status.authorized",
          model: "UserRefrensi",
          select: "_id username email",
        },
      ],
    });

    if (!flowInstance) {
      return res
        .status(404)
        .json({ message: "Flow instance tidak ditemukan." });
    }

    if (flowInstance.currentStatusIndex <= 0) {
      return res
        .status(400)
        .json({ message: "Tidak bisa undo dari status awal." });
    }

    // Otorisasi: yang boleh undo adalah authorized di step saat ini (sebelum mundur)
    const stepBeingUndoneIndex = flowInstance.currentStatusIndex;

    //main
    if (flowInstance.currentStatusIndex < targetStatusIndex) {
      return res
        .status(400)
        .json({ message: "Tidak bisa undo ke step di atas." });
    }
    flowInstance.currentStatusIndex = targetStatusIndex;

    // RESET jawaban yang didepan targetstatusIndex (yang akan diisi ulang)
    for (
      let i = flowInstance?.currentStatusIndex;
      i < flowInstance.statuses.length;
      i++
    ) {
      flowInstance.statuses[i].completed = false;
      flowInstance.statuses[i].completedBy = null; //ObjectId
      flowInstance.statuses[i].completedAt = null; //Date
      flowInstance.statuses[i].rejectedReason = null; //String
      flowInstance.statuses[i].verdict = "pending"; //String
      flowInstance.statuses[i].requirementsData = {}; // sesuai default schema
    }

    // Hapus step yang di depan (yang barusan di-undo)
    flowInstance.statuses.splice(stepBeingUndoneIndex, 1);

    flowInstance.overallStatus = "in-progress";

    // Pastikan perubahan nested terdeteksi (kadang perlu)
    flowInstance.markModified("statuses");

    await flowInstance.save();

    return res.json({
      message:
        "Berhasil undo satu langkah; jawaban di step aktif sudah dikosongkan.",
      currentStatusIndex: flowInstance.currentStatusIndex,
      statusesLength: flowInstance.statuses.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
});

router.delete("/delete/:instanceId", async (req, res) => {
  const instanceId = req.params.instanceId;
  try {
    const flowInstance = await FlowInstance.findOneAndDelete({
      _id: instanceId,
      org: req.user.org,
    });
    return res.json({
      message: "berhasil menghapus data flow instance",
      data: flowInstance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get tasks assigned to the current user
router.get("/my-tasks", async (req, res) => {
  const userId = req.user._id;
  const orgId = req.user.org;

  if (!userId || !orgId) {
    return res.status(400).json({ message: "User or organization not found" });
  }

  try {
    const tasks = await FlowInstance.aggregate([
      // Stage 1: Match initial documents that are in-progress and belong to the user's org
      {
        $match: {
          overallStatus: "in-progress",
          org: new mongoose.Types.ObjectId(orgId),
        },
      },
      // Stage 2: Lookup to join with the flowandpoints collection to get template details
      {
        $lookup: {
          from: "flowandpoints", // The collection name for the FlowAndPoint model
          localField: "flowTemplate",
          foreignField: "_id",
          as: "flowTemplateDetails",
        },
      },
      // Stage 3: Deconstruct the flowTemplateDetails array field from the input documents to output a document for each element
      {
        $unwind: "$flowTemplateDetails",
      },
      // Stage 4: Add a new field 'currentStatusObject' which holds the status object at the current index
      {
        $addFields: {
          currentStatusObject: {
            $arrayElemAt: [
              "$flowTemplateDetails.status",
              "$currentStatusIndex",
            ],
          },
        },
      },
      // Stage 5: Filter documents to only include those where the current user is in the authorized array of the current status
      {
        $match: {
          "currentStatusObject.authorized": new mongoose.Types.ObjectId(userId),
        },
      },
      // Stage 6: Lookup to get the requester's username
      {
        $lookup: {
          from: "userrefrensis", // The collection name for the UserRefrensi model
          localField: "requestedBy",
          foreignField: "_id",
          as: "requestedByInfo",
        },
      },
      // Stage 7: Unwind the requestedByInfo array
      {
        $unwind: {
          path: "$requestedByInfo",
          preserveNullAndEmptyArrays: true, // Keep instances even if requester is not found
        },
      },
      // Stage 8: Sort documents by creation date in descending order
      {
        $sort: {
          createdAt: -1,
        },
      },
      // Stage 9: Project to shape the final output documents
      {
        $project: {
          _id: 1,
          instanceTitle: 1,
          createdAt: 1,
          debugTitle: 1,
          currentStatusTitle: "$currentStatusObject.title",
          requestedByUsername: "$requestedByInfo.username",
          flowTemplateTitle: "$flowTemplateDetails.title",
          globalIndex: 1, // << langsung ambil dari FlowInstance
        },
      },
    ]);

    return res.json({
      message: "Successfully retrieved your tasks.",
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching user tasks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/download/:month", async (req, res) => {
  try {
    const { month } = req.params; // format: "2025-06"

    // Validasi format month
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        message:
          "Format bulan tidak valid. Gunakan format YYYY-MM (contoh: 2025-01)",
      });
    }

    // Cek apakah sudah ada record di database
    let record = await DownloadedProcess.findOne({
      month,
      org: req.user.org,
    });

    if (!record) {
      // Generate Excel buffer
      const excelBuffer = await generateExcelFile(month); //util Excel Js customer complex juga

      // Buat nama file
      const filename = `process-history-${month}.xlsx`;

      // Set header untuk download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      // Kirim buffer langsung
      res.send(excelBuffer);

      // Simpan record ke database untuk tracking
      try {
        await DownloadedProcess.create({
          month,
          filePath: filename, // Simpan nama file saja
          org: req.user.org,
          downloadedAt: new Date(),
        });
      } catch (dbError) {
        // Log error tapi jangan gagalkan download
        console.error("Failed to save download record:", dbError);
      }
    } else {
      // Jika sudah ada record, generate ulang untuk data terbaru
      const excelBuffer = await generateExcelFile(month);

      const filename = `process-history-${month}.xlsx`;

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Content-Length", excelBuffer.length);

      res.send(excelBuffer);

      // Update timestamp
      try {
        await DownloadedProcess.findOneAndUpdate(
          { month, org: req.user.org },
          { downloadedAt: new Date() }
        );
      } catch (dbError) {
        console.error("Failed to update download record:", dbError);
      }
    }
  } catch (error) {
    console.error("Error generating Excel file:", error);
    res.status(500).json({
      message: "Gagal menggenerate file Excel",
      error: error.message,
    });
  }
});

router.post("/download-detail", async (req, res) => {
  const { flowTemplateId, month } = req.body;

  if (!flowTemplateId || !month) {
    return res.status(400).json({
      message: "flowTemplateId dan month wajib diisi.",
    });
  }

  try {
    // Ambil template lengkap untuk membangun header
    const flowTemplate = await FlowAndPoint.findOne({
      _id: flowTemplateId,
      org: req.user.org,
    })
      .populate({ path: "request", model: "Input" })
      .populate({ path: "status.requirements", model: "Input" })
      .populate({
        path: "status.authorized",
        model: "UserRefrensi",
        select: "_id username",
      })
      .lean();

    if (!flowTemplate) {
      return res.status(404).json({ message: "Flow template not found" });
    }

    // Siapkan workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detail dalam satu row");

    // Kolom dasar
    const columns = [
      { header: "Flow Template", key: "meta_flowTemplate", width: 24 },
      { header: "Description", key: "meta_desc", width: 30 },
      { header: "Instance Title", key: "meta_instanceTitle", width: 24 },
      { header: "Global Index", key: "meta_globalIndex", width: 18 },
      { header: "Requested By", key: "meta_requestedBy", width: 20 },
      { header: "Requested At", key: "meta_createdAt", width: 18 },
      { header: "Overall Status", key: "meta_overallStatus", width: 16 },
      {
        header: "Current Status Index",
        key: "meta_currentStatusIndex",
        width: 8,
      },
    ];

    // Kolom untuk request (berdasarkan template.request)
    for (const reqInput of flowTemplate.request || []) {
      const valueKey = `req_${reqInput._id}`;
      const typeKey = `req_${reqInput._id}_type`;
      columns.push({
        header: reqInput.title || valueKey,
        key: valueKey,
        width: 24,
      });
      if (reqInput.tipe === "table") {
        // Show all table columns (including image columns, but data will be filtered)
        const tableKeys = Array.isArray(reqInput.table?.keys)
          ? reqInput.table.keys
          : [];

        if (tableKeys.length > 0) {
          const tableKey = `req_${reqInput._id}_tableKeys`;
          const tableHeader = tableKeys.join(" | ");
          columns.push({ header: tableHeader, key: tableKey, width: 30 });
        }
      }
    }

    // Tambahkan separator pertama setelah request data
    if ((flowTemplate.status || []).length > 0) {
      columns.push({
        header: ` | Next approval | `,
        key: `sep_0`,
        width: 6,
      });
    }

    // Kolom untuk status dan requirements
    for (let i = 0; i < (flowTemplate.status || []).length; i++) {
      const statusTemplate = flowTemplate.status[i];

      // Tambahkan separator sebelum setiap status (kecuali status pertama)
      if (i > 0) {
        columns.push({
          header: ` | Next approval | `,
          key: `sep_${i}`,
          width: 6,
        });
      }

      columns.push({
        header: statusTemplate.title,
        key: `st_${i}_title`,
        width: 24,
      });
      columns.push({
        header: `Authorized for ${statusTemplate.title}`,
        key: `st_${i}_authorized`,
        width: 30,
      });

      for (const req of statusTemplate.requirements || []) {
        const rKey = `st_${i}_req_${req._id}`;
        const rTypeKey = `st_${i}_req_${req._id}_type`;
        columns.push({ header: req.title || rKey, key: rKey, width: 24 });
        if (req.tipe === "table") {
          // Show all table columns (including image columns, but data will be filtered)
          const tableKeys = Array.isArray(req.table?.keys)
            ? req.table.keys
            : [];

          if (tableKeys.length > 0) {
            const rTableKey = `st_${i}_req_${req._id}_tableKeys`;
            const rTableHeader = tableKeys.join(" | ");
            columns.push({ header: rTableHeader, key: rTableKey, width: 30 });
          }
        }
      }
    }

    worksheet.columns = columns;

    // Styling header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2cd451" },
    };

    // Ambil instances untuk bulan
    let query = {};

    //make iso date
    const year = parseInt(month.split("-")[0]);
    const monthNumber = parseInt(month.split("-")[1]);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

    query = {
      flowTemplate: flowTemplateId,
      org: req.user.org,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    };

    const instances = await FlowInstance.find(query)
      .populate("requestedBy", "username")
      .lean();

    if (!instances?.length) {
      return res
        .status(421)
        .json({ message: "Tidak ada data dengan konfigurasi ini" });
    }
    // ----------------- START: helper baru (letakkan sebelum `for (const inst of instances)`) -----------------

    // Pastikan kita selalu index dengan string id
    const idToStr = (id) => (typeof id === "string" ? id : String(id));

    // Normalisasi tiap row table ke object sesuai table.keys
    const normalizeTableRows = (tableData, keys) => {
      if (!Array.isArray(tableData)) return [];

      // fallback keys array
      const cols = Array.isArray(keys) ? keys : [];

      return tableData.map((row) => {
        // Case: row is array -> map by position into keys
        if (Array.isArray(row)) {
          const obj = {};
          cols.forEach((k, i) => {
            obj[k] = row[i] !== undefined ? row[i] : "";
          });
          return obj;
        }

        // Case: row is object
        if (row && typeof row === "object") {
          // If object already contains the expected keys, pick those
          const hasAnyKey = cols.some((k) =>
            Object.prototype.hasOwnProperty.call(row, k)
          );
          if (hasAnyKey) {
            const obj = {};
            cols.forEach((k) => {
              obj[k] = row[k] !== undefined ? row[k] : "";
            });
            return obj;
          }

          // If object doesn't contain expected keys, try "fuzzy" match:
          // - If the object has a single key which looks like header combined, try to split or use value
          const rowKeys = Object.keys(row);
          if (rowKeys.length === 1) {
            const soleKey = rowKeys[0];
            const val = row[soleKey];

            // If value is array -> maybe it's the original row array
            if (Array.isArray(val)) {
              const obj = {};
              cols.forEach((k, i) => {
                obj[k] = val[i] !== undefined ? val[i] : "";
              });
              return obj;
            }

            // If soleKey contains separators " | " and val is scalar -> map by separators if possible
            if (typeof soleKey === "string" && soleKey.includes("|")) {
              // If val is array or object try to distribute; else fallback to use val as first column
              if (Array.isArray(val)) {
                const obj = {};
                cols.forEach((k, i) => {
                  obj[k] = val[i] !== undefined ? val[i] : "";
                });
                return obj;
              }
              // fallback: use the scalar value for first column
              const obj = {};
              cols.forEach((k, i) => {
                obj[k] = i === 0 ? val : "";
              });
              return obj;
            }
          }

          // Last fallback: attempt to match by partial includes
          const obj = {};
          cols.forEach((k) => {
            const foundKey =
              rowKeys.find((rk) => rk === k) ||
              rowKeys.find((rk) =>
                rk.toString().toLowerCase().includes(k.toString().toLowerCase())
              ) ||
              null;
            obj[k] = foundKey ? row[foundKey] : "";
          });
          return obj;
        }

        // Not an object/array -> return as-is into first column
        const fallback = {};
        cols.forEach((k, i) => {
          fallback[k] = i === 0 ? row : "";
        });
        return fallback;
      });
    };

    // Filter image columns and convert values into safe form (string)
    const filterImageColumnsFromTable = (
      tableData,
      keys = [],
      keysType = []
    ) => {
      if (!Array.isArray(tableData)) return tableData;
      // normalize to objects with expected keys
      const normalized = normalizeTableRows(tableData, keys);
      return normalized.map((row) => {
        if (!row || typeof row !== "object") return row;
        const filtered = {};
        keys.forEach((key, idx) => {
          const kt = Array.isArray(keysType) ? keysType[idx] : undefined;
          const value = row[key];
          if (kt === "image") {
            // show url if string and looks like url, else empty
            if (typeof value === "string" && value.startsWith("http"))
              filtered[key] = value;
            else filtered[key] = "";
          } else {
            // non-image: stringify scalar or keep object as string
            if (value === undefined || value === null) filtered[key] = "";
            else if (typeof value === "object")
              filtered[key] = JSON.stringify(value);
            else filtered[key] = String(value);
          }
        });
        return filtered;
      });
    };

    // formatValue upgraded
    const formatValue = (tipe, val, keys = [], keysType = []) => {
      if (val === undefined || val === null) return "";
      if (tipe === "date") {
        try {
          return new Date(val).toLocaleDateString("id-ID");
        } catch {
          return String(val);
        }
      }
      if (tipe === "table") {
        // Normalize + filter image columns
        const filtered = filterImageColumnsFromTable(val, keys, keysType);
        // If empty array or all rows are empty objects -> return empty string
        if (!Array.isArray(filtered) || filtered.length === 0) return "";

        const allEmpty = filtered.every((r) => {
          if (r && typeof r === "object") {
            // check if all values are empty string
            return Object.values(r).every(
              (v) => v === "" || v === null || v === undefined
            );
          }
          return !r;
        });
        if (allEmpty) return "";

        // return readable JSON. If you prefer CSV, transform here.
        return JSON.stringify(filtered);
      }
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    };

    // ----------------- END: helper baru -----------------

    // Tambahkan baris per instance
    for (const inst of instances) {
      const row = {
        meta_flowTemplate: flowTemplate.title,
        meta_desc: flowTemplate.desc,
        meta_instanceTitle: inst.instanceTitle,
        meta_globalIndex: inst.globalIndex,
        meta_requestedBy: inst.requestedBy?.username || "",
        meta_createdAt: new Date(inst.createdAt).toLocaleDateString("id-ID"),
        meta_overallStatus: inst.overallStatus,
        meta_currentStatusIndex:
          inst.currentStatusIndex + "/" + inst.statuses.length,
      };
      // MAP requestData (di dalam for (const inst of instances) { ... })
      for (const reqInput of flowTemplate.request || []) {
        const inputId = idToStr(reqInput._id);
        const vKey = `req_${inputId}`; // gunakan string id sebagai key kolom juga (lebih aman)
        const tKey = `req_${inputId}_type`;
        const tbKey = `req_${inputId}_tableKeys`;
        const rawVal = inst.requestData ? inst.requestData[inputId] : undefined;

        row[vKey] = formatValue(
          reqInput.tipe,
          rawVal,
          reqInput.table?.keys,
          reqInput.table?.keysType
        );
        // optional: tampilkan tipe hanya kalau bukan table, atau hapus sama sekali kalau ga mau debug
        row[tKey] = reqInput.tipe === "table" ? "" : reqInput.tipe;

        if (reqInput.tipe === "table") {
          const tableKeys = Array.isArray(reqInput.table?.keys)
            ? reqInput.table.keys
            : [];
          if (tableKeys.length > 0) {
            row[tbKey] = tableKeys.join(" | ");
          }
        }
      }

      // MAP statuses requirements (di bagian mapping statuses)
      for (let i = 0; i < (flowTemplate.status || []).length; i++) {
        const stTpl = flowTemplate.status[i];
        const stInst = inst.statuses?.[i] || {};
        // ...
        for (const req of stTpl.requirements || []) {
          const reqIdStr = idToStr(req._id);
          const rKey = `st_${i}_req_${reqIdStr}`;
          const rTypeKey = `st_${i}_req_${reqIdStr}_type`;
          const rawVal = stInst?.requirementsData
            ? stInst.requirementsData[reqIdStr]
            : undefined;

          row[rKey] = formatValue(
            req.tipe,
            rawVal,
            req.table?.keys,
            req.table?.keysType
          );
          row[rTypeKey] = req.tipe === "table" ? "" : req.tipe;

          if (req.tipe === "table") {
            const tableKeys = Array.isArray(req.table?.keys)
              ? req.table.keys
              : [];
            if (tableKeys.length > 0) {
              const rTableKey = `st_${i}_req_${reqIdStr}_tableKeys`;
              row[rTableKey] = tableKeys.join(" | ");
            }
          }
        }
      }

      worksheet.addRow(row);
    }

    // Kirim sebagai file download
    const filename = `process-detail-${month}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Length", buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/download-detail-table-column", async (req, res) => {
  const { flowTemplateId, month } = req.body;

  if (!flowTemplateId || !month) {
    return res.status(400).json({
      message: "flowTemplateId dan month wajib diisi.",
    });
  }

  try {
    const flowTemplate = await FlowAndPoint.findOne({
      _id: flowTemplateId,
      org: req.user.org,
    })
      .populate({ path: "request", model: "Input" })
      .populate({ path: "status.requirements", model: "Input" })
      .populate({
        path: "status.authorized",
        model: "UserRefrensi",
        select: "_id username",
      })
      .lean();

    if (!flowTemplate) {
      return res.status(404).json({ message: "Flow template not found" });
    }

    // ---------- Helpers ----------
    const idToStr = (id) => (typeof id === "string" ? id : String(id));

    const normalizeTableRows = (tableData, keys) => {
      if (!Array.isArray(tableData)) return [];
      const cols = Array.isArray(keys) ? keys : [];

      return tableData.map((row) => {
        if (Array.isArray(row)) {
          const obj = {};
          cols.forEach((k, i) => {
            obj[k] = row[i] !== undefined ? row[i] : "";
          });
          return obj;
        }

        if (row && typeof row === "object") {
          const rowKeys = Object.keys(row);
          const hasAnyKey = cols.some((k) =>
            Object.prototype.hasOwnProperty.call(row, k)
          );
          if (hasAnyKey) {
            const obj = {};
            cols.forEach((k) => {
              obj[k] = row[k] !== undefined ? row[k] : "";
            });
            return obj;
          }

          if (rowKeys.length === 1) {
            const soleKey = rowKeys[0];
            const val = row[soleKey];
            if (Array.isArray(val)) {
              const obj = {};
              cols.forEach((k, i) => {
                obj[k] = val[i] !== undefined ? val[i] : "";
              });
              return obj;
            }
            // fallback: scalar -> first column
            const obj = {};
            cols.forEach((k, i) => {
              obj[k] = i === 0 ? val : "";
            });
            return obj;
          }

          // partial fuzzy match
          const obj = {};
          cols.forEach((k) => {
            const foundKey =
              rowKeys.find((rk) => rk === k) ||
              rowKeys.find((rk) =>
                rk.toString().toLowerCase().includes(k.toString().toLowerCase())
              ) ||
              null;
            obj[k] = foundKey ? row[foundKey] : "";
          });
          return obj;
        }

        // scalar fallback
        const fallback = {};
        cols.forEach((k, i) => {
          fallback[k] = i === 0 ? row : "";
        });
        return fallback;
      });
    };

    const filterImageColumnsFromTable = (
      tableData,
      keys = [],
      keysType = []
    ) => {
      if (!Array.isArray(tableData)) return [];
      const normalized = normalizeTableRows(tableData, keys);
      return normalized.map((row) => {
        const filtered = {};
        keys.forEach((key, idx) => {
          const kt = Array.isArray(keysType) ? keysType[idx] : undefined;
          const value = row[key];
          if (kt === "image") {
            if (typeof value === "string" && value.startsWith("http"))
              filtered[key] = value;
            else filtered[key] = "";
          } else {
            if (value === undefined || value === null) filtered[key] = "";
            else if (typeof value === "object")
              filtered[key] = JSON.stringify(value);
            else filtered[key] = String(value);
          }
        });
        return filtered;
      });
    };

    const formatValue = (tipe, val, keys = [], keysType = []) => {
      if (val === undefined || val === null) return "";
      if (tipe === "date") {
        try {
          return new Date(val).toLocaleDateString("id-ID");
        } catch {
          return String(val);
        }
      }
      if (tipe === "table") {
        const filtered = filterImageColumnsFromTable(val, keys, keysType);
        if (!Array.isArray(filtered) || filtered.length === 0) return [];
        return filtered; // for table: return array-of-rows (we'll handle it outside)
      }
      if (typeof val === "object") return JSON.stringify(val);
      return String(val);
    };
    // ---------- end helpers ----------

    // ---------- Workbook & single sheet ----------
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Detail dalam satu row");

    // Meta columns
    const metaColumns = [
      { header: "Flow Template", key: "meta_flowTemplate", width: 24 },
      { header: "Description", key: "meta_desc", width: 30 },
      { header: "Instance Title", key: "meta_instanceTitle", width: 24 },
      { header: "Global Index", key: "meta_globalIndex", width: 18 },
      { header: "Requested By", key: "meta_requestedBy", width: 20 },
      { header: "Requested At", key: "meta_createdAt", width: 18 },
      { header: "Overall Status", key: "meta_overallStatus", width: 16 },
      {
        header: "Current Status Index",
        key: "meta_currentStatusIndex",
        width: 12,
      },
    ];

    // We'll build columns dynamic: non-table fields + table keys expanded
    const columns = [...metaColumns];

    // Collect table inputs globally to decide header naming (if more than 1 table => prefix)
    const tableInputs = []; // { idStr, title, keys, keysType, source, statusIndex }
    // 1) request inputs
    for (const reqInput of flowTemplate.request || []) {
      const inputId = idToStr(reqInput._id);
      if (reqInput.tipe === "table") {
        tableInputs.push({
          idStr: inputId,
          title: reqInput.title || `req_${inputId}`,
          keys: Array.isArray(reqInput.table?.keys) ? reqInput.table.keys : [],
          keysType: Array.isArray(reqInput.table?.keysType)
            ? reqInput.table.keysType
            : [],
          source: "request",
        });
      } else {
        columns.push({
          header: reqInput.title || `req_${inputId}`,
          key: `req_${inputId}`,
          width: 24,
        });
      }
    }

    // 2) statuses requirements
    for (let i = 0; i < (flowTemplate.status || []).length; i++) {
      const stTpl = flowTemplate.status[i];
      columns.push({
        header: stTpl.title,
        key: `st_${i}_title`,
        width: 24,
      });
      columns.push({
        header: `Authorized for ${stTpl.title}`,
        key: `st_${i}_authorized`,
        width: 30,
      });

      for (const req of stTpl.requirements || []) {
        const rId = idToStr(req._id);
        if (req.tipe === "table") {
          tableInputs.push({
            idStr: rId,
            title: req.title || `st_${i}_req_${rId}`,
            keys: Array.isArray(req.table?.keys) ? req.table.keys : [],
            keysType: Array.isArray(req.table?.keysType)
              ? req.table.keysType
              : [],
            source: `status`,
            statusIndex: i,
          });
        } else {
          columns.push({
            header: req.title || `st_${i}_req_${rId}`,
            key: `st_${i}_req_${rId}`,
            width: 24,
          });
        }
      }
    }

    // Decide header naming: if more than 1 tableInputs overall -> prefix title|col, else use col only
    const prefixTables = tableInputs.length > 1;

    // Add expanded columns for all table inputs (tableInputs order preserved)
    // We'll generate unique internal keys (safe for ExcelJS) but readable headers
    tableInputs.forEach((t, ti) => {
      const prefix = prefixTables ? `${t.title} | ` : "";
      t.keys.forEach((colName, ci) => {
        const colKey = `tbl_${t.idStr}_${ci}`; // internal unique key
        columns.push({
          header: `${prefix}${colName}`,
          key: colKey,
          width: 22,
        });
        // store mapping to use when filling rows
        if (!t._colMap) t._colMap = [];
        t._colMap.push({ colName, colKey, ci });
      });
    });

    worksheet.columns = columns;
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "2cd451" },
    };

    // Ambil instances
    const year = parseInt(month.split("-")[0]);
    const monthNumber = parseInt(month.split("-")[1]);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

    const query = {
      flowTemplate: flowTemplateId,
      org: req.user.org,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    };

    const instances = await FlowInstance.find(query)
      .populate("requestedBy", "username")
      .lean();

    if (!instances?.length) {
      return res
        .status(421)
        .json({ message: "Tidak ada data dengan konfigurasi ini" });
    }

    // For each instance, create as many rows as the max table-row-count among its table inputs
    for (const inst of instances) {
      // Prepare non-table base values
      const baseMeta = {
        meta_flowTemplate: flowTemplate.title,
        meta_desc: flowTemplate.desc,
        meta_instanceTitle: inst.instanceTitle,
        meta_globalIndex: inst.globalIndex,
        meta_requestedBy: inst.requestedBy?.username || "",
        meta_createdAt: new Date(inst.createdAt).toLocaleDateString("id-ID"),
        meta_overallStatus: inst.overallStatus,
        meta_currentStatusIndex:
          inst.currentStatusIndex + "/" + inst.statuses.length,
      };

      // Non-table request fields
      for (const reqInput of flowTemplate.request || []) {
        if (reqInput.tipe === "table") continue;
        const inputIdStr = idToStr(reqInput._id);
        const vKey = `req_${inputIdStr}`;
        const rawVal = inst.requestData?.[inputIdStr];
        baseMeta[vKey] = formatValue(
          reqInput.tipe,
          rawVal,
          reqInput.table?.keys,
          reqInput.table?.keysType
        );
      }

      // Non-table status requirements
      for (let i = 0; i < (flowTemplate.status || []).length; i++) {
        const stTpl = flowTemplate.status[i];
        const stInst = inst.statuses?.[i] || {};
        baseMeta[`st_${i}_title`] = stTpl.title;
        baseMeta[`st_${i}_authorized`] = (stTpl.authorized || [])
          .map((u) => u?.username)
          .filter(Boolean)
          .join(", ");

        for (const req of stTpl.requirements || []) {
          if (req.tipe === "table") continue;
          const rIdStr = idToStr(req._id);
          const rKey = `st_${i}_req_${rIdStr}`;
          const rawVal = stInst?.requirementsData?.[rIdStr];
          baseMeta[rKey] = formatValue(
            req.tipe,
            rawVal,
            req.table?.keys,
            req.table?.keysType
          );
        }
      }

      // For each table input, get its rows for this instance
      const tableRowsPerInput = tableInputs.map((t) => {
        let rawVal;
        if (t.source === "request") rawVal = inst.requestData?.[t.idStr];
        else if (t.source === "status") {
          const idx = t.statusIndex;
          rawVal = inst.statuses?.[idx]?.requirementsData?.[t.idStr];
        }
        const rows = filterImageColumnsFromTable(
          rawVal || [],
          t.keys,
          t.keysType
        );
        return rows;
      });

      // Determine max rows across table inputs for this instance (min 1 so we still output 1 row if no table)
      const maxRows = Math.max(
        1,
        ...tableRowsPerInput.map((r) => (Array.isArray(r) ? r.length : 0))
      );

      // produce rows
      for (let ri = 0; ri < maxRows; ri++) {
        const rowObj = {};

        // meta only on first row of the instance (ri === 0). If you prefer to repeat, change logic.
        if (ri === 0) {
          Object.assign(rowObj, baseMeta);
        } else {
          // leave meta blank to reduce clutter (easy to change)
          for (const m of metaColumns) rowObj[m.key] = "";
        }

        // fill table columns: for each table input, each column
        for (let ti = 0; ti < tableInputs.length; ti++) {
          const t = tableInputs[ti];
          const rows = tableRowsPerInput[ti] || [];
          const currentRow = rows[ri] || {};
          // t._colMap has mapping {colName, colKey}
          (t._colMap || []).forEach(({ colName, colKey }) => {
            rowObj[colKey] = currentRow[colName] ?? "";
          });
        }

        // Add row to worksheet
        worksheet.addRow(rowObj);
      }
    }

    // Kirim file
    const filename = `process-detail-${month}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader("Content-Length", buffer.length);
    return res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
