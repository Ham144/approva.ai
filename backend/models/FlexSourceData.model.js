import mongoose from "mongoose";

//source Data dicocokkan
const sourceDataSchema = new mongoose.Schema({
  title: String,
  desc: String,
  keys: [
    {
      key: String,
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRefrensi",
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Org",
  },
});

sourceDataSchema.index({ title: 1, unique: true });

const SourceData = mongoose.model("SourceData", sourceDataSchema);
export default SourceData;
