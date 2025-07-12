import { Router } from "express";
import generateTokenJWT from "../utils/generateTokenJWT.js";
import UserRefrensi from "../models/User.model.js";
import bcrypt from "bcryptjs";
import LdapClient from "ldapjs-client";
import authenticate from "../middlewares/authenticate.js";
import Org from "../models/Organization.model.js";

const router = Router();

// Middleware untuk menangani async routes dan error
// Ini akan menangkap Promise rejection dan meneruskannya ke middleware error Express berikutnya
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next); // Meneruskan error ke next()
};

// login biasa web deprecated
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password diperlukan.",
      });
    }

    const userDB = await UserRefrensi.findOne({ username });
    if (!userDB) {
      return res.status(400).json({
        success: false,
        message: "Username atau password salah.",
      });
    }

    const isPasswordMatch = bcrypt.compareSync(password, userDB.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Username atau password salah.",
      });
    }

    if (userDB.isDisabled) {
      return res.status(403).json({
        // Menggunakan 403 Forbidden lebih sesuai untuk akun dinonaktifkan
        success: false,
        message: "Akun Anda telah dinonaktifkan.",
      });
    }

    const sanitizedUser = {
      _id: userDB._id,
      username: userDB.username,
      role: userDB.role,
    };

    const token = await generateTokenJWT(userDB._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya secure di production
      sameSite: "Lax", // Menggunakan 'Lax' lebih fleksibel untuk banyak kasus
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      success: true,
      message: "Selamat datang kembali.",
      data: sanitizedUser,
    });
  })
);

router.post(
  "/multi-tenant/register",
  asyncHandler(async (req, res) => {
    const { username, password, email, org, selectedOrg } = req.body;

    try {
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username dan password diperlukan.",
        });
      }

      let client;
      let ldapHost, ldapPort;
      let organizationId;
      let role = "member"; // default role

      // ───── JOIN EXISTING ORG ─────
      if (selectedOrg) {
        const OrgDB = await Org.findById(selectedOrg);
        if (!OrgDB) {
          return res.status(400).json({
            success: false,
            message: "Organisasi yang dipilih tidak ditemukan.",
          });
        }

        ldapHost = OrgDB.AD_HOST;
        ldapPort = OrgDB.AD_PORT;
        organizationId = OrgDB._id;

        client = new LdapClient({
          url: `ldap://${ldapHost}:${ldapPort}`,
        });
      }

      // ───── CREATE NEW ORG ─────
      else if (org) {
        const { AD_HOST, AD_PORT, organizationName } = org;

        if (!AD_HOST || !AD_PORT || !organizationName) {
          return res.status(400).json({
            success: false,
            message: "Field konfigurasi organisasi tidak lengkap.",
          });
        }

        ldapHost = AD_HOST;
        ldapPort = AD_PORT;

        client = new LdapClient({
          url: `ldap://${ldapHost}:${ldapPort}`,
        });

        // tes koneksi LDAP
        try {
          await client.bind(username, password);
        } catch (error) {
          return res.status(403).json({
            success: false,
            message: "Gagal login ke LDAP, periksa koneksi dan kredensial.",
          });
        }

        // buat org baru
        const existingOrg = await Org.findOne({
          organizationName,
        });
        if (existingOrg) {
          return res.status(400).json({
            success: false,
            message: "Organisasi dengan nama ini sudah ada.",
          });
        }
        const newOrg = await Org.create({
          organizationName,
          AD_HOST,
          AD_PORT,
          owners: [], // ditambahkan nanti setelah user dibuat
          members: [],
        });

        organizationId = newOrg._id;
        role = "owner";
      }

      // ───── HANDLE ERROR: TIDAK PILIH APA-APA ─────
      else {
        return res.status(400).json({
          success: false,
          message: "Anda harus memilih atau membuat organisasi.",
        });
      }

      // ───── VALIDASI USER KE LDAP ─────
      try {
        const userLDAP = await client.bind(username, password);

        if (!userLDAP || userLDAP.success === false) {
          return res.status(403).json({
            message: "User tidak ditemukan di LDAP.",
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(403).json({
          message: "Gagal login ke LDAP.",
        });
      }
      // ───── SIMPAN DI DATABASE ─────
      let userDB = await UserRefrensi.findOne({
        username,
        org: organizationId,
      });

      if (!email) {
        return res
          .status(400)
          .json({ message: "Gagal, email diperlukan untuk notifikasi" });
      }
      if (userDB) {
        return res
          .status(400)
          .json({ message: "Anda sudah terdaftar, coba login saja" });
      } else {
        userDB = await UserRefrensi.create({
          username,
          email,
          org: organizationId,
          role,
        });

        // Tambahkan ke org.members dan org.owners jika owner
        await Org.findByIdAndUpdate(organizationId, {
          $addToSet: {
            members: userDB._id,
            ...(role === "owner" ? { owners: userDB._id } : {}),
          },
        });
      }

      // ───── BUAT TOKEN LOGIN ─────
      const payload = {
        _id: userDB._id,
        username: userDB.username,
        org: userDB.organizationId,
        role: userDB.role,
      };

      const token = await generateTokenJWT(payload);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message:
          userDB.status === "pending"
            ? "Pendaftaran berhasil, menunggu persetujuan organisasi."
            : "Login berhasil. Selamat datang!",
        data: {
          username: userDB.username,
          role: userDB.role,
          organizationId: userDB._id,
        },
      });
    } catch (error) {
      if (error.code === "11000") {
        return res.status(400).json({
          message: "Terdapat duplikat",
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  })
);

router.post(
  "/login/ldap",
  asyncHandler(async (req, res) => {
    const { username, password, selectedOrg } = req.body;

    if (!username || !password || !selectedOrg) {
      return res.status(400).json({
        success: false,
        message: "perlu melengkapi semua credentials",
      });
    }

    const OrgDB = await Org.findById(selectedOrg);
    if (!OrgDB) {
      return res.status(400).json({
        success: false,
        message: "Organisasi yang dipilih tidak ditemukan.",
      });
    }

    let userDB = await UserRefrensi.findOne({ username, org: selectedOrg });

    if (!userDB) {
      return res.status(400).json({
        success: false,
        message:
          "Anda tidak diemukan di organisasi ini, mohon register dulu dan pilih organisasi anda dengan username:password LDAP anda.",
      });
    }

    const client = new LdapClient({
      url: `ldap://${OrgDB.AD_HOST}:${OrgDB.AD_PORT}`,
    });

    try {
      let userLDAP;
      try {
        userLDAP = await client.bind(username, password);
      } catch (error) {
        return res.status(403).json({
          message:
            "Gagal menghubungkan kredensial user ke LDAP, mungkin kesalahan pemmilihan organisasi atau username:password.",
        });
      }

      if (userLDAP?.success == false || userLDAP.message == "null") {
        return res.status(403).json({
          message:
            "Anda tidak ditemukan pada LDAP organisasi demikian, mungkin kesalahan pemmilihan organisasi atau username:password",
        });
      }

      const payload = {
        _id: userDB._id,
        username: username,
        org: OrgDB._id,
        role: userDB.role,
      };

      const token = await generateTokenJWT(payload);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax", // Menggunakan 'Lax' lebih fleksibel untuk banyak kasus
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        success: true,
        message: "Selamat datang kembali.",
        data: username,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  })
);

router.put(
  "/updateUser",
  authenticate,
  asyncHandler(async (req, res) => {
    const { _id, role } = req.body;

    if (!_id || !role) {
      return res.status(400).json({
        success: false,
        message: "ID dan role diperlukan.",
      });
    }

    const user = await UserRefrensi.findById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    if (user.role === role) {
      return res.status(400).json({
        success: false,
        message: "Role sama, tidak ada perubahan.",
      });
    }

    const orgDB = await Org.findById(req.user.org);
    if (!orgDB) {
      return res.status(404).json({
        success: false,
        message: "Organisasi tidak ditemukan.",
      });
    }

    // Pastikan selalu ada di members[]
    if (!orgDB.members.includes(user._id)) {
      orgDB.members.push(user._id);
    }

    // Update role dan update array
    if (role === "owner") {
      // Tambahkan ke owners jika belum ada
      if (!orgDB.owners.includes(user._id)) {
        orgDB.owners.push(user._id);
      }
    } else if (role === "member") {
      // Hapus dari owners jika ada
      orgDB.owners = orgDB.owners.filter(
        (ownerId) => ownerId.toString() !== user._id.toString()
      );
    }

    user.role = role;

    await orgDB.save();
    await user.save();

    return res.json({
      success: true,
      message: "User berhasil diperbarui.",
    });
  })
);

//ini untuk memperbarui userInfo karena di authenticate payload cuma di decode
router.get(
  "/getUserInfo",
  authenticate,
  asyncHandler(async (req, res) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Akses tidak sah. Token tidak ditemukan atau tidak valid.",
      });
    }

    const userDB = await UserRefrensi.findById(req.user._id).select(
      "-password"
    );
    if (!userDB) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    return res.json({
      success: true,
      userInfo: userDB,
    });
  })
);

router.get(
  "/getUserInfoComplete",
  authenticate, // Asumsi middleware authorize akan mengisi req.userId
  asyncHandler(async (req, res) => {
    if (!req.userId) {
      // Sama seperti getUserInfo
      return res.status(401).json({
        success: false,
        message: "Akses tidak sah. Token tidak ditemukan atau tidak valid.",
      });
    }
    const userDB = await UserRefrensi.findById(req.userId).select("-password");
    if (!userDB) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }
    return res.json({
      success: true,
      message: "Informasi user lengkap berhasil diambil.",
      data: userDB,
    });
  })
);

router.get(
  "/getAllAccount",
  authenticate,
  asyncHandler(async (req, res) => {
    // Opsional: Tambahkan logika otorisasi peran di sini, misalnya:
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ success: false, message: "Akses ditolak. Hanya admin yang bisa melihat semua akun." });
    // }
    const userDBs = await UserRefrensi.find().select("-password -isDisabled");
    return res.json({
      success: true,
      message: "Semua akun berhasil diambil.",
      data: userDBs,
    });
  })
);

// web
router.delete(
  "/logout",
  authenticate,
  asyncHandler(async (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    }); // Pastikan opsi cookie sama saat menghapus
    return res.json({
      success: true,
      message: "Berhasil logout.",
    });
  })
);

export default router;
