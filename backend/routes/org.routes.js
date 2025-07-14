import { Router } from "express";
import Org from "../models/Organization.model.js";

const router = Router();

router.get("/getAllOrg", async (req, res) => {
  console.log(req.query);
  const search = req.query.search;

  let query = {};
  if (search) {
    query = {
      organizationName: { $regex: "^" + search, $options: "i" },
    };
  }
  try {
    const orgList = await Org.find(query).select("organizationName").limit(5);

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
