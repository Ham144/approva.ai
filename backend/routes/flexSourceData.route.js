import { Router } from "express";
import FlexSourceData from "../models/FlexSourceData.model.js";

const router = Router();
router.post("/createSourceData", async (req, res) => {
  const { title, desc, keys } = req.body;

  if (!title || !desc) {
    return res.status(400).json({
      message: "Title and description are required",
    });
  }

  if (!Array.isArray(keys) || keys.length < 2) {
    return res.status(400).json({
      message: "Your data must have at least 2 options",
    });
  }

  for (const fl of keys) {
    if (!fl.key || typeof fl.key !== "string") {
      return res.status(400).json({
        message: "Each key must be a non-empty string",
      });
    }
  }

  try {
    const flexSourceDataInstance = new FlexSourceData({
      title,
      desc,
      keys: keys.map((fl) => ({
        ...fl,
        key: fl.key.replaceAll(" ", "_"),
      })),
      createdBy: req?.user?._id,
    });

    await flexSourceDataInstance.save();

    return res.json({
      message: "New list of data for options added",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Title must be unique",
      });
    }

    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

//kembalikan hanya judul dan desc
router.get("/getAllSourceData/:search?", async (req, res) => {
  const search = req.params.search;
  const query = {};

  if (search != "undefined" && search) {
    query.title = { $regex: search, $options: "i" };
  }

  try {
    const flexSourceData = await FlexSourceData.find(query)
      .populate("createdBy", "username")
      .select("-keys");

    return res.json(flexSourceData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

router.get("/getSourceDataById/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Id is required to fetch full data" });
  }
  try {
    const flexSourceData = await FlexSourceData.findById(id);
    if (!flexSourceData)
      return res.status(404).json({ message: "we cant find such id" });
    else return res.json({ data: flexSourceData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/getSourceDataByIdPost", async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Id is required to fetch full data" });
  }
  try {
    const flexSourceData = await FlexSourceData.findById(id);
    if (!flexSourceData)
      return res.status(204).json({ message: "we cant find such id" });
    else return res.json({ data: flexSourceData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Edit source data
router.put("/editSourceData/:id", async (req, res) => {
  const { id } = req.params;
  const { title, desc, keys } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  if (!title || !desc) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }
  if (!Array.isArray(keys) || keys.length < 2) {
    return res
      .status(400)
      .json({ message: "Your data must have at least 2 options" });
  }
  for (const fl of keys) {
    if (!fl.key || typeof fl.key !== "string") {
      return res
        .status(400)
        .json({ message: "Each key must be a non-empty string" });
    }
  }
  try {
    const updated = await FlexSourceData.findByIdAndUpdate(
      id,
      {
        title,
        desc,
        keys: keys.map((fl) => ({ ...fl, key: fl.key.replaceAll(" ", "_") })),
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Data not found" });
    return res.json({ message: "Data updated", data: updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Title must be unique" });
    }
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Delete source data
router.delete("/deleteSourceData/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const deleted = await FlexSourceData.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Data not found" });
    return res.json({ message: "Data deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export default router;
