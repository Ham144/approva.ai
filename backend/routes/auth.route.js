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

// register ldap depracated ✅
router.post(
  "/multi-tenant/register",
  asyncHandler(async (req, res) => {
    const { username, password, email, newOrg, selectedOrg } = req.body;

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
      let role = process.env.DEFAULT_ROLE; // default role

      // ───── JOIN EXISTING ORG ─────
      if (selectedOrg?._id) {
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
      else if (newOrg) {
        const { AD_HOST, AD_PORT, organizationName } = newOrg;

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
        const org = await Org.create({
          organizationName,
          AD_HOST,
          AD_PORT,
          owners: [], // ditambahkan nanti setelah user dibuat
          members: [],
        });

        organizationId = org._id;
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

//login LDAP ✅
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

      let userDB = await UserRefrensi.findOne({ username, org: selectedOrg });
      if (!userDB) {
        userDB = new UserRefrensi({
          username,
          org: selectedOrg,
          role: "member",
          authMethod: "ldap",
        });
        await userDB.save();
        await Org.findByIdAndUpdate(selectedOrg, {
          $addToSet: {
            members: userDB._id,
          },
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

// login app ✅
router.post(
  "/login/app",
  asyncHandler(async (req, res) => {
    const { username, password, selectedOrg } = req.body;

    if (!username || !password || !selectedOrg) {
      return res.status(400).json({
        success: false,
        message: "Perlu melengkapi semua credentials",
      });
    }

    const OrgDB = await Org.findById(selectedOrg);
    if (!OrgDB) {
      return res.status(400).json({
        success: false,
        message: "Organisasi yang dipilih tidak ditemukan.",
      });
    }

    // Ambil user dengan password (jangan .select dulu!)
    const userDB = await UserRefrensi.findOne({
      username,
      org: selectedOrg,
    });

    if (!userDB) {
      return res.status(400).json({
        success: false,
        message:
          "Anda tidak ditemukan di organisasi ini. Mohon register dulu dan pilih organisasi anda.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userDB.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password salah.",
      });
    }

    const payload = {
      _id: userDB._id,
      username: userDB.username,
      org: OrgDB._id,
      role: userDB.role,
    };

    const token = await generateTokenJWT(payload);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    });

    // Hilangkan password sebelum kirim response
    const { password: _pw, ...userWithoutPassword } = userDB.toObject();

    return res.json({
      success: true,
      message: "Selamat datang.",
      data: userWithoutPassword,
    });
  })
);

//update user ✅
router.put(
  "/updateUser",
  authenticate,
  asyncHandler(async (req, res) => {
    const { _id, role, password } = req.body;

    if (!_id || !role) {
      return res.status(400).json({
        success: false,
        message: "ID dan role diperlukan.",
      });
    }

    const user = await UserRefrensi.findOne({ _id, org: req.user.org });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    if (user.authMethod == "supertenant") {
      return res.status(400).json({
        success: false,
        message: "User supertenant masih belum bisa diedit seperti user lain.",
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

    if (password && user.authMethod === "app") {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
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
//get user info ✅
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

    const userDB = await UserRefrensi.findOne({
      _id: req.user._id,
      org: req.user.org,
    }).select("-password");
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

//get user info complete ✅
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
    const userDB = await UserRefrensi.findOne({
      _id: req.userId,
      org: req.user.org,
    }).select("-password");
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
    // Opsional: Validasi role jika hanya pemilik/owner yang boleh lihat
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Hanya owner yang bisa melihat semua akun.",
      });
    }

    const userDBs = await UserRefrensi.find({
      org: req.user.org,
    }).select("-password");

    return res.json({
      success: true,
      message: "Semua akun berhasil diambil.",
      data: userDBs,
    });
  })
);

//ini untuk membuat user yang tidak terikat dengan LDAP
router.post("/createAppUser", authenticate, async (req, res) => {
  const { username, email, password, role } = req.body;

  // Validasi input awal
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username, email, dan password harus diisi.",
    });
  }

  try {
    // Cek duplikasi username di organisasi yang sama
    const usernameExists = await UserRefrensi.findOne({
      username,
      org: req.user.org,
    });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username sudah digunakan.",
      });
    }

    // Cek duplikasi email di organisasi yang sama
    const emailExists = await UserRefrensi.findOne({
      email,
      org: req.user.org,
    });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email sudah digunakan.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    await UserRefrensi.create({
      username,
      email,
      password: hashedPassword,
      role: role || "member",
      authMethod: "app",
      org: req.user.org,
    });

    return res.status(201).json({
      success: true,
      message: "User berhasil dibuat.",
    });
  } catch (error) {
    console.error("❌ Create App User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server.",
    });
  }
});

router.delete("/deleteAppUser/:id", authenticate, async (req, res) => {
  const id = req?.params?.id;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Id is required",
    });
  }

  try {
    await UserRefrensi.findOneAndDelete({ _id: id, org: req.user.org });

    return res.json({
      message: "User berhasil dihapus.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

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
