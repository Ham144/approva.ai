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
    isAllowanceModeRequest: Boolean, //jika true maka akan cek apakah hanya untuk deparment tertentu. yg coba create request dengan flow template ini terdaftar di allowedDepartmentToRequest
    mode: {
      //harusnya ini aja bisa gantikan field diatas tapi tunda dulu
      type: String,
      enums: ["public", "private", "department"],
      required: true,
    },
    allowedDepartmentToRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    allowedSpecificUserToRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserRefrensi",
      },
    ],

    status: [
      {
        uuid: String,
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
    logics: [
      {
        requirementId: String,
        logicType: String,
        operator: String,
        value: String,
        jumpToStatusUuid: String,
      },
    ],
    org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      required: true,
    },
  },
  { timestamps: true }
);

const Flow = mongoose.model("FlowAndPoint", flowSchema);
export default Flow;
