import mongoose from "mongoose";

//Ingat: INI HANYA TEMPLATE UNTUK EDITOR, untuk penggunaan sebenarnya itu adalah model FlowInstance.model.js
const flowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
      required: true,
    },
    request: [
      {
        type: String,
        ref: "Input",
      },
    ],
    isAllowanceModeRequest: Boolean, //jika true maka akan cek apakah user yg coba create request dengan flow template ini terdaftar di allowedUserRequest
    allowedUserToRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRefrensi",
      },
    ],
    status: [
      {
        title: {
          type: String,
          required: true,
        },
        desc: {
          type: String,
          required: true,
        },
        authorized: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserRefrensi",
          },
        ],
        requirements: [
          {
            type: String,
            ref: "Input",
          },
        ],
      },
    ],
    designedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRefrensi",
      },
    ],
  },
  { timestamps: true }
);

const Flow = mongoose.model("FlowAndPoint", flowSchema);
export default Flow;
