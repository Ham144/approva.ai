import { Router } from "express";
import Input from "../models/Input.model.js";

const router = Router();

router.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const input = await Input.findById(id);
    if (!input) {
      return res.status(404).json({ message: "Input tidak ditemukan" });
    }

    return res.status(200).json({ message: "Input berhasil diupdate" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Terjadi kesalahan server" });
  }
});

export default router;
