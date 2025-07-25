import mongoose from "mongoose";

export const InputSchema = new mongoose.Schema({
  // _id: {
  //   type: String,
  //   required: true,
  // },
  title: {
    type: String,
    required: true,
  },
  help: String,
  tipe: {
    type: String,
    enum: [
      "pdf",
      "image",
      "text",
      "table",
      "confirm",
      "date",
      "signature",
      "number",
      "select",
      "multipleCheckbox",
    ],
  },
  sourceData: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SourceData",
  },
  table: {
    keys: [String],
    keysType: ["image", "text", "date", "number", "select"],
    sourceDataList: [mongoose.Schema.Types.ObjectId],
  },
  isNullable: Boolean,
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: true,
  },
});

const Input = mongoose.model("Input", InputSchema);
export default Input;
