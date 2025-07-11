import express from "express";
import "dotenv/config";
import { connectDB } from "./utils/connectDB.js";
import cors from "cors";
import auhtRoutes from "./routes/auth.route.js";
import authenticate from "./middlewares/authenticate.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import configRoutes from "./routes/config.route.js";
import FlexSourceDataRoutes from "./routes/flexSourceData.route.js";
import flowAndPointRoutes from "./routes/flowAndPoint.route.js";
import flowInstanceroutes from "./routes/flowInstance.route.js";

const isProduction = process.env.NODE_ENV === "production";
const corsOrigin = isProduction
  ? ["http://192.168.169.12:5173"]
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
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//database
connectDB();

//public seutuhnya || kalau sebagian, tambah ke noAuthOriginalUrl js
app.get("/", async (req, res) => {
  return res.send("BACKEND : 200");
});

//routes
app.use("/api/auth", auhtRoutes);
app.use("/api/config", authenticate, configRoutes);
app.use("/api/flexSourceData", authenticate, FlexSourceDataRoutes);
app.use("/api/flow", authenticate, flowAndPointRoutes); //ini untuk designernya
app.use("/api/flowInstance", authenticate, flowInstanceroutes); //ini untuk user

const port = process.env.PORT;
app.listen(port, () => console.log("Server Berjalan di port "));
