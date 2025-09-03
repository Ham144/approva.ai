import { Router } from "express";
import Customer from "../models/Customer.model.js";

const router = Router();

router.get("/list", async (req, res) => {
  const customer = Customer.find();
  return customer;
});

router.post("/checkRadius", async (req, res) => {
  const { longtitude, lattitude } = req.body;
  const customer = Customer.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longtitude, lattitude],
        },
        $maxDistance: 1000,
      },
    },
  });

  return customer;
});

router.post("/create", async (req, res) => {
  const { No, Name, coordinates } = req.body;

  const isExist = await Customer.findOne({ No });
  if (isExist) {
    return res.status(400).json({ message: "No already exist" });
  }
  const customer = await Customer.create({ No, Name, coordinates });
  return customer;
});

router.put("/update", async (req, res) => {
  const { No, Name, coordinates } = req.body;
  const customer = await Customer.findOneAndUpdate(
    { No },
    { Name, coordinates }
  );
  return customer;
});

export default router;
