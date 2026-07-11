import { Router } from "express";
import FlexSourceData from "../models/FlexSourceData.model.js";
import axios from "axios";
import getNestedValue from "../utils/getNestedDataUtil.js";
import authenticate from "../middlewares/authenticate.js";

const router = Router();
//interal
router.post("/createSourceData", authenticate, async (req, res) => {
  const { title, desc, keys, views } = req.body;

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
      views,
      createdBy: req.user._id,
      org: req.user.org, // ✅ penting: scope ke organisasi
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

router.post("/createSourceDataExternal", authenticate, async (req, res) => {
  const {
    title,
    desc,
    endpoint,
    xApiKey: apiKey,
    searchKey,
    penamaanSearchKey,
    pointer,
    keyMapping: key,
    valueMapping: value,
  } = req.body;

  if (!penamaanSearchKey) {
    return res.status(400).json({ message: "Penamaan search key is required" });
  }
  try {
    const flexSourceDataInstance = new FlexSourceData({
      tipe: "external",
      title,
      desc,
      penamaanSearchKey,
      endpoint,
      apiKey,
      pointer,
      keyMapping: { key, value },
      createdBy: req.user._id,
      org: req.user.org, // ✅ penting: scope ke organisasi
    });

    await flexSourceDataInstance.save();

    return res.json({
      data: flexSourceDataInstance,
      message: "New list of data for options added",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/getAllSourceData/:search?", authenticate, async (req, res) => {
  const search = req.params.search;
  const query = {};
  if (search && search !== "undefined") {
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

router.get("/getSourceDataById/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Id is required to fetch full data" });
  }

  try {
    const flexSourceData = await FlexSourceData.findOne({
      _id: id,
      org: req.user.org,
    });

    if (!flexSourceData) {
      return res.status(404).json({ message: "We can't find such id" });
    }

    return res.json({ data: flexSourceData });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/getSourceDataByIdPost", async (req, res) => {
  const { id, searchKey } = req.query;
  if (!id) {
    return res
      .status(400)
      .json({ message: "Id is required to fetch full data" });
  }

  try {
    const flexSourceData = await FlexSourceData.findOne({
      _id: id,
    });

    if (!flexSourceData) {
      return res.status(404).json({ message: "Pilihan tidak ditemukan" });
    }

    // Jika user login, pastikan org cocok (tenancy isolation)
    if (req.user && flexSourceData.org && flexSourceData.org.toString() !== req.user.org.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (flexSourceData.tipe == "external") {
      const { endpoint, apiKey, penamaanSearchKey, pointer, keyMapping } =
        flexSourceData;

      const params = searchKey ? { [penamaanSearchKey]: searchKey } : {};

      const response = await axios.get(endpoint, {
        headers: { "x-api-key": apiKey },
        params,
      });

      let extractedData = response.data;
      if (pointer?.length > 0) {
        extractedData = response.data;

        if (pointer?.length > 0) {
          extractedData = getNestedValue({
            obj: response.data,
            pointer: pointer,
          });
        }
      }

      const keys =
        extractedData?.map((item) => ({
          key: item[keyMapping.key],
          value: item[keyMapping.value],
        })) || [];

      //jaga jaga jika data dari external terlalu banyak
      if (keys.length > 30) {
        result.keys = result.keys.slice(0, 30);
      }

      const result = {
        ...flexSourceData._doc,
        keys,
      };

      return res.json({ data: result });
    }

    return res.json({ data: flexSourceData });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Edit source data
router.put("/editSourceData/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, desc, keys, views } = req.body;

  console.log(id, req.body);

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
    const updated = await FlexSourceData.findOneAndUpdate(
      { _id: id, org: req.user.org }, // ✅ scope ke tenant
      {
        title,
        desc,
        views,
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
router.delete("/deleteSourceData/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const deleted = await FlexSourceData.findOneAndDelete({
      _id: id,
      org: req.user._id,
    });
    if (!deleted) return res.status(404).json({ message: "Data not found" });
    return res.json({ message: "Data deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

export default router;
