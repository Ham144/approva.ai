import mongoose from "mongoose";

export const InputSchema = new mongoose.Schema({
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
      "textArea",
      "helper",
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
  uuid: String,
});

const Input = mongoose.model("Input", InputSchema);
export default Input;
