import { Router } from "express";
import Input from "../models/Input.model.js";
import FlowAndPoint from "../models/FlowAndPoint.model.js";
import FlowInstance from "../models/FlowInstance.model.js";

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
      const newInput = await Input.create(rest);
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

      //buang _id nya menghidani 11000
      for (let requirement of statusItem.requirements) {
        const { _id, ...restReq } = requirement; // buang _id
        const newRequirement = await Input.create(restReq);
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

    // Set data final
    newFlowAndPoint.title = title;
    newFlowAndPoint.desc = desc;
    newFlowAndPoint.isAllowanceModeRequest = isAllowanceModeRequest || false;
    newFlowAndPoint.request = inputRequest;
    newFlowAndPoint.status = statuses;
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const existing = newFlowAndPoint.designedBy?.findIndex((d) => d == userId);
    if (existing == -1) {
      newFlowAndPoint.designedBy.push(userId);
    }

    //periksa jika mode isAllowanceModeRequest maka tambahin user yg diizinkan create
    if (isAllowanceModeRequest) {
      newFlowAndPoint.allowedUserToRequest = allowedUserToRequest;
    }

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
    let query = {};

    if (searchKey && searchKey !== "") {
      query = {
        title: { $regex: searchKey, $options: "i" },
      };
    }

    const list = await FlowAndPoint.find(query)
      .select("title desc isAllowanceModeRequest allowedUserToRequest")
      .populate("designedBy", "username");

    //terakhir filter out instance yg isAllowanceModeRequest true dan template.allowedUserToRequest nya tidak mengandung current userId
    const flowListFiltered = list.filter((template) => {
      const iamCreator = template.designedBy?.findIndex((d) => d._id == userId);
      if (iamCreator != -1) {
        return true;
      }
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
    const flow = await FlowAndPoint.findById(id)
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
    let existingFlow = await FlowAndPoint.findById(id);
    if (!existingFlow) {
      return res.status(400).json({ message: "Flow not found" });
    }

    const youAreTheDesigner = existingFlow.designedBy.find(
      (d) => d._id == req.user._id
    );

    existingFlow.title = title;
    existingFlow.desc = desc;
    existingFlow.request = request;
    existingFlow.isAllowanceModeRequest = isAllowanceModeRequest;
    existingFlow.allowedUserToRequest = allowedUserToRequest;
    existingFlow.status = updatedStatus;
    existingFlow.designedBy = youAreTheDesigner
      ? existingFlow.designedBy
      : [...existingFlow.designedBy, req.user._id];

    await existingFlow.save();

    return res.json({
      message: "Berhasil mengedit flow, beberapa aturan telah berubah",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.put("/rollback/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const flowInstance = await FlowInstance.findById(id);
    if (!flowInstance) {
      return res.status(400).json({ message: "request tidak ditemukan" });
    }

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

    return res.json({
      message: "Berhasil mengupdate, prosess kembali ke awal",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    //hapus instances nya
    const query = {
      flowTemplate: id,
    };

    const deletedInstancesCount = await FlowInstance.countDocuments(query);
    await FlowInstance.deleteMany(query);

    await FlowAndPoint.findByIdAndDelete(id);
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
