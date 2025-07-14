import mongoose from "mongoose";

//tenant
const organizationSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: true,
    unique: true,
  },
  AD_HOST: {
    type: String,
    required: true,
  },
  AD_PORT: {
    type: Number,
    required: true,
  },
  owners: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRefrensi",
      required: true,
    },
  ],
  members: [
    //owner juga harusnya ada disini
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRefrensi",
      required: true,
    },
  ],
});

const Org = new mongoose.model("Org", organizationSchema);
export default Org;
