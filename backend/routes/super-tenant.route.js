import { Router } from "express";
import Org from "../models/Organization.model.js"
import mongoose from "mongoose";
import FlowInstance from "../models/FlowInstance.model.js";

const router = Router();

router.get("/getAllOrgSuperTenant", async (req, res) => {
  const { search, limit, skip } = req.query;

  let query = {};
  if (search) {
    query = {
      organizationName: { $regex: "^" + search, $options: "i" },
    };
  }
  try {
    const orgList = await Org.find(query)
      .populate("createdBy", "username")
      .select(
        "-__v -AD_HOST -AD_PORT -EMAIL_USER -EMAIL_PASS -EMAIL_HOST -EMAIL_PORT -EMAIL_SECURE",
      )
      .limit(limit || 10)
      .skip(skip || 0);

    res.json({
      message: "berhasil ambil data",
      data: orgList,
    });
  } catch (error) {
    return res.status(500).json({
      message: error?.message || "Inerval server error",
    });
  }
});

router.post("/createOrg", async (req, res) => {
  const {
    organizationName,
    AD_HOST,
    AD_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    AD_DOMAIN,
    AD_BASE_DN,
  } = req.body;

  // Validasi minimum
  if (!organizationName || !AD_HOST || !AD_PORT) {
    return res.status(400).json({
      message: "Mohon lengkapi nama organisasi dan kredensial AD",
    });
  }

  try {
    // Cek jika sudah ada organisasi dengan nama sama
    const orgExisting = await Org.findOne({ organizationName });
    if (orgExisting) {
      return res.status(400).json({
        message: "Organisasi dengan nama ini sudah ada",
      });
    }

    // Buat object organisasi baru
    const newOrg = new Org({
      organizationName,
      AD_HOST,
      AD_PORT,
      AD_DOMAIN,
      AD_BASE_DN,
      EMAIL_USER,
      EMAIL_PASS,
      EMAIL_HOST,
      EMAIL_PORT,
      EMAIL_SECURE,
      createdBy: req.user._id,
      owners: [req.user._id],
      members: [req.user._id],
    });

    await newOrg.save();

    return res.status(200).json({
      message: "Berhasil membuat organisasi baru",
      data: newOrg,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan di server",
    });
  }
});

router.delete("/disableOrg/:_id", async (req, res) => {
  const _id = req.params._id;

  try {
    let updatedOrg = await Org.findOne(
      // Tambahkan variabel untuk menangkap hasilnya
      { _id },
    );

    if (!updatedOrg) {
      // Tambahkan pengecekan apakah organisasi ditemukan
      return res.status(404).json({
        message: "Organization not found.", // Pesan yang lebih spesifik
      });
    }

    updatedOrg.isDisabled = !updatedOrg.isDisabled;

    await updatedOrg.save();
    return res.json({
      message: "Organization disabled successfully.", // Pesan yang lebih jelas
      data: updatedOrg, // Opsional: kirim data organisasi yang sudah diupdate
    });
  } catch (error) {
    console.error("Error disabling organization:", error); // Gunakan console.error dan pesan yang lebih deskriptif
    // Periksa jika error karena format _id yang tidak valid (misal, ObjectId yang salah)
    if (error.name === "CastError" && error.path === "_id") {
      return res.status(400).json({
        message: "Invalid organization ID format.",
      });
    }
    return res.status(500).json({
      message: "Internal server error while disabling organization.", // Pesan lebih deskriptif
    });
  }
});

router.delete("/deleteOrg/:_id", async (req, res) => {
  const _id = req.params._id;

  try {
    const deletedOrg = await Org.findOneAndDelete({ _id }); // Ganti nama variabel jadi deletedOrg

    if (deletedOrg) {
      // Periksa apakah dokumen ditemukan dan dihapus
      return res.json({
        message: "Organization deleted successfully.", // Pesan yang lebih jelas
        data: deletedOrg, // Opsional: kirim data organisasi yang dihapus
      });
    } else {
      return res.status(404).json({
        // Jika tidak ditemukan, return 404
        message: "Organization not found or could not be deleted.", // Pesan yang lebih spesifik
      });
    }
  } catch (error) {
    console.error("Error deleting organization:", error); // Gunakan console.error dan pesan yang lebih deskriptif
    // Periksa jika error karena format _id yang tidak valid
    if (error.name === "CastError" && error.path === "_id") {
      return res.status(400).json({
        message: "Invalid organization ID format.",
      });
    }
    return res.status(500).json({
      message: "Internal server error while deleting organization.", // Pesan lebih deskriptif
    });
  }
});

router.get("/department-stats", async (req, res) => {
  const { departmendId, orgId, startDate, endDate } = req.query;

  try {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const end = endDate ? new Date(endDate) : new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const isAllDepartment = !departmendId || departmendId === "all";

    let memberIds = [];
    let departmentName = "All Department";

    // ================== AMBIL MEMBER DEPARTMENT ==================
    if (!isAllDepartment) {
      const department = await Department.findById(departmendId).select(
        "members name"
      );

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      memberIds = department.members || [];
      departmentName = department.name;
    }

    // ================== ACTIVITY PIPELINE ==================
    const activityMatch = {
      org: new mongoose.Types.ObjectId(orgId),
      createdAt: { $gte: start, $lte: end },
    };

    if (!isAllDepartment) {
      activityMatch.requestedBy = { $in: memberIds };
    }

    const activityPipeline = [
      { $match: activityMatch },

      {
        $project: {
          activities: {
            $concatArrays: [
              [
                {
                  user: "$requestedBy",
                  type: "request",
                  lastActivity: "$createdAt",
                },
              ],
              {
                $map: {
                  input: {
                    $filter: {
                      input: "$statuses",
                      as: "s",
                      cond: { $eq: ["$$s.completed", true] },
                    },
                  },
                  as: "s",
                  in: {
                    user: "$$s.completedBy",
                    type: "completed",
                    lastActivity: "$$s.completedAt",
                  },
                },
              },
            ],
          },
        },
      },

      { $unwind: "$activities" },
    ];

    if (!isAllDepartment) {
      activityPipeline.push({
        $match: {
          "activities.user": { $in: memberIds },
        },
      });
    }

    activityPipeline.push({
      $group: {
        _id: null,
        requestCount: {
          $sum: {
            $cond: [{ $eq: ["$activities.type", "request"] }, 1, 0],
          },
        },
        completedCount: {
          $sum: {
            $cond: [{ $eq: ["$activities.type", "completed"] }, 1, 0],
          },
        },
        lastActivity: { $max: "$activities.lastActivity" },
      },
    });

    const activityStats = await FlowInstance.aggregate(activityPipeline);

    // ================== PENDING PIPELINE ==================
    const pendingMatch = {
      overallStatus: "in-progress",
      org: new mongoose.Types.ObjectId(orgId),
      createdAt: { $gte: start, $lte: end },
    };

    const pendingPipeline = [
      { $match: pendingMatch },

      {
        $lookup: {
          from: "flowandpoints",
          localField: "flowTemplate",
          foreignField: "_id",
          as: "flowTemplateDetails",
        },
      },

      { $unwind: "$flowTemplateDetails" },

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

      { $unwind: "$currentStatusObject.authorized" },
    ];

    if (!isAllDepartment) {
      pendingPipeline.push({
        $match: {
          "currentStatusObject.authorized": { $in: memberIds },
        },
      });
    }

    pendingPipeline.push({
      $group: {
        _id: null,
        pendingCount: { $sum: 1 },
        lastPendingActivity: { $max: "$updatedAt" },
      },
    });

    const pendingStats = await FlowInstance.aggregate(pendingPipeline);

    // ================== GABUNGKAN ==================
    const activityData = activityStats[0] || {
      requestCount: 0,
      completedCount: 0,
      lastActivity: null,
    };

    const pendingData = pendingStats[0] || {
      pendingCount: 0,
      lastPendingActivity: null,
    };

    let lastActivityDate = activityData.lastActivity;

    if (pendingData.lastPendingActivity) {
      if (
        !lastActivityDate ||
        new Date(pendingData.lastPendingActivity) > new Date(lastActivityDate)
      ) {
        lastActivityDate = pendingData.lastPendingActivity;
      }
    }

    // ================== FORMAT TANGGAL ==================
    let tanggalAktifitasTerakhir;
    let jamAktifitasTerakhir;

    if (lastActivityDate) {
      const lastDate = new Date(lastActivityDate);

      tanggalAktifitasTerakhir = lastDate.toISOString().split("T")[0];

      const timeStr = lastDate.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      jamAktifitasTerakhir = timeStr.replace(":", ".");
    } else {
      const now = new Date();

      tanggalAktifitasTerakhir = now.toISOString().split("T")[0];

      const timeStr = now.toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

      jamAktifitasTerakhir = timeStr.replace(":", ".");
    }

    // ================== HITUNG TOTAL ==================
    const qtyAll =
      (activityData.requestCount || 0) +
      (activityData.completedCount || 0) +
      (pendingData.pendingCount || 0);

    const result = {
      name: departmentName,
      tanggalAktifitasTerakhir,
      jamAktifitasTerakhir,
      "QTY request": activityData.requestCount || 0,
      "QTY approved&reject": activityData.completedCount || 0,
      "Pending Di Saya": pendingData.pendingCount || 0,
      "QTY AlL": qtyAll,
    };

    return res.json(result);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal Server Error" });
  }
});

export default router;
