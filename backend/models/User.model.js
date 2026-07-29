import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true, // 🌟 Mengamankan agar username selalu disimpan dalam huruf kecil
      trim: true
    },
    displayName: String,
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      enum: ["member", "viewer", "owner", "supertenant"],
      default: "member",
    },
    password: {
      type: String,
      // 🌟 Validasi bersyarat: Jika authMethod adalah 'app', password WAJIB diisi
      required: function() {
        return this.authMethod === "app";
      }
    },
    authMethod: {
      type: String,
      required: true,
      enum: ["app", "ldap"],
      default: "ldap",
    },
    mobile :String,// ini di ldap apa ya?
    // 🌟 TAMBAHKAN VALIDASI: hanya user role owner yang boleh upload foto profil.
    org: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Org",
      // 🌟 Validasi bersyarat: Jika role adalah 'supertenant', org BOLEH kosong (null)
      required: function() {
        return this.role !== "supertenant";
      }
    },
  },
  { timestamps: true }
);

// 🌟 SOLUSI KRITIS: Membuat kombinasi username + org menjadi UNIK.
// Ini mencegah username kembar di dalam organisasi yang sama, 
// tetapi mengizinkan username yang sama di organisasi yang berbeda.
userSchema.index({ username: 1, org: 1 }, { unique: true });

const UserRefrensi = mongoose.models.UserRefrensi || mongoose.model("UserRefrensi", userSchema);
export default UserRefrensi;
