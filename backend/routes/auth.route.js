import { Router } from "express";
import generateTokenJWT from "../utils/generateTokenJWT.js";
import UserRefrensi from "../models/User.model.js";
import bcrypt from "bcryptjs";
import LdapClient from "ldapjs-client";
import authenticate from "../middlewares/authenticate.js";

const router = Router();

// Middleware untuk menangani async routes dan error
// Ini akan menangkap Promise rejection dan meneruskannya ke middleware error Express berikutnya
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next); // Meneruskan error ke next()
};

// login biasa web
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
  "/login/ldap",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username dan password diperlukan.",
      });
    }

    const client = new LdapClient({
      url: `ldap://${process.env.AD_HOST}:${process.env.AD_PORT}`,
    });

    try {
      let userLDAP;
      try {
        userLDAP = await client.bind(username, password);
      } catch (error) {
        throw Error("Gagal menemukan user demikian di LDAP");
      }

      if (userLDAP?.success == false || userLDAP.message == "null") {
        return res.status(403).json({
          message: "Anda tidak ditemukan di LDAP",
        });
      }
      console.log("user ditemukan di database");

      let userDB = await UserRefrensi.findOne({ username });
      if (!userDB) {
        userDB = await UserRefrensi.create({ username });
      }

      const payload = {
        _id: userDB._id,
        username: username,
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

// Create new user endpoint
router.post("/createNewUser", async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username dan password diperlukan.",
    });
  }

  const user = await UserRefrensi.findOne({ username });
  if (user) {
    return res.status(400).json({
      success: false,
      message: "Username sudah ada.",
    });
  }

  // Validasi password
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password harus memiliki setidaknya 6 karakter.",
    });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password harus memiliki setidaknya satu huruf besar.",
    });
  }
  if (!/\d/.test(password)) {
    return res.status(400).json({
      success: false,
      message: "Password harus memiliki setidaknya satu angka.",
    });
  }

  const hashedPass = bcrypt.hashSync(password, 10);
  const newUser = new UserRefrensi({
    username,
    password: hashedPass,
    role: role,
  });

  await newUser.save();
  return res.status(201).json({
    // 201 Created untuk resource baru
    success: true,
    message: "User berhasil dibuat.",
  });
});

router.put(
  "/updateUser",
  asyncHandler(async (req, res) => {
    const { _id, password, role, isDisabled, username } = req.body;

    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "ID user diperlukan.",
      });
    }
    if (!role) {
      // Role mungkin opsional untuk update, sesuaikan kebutuhan Anda
      return res.status(400).json({
        success: false,
        message: "Role diperlukan.",
      });
    }

    const user = await UserRefrensi.findById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    // Hanya update jika username diberikan dan berbeda
    if (username && user.username !== username) {
      const existingUserWithNewUsername = await UserRefrensi.findOne({
        username,
      });
      if (
        existingUserWithNewUsername &&
        existingUserWithNewUsername._id.toString() !== _id
      ) {
        return res.status(400).json({
          success: false,
          message: "Username sudah digunakan oleh akun lain.",
        });
      }
      user.username = username;
    }

    user.role = role;
    user.isDisabled = isDisabled !== undefined ? isDisabled : user.isDisabled; // Hanya update jika isDisabled diberikan

    if (password && password !== "") {
      // Validasi password baru
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password harus memiliki setidaknya 6 karakter.",
        });
      }
      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password harus memiliki setidaknya satu huruf besar.",
        });
      }
      if (!/\d/.test(password)) {
        return res.status(400).json({
          success: false,
          message: "Password harus memiliki setidaknya satu angka.",
        });
      }
      user.password = bcrypt.hashSync(password, 10);
    }

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
