import mongoose from "mongoose";

const downloadProcessSchema = new mongoose.Schema({
  filePath: String,
  month: String,
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
    required: true,
  },
});

const DownloadedProcess = mongoose.model(
  "DownloadedProcess",
  downloadProcessSchema
);
export default DownloadedProcess;
