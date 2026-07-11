import mongoose from "mongoose";

const flowInstanceSchema = new mongoose.Schema(
  {
    // Referensi ke template Flow yang digunakan
    instanceTitle: {
      type: String,
      required: true,
    },
    flowTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FlowAndPoint",
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRefrensi",
    },
    requestData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    currentStatusIndex: {
      type: Number, // Indeks dari array status di flowTemplate
      default: 0, // Dimulai dari status pertama
    },
    statuses: [
      {
        statusTitle: {
          type: String,
          required: true,
        },
        statusDesc: {
          type: String,
          required: true,
        },
        requirementsData: {
          type: mongoose.Schema.Types.Mixed, // Objek { [input._id]: value }
          default: {},
        },
        // Properti yang akan berubah seiring berjalannya alur kerja
        completed: {
          type: Boolean,
          default: false,
        },
        completedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserRefrensi",
        },
        completedAt: {
          type: Date,
        },
        verdict: {
          //yang nentuin ini adalah approval button
          type: String,
          enum: ["approved", "rejected", "pending"],
          default: "pending",
        },
        rejectedReason: String,
        isPrivateAuthorized: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Properti tambahan untuk melacak alur kerja secara keseluruhan
    overallStatus: {
      type: String,
      enum: [
        "draft", //ini cuma request tapi tidak public, hanya dirinnya sendiri yg bisa liat, dan requirement/status tidak bisa diisi
        "in-progress", //ini sudah public dan akan memberikan notifikasi sesuai orang yang bertanggung jawab pada currentStatusIndex
        "completed", // ini sudah lewat dan barang sudah didapat
        "rejected", //ini sudah lewat dan request berakhir ditolak
      ],
      default: "draft",
    },
    // isPrivateRequest: {
    //   //ini untuk menentukan request ini tampil kesemua nya di process page atau hanya sebagian orang
    //   type: Boolean,
    //   default: false,
    // },
    // whoCanSee: [
    //   //not used
    //   //ini untuk mode isPrivateRequest active
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "UserRefrensi",
    //   },
    // ],
    org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      required: true,
    },
    globalIndex: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // createdAt dan updatedAt untuk setiap permintaan
);

const FlowInstance = mongoose.model("FlowInstance", flowInstanceSchema);
export default FlowInstance;
