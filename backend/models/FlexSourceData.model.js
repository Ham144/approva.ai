import mongoose from "mongoose";

//source Data dicocokkan
const sourceDataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
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
  //external (tipe external itu ga make field keys, dia hanya hanya menampilkan data dari url yang diberikan )
  tipe: {
    type: String,
    enum: ["external", "internal"],
    default: "internal",
  },
  apiKey: String,
  penamaanSearchKey: {
    type: String,
    default: "searchKey",
  },
  views: {
    type: String,
    enum: ["big", "standard", "small"],
    default: "standard",
  },
  endpoint: String,
  pointer: String,
  keyMapping: {
    //ini digunakan untuk penggati keys nanti jika tipe : external
    key: String,
    value: String,
  },
});

sourceDataSchema.index({ title: 1, unique: true });

const SourceData = mongoose.model("SourceData", sourceDataSchema);
export default SourceData;
