import { Router } from "express";
import {
  getSoapConfig,
  resetInitialSystemConfig,
  updateSoapConfig,
  updateSoapCredentials,
} from "../controllers/soapConfig-controller.js";

const router = Router();

router.get("/get-ws", getSoapConfig);
router.put("/update-ws", updateSoapConfig);
router.put("/update-credentials", updateSoapCredentials);
router.put("/reset", resetInitialSystemConfig);

export default router;
