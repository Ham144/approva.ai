import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Play,
  Calendar,
  X,
  Globe,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders,
  Layers,
  Lock,
  Server,
  Key,
  Users,
  DollarSign,
  Clock,
  Activity,
  XCircle,
  Printer,
  FileText,
  Workflow,
  Cpu,
  Award,
  BookOpen,
  Compass,
  FileSpreadsheet,
  BadgeCheck,
  ExternalLink,
  PhoneCall,
  Mail,
  Building,
  CheckSquare,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  Share2,
  Send,
  Database,
  Terminal,
  FileCode,
  CheckSquare2,
  TrendingUp,
  Grid,
  GitBranch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../store";
import RoiStatementModal from "../components/RoiStatementModal";
import LegalModal from "../components/LegalModal";
import { PHONE } from "@/api/constant";

const LandingPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  // Mobile Menu Navigation Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lead Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    employeeCount: "30-100",
    role: "Head of Operations / COO",
    email: "",
    phone: "",
    approvalPain: "Proses approval lambat & berkas sering terselip",
    preferredDate: "",
    preferredTime: "10:00",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Canvas Hub Active Tab State
  const [canvasTab, setCanvasTab] = useState("simulator"); // simulator, blueprint, form, multitenant

  // Live Node Simulator State
  const [simulatedStage, setSimulatedStage] = useState(2); // 1: Draft, 2: Review, 3: Jump, 4: Approved
  const [simulatedConsoleLog, setSimulatedConsoleLog] = useState(
    "Menunggu Otorisasi VP Operations. Notifikasi WhatsApp terkirim ke (+62 812-****-889).",
  );
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);

  // Use Case Active Tab State
  const [activeCase, setActiveCase] = useState("procurement"); // procurement, reimbursement, directors, vendor

  // Multi-Tenant Active Switcher State
  const [activeTenant, setActiveTenant] = useState("master"); // master, subA, subB

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // ROI Calculator State
  const [employeeCount, setEmployeeCount] = useState(85);
  const [avgApprovalTimeDays, setAvgApprovalTimeDays] = useState(5);
  const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);

  // Legal Modal State
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState("privacy");

  const handleOpenLegalModal = (tab = "privacy") => {
    setLegalModalTab(tab);
    setIsLegalModalOpen(true);
  };

  // ROI Calculations
  const hourlyCost = 85000;
  const monthlyApprovalCount = Math.round(employeeCount * 1.8);
  const hoursSavedPerApproval = avgApprovalTimeDays * 1.5;
  const monthlySavingsRp = Math.round(
    monthlyApprovalCount * hoursSavedPerApproval * (hourlyCost * 0.4),
  );
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    // 1. Menyusun teks pesan dari data formData
    const message = `Halo, saya ingin mengirimkan data formulir:
  - Nama Perusahaan: ${formData.companyName}
  - Jumlah Karyawan: ${formData.employeeCount}
  - Jabatan/Role: ${formData.role}
  - Email: ${formData.email}
  - No. WhatsApp: ${formData.phone}
  - Kendala Approval: ${formData.approvalPain}
  - Tanggal Pilihan: ${formData.preferredDate}
  - Jam Pilihan: ${formData.preferredTime}`;

    // 2. Mengubah teks pesan agar aman untuk URL
    const encodedMessage = encodeURIComponent(message);

    // 3. Nomor tujuan WhatsApp (format internasional tanpa '+' atau tanda spasi/strip, contoh: 628123456789)
    const targetPhone = PHONE;

    // Format jika ada nomor tujuan:
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedMessage}`;

    // Format jika tanpa nomor tujuan (langsung pilih kontak):
    // const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

    // 4. Mengarahkan browser untuk membuka WhatsApp di tab baru dengan rel yang aman
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };
  const handleSimulateApprove = () => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setSimulatedStage(4);
      setSimulatedConsoleLog(
        "✅ Persetujuan Disahkan oleh VP Operations. Immutable Audit Log berhasil dicatat: 2026-08-10T15:18:00Z.",
      );
      setIsSimulatingAction(false);
    }, 350);
  };

  const handleSimulateRollback = () => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setSimulatedStage(1);
      setSimulatedConsoleLog(
        "⤶ Rollback dieksekusi ke Stage 1 (Drafting). Catatan Koreksi: 'Lampiran kuitansi blur'.",
      );
      setIsSimulatingAction(false);
    }, 350);
  };

  const handleSimulateJump = () => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setSimulatedStage(3);
      setSimulatedConsoleLog(
        "⚡ Aturan JumpLogic Aktif: Nominal > Rp 15M ➔ Melewati tahap perantara langsung ke Direktur.",
      );
      setIsSimulatingAction(false);
    }, 350);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: "Bagaimana cara kerja Model Lisensi Beli Putus (Perpetual Buyout)?",
      a: "Anda membeli hak kepemilikan lisensi aplikasi satu kali untuk organisasi Anda selamanya. Tidak ada biaya langganan bulanan per-user. Anda mendapatkan paket installer full On-Premise serta kebebasan mendaftarkan jumlah pengguna tanpa batas.",
    },
    {
      q: "Apakah seluruh data perusahaan 100% tersimpan aman di server VPS/On-Premise kami?",
      a: "Ya, 100% terisolasi. Approva.ai dipasang langsung di server VPS atau server fisik lokal milik perusahaan Anda sendiri. Seluruh database, dokumen lampiran, dan audit log tidak pernah terkirim ke pihak ketiga.",
    },
    {
      q: "Apakah Approva.ai dapat diintegrasikan dengan LDAP / Active Directory kantor?",
      a: "Sangat bisa. Sistem memiliki modul SSO & LDAP Client bawaan untuk sinkronisasi otomatis struktur departemen, posisi manajer atasan, dan hak akses otorisasi pejabat.",
    },
    {
      q: "Bagaimana notifikasi WhatsApp dan Email dikirimkan ke Approver?",
      a: "Approva.ai menyediakan integrasi Gateway WhatsApp API & SMTP Email terenkripsi. Approver menerima ringkasan pengajuan langsung di WhatsApp beserta quick-link otorisasi.",
    },
    {
      q: "Berapa lama waktu yang dibutuhkan untuk setup On-Premise hingga siap pakai?",
      a: "Proses deployment standar di server VPS perusahaan Anda selesai dalam 1-3 hari kerja, termasuk konfigurasi awal database, template E-Form pertama, dan pengujian gateway notifikasi.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-teal-500 selection:text-zinc-950 overflow-x-hidden relative">
      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-zinc-900 border-b border-zinc-800 text-zinc-300 text-xs py-2 px-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="bg-teal-500/10 border border-teal-500/30 text-teal-400 font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
              ENTERPRISE EDITION
            </span>
            <span className="hidden sm:inline text-zinc-400">
              BUMN &amp; HOLDING READY • ON-PREMISE DATA SOVEREIGNTY • LISENSI
              PERPETUAL
            </span>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="font-medium text-teal-400 hover:text-teal-300 text-xs flex items-center gap-1.5 whitespace-nowrap transition-colors"
          >
            <span>Konsultasi Deployment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Branding */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center p-2 rounded-lg bg-zinc-900 border border-zinc-800">
              <img
                src="/logo.png"
                alt="Approva Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-100">
                  Approva<span className="text-teal-400 font-mono">.ai</span>
                </span>
                <span className="text-[10px] font-mono font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 rounded">
                  ENT
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase">
                Workflow &amp; E-Form Platform
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a
              href="#overview"
              className="hover:text-zinc-100 transition-colors"
            >
              Overview
            </a>
            <a
              href="#features"
              className="hover:text-zinc-100 transition-colors"
            >
              Masalah &amp; Solusi
            </a>
            <a
              href="#canvas-hub"
              className="hover:text-zinc-100 transition-colors"
            >
              Live Canvas Hub
            </a>
            <a
              href="#scenarios"
              className="hover:text-zinc-100 transition-colors"
            >
              Skenario
            </a>
            <a
              href="#roi-calculator"
              className="hover:text-zinc-100 transition-colors"
            >
              Kalkulator ROI
            </a>
            <a href="#faq" className="hover:text-zinc-100 transition-colors">
              FAQ
            </a>
            <a
              href="#license-certificate"
              className="hover:text-zinc-100 transition-colors"
            >
              Lisensi Beli Putus
            </a>
          </nav>

          {/* Action Header Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {userInfo ? (
              <button
                onClick={() => navigate("/home")}
                className="px-3.5 py-2 text-xs font-medium text-zinc-200 hover:text-white border border-zinc-700 bg-zinc-900 rounded-lg transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-zinc-950" />
              <span>Jadwalkan Konsultasi</span>
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <BookOpen className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2 text-xs font-medium text-zinc-300">
            <a
              href="#overview"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5"
            >
              Overview
            </a>
            <a
              href="#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5"
            >
              Masalah &amp; Solusi
            </a>
            <a
              href="#canvas-hub"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5"
            >
              Live Canvas Hub
            </a>
            <a
              href="#scenarios"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5"
            >
              Skenario Lapangan
            </a>
            <a
              href="#roi-calculator"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5"
            >
              Kalkulator ROI
            </a>
            <a
              href="#faq"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5"
            >
              FAQ
            </a>
            <a
              href="#license-certificate"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5"
            >
              Sertifikat Lisensi
            </a>
            <div className="pt-3 border-t border-zinc-800">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsBookingOpen(true);
                }}
                className="w-full py-2.5 rounded-lg bg-teal-500 text-zinc-950 font-semibold flex items-center justify-center gap-2 text-xs"
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwalkan Konsultasi</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 01: HERO OVERVIEW */}
      <section
        id="overview"
        className="pt-10 pb-16 px-4 sm:px-8 max-w-7xl mx-auto"
      >
        <div className="bg-[#0b0f14] border border-zinc-800 rounded-xl p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5 mb-8 text-xs font-mono">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
              <span className="text-zinc-200 font-semibold tracking-wider uppercase">
                ENTERPRISE ARCHITECTURE
              </span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <span>REF: APPROVA-ENT-2026</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300 font-medium">ON-PREMISE VPS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-100 tracking-tight leading-snug">
                Otomatisasi E-Form Dinamis &amp; Kontrol Otorisasi Mandiri.
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
                Platform alur persetujuan terstruktur untuk holding BUMN dan
                korporasi berskala besar. Menggunakan model{" "}
                <span className="text-zinc-100 font-medium underline underline-offset-4 decoration-zinc-700">
                  Lisensi Perpetual (Beli Putus)
                </span>
                , di-deploy penuh pada infrastruktur server internal perusahaan
                Anda tanpa ketergantungan pihak ketiga.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2 font-sans">
                {/* Primary Action: Demo Booking */}
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Jadwalkan Demo Official</span>
                </button>

                {/* Secondary Action: Features & Changelog */}
                <a
                  href="/update-logs"
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-medium text-xs transition-colors flex items-center justify-center gap-2 group"
                >
                  <Terminal className="w-3.5 h-3.5 text-zinc-500 group-hover:text-teal-400 transition-colors" />
                  <span>Features Log</span>
                </a>

                {/* Secondary Action: Documentation */}
                <a
                  href="/documentation"
                  className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-zinc-100 font-medium text-xs transition-colors flex items-center justify-center gap-2 group"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-500 group-hover:text-teal-400 transition-colors" />
                  <span>Dokumentasi &amp; Panduan</span>
                </a>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-start gap-4">
                <div className="text-xs text-zinc-400 space-y-0.5">
                  <span className="text-zinc-200 font-semibold block">
                    100% Kedaulatan Data &amp; Aset
                  </span>
                  <p className="text-zinc-500 leading-normal">
                    Bebas dari skema recurring subscription bulanan maupun
                    kalkulasi biaya per-kursi (seat).
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-950/80 rounded border border-zinc-800/70">
                  <img
                    src="/logo.png"
                    alt="Approva Logo"
                    className="h-4 object-contain"
                  />
                  <span className="text-[10px] font-mono text-zinc-300 font-medium tracking-wide">
                    SELF-HOSTED NODE
                  </span>
                </div>

                <div className="rounded overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center p-4">
                  <img
                    src="/approva-motto.png"
                    alt="Approva Official Motto"
                    className="w-56 h-auto object-contain opacity-90"
                  />
                </div>

                <div className="p-3 bg-zinc-950/80 rounded border border-zinc-800/70 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between items-center text-zinc-500 text-[10px]">
                    <span>NODE: MULTI-TENANT</span>
                    <span>AVAILABILITY: 99.9%</span>
                  </div>
                  <p className="text-zinc-300 font-sans text-xs">
                    Otorisasi Bertingkat • Webhook WhatsApp • Audit Trail
                    Terenkripsi
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="space-y-1">
              <span className="text-2xl font-bold text-zinc-100 font-mono tracking-tight block">
                100%
              </span>
              <span className="text-xs text-zinc-500 font-medium leading-relaxed block">
                Data Sovereignty VPS Internal
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold text-zinc-100 font-mono tracking-tight block">
                &lt; 1 Jam
              </span>
              <span className="text-xs text-zinc-500 font-medium leading-relaxed block">
                Siklus Rata-rata Approval Selesai
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold text-zinc-100 font-mono tracking-tight block">
                Rp 0,-
              </span>
              <span className="text-xs text-zinc-500 font-medium leading-relaxed block">
                Tanpa Tagihan Bulanan / User
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-bold text-zinc-100 font-mono tracking-tight block">
                99.9%
              </span>
              <span className="text-xs text-zinc-500 font-medium leading-relaxed block">
                Tingkat Ketersediaan Sistem
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: BEFORE VS AFTER */}
      <section
        id="features"
        className="py-12 px-4 sm:px-8 max-w-7xl mx-auto text-left"
      >
        <div className="space-y-2 mb-8 border-b border-zinc-800 pb-5">
          <span className="font-mono text-xs text-teal-400 font-medium uppercase tracking-wider">
            ANALISIS KOMPARASI SISTEM
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Penyederhanaan Birokrasi Operasional
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-2xl">
            Perbandingan langsung alur persetujuan manual tidak terpusat versus
            sistem audit otomatis Approva.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Manual Reality */}
          <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-zinc-500" />
                  Alur Manual &amp; Chat Personal
                </h3>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                  UNSTRUCTURED
                </span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-400 font-sans leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-600 font-mono font-bold mt-0.5">
                    01.
                  </span>
                  <p>
                    Persetujuan tersebar di chat aplikasi perorangan tanpa log
                    timestamp resmi untuk keperluan audit kepatuhan.
                  </p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-600 font-mono font-bold mt-0.5">
                    02.
                  </span>
                  <p>
                    Pengadaan terhenti berhari-hari saat pejabat pemegang
                    otoritas sedang perjalanan dinas atau cuti tanpa delegasi.
                  </p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-600 font-mono font-bold mt-0.5">
                    03.
                  </span>
                  <p>
                    Kesalahan entri data di tahap akhir memaksa staf membatalkan
                    berkas fisik dan mengulang rantai approval dari awal.
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Approva Solution */}
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-700/80 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  Approva.ai Structured Workflow
                </h3>
                <span className="text-[10px] font-mono bg-teal-950/60 text-teal-400 px-2 py-0.5 rounded border border-teal-800/80 font-medium">
                  STANDARDIZED
                </span>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 font-sans leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-teal-400 font-mono font-bold mt-0.5">
                    01.
                  </span>
                  <p>
                    <strong className="text-zinc-100 font-medium">
                      Immutable Audit Trail:
                    </strong>{" "}
                    Merekam seluruh riwayat tindakan, hash dokumen, dan waktu
                    persetujuan secara permanen.
                  </p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-teal-400 font-mono font-bold mt-0.5">
                    02.
                  </span>
                  <p>
                    <strong className="text-zinc-100 font-medium">
                      Take Over &amp; Smart Jump:
                    </strong>{" "}
                    Delegasi wewenang transparan dengan pengalihan otomatis saat
                    approval melebihi batas waktu SLA.
                  </p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-teal-400 font-mono font-bold mt-0.5">
                    03.
                  </span>
                  <p>
                    <strong className="text-zinc-100 font-medium">
                      Rollback Stage:
                    </strong>{" "}
                    Fasilitas pengembalian berkas langsung ke node pembuat untuk
                    perbaikan data parsial tanpa reset alur.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: INTERACTIVE WORKSPACE CANVAS HUB */}
      <section
        id="canvas-hub"
        className="py-12 px-4 sm:px-8 max-w-7xl mx-auto text-left"
      >
        <div className="space-y-2 mb-6">
          <span className="font-mono text-xs text-teal-400 font-medium uppercase tracking-wider">
            LIVE WORKSPACE CONSOLE
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Pusat Kendali Workflow Interaktif
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm">
            Simulasi logika node persetujuan, builder E-Form, skema arsitektur,
            dan manajemen multi-tenant.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-[#0b0f14] p-4 sm:p-6 space-y-6">
          {/* Workspace Toolbar Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-teal-400" />
              <span className="font-mono text-xs text-zinc-200 font-semibold uppercase">
                Control Engine Canvas
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
              <button
                onClick={() => setCanvasTab("simulator")}
                className={`px-3 py-1.5 rounded transition-colors ${
                  canvasTab === "simulator"
                    ? "bg-zinc-800 text-teal-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                1. Node Simulator
              </button>
              <button
                onClick={() => setCanvasTab("blueprint")}
                className={`px-3 py-1.5 rounded transition-colors ${
                  canvasTab === "blueprint"
                    ? "bg-zinc-800 text-teal-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                2. Blueprint
              </button>
              <button
                onClick={() => setCanvasTab("form")}
                className={`px-3 py-1.5 rounded transition-colors ${
                  canvasTab === "form"
                    ? "bg-zinc-800 text-teal-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                3. Dynamic Form
              </button>
              <button
                onClick={() => setCanvasTab("multitenant")}
                className={`px-3 py-1.5 rounded transition-colors ${
                  canvasTab === "multitenant"
                    ? "bg-zinc-800 text-teal-400 font-medium"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                4. Multi-Tenant
              </button>
            </div>
          </div>

          {/* Tab Content Box */}
          <div className="p-4 sm:p-6 bg-zinc-950 rounded-lg border border-zinc-850 min-h-[340px] flex flex-col justify-between space-y-6">
            {/* Tab 1: Live Node Simulator */}
            {canvasTab === "simulator" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                      INSTANCE REF: #WF-2026-99
                    </span>
                    <h3 className="font-semibold text-zinc-100 text-sm">
                      Pengadaan Server On-Premise &amp; Lisensi Database
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-teal-400 bg-teal-950/50 px-2.5 py-1 rounded border border-teal-800/60 w-fit">
                    SLA: 1.5 Hours Elapsed
                  </span>
                </div>

                {/* Node Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div
                    className={`p-3.5 rounded-lg border transition-colors ${simulatedStage === 1 ? "bg-zinc-900 border-teal-500 text-zinc-100" : "bg-zinc-900/40 border-zinc-800 text-zinc-500"}`}
                  >
                    <span className="text-[10px] font-mono block mb-1">
                      STAGE 01 // DRAFT
                    </span>
                    <div className="font-medium text-zinc-200">
                      Staff Pemohon
                    </div>
                    <div className="text-[11px] text-zinc-400">Irfan Hakim</div>
                  </div>

                  <div
                    className={`p-3.5 rounded-lg border transition-colors ${simulatedStage === 2 ? "bg-zinc-900 border-teal-500 text-zinc-100" : "bg-zinc-900/40 border-zinc-800 text-zinc-500"}`}
                  >
                    <span className="text-[10px] font-mono block mb-1">
                      STAGE 02 // REVIEW
                    </span>
                    <div className="font-medium text-zinc-200">Head of IT</div>
                    <div className="text-[11px] text-zinc-400">
                      Approved via WA
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-lg border transition-colors ${simulatedStage === 3 ? "bg-zinc-900 border-teal-500 text-zinc-100" : "bg-zinc-900/40 border-zinc-800 text-zinc-500"}`}
                  >
                    <span className="text-[10px] font-mono block mb-1">
                      STAGE 03 // JUMP LOGIC
                    </span>
                    <div className="font-medium text-zinc-200">
                      VP Operations
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Nominal &gt; 50M
                    </div>
                  </div>

                  <div
                    className={`p-3.5 rounded-lg border transition-colors ${simulatedStage === 4 ? "bg-zinc-900 border-teal-500 text-zinc-100" : "bg-zinc-900/40 border-zinc-800 text-zinc-500"}`}
                  >
                    <span className="text-[10px] font-mono block mb-1">
                      STAGE 04 // FINAL
                    </span>
                    <div className="font-medium text-zinc-200">
                      Audit Ledger
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Recorded Immutable
                    </div>
                  </div>
                </div>

                {/* Console Log Output */}
                <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs max-w-lg">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-teal-400" /> Output
                      Konsol:
                    </span>
                    <p className="font-mono text-xs text-zinc-200 bg-zinc-950 px-3 py-1.5 rounded border border-zinc-800 truncate">
                      {isSimulatingAction
                        ? "Memproses eksekusi node..."
                        : simulatedConsoleLog}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSimulateApprove}
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve WA
                    </button>
                    <button
                      onClick={handleSimulateRollback}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-xs transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-400" /> Uji
                      Rollback
                    </button>
                    <button
                      onClick={handleSimulateJump}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-medium text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-zinc-400" /> Trigger Jump
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Visual Blueprint */}
            {canvasTab === "blueprint" && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                  <div>
                    <h4 className="font-semibold text-zinc-100 text-sm">
                      Visual Workflow Architecture
                    </h4>
                    <p className="text-zinc-500 text-[11px]">
                      Skema arsitektur logika relasi antar node otorisasi.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    TOPOLOGY VECTOR
                  </span>
                </div>
                <div className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center p-3">
                  <img
                    src="/interactive_workflow_hub.png"
                    alt="Architecture Blueprint"
                    className="w-full max-h-[340px] object-contain rounded opacity-90"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Dynamic Form */}
            {canvasTab === "form" && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                  <h4 className="font-semibold text-zinc-100 text-sm">
                    Dynamic E-Form Component Specs
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    SCHEMA DRIVEN
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
                    <label className="text-zinc-400 text-xs font-mono block uppercase">
                      Currency Input
                    </label>
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono font-semibold flex justify-between items-center">
                      <span>Rp 85.000.000,-</span>
                      <span className="text-[10px] text-zinc-500 font-sans">
                        IDR Formatted
                      </span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
                    <label className="text-zinc-400 text-xs font-mono block uppercase">
                      API Data Select
                    </label>
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 flex justify-between items-center">
                      <span className="truncate">
                        PT Hardware Utama (ERP-VND-09)
                      </span>
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5 md:col-span-2">
                    <label className="text-zinc-400 text-xs font-mono block uppercase">
                      Digital Signature Validation
                    </label>
                    <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 flex items-center justify-between font-mono text-[11px]">
                      <span className="text-teal-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                        Kuitansi_Server_OnPremise.pdf
                      </span>
                      <span className="text-zinc-500 text-[10px]">
                        SHA-256 HASH VERIFIED
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Multi-Tenant */}
            {canvasTab === "multitenant" && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                  <h4 className="font-semibold text-zinc-100 text-sm">
                    Holding BUMN Multi-Tenant Gateway
                  </h4>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                    TENANT ISOLATION
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div
                    onClick={() => setActiveTenant("master")}
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                      activeTenant === "master"
                        ? "bg-zinc-900 border-teal-500 text-zinc-100"
                        : "bg-zinc-900/40 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <div className="font-medium text-zinc-200 flex items-center justify-between">
                      <span>PT Semen Indonesia</span>
                      <span className="text-[9px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-300">
                        Master
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Holding Group • 1.250 Users • All Flows Active
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTenant("subA")}
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                      activeTenant === "subA"
                        ? "bg-zinc-900 border-teal-500 text-zinc-100"
                        : "bg-zinc-900/40 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <div className="font-medium text-zinc-200 flex items-center justify-between">
                      <span>PT Solusi Bangun</span>
                      <span className="text-[9px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-300">
                        Sub A
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Anak Perusahaan • 450 Users • Isolated Schema
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTenant("subB")}
                    className={`p-3.5 rounded-lg border transition-colors cursor-pointer space-y-1.5 ${
                      activeTenant === "subB"
                        ? "bg-zinc-900 border-teal-500 text-zinc-100"
                        : "bg-zinc-900/40 border-zinc-800 text-zinc-400"
                    }`}
                  >
                    <div className="font-medium text-zinc-200 flex items-center justify-between">
                      <span>PT Logistik Nusantara</span>
                      <span className="text-[9px] font-mono bg-zinc-800 px-1.5 py-0.2 rounded text-zinc-300">
                        Sub B
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-normal">
                      Anak Perusahaan • 180 Users • Custom SLA
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 04: FIELD USE CASES */}
      <section
        id="scenarios"
        className="py-12 px-4 sm:px-8 max-w-7xl mx-auto text-left"
      >
        <div className="space-y-2 mb-8 border-b border-zinc-800 pb-5">
          <span className="font-mono text-xs text-teal-400 font-medium uppercase tracking-wider">
            SKENARIO OPERASIONAL
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Implementasi di Berbagai Divisi
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1 flex flex-col gap-2">
            <button
              onClick={() => setActiveCase("procurement")}
              className={`p-3.5 text-left rounded-lg transition-colors border text-xs ${
                activeCase === "procurement"
                  ? "bg-zinc-900 border-teal-500 text-zinc-100 font-semibold"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="text-[10px] font-mono block text-zinc-500 mb-0.5">
                01 // PROCUREMENT
              </span>
              Pengadaan Barang &amp; Jasa Kantor
            </button>

            <button
              onClick={() => setActiveCase("reimbursement")}
              className={`p-3.5 text-left rounded-lg transition-colors border text-xs ${
                activeCase === "reimbursement"
                  ? "bg-zinc-900 border-teal-500 text-zinc-100 font-semibold"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="text-[10px] font-mono block text-zinc-500 mb-0.5">
                02 // CLAIM
              </span>
              Reimbursement Perjalanan Dinas
            </button>

            <button
              onClick={() => setActiveCase("directors")}
              className={`p-3.5 text-left rounded-lg transition-colors border text-xs ${
                activeCase === "directors"
                  ? "bg-zinc-900 border-teal-500 text-zinc-100 font-semibold"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="text-[10px] font-mono block text-zinc-500 mb-0.5">
                03 // DIRECTORS
              </span>
              Otorisasi Direksi (SSO / LDAP)
            </button>

            <button
              onClick={() => setActiveCase("vendor")}
              className={`p-3.5 text-left rounded-lg transition-colors border text-xs ${
                activeCase === "vendor"
                  ? "bg-zinc-900 border-teal-500 text-zinc-100 font-semibold"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
              }`}
            >
              <span className="text-[10px] font-mono block text-zinc-500 mb-0.5">
                04 // PUBLIC
              </span>
              Portal Vendor / Stranger Mode
            </button>
          </div>

          <div className="lg:col-span-2 p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 min-h-[220px] flex flex-col justify-center text-xs">
            {activeCase === "procurement" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h4 className="font-semibold text-zinc-100 text-sm">
                    Pengadaan CAPEX / OPEX
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-teal-400 border border-zinc-700 font-mono text-[10px]">
                    Jump Logic
                  </span>
                </div>
                <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-3 font-mono text-[11px]">
                  <div className="flex justify-between text-zinc-400">
                    <span>Vendor: PT Hardware Utama</span>
                    <span className="text-zinc-200 font-semibold">
                      Total: Rp 65.000.000,-
                    </span>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded border border-zinc-800 text-zinc-300 flex items-center justify-between">
                    <span>1. Staff Pembuat</span>
                    <span className="text-zinc-600">→</span>
                    <span>2. Head of Division</span>
                    <span className="text-zinc-600">→</span>
                    <span className="text-teal-400 font-medium">
                      3. Jump ke Direktur Operasional
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeCase === "reimbursement" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h4 className="font-semibold text-zinc-100 text-sm">
                    Reimbursement Perjalanan Dinas
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10px]">
                    Rollback Target
                  </span>
                </div>
                <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                  <div className="font-mono text-xs text-zinc-200 flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />{" "}
                    Dikembalikan ke Tahap 1 (Koreksi Lampiran)
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Catatan Reviewer: "Mohon lampirkan ulang bukti invoice
                    boarding pass yang terbaca jelas."
                  </p>
                </div>
              </div>
            )}

            {activeCase === "directors" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h4 className="font-semibold text-zinc-100 text-sm">
                    Otorisasi Dokumen Direksi
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-teal-400 border border-zinc-700 font-mono text-[10px]">
                    Active Directory
                  </span>
                </div>
                <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-zinc-200">
                      Direktur Utama: Bpk. Suhartono
                    </span>
                    <span className="text-teal-400 text-[10px]">
                      LDAP SSO ACTIVE
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs">
                    Akses login tersinkronisasi otomatis dengan infrastruktur
                    Active Directory kantor pusat.
                  </p>
                </div>
              </div>
            )}

            {activeCase === "vendor" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h4 className="font-semibold text-zinc-100 text-sm">
                    Formulir Eksternal &amp; Rekanan
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[10px]">
                    Stranger Access
                  </span>
                </div>
                <div className="p-3.5 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1.5 font-mono">
                  <span className="text-zinc-500 text-[10px] uppercase block">
                    Secure Public Endpoint
                  </span>
                  <div className="text-teal-400 text-xs p-2 bg-zinc-900 rounded border border-zinc-800 truncate">
                    https://approva.internal.corp/portal/vendor-claim
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 05: FINANCIAL ROI CALCULATOR */}
      <section
        id="roi-calculator"
        className="py-12 px-4 sm:px-8 max-w-7xl mx-auto text-left"
      >
        <div className="space-y-2 mb-8 border-b border-zinc-800 pb-5">
          <span className="font-mono text-xs text-teal-400 font-medium uppercase tracking-wider">
            ANALISIS EFISIENSI BIAYA
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Laporan Kalkulasi Efisiensi Finansial
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-zinc-800 bg-[#0b0f14] rounded-xl p-6 sm:p-8">
          <div className="space-y-6">
            <h3 className="text-base font-semibold text-zinc-100">
              Estimasi Parameter Beban Operasional
            </h3>

            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Total Karyawan Aktif:</span>
                  <span className="text-zinc-100 font-bold">
                    {employeeCount} Users
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">
                    Durasi Approval Manual (Saat Ini):
                  </span>
                  <span className="text-zinc-100 font-bold">
                    {avgApprovalTimeDays} Hari Kerja
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="1"
                  value={avgApprovalTimeDays}
                  onChange={(e) =>
                    setAvgApprovalTimeDays(Number(e.target.value))
                  }
                  className="w-full h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-teal-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-5 text-center">
            <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider block">
              ESTIMASI PENGHEMATAN MAN-HOUR
            </span>

            <div>
              <div className="text-3xl sm:text-4xl font-bold text-zinc-100 font-mono tracking-tight">
                Rp {monthlySavingsRp.toLocaleString("id-ID")}
              </div>
              <span className="text-xs text-zinc-500 block mt-1">
                / bulan efisiensi jam kerja manajerial
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-800 text-left font-mono text-xs">
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[10px] block mb-0.5">
                  Volume Berkas / Bln
                </span>
                <span className="font-semibold text-zinc-200">
                  {monthlyApprovalCount} Berkas
                </span>
              </div>
              <div className="p-3 rounded bg-zinc-950 border border-zinc-800">
                <span className="text-zinc-500 text-[10px] block mb-0.5">
                  Jam Terhemat
                </span>
                <span className="font-semibold text-teal-400">
                  {Math.round(monthlyApprovalCount * hoursSavedPerApproval)} Jam
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsRoiModalOpen(true)}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-zinc-950" />
              <span>Ekspor Laporan Finansial (PDF)</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 06: FAQ ACCORDION */}
      <section
        id="faq"
        className="py-12 px-4 sm:px-8 max-w-4xl mx-auto text-left"
      >
        <div className="space-y-2 mb-8 text-center">
          <span className="font-mono text-xs text-teal-400 font-medium uppercase tracking-wider">
            DOKUMENTASI TEKNIS
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold text-zinc-100 tracking-tight">
            Pertanyaan Umum (FAQ)
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-zinc-800 rounded-lg bg-zinc-900/60 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-4 text-left font-medium text-zinc-200 text-xs sm:text-sm flex items-center justify-between gap-4 hover:text-white transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="p-4 pt-0 text-xs text-zinc-400 leading-relaxed border-t border-zinc-850 bg-zinc-950/40">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 07: CERTIFICATE OF LICENSE */}
      <section
        id="license-certificate"
        className="py-12 px-4 sm:px-8 max-w-5xl mx-auto text-left"
      >
        <div className="bg-[#0b0f14] border border-zinc-800 rounded-xl p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-teal-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                  PERPETUAL LICENSE SPECIFICATION
                </span>
                <h3 className="text-base font-semibold text-zinc-100">
                  Approva.ai On-Premise Enterprise License
                </h3>
              </div>
            </div>
            <div className="text-left sm:text-right font-mono text-[11px]">
              <span className="text-teal-400 block font-medium">
                100% DATA SOVEREIGNTY
              </span>
              <span className="text-zinc-500 text-[10px]">
                ON-PREMISE VPS NODE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <div className="text-2xl sm:text-3xl font-bold text-zinc-100 font-mono">
                Rp 45.000.000,-
                <span className="text-xs font-sans font-normal text-zinc-500 block mt-1">
                  Mulai dari (One-Time Perpetual Buyout License)
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Di-host mandiri pada infrastruktur server atau VPS privat
                perusahaan. Kontrol penuh terhadap basis data tanpa
                ketergantungan biaya langganan bulanan per-user.
              </p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-850">
                <span className="text-zinc-500">Tier SME (30-100 user)</span>
                <span className="text-zinc-200 font-medium">
                  Rp 45jt – Rp 65jt
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-850">
                <span className="text-zinc-500">
                  Enterprise (100-500+ user)
                </span>
                <span className="text-zinc-200 font-medium">
                  Rp 85jt – Rp 150jt
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">
                  SLA &amp; Maintenance (Thn 2+)
                </span>
                <span className="text-teal-400 font-medium">
                  ~10% / thn (Opsional)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>
                Termasuk implementasi 3 hari kerja &amp; deployment SLA support.
              </span>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-xs transition-colors"
            >
              Minta Penawaran Resmi
            </button>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto text-center space-y-4">
        <h2 className="text-xl sm:text-3xl font-semibold text-zinc-100 tracking-tight">
          Modernisasi Alur Otorisasi Organisasi Anda.
        </h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Jadwalkan sesi demonstrasi teknis 1-on-1 bersama konsultan sistem kami
          untuk simulasi kebutuhan alur persetujuan divisi Anda.
        </p>
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-6 py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-zinc-950" />
            <span>Jadwalkan Sesi Konsultasi</span>
            <ArrowRight className="w-4 h-4 text-zinc-950" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-850 bg-zinc-950 py-8 px-4 sm:px-8 text-xs text-zinc-500 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Approva Logo"
            className="w-5 h-5 object-contain"
          />
          <span className="font-semibold text-zinc-300">Approva.ai</span>
          <span>
            • &copy; 2026 Enterprise Dynamic Workflow &amp; E-Form Platform.
          </span>
        </div>
        <div className="flex gap-4 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => handleOpenLegalModal("privacy")}
            className="hover:text-zinc-300 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => handleOpenLegalModal("terms")}
            className="hover:text-zinc-300 transition-colors"
          >
            Terms of License
          </button>
          <button
            type="button"
            onClick={() => handleOpenLegalModal("whitepaper")}
            className="hover:text-zinc-300 transition-colors"
          >
            Security Whitepaper
          </button>
        </div>
      </footer>

      {/* LEAD CONSULTATION MODAL */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm text-left">
          <div className="relative w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-zinc-100">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="space-y-1.5 border-b border-zinc-800 pb-4">
                  <span className="text-[10px] font-mono text-teal-400 uppercase tracking-wider block">
                    DEPLOYMENT INQUIRY
                  </span>
                  <h3 className="text-base font-semibold text-zinc-100">
                    Jadwalkan Konsultasi Approva.ai
                  </h3>
                  <p className="text-zinc-400 text-xs">
                    Lengkapi informasi organisasi untuk sesi penyesuaian skema
                    teknis.
                  </p>
                </div>

                <form
                  onSubmit={handleFormSubmit}
                  className="space-y-3.5 text-xs"
                >
                  <div className="space-y-1">
                    <label className="block text-zinc-300 font-medium">
                      Nama Organisasi / Perusahaan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="PT Semen Indonesia (Persero)"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-zinc-300 font-medium">
                        Jumlah Karyawan *
                      </label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            employeeCount: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                      >
                        <option value="<30">&lt; 30</option>
                        <option value="30-100">30 - 100</option>
                        <option value="100-500">100 - 500</option>
                        <option value=">500">&gt; 500</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-zinc-300 font-medium">
                        Jabatan / Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                      >
                        <option value="C-Level / Director">
                          C-Level / Director
                        </option>
                        <option value="Head of Operations / COO">
                          Head of Operations
                        </option>
                        <option value="IT Manager / CTO">
                          IT Manager / CTO
                        </option>
                        <option value="HR / GA Manager">HR / GA Manager</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-zinc-300 font-medium">
                      Email Korporat *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@perusahaan.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-zinc-300 font-medium">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 mt-4"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Kirim Permintaan Konsultasi</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-teal-950 text-teal-400 flex items-center justify-center mx-auto border border-teal-800">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Permintaan Berhasil Terkirim
                </h3>
                <p className="text-zinc-400 text-xs max-w-xs mx-auto leading-relaxed">
                  Terima kasih{" "}
                  <strong className="text-zinc-200">
                    {formData.companyName}
                  </strong>
                  . Tim spesialis solusi kami akan segera menghubungi Anda.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsBookingOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <RoiStatementModal
        isOpen={isRoiModalOpen}
        onClose={() => setIsRoiModalOpen(false)}
        employeeCount={employeeCount}
        avgApprovalTimeDays={avgApprovalTimeDays}
        monthlySavingsRp={monthlySavingsRp}
        monthlyApprovalCount={monthlyApprovalCount}
        totalHoursSaved={Math.round(
          monthlyApprovalCount * avgApprovalTimeDays * 1.5,
        )}
      />

      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
    </div>
  );
};

export default LandingPage;
