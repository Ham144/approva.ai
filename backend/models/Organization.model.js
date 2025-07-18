import mongoose from "mongoose";

//tenant
const organizationSchema = new mongoose.Schema(
  {
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRefrensi",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    // start smtp---------------
    EMAIL_USER: {
      type: String,
      required: true,
    },
    EMAIL_PASS: {
      type: String,
      required: true,
    },
    EMAIL_HOST: {
      type: String,
      required: true,
    },
    EMAIL_PORT: {
      type: String,
      required: true,
      default: "587",
    },
    EMAIL_SECURE: {
      type: Boolean,
      required: true,
      default: false,
    },
    // start smtp---------------
  },
  {
    timestamps: true,
  }
);

const Org = new mongoose.model("Org", organizationSchema);
export default Org;
