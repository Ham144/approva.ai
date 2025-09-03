import { Router } from "express";
import Customer from "../models/Customer.model.js";

const router = Router();

router.get("/list", async (req, res) => {
  const customer = Customer.find();
  return customer;
});

router.get;

export default router;
