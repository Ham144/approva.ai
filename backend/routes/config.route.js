import { Router } from "express";
import dotenv from "dotenv";
import Org from "../models/Organization.model.js";

dotenv.config();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const org = await Org.findById(req.user.org).select("AD_HOST AD_PORT");

    if (!org) {
      return res.status(404).json({ message: "Organisasi tidak ditemukan." });
    }

    return res.status(200).json({
      message: "Berhasil mengambil konfigurasi LDAP organisasi.",
      data: {
        AD_HOST: org.AD_HOST,
        AD_PORT: org.AD_PORT,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Gagal, internal server error." });
  }
});

export default router;
