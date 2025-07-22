import { Router } from "express";
import FlowInstance from "../models/FlowInstance.model.js";
import FlowAndPoint from "../models/FlowAndPoint.model.js";
import mongoose from "mongoose";
import {
  sendApprovalRequestEmail,
  sendSkippedUserNotification,
} from "../utils/emailService.js";
import Department from "../models/Department.model.js";

const router = Router();

//flow instance untuk start flow baru dengan template yang dipilih
router.post("/request/new", async (req, res) => {
  const { instanceTitle, flowTemplateId, overallStatus, requestData } =
    req.body;

  // 1. Validasi awal untuk keberadaan data utama
  if (!instanceTitle || !flowTemplateId || !overallStatus || !requestData) {
    return res.status(400).json({
      message:
        "instanceTitle, flowTemplateId, overallStatus, dan requestData wajib diisi.",
    });
  }

  try {
    const userId = req.user._id;

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
    if (template.isAllowanceModeRequest && !isDeparmentInclude) {
      return res.status(400).json({
        message: "department anda tidak terdaftar untuk membuat request ini",
      });
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
    });

    // --- Start Email Notification Logic for First Approver ---
    try {
      if (flowInstance.overallStatus === "in-progress") {
        const nextStatusTemplate =
          template.status[flowInstance.currentStatusIndex];
        const nextApprovers = nextStatusTemplate.authorized;

        if (nextApprovers.length > 0) {
          await sendApprovalRequestEmail(
            nextApprovers,
            flowInstance,
            "System (Initial Request)" // Or use the requester's name: req.user.username
          );
        }
      }
    } catch (emailError) {
      console.error(
        "Email notification for initial request failed:",
        emailError
      );
    }
    // --- End Email Notification Logic ---

    return res
      .status(201) // Gunakan 201 Created untuk resource baru
      .json({ message: "Flow instance berhasil dibuat", data: flowInstance });
  } catch (error) {
    // Tangani kemungkinan error duplikasi `instanceTitle` jika ada unique index
    if (error.code === 11000) {
      return res.status(409).json({
        message: `Instance dengan judul '${instanceTitle}' sudah ada.`,
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
    limit,
    skip,
  } = req.query;

  try {
    let query = {
      org: req.user.org,
    };
    if (instanceId) {
      query._id = instanceId;
    } else {
      if (flowTemplateCategory) {
        query.flowTemplate = new mongoose.Types.ObjectId(flowTemplateCategory);
      }

      if (overallStatus) {
        query.overallStatus = overallStatus;
      }
      if (requestedBy) {
        query.requestedBy = requestedBy;
      }
      if (requestDate) {
        // Cari berdasarkan tanggal (createdAt) harian
        const start = new Date(requestDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(requestDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt = { $gte: start, $lte: end };
      }

      if (isMyDepartmentOnly == "true") {
        const myDepartment = await Department.findOne({
          org: req.user.org,
          members: { $in: [req.user._id] },
        });
        console.log(myDepartment);
        if (myDepartment) {
          query = {
            ...query,
            flowTemplate: {
              $in: await FlowAndPoint.find({
                allowedDepartmentToRequest: myDepartment._id,
              }).distinct("_id"),
            },
          };
        }
      }
    }

    if (isMyRequestOnly == "true") {
      //ingat ini perlu sandingkan dengan string
      query.requestedBy = req.user._id;
    }

    // Total semua dokumen yang cocok dengan query
    const totalData = await FlowInstance.countDocuments(query);
    const totalPage = Math.ceil(totalData / limit);

    // Ambil data paginated
    const flowInstanceList = await FlowInstance.find(query)
      .populate("requestedBy", "username") // Tetap di sini, ini terpisah
      .populate({
        path: "flowTemplate",
        select: "title desc", // Masukkan field yang ingin diambil di sini juga
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
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    return res
      .status(200)
      .json({ data: flowInstanceList, totalPage, totalData });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Terjadi kesalahan server" });
  }
});

//ini lengkap dapatin tempalte nya beserta instance flow nya
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

    return res.json({
      message: "berhasil mengambil data flow instance",
      data: flowInstance,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//submit hanya 1 status bukan semua
router.post("/submitStatusFulfillment/:instanceId", async (req, res) => {
  const currentIndexStatusResponse = req.body;
  const instanceId = req.params.instanceId;

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
        flowInstance.currentStatusIndex += 1;
      }
    }

    await flowInstance.save();

    // --- Start Email Notification Logic ---
    if (verdictOfRequirement === "approved") {
      try {
        // The `flowInstance` variable has the `flowTemplate` populated with authorized users (including email).

        // 1. Notify users who were skipped on the step that was just completed.
        const completedStatusTemplate =
          flowInstance.flowTemplate.status[currentStatusIndex]; // Use the original index
        const skippedUsers = completedStatusTemplate.authorized.filter(
          (user) => !user._id.equals(userId)
        );

        if (skippedUsers.length > 0) {
          await sendSkippedUserNotification(
            skippedUsers,
            flowInstance,
            req.user.username,
            flowInstance._id
          );
        }

        // 2. Notify the next approvers if the flow is not yet complete.
        if (flowInstance.overallStatus === "in-progress") {
          const nextStatusTemplate =
            flowInstance.flowTemplate.status[flowInstance.currentStatusIndex]; // Use the new, incremented index
          const nextApprovers = nextStatusTemplate.authorized;

          if (nextApprovers.length > 0) {
            await sendApprovalRequestEmail(
              nextApprovers,
              flowInstance,
              req.user.username
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

// router.get("/onduty/list", async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const userId = req.user._id;

//   try {
//     const instanceList = await FlowInstance.aggregate([
//       {
//         $match: {
//           overallStatus: "in-progress",
//           $expr: {
//             $in: [
//               { $toObjectId: userId },
//               {
//                 $let: {
//                   vars: {
//                     currentStatus: {
//                       $arrayElemAt: [
//                         "$flowTemplate.status",
//                         "$currentStatusIndex",
//                       ],
//                     },
//                   },
//                   in: "$$currentStatus.authorized",
//                 },
//               },
//             ],
//           },
//         },
//       },
//       {
//         $lookup: {
//           from: "userrefrensis",
//           localField: "requestedBy",
//           foreignField: "_id",
//           as: "requestedByInfo",
//         },
//       },
//       {
//         $unwind: {
//           path: "$requestedByInfo",
//           preserveNullAndEmptyArrays: true,
//         },
//       },
//       {
//         $sort: { createdAt: -1 },
//       },
//       {
//         $skip: (page - 1) * limit,
//       },
//       {
//         $limit: limit,
//       },
//       {
//         $project: {
//           _id: 1,
//           instanceTitle: 1,
//           createdAt: 1,
//           requestedByUsername: "$requestedByInfo.username",
//         },
//       },
//     ]);

//     // Hitung total count
//     const totalCountAgg = await FlowInstance.aggregate([
//       {
//         $match: {
//           overallStatus: "in-progress",
//           $expr: {
//             $in: [
//               { $toObjectId: userId },
//               {
//                 $let: {
//                   vars: {
//                     currentStatus: {
//                       $arrayElemAt: [
//                         "$flowTemplate.status",
//                         "$currentStatusIndex",
//                       ],
//                     },
//                   },
//                   in: "$$currentStatus.authorized",
//                 },
//               },
//             ],
//           },
//         },
//       },
//       {
//         $count: "count",
//       },
//     ]);

//     const totalCount = totalCountAgg[0]?.count || 0;
//     const pages = Math.ceil(totalCount / limit);

//     return res.json({
//       data: instanceList,
//       pages,
//     });
//   } catch (error) {
//     console.error("❌ Error on /onduty/list:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

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
          currentStatusTitle: "$currentStatusObject.title",
          requestedByUsername: "$requestedByInfo.username",
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

export default router;
