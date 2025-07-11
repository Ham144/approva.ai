import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  //tetap pakai _id ya untuk link, biar bisa populate
  {
    username: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["pengelola", "user"],
      default: "pengelola", //nanti ubah jadi user
    },
  },
  { timestamps: true }
);

userSchema.index({ username: 1 }, { unique: true });

const UserRefrensi = new mongoose.model("UserRefrensi", userSchema);

export default UserRefrensi;
