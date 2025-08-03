import express from "express";
import "dotenv/config";
import { connectDB } from "./utils/connectDB.js";
import cors from "cors";
import auhtRoutes from "./routes/auth.route.js";
import authenticate from "./middlewares/authenticate.js";
import cookieParser from "cookie-parser";
import path from "path";
import configRoutes from "./routes/config.route.js";
import FlexSourceDataRoutes from "./routes/flexSourceData.route.js";
import flowAndPointRoutes from "./routes/flowAndPoint.route.js";
import flowInstanceroutes from "./routes/flowInstance.route.js";
import orgRoutes from "./routes/org.routes.js";
import fileRoutes from "./routes/file.route.js";
import authorize from "./middlewares/authorize.js";
import departmentRoutes from "./routes/department.route.js";
import bulkRoutes from "./routes/bulk.route.js";
import fs from 'fs'

//initilize /uploads dir because its needed
const uploadPath = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

const isProduction = process.env.NODE_ENV === "production";

const corsOrigin = isProduction
  ? [
      "https://e-form.mycsi.net",
      "http://e-form.mycsi.net",
      "http://192.168.169.22",
      "http://192.168.169.12:5173",
    ]
  : ["http://192.168.169.12:5173"];

const app = express();

//midlerwares
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// Untuk serve file statis dari frontend/dist
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Untuk SPA fallback (route selain API, dsb.)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

//database
connectDB();

//public seutuhnya || kalau sebagian, tambah ke noAuthOriginalUrl js
app.get("/", async (req, res) => {
  return res.send("BACKEND : 200");
});

//routes
app.use("/api/auth", auhtRoutes);
app.use("/api/config", authenticate, authorize, configRoutes);
app.use("/api/flexSourceData", authenticate, FlexSourceDataRoutes);
app.use("/api/flow", authenticate, flowAndPointRoutes); //ini untuk designernya
app.use("/api/flowInstance", authenticate, flowInstanceroutes); //ini untuk user
app.use("/api/org", orgRoutes);
app.use("/api/file", authenticate, fileRoutes);
app.use("/api/department", authenticate, departmentRoutes);
app.use("/api/bulk", authenticate, authorize, bulkRoutes);

const port = process.env.PORT;
app.listen(port, () => console.log("Server Berjalan di port "));


