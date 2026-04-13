import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + file.originalname.replace(/\s/g, "_");
    cb(null, name);
  },
});

const upload = multer({ storage });

router.post("/upload/img", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const url = `https://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url });
});

// Route untuk download file (PDF dan gambar)
router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), "uploads", filename);

  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File tidak ditemukan" });
  }

  // Set header untuk download
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  // Tentukan content type berdasarkan extension
  const ext = path.extname(filename).toLowerCase();
  const contentTypeMap = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  const contentType = contentTypeMap[ext] || "application/octet-stream";
  res.setHeader("Content-Type", contentType);

  // Stream file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// Route untuk preview file (PDF dan gambar) - serve file langsung
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), "uploads", filename);

  // Cek apakah file ada
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File tidak ditemukan" });
  }

  // Tentukan content type berdasarkan extension
  const ext = path.extname(filename).toLowerCase();
  const contentTypeMap = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };

  const contentType = contentTypeMap[ext] || "application/octet-stream";
  res.setHeader("Content-Type", contentType);

  // Header untuk memungkinkan embedding di iframe
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN"); // Allow same origin iframe
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self'");

  // Untuk PDF, tambahkan header khusus
  if (ext === ".pdf") {
    res.setHeader("Content-Disposition", "inline"); // inline untuk preview, bukan attachment
  }

  // Stream file untuk preview (tidak ada Content-Disposition attachment)
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

export default router;
