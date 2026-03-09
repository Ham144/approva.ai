import { Router } from "express";
import Org from "../models/Organization.model.js";

const router = Router();

router.get("/getOrgById/:_id", async (req, res) => {
  const _id = req.params._id;
  try {
    const orgDB = await Org.findById(_id).select("organizationName _id");
    return res.json({ message: "berhasil ambil data", data: orgDB });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "failed" });
  }
});

router.get("/getAllOrg", async (req, res) => {
  const search = req.query.search;

  let query = {};
  if (search && search !== "*") {
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
