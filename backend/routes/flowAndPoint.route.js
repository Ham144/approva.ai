import { Router } from "express";
import Input from "../models/Input.model.js";
import FlowAndPoint from "../models/FlowAndPoint.model.js";
import FlowInstance from "../models/FlowInstance.model.js";
import UserRefrensi from "../models/User.model.js";
import mongoose from "mongoose";

const router = Router();

router.post("/createFlow", async (req, res) => {
  const {
    title,
    desc,
    request,
    status,
    isAllowanceModeRequest,
    allowedUserToRequest,
  } = req.body;

  if (!title || !desc) {
    return res.status(400).json({ message: "Title and desc required" });
  }

  if (!request || request.length === 0) {
    return res
      .status(400)
      .json({ message: "Form request setidaknya 1 input aktif" });
  }

  if (!status || status.length === 0) {
    return res
      .status(400)
      .json({ message: "Status setidaknya 1 status aktif" });
  }

  try {
    const newFlowAndPoint = new FlowAndPoint();
    let inputRequest = [];

    // buang _id nya untuk request menghindari duplikasi
    for (let input of request) {
      const { _id, ...rest } = input; // buang _id
      if (
        (input.tipe == "select" || input.tipe == "multipleCheckbox") &&
        !input.sourceData
      ) {
        return res.status(400).json({
          message:
            "Source data harus diisi jika tipe select/multipleCheckbox" +
            " " +
            input?.title,
        });
      }
      const newInput = await Input.create({
        ...rest,
        org: req.user.org, // ✅ Tambahkan ini
      });

      inputRequest.push(newInput._id);
    }

    const statuses = [];
    // Buat status dengan requirements
    for (let statusItem of status) {
      const requirementIds = [];

      //cegah kalau authorized tidak ada pada salah satu status
      if (statusItem?.authorized?.length == 0) {
        return res.status(400).json({
          message:
            "Salah satu status anda buat tidak memiliki orang yang diizinkan untuk approve : " +
            statusItem?.title,
        });
      }

      //cegah tidak ada requirements
      if (statusItem?.requirements?.length == 0) {
        return res.status(400).json({
          message:
            "Salah satu status anda buat tidak memiliki requirement : " +
            statusItem?.title,
        });
      }

      //cegah authorized tidak terdaftar
      const authorizedFound = await UserRefrensi.find({
        _id: { $in: statusItem?.authorized },
      });
      if (authorizedFound?.length != statusItem?.authorized.length) {
        return res.status(400).json({
          message:
            "Salah satu status anda buat memiliki akun yang tidak dikenal untuk approve : " +
            statusItem?.title,
        });
      }

      //buang _id nya menghidani 11000
      for (let requirement of statusItem.requirements) {
        const { _id, ...restReq } = requirement; // buang _id

        if (
          (requirement.tipe == "select" ||
            requirement.tipe == "multipleCheckbox") &&
          !requirement.sourceData
        ) {
          return res.status(400).json({
            message:
              "Source data harus diisi jika tipe select/multipleCheckbox" +
              " " +
              statusItem?.title,
          });
        }
        const newRequirement = await Input.create({
          ...restReq,
          org: req.user.org, // ✅ Tambahkan ini juga
        });
        requirementIds.push(newRequirement._id);
      }

      statuses.push({
        title: statusItem?.title,
        desc: statusItem?.desc,
        authorized: statusItem.authorized || [],
        completed: false,
        isPrivateAuthorized: statusItem?.isPrivateAuthorized || false,
        privateAuthorizedUser: statusItem?.privateAuthorizedUser || [],
        requirements: requirementIds,
      });
    }

    if (
      isAllowanceModeRequest !== "undefined" &&
      isAllowanceModeRequest !== null &&
      isAllowanceModeRequest
    ) {
      newFlowAndPoint.isAllowanceModeRequest = isAllowanceModeRequest;

      if (allowedUserToRequest && allowedUserToRequest.length > 0) {
        // Validasi bahwa semua isi adalah ObjectId valid
        const validUsers = await UserRefrensi.find({
          _id: { $in: allowedUserToRequest },
        });

        if (validUsers.length !== allowedUserToRequest.length) {
          return res.status(400).json({ error: "Beberapa userId tidak valid" });
        }

        newFlowAndPoint.allowedUserToRequest = allowedUserToRequest;
      }
    }

    // Set data final
    newFlowAndPoint.title = title;
    newFlowAndPoint.desc = desc;
    newFlowAndPoint.request = inputRequest;
    newFlowAndPoint.status = statuses;
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const existing = newFlowAndPoint.designedBy?.findIndex((d) => d == userId);
    if (existing == -1) {
      newFlowAndPoint.designedBy.push(userId);
    }

    newFlowAndPoint.org = req.user.org;

    await newFlowAndPoint
      .save()
      .then(() => {
        console.log("✅ Berhasil simpan ke Mongo");
        return res.json({
          message: "berhasil menambahkan flow",
          newFlowAndPoint,
        });
      })
      .catch((err) => {
        console.error("❌ Gagal simpan ke Mongo:", err.message);
        return res.status(500).json({ message: err.message });
      });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/list", async (req, res) => {
  const { searchKey } = req.query;
  const userId = req.user._id;

  try {
    let query = {
      org: req.user.org, // ✅ Scope tenant
    };

    if (searchKey && searchKey.trim() !== "") {
      query.title = { $regex: searchKey, $options: "i" };
    }

    const rawList = await FlowAndPoint.find(query)
      .select(
        "title desc isAllowanceModeRequest allowedUserToRequest status designedBy"
      )
      .populate("designedBy", "username");

    const list = rawList.map((item) => ({
      ...item.toObject(),
      status: item.status?.map((s) => ({ title: s.title })),
    }));

    const flowListFiltered = list.filter((template) => {
      const iamCreator = template.designedBy?.findIndex((d) => d._id == userId);
      if (iamCreator !== -1) return true;

      if (
        template.isAllowanceModeRequest &&
        !template.allowedUserToRequest.includes(req.user._id)
      ) {
        return false;
      }

      return true;
    });

    return res.status(200).json({
      message: "Berhasil mengambil data flow",
      data: flowListFiltered,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/getFlowById/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "ID required" });
  }

  try {
    const flow = await FlowAndPoint.findOne({
      _id: id,
      org: req.user.org, // ✅ Scope tenant
    })
      .populate({
        path: "request",
        populate: [{ path: "sourceData", model: "SourceData" }],
      })
      .populate("status.requirements")
      .populate("status.authorized")
      .populate("designedBy");

    if (!flow) {
      return res.status(404).json({ message: "Flow tidak ditemukan" });
    }

    return res.status(200).json({
      message: "Berhasil mengambil data flow",
      data: flow,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

function isValidObjectIdStrict(id) {
  return (
    mongoose.Types.ObjectId.isValid(id) &&
    String(new mongoose.Types.ObjectId(id)) === id
  );
}
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const {
    title,
    desc,
    request,
    status,
    isAllowanceModeRequest,
    allowedUserToRequest,
  } = req.body;

  // Validasi input dasar
  if (!title || !desc) {
    return res.status(400).json({ message: "Title dan deskripsi diperlukan." });
  }

  if (!request || request.length === 0) {
    return res.status(400).json({
      message: "Form request harus memiliki setidaknya 1 input aktif.",
    });
  }

  if (!status || status.length === 0) {
    return res.status(400).json({
      message: "Harus ada setidaknya 1 status dalam flow.",
    });
  }

  try {
    const existingFlow = await FlowAndPoint.findOne({
      _id: id,
      org: req.user.org,
    });
    if (!existingFlow) {
      return res.status(404).json({ message: "Flow tidak ditemukan." });
    }

    // Validasi: user saat ini adalah salah satu desainer
    const youAreTheDesigner = existingFlow.designedBy.find(
      (d) => d.toString() === req.user._id
    );
    console.log(youAreTheDesigner);
    // Buang _id hanya kalau _id memang tidak valid (misal berasal dari frontend bodoh)
    const sanitizedInputs = [];

    for (let input of request) {
      const { _id, ...restInput } = input;

      if (isValidObjectIdStrict(_id)) {
        sanitizedInputs.push(_id); // langsung pakai
      } else {
        const newInput = await Input.create({
          ...restInput, // pastikan _id tidak ikut
          createdBy: req.user._id,
          org: req.user.org,
        });
        sanitizedInputs.push(newInput._id);
      }
    }

    const updatedStatuses = [];
    for (const s of status) {
      const authorizedIds = s.authorized;

      // Validasi user
      const foundUsers = await UserRefrensi.find({
        _id: { $in: authorizedIds },
        org: req.user.org,
      });
      if (foundUsers.length !== authorizedIds.length) {
        return res
          .status(400)
          .json({ message: `User tidak valid di status: ${s.title}` });
      }

      const requirementIds = [];

      for (let requirement of s.requirements) {
        const { _id, ...restReq } = requirement;

        if (isValidObjectIdStrict(_id)) {
          requirementIds.push(_id);
        } else {
          const newRequirement = await Input.create({
            ...restReq,
            createdBy: req.user._id,
            org: req.user.org,
          });
          requirementIds.push(newRequirement._id);
        }
      }

      updatedStatuses.push({
        title: s.title,
        desc: s.desc,
        authorized: authorizedIds,
        requirements: requirementIds,
      });
    }

    // Update flow
    existingFlow.title = title;
    existingFlow.desc = desc;
    existingFlow.request = sanitizedInputs;
    existingFlow.isAllowanceModeRequest = isAllowanceModeRequest;
    existingFlow.allowedUserToRequest = allowedUserToRequest;
    existingFlow.status = updatedStatuses;

    // Tambahkan desainer baru jika belum ada
    if (!youAreTheDesigner) {
      existingFlow.designedBy.push(req.user._id);
    }

    await existingFlow.save();

    return res.json({
      message: "Flow berhasil diperbarui.",
    });
  } catch (error) {
    console.error("Error updating flow:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    //hapus instances nya
    const query = {
      flowTemplate: id,
      org: req.user.org,
    };

    const deletedInstancesCount = await FlowInstance.countDocuments(query);
    await FlowInstance.deleteMany(query);

    await FlowAndPoint.findOneAndDelete({ _id: id, org: req.user.org });
    return res.json({
      message: `berhasil menghapus data flow${
        deletedInstancesCount > 0 ? " beserta proses yang terkait" : ""
      }`,
      deletedInstancesCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
