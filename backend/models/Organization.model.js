import mongoose from "mongoose";

//tenant
const organizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      unique: true,
    },
    // start AD---------------
    AD_HOST: {
      type: String,
    },
    AD_PORT: {
      type: Number,
    },
    AD_DOMAIN: {
      type: String,
    },
    AD_BASE_DN: {
      //contoh : DC=csi,DC=my,DC=id
      type: String,
    },
    //END AD------------------
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
    },
    EMAIL_PASS: {
      type: String,
    },
    EMAIL_HOST: {
      type: String,
    },
    EMAIL_PORT: {
      type: String,
      default: "587",
    },
    EMAIL_SECURE: {
      type: Boolean,
      default: false,
    },
    // Setting app
    authorizedToDownloadUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRefrensi",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Org = new mongoose.model("Org", organizationSchema);
export default Org;
