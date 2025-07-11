import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/", async (req, res) => {
  try {
    const AD_HOST = process.env.AD_HOST;
    const AD_PORT = process.env.AD_PORT;

    if (!AD_HOST || !AD_PORT) {
      return res.status(400).json({ message: "tidak ditemukan config" });
    }

    const data = {
      AD_HOST,
      AD_PORT,
    };

    return res.status(200).json({
      message: "Berhasil mengambil config",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Gagal, Internal server error" });
  }
});

export default router;
