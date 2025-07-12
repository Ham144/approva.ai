import { Router } from "express";
import Org from "../models/Organization.model";

const router = Router();

router.get("/getAllOrg", async (req, res) => {
  const search = req.query.search;

  try {
    const orgList = await Org.find({
      organizationName: { $regex: search, $options: "i" },
    }).select("organizationName");

    res.json({
      message: "berhasil ambil data",
      data: orgList,
    });
  } catch (error) {
    return res.status(500).json({
      message: "internal server error",
    });
  }
});

export default router;
