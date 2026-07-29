import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import UserRefrensi from "../models/User.model.js";
import Org from "../models/Organization.model.js";

async function init() {
  try {
    // 1. Hubungkan ke database menggunakan URI dari environment
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Menghubungkan ke database untuk pengecekan awal...");

    // 2. Cek/Buat Organisasi Default (Hexadim LLC) jika belum ada sama sekali
    let defaultOrg = await Org.findOne({ organizationName: "Hexadim LLC" });
    if (!defaultOrg) {
      console.log("🌱 Membuat organisasi default 'Hexadim LLC'...");
      defaultOrg = await Org.create({
        organizationName: "Hexadim LLC",
        owners: [],
        members: []
      });
      console.log("✅ Organisasi 'Hexadim LLC' berhasil dibuat.");
    }

    // 3. Cek apakah ada data user supertenant di database
    let supertenant = await UserRefrensi.findOne({ role: "supertenant", username: "supertenant" });
    
    if (!supertenant) {
      console.log("🌱 Supertenant belum ada. Menjalankan seed awal...");

      // Buat password acak yang aman (huruf besar, kecil, angka, simbol)
      const randomString = Math.random().toString(36).slice(-6);
      const randomPassword = `Admin${randomString}!`; // Contoh: Adminx8y9z!
      
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Buat user supertenant dan hubungkan ke Hexadim LLC
      supertenant = await UserRefrensi.create({
        username: "supertenant",
        email: "supertenant@approva.local", 
        role: "supertenant",
        authMethod: "app",
        password: hashedPassword,
        org: defaultOrg._id
      });

      // Update owners dan members organisasi dengan supertenant
      defaultOrg.owners.push(supertenant._id);
      defaultOrg.members.push(supertenant._id);
      await defaultOrg.save();

      console.log("\n=========================================================");
      console.log("✅ SEED BERHASIL! Akun Supertenant pertama kali dibuat.");
      console.log("=========================================================");
      console.log(`Username : supertenant`);
      console.log(`Password : ${randomPassword}`);
      console.log("=========================================================");
      console.log("⚠️ SIMPAN PASSWORD INI! HANYA AKAN MUNCUL SEKALI SAJA.");
      console.log("=========================================================\n");
    } else {
      console.log("✅ Supertenant sudah ada. Seed dilewati.");
      
      // Pastikan supertenant terhubung ke Hexadim LLC jika sebelumnya kosong
      if (!supertenant.org) {
        supertenant.org = defaultOrg._id;
        await supertenant.save();
        
        if (!defaultOrg.owners.includes(supertenant._id)) {
          defaultOrg.owners.push(supertenant._id);
        }
        if (!defaultOrg.members.includes(supertenant._id)) {
          defaultOrg.members.push(supertenant._id);
        }
        await defaultOrg.save();
        console.log("✅ Hubungan Supertenant ke Hexadim LLC diperbarui.");
      }
    }

    // 5. Tutup koneksi agar script selesai dengan rapi
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat seeding:", error);
    // Coba putus koneksi jika memungkinkan
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

init();