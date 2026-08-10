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
  Grid
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../store";
import RoiStatementModal from "../components/RoiStatementModal";
import LegalModal from "../components/LegalModal";

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
    "Menunggu Otorisasi VP Operations. Notifikasi WhatsApp terkirim ke (+62 812-****-889)."
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
    monthlyApprovalCount * hoursSavedPerApproval * (hourlyCost * 0.4)
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleSimulateApprove = () => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setSimulatedStage(4);
      setSimulatedConsoleLog(
        "✅ Persetujuan Disahkan oleh VP Operations. Immutable Audit Log berhasil dicatat: 2026-08-10T15:18:00Z."
      );
      setIsSimulatingAction(false);
    }, 350);
  };

  const handleSimulateRollback = () => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setSimulatedStage(1);
      setSimulatedConsoleLog(
        "⤶ Rollback dieksekusi ke Stage 1 (Drafting). Catatan Koreksi: 'Lampiran kuitansi blur'."
      );
      setIsSimulatingAction(false);
    }, 350);
  };

  const handleSimulateJump = () => {
    setIsSimulatingAction(true);
    setTimeout(() => {
      setSimulatedStage(3);
      setSimulatedConsoleLog(
        "⚡ Aturan JumpLogic Aktif: Nominal > Rp 15M ➔ Melewati tahap perantara langsung ke Direktur."
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
      a: "Anda membeli hak kepemilikan lisensi aplikasi satu kali untuk organisasi Anda selamanya. Tidak ada biaya langganan bulanan per-user. Anda mendapatkan paket installer full On-Premise serta kebebasan mendaftarkan jumlah pengguna tanpa batas."
    },
    {
      q: "Apakah seluruh data perusahaan 100% tersimpan aman di server VPS/On-Premise kami?",
      a: "Ya, 100% terisolasi. Approva.ai dipasang langsung di server VPS atau server fisik lokal milik perusahaan Anda sendiri. Seluruh database, dokumen lampiran, dan audit log tidak pernah terkirim ke pihak ketiga."
    },
    {
      q: "Apakah Approva.ai dapat diintegrasikan dengan LDAP / Active Directory kantor?",
      a: "Sangat bisa. Sistem memiliki modul SSO & LDAP Client bawaan untuk sinkronisasi otomatis struktur departemen, posisi manajer atasan, dan hak akses otorisasi pejabat."
    },
    {
      q: "Bagaimana notifikasi WhatsApp dan Email dikirimkan ke Approver?",
      a: "Approva.ai menyediakan integrasi Gateway WhatsApp API & SMTP Email terenkripsi. Approver menerima ringkasan pengajuan langsung di WhatsApp beserta quick-link otorisasi."
    },
    {
      q: "Berapa lama waktu yang dibutuhkan untuk setup On-Premise hingga siap pakai?",
      a: "Proses deployment standar di server VPS perusahaan Anda selesai dalam 1-3 hari kerja, termasuk konfigurasi awal database, template E-Form pertama, dan pengujian gateway notifikasi."
    }
  ];

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 font-sans selection:bg-[#0078d4] selection:text-white overflow-x-hidden relative">
      
      {/* ENTERPRISE TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-blue-950 via-[#0078d4] to-indigo-950 text-white text-[11px] py-2 px-4 border-b border-blue-500/30 overflow-hidden relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono tracking-wider font-semibold">
            <span className="bg-emerald-400 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-widest animate-pulse">
              OFFICIAL ENTERPRISE EDITION
            </span>
            <span className="hidden sm:inline">
              BUMN & HOLDING GROUP READY • 100% ON-PREMISE DATA SOVEREIGNTY • LISENSI BELI PUTUS
            </span>
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="font-bold underline hover:text-cyan-200 text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Konsultasi Deployment 1-on-1</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ENTERPRISE HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070a11]/90 border-b border-slate-800 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Official Logo Branding */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="relative p-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-md group-hover:border-[#0078d4] transition-all">
              <img
                src="/logo.png"
                alt="Approva Official Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">
                  Approva<span className="text-[#0078d4]">.ai</span>
                </span>
                <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-800/80 px-1.5 py-0.5 rounded">
                  ENTERPRISE
                </span>
              </div>
              <span className="block text-[9px] font-mono text-slate-400 tracking-widest font-semibold uppercase">
                Dynamic Workflow & E-Form Control Platform
              </span>
            </div>
          </div>

          {/* Clean Enterprise Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-slate-300">
            <a href="#overview" className="hover:text-cyan-300 transition-colors">Overview</a>
            <a href="#features" className="hover:text-cyan-300 transition-colors">Masalah & Solusi</a>
            <a href="#canvas-hub" className="hover:text-cyan-300 transition-colors">Live Canvas Hub</a>
            <a href="#scenarios" className="hover:text-cyan-300 transition-colors">Skenario Lapangan</a>
            <a href="#roi-calculator" className="hover:text-cyan-300 transition-colors">Kalkulator ROI</a>
            <a href="#faq" className="hover:text-cyan-300 transition-colors">FAQ</a>
            <a href="#license-certificate" className="hover:text-cyan-300 transition-colors">Lisensi Beli Putus</a>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            {userInfo ? (
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 text-xs font-bold text-[#0078d4] hover:text-cyan-300 transition-all border border-blue-500/30 rounded-xl bg-blue-500/10"
              >
                Dashboard Utama
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0078d4] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-xs transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwalkan Konsultasi</span>
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 text-xs font-semibold text-slate-300 animate-fadeIn">
            <a href="#overview" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Overview</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Masalah & Solusi</a>
            <a href="#canvas-hub" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Live Canvas Hub</a>
            <a href="#scenarios" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Skenario Lapangan</a>
            <a href="#roi-calculator" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Kalkulator ROI</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">FAQ</a>
            <a href="#license-certificate" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Sertifikat Lisensi Putus</a>
            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={() => { setIsMobileMenuOpen(false); setIsBookingOpen(true); }}
                className="w-full py-3 rounded-xl bg-[#0078d4] text-white font-bold flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Jadwalkan Konsultasi</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Decorative Subtle Architectural Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0f_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0f_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none -z-10"></div>

      {/* SECTION 01: HERO OVERVIEW */}
      <section id="overview" className="pt-12 pb-20 px-6 sm:px-12 max-w-7xl mx-auto relative">
        <div className="border border-slate-800 bg-[#0a0f1d] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-10">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-mono text-xs text-emerald-400 font-bold tracking-widest uppercase">
                ENTERPRISE SYSTEM SPECIFICATION // 2026
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span>DOC REF: APPROVA-ENT-2026</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-cyan-400 font-bold">DEPLOYS ON-PREMISE VPS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Main Editorial Title */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/90 border border-blue-800 text-cyan-300 font-mono text-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>DYNAMIC E-FORM & WORKFLOW CONTROL PLATFORM</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
                Arsitektur Alur Otomatisasi{" "}
                <span className="bg-gradient-to-r from-[#0078d4] via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Persetujuan Korporat
                </span>{" "}
                Era AI
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Platform otomatisasi E-Form dinamis & alur otorisasi internal untuk holding BUMN & korporasi. <strong className="text-white">Lisensi Beli Putus selamanya</strong>, di-deploy 100% aman di server VPS mandiri perusahaan Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#0078d4] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Jadwalkan Demo Official</span>
                </button>
                <a
                  href="#canvas-hub"
                  className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:text-white"
                >
                  <span>Lihat Live Canvas Hub</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Official Motto Poster Graphic Asset */}
              <div className="pt-4 flex items-center gap-4">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 max-w-xs shadow-md">
                  <img
                    src="/approva-motto.png"
                    alt="Approva Official Motto"
                    className="w-full h-auto object-contain rounded"
                  />
                </div>
                <div className="text-xs text-slate-400 space-y-1 font-mono">
                  <span className="text-amber-400 font-bold block">100% Hak Milik Perusahaan</span>
                  <p className="text-[11px]">Tanpa Biaya Bulanan / Langganan Per-User.</p>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Asset Card */}
            <div className="lg:col-span-5 relative">
              <div className="p-4 rounded-2xl bg-[#0d1424] border border-slate-700 shadow-2xl space-y-3 relative group">
                
                {/* Official Logo Banner Badge */}
                <div className="flex items-center justify-between px-3 py-2 bg-slate-950 rounded-xl border border-slate-800">
                  <img
                    src="/logo-with-background.png"
                    alt="Approva Logo Header"
                    className="h-7 object-contain"
                  />
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    ON-PREMISE SECURE
                  </span>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-800 max-h-[340px] bg-slate-900 flex items-center justify-center">
                  <img
                    src="/workflow_network_hero.png"
                    alt="Workflow Network Infrastructure"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-3 text-xs bg-slate-950 rounded-xl border border-slate-800 space-y-1 font-mono">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span>ARCHITECTURE TYPE: MULTI-TENANT NODE</span>
                    <span>SLA: 99.9%</span>
                  </div>
                  <p className="text-slate-300 text-[11px] font-bold">
                    Otorisasi Terstruktur • Notifikasi WhatsApp • Audit Trail Permanen
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Key Metrics Counter Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono block">100%</span>
              <span className="text-xs text-slate-400">On-Premise VPS Data Sovereignty</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">&lt; 1 Jam</span>
              <span className="text-xs text-slate-400">Rata-rata Waktu Siklus Approval</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono block">0 Rupiah</span>
              <span className="text-xs text-slate-400">Biaya Langganan Bulanan Per-User</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">99.9%</span>
              <span className="text-xs text-slate-400">Jaminan SLA Availability Systems</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 02: BEFORE VS AFTER (MASALAH BIROKRASI & SOLUSI APPROVA) */}
      <section id="features" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-left">
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#0078d4] font-bold">REVOLUSI ALUR PERSETUJUAN KORPORAT</span>
            <span className="h-px bg-slate-800 flex-grow"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Merapikan Birokrasi Kerja Kantor Anda
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            Perbandingan visual antara kekacauan persetujuan manual via WhatsApp vs efisiensi terstruktur Approva.ai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Manual Reality (Using Login Light Hero Image) */}
          <div className="p-8 rounded-3xl bg-[#0a0f1d] border border-rose-900/50 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-rose-900/40 pb-4">
                <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Sebelum Approva (Manual & WA Chat)
                </h3>
                <span className="text-[10px] font-mono bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-bold border border-rose-800/60">
                  RESIKO TINGGI
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-rose-950 max-h-[190px]">
                <img
                  src="/login_light_hero.png"
                  alt="Manual Paperwork & Chat Approval Chaos"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <p>Persetujuan diberikan via WhatsApp chat personal tanpa log timestamps resmi untuk audit.</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <p>Seluruh proses pengadaan terhenti berhari-hari saat direktur sedang dinas luar atau cuti.</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold mt-0.5">✕</span>
                  <p>Salah input data di tahap akhir memaksa staf membatalkan formulir dan mengulang kembali dari awal.</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Approva Solution (Using Approva AI Image) */}
          <div className="p-8 rounded-3xl bg-[#0a0f1d] border border-emerald-800/60 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-800/40 pb-4">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Dengan Approva.ai (Terstruktur)
                </h3>
                <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-800/60">
                  OTOMATIS & AMAN
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-emerald-900 max-h-[190px]">
                <img
                  src="/approva.ai.jpeg"
                  alt="Approva Digital System"
                  className="w-full h-full object-cover"
                />
              </div>

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <p><strong className="text-white">Immutable Audit Trail</strong> merekam setiap aksi persetujuan secara otomatis dan permanen.</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <p><strong className="text-white">Take Over & Smart Jump</strong> mengalihkan wewenang persetujuan secara transparan saat pejabat berhalangan.</p>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <p><strong className="text-white">Fitur Rollback Stage</strong> mengembalikan dokumen ke tahapan sebelumnya untuk koreksi spesifik.</p>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 03: INTERACTIVE WORKSPACE CANVAS HUB */}
      <section id="canvas-hub" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-left">
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#0078d4] font-bold">DEMO INTERAKTIF APPLIKASI</span>
            <span className="h-px bg-slate-800 flex-grow"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Pusat Kendali Workflow Interaktif
          </h2>
          <p className="text-slate-400 text-sm">
            Uji coba langsung logika node persetujuan, diagram arsitektur, builder E-Form, dan konsol multi-tenant.
          </p>
        </div>

        {/* WORKSPACE CONTAINER */}
        <div className="rounded-3xl border border-slate-800 bg-[#0a0f1d] p-4 sm:p-6 shadow-2xl space-y-6">
          
          {/* Canvas Window Header & Interactive Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 bg-slate-900/80 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="font-mono text-xs text-slate-300 font-bold flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0078d4]" />
                Approva Canvas Workspace
              </span>
            </div>

            {/* Interactive Tab Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setCanvasTab("simulator")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  canvasTab === "simulator" ? "bg-[#0078d4] text-white font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                1. Node Simulator
              </button>
              <button
                onClick={() => setCanvasTab("blueprint")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  canvasTab === "blueprint" ? "bg-[#0078d4] text-white font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                2. Visual Blueprint
              </button>
              <button
                onClick={() => setCanvasTab("form")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  canvasTab === "form" ? "bg-[#0078d4] text-white font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                3. Live E-Form
              </button>
              <button
                onClick={() => setCanvasTab("multitenant")}
                className={`px-3.5 py-2 rounded-lg transition-all ${
                  canvasTab === "multitenant" ? "bg-[#0078d4] text-white font-bold shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                4. Multi-Tenant Console
              </button>
            </div>
          </div>

          {/* Canvas Tab Content */}
          <div className="p-4 sm:p-6 bg-[#070a11] rounded-2xl min-h-[360px] flex flex-col justify-between space-y-6">
            
            {/* Tab 1: Live Node Simulator */}
            {canvasTab === "simulator" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">Instansi Permohonan #WF-2026-99</span>
                    <h3 className="font-bold text-white text-sm sm:text-base">Pengadaan Hardware Server & Lisensi Database Office</h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800 w-fit flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    SLA Status: 1.5 Hours Elapsed
                  </span>
                </div>

                {/* Node Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 1 ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/40' : 'bg-slate-900 border-slate-800 opacity-70'}`}>
                    <span className="text-[10px] font-mono font-bold text-amber-400 block mb-1">STAGE 1: DRAFT</span>
                    <div className="font-bold text-white">Requestor (IT Staff)</div>
                    <div className="text-[11px] text-slate-400">Irfan Hakim</div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 2 ? 'bg-cyan-950/80 border-cyan-500 ring-2 ring-cyan-500/40' : 'bg-slate-900 border-slate-800 opacity-70'}`}>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">STAGE 2: REVIEW</span>
                    <div className="font-bold text-white">Department Lock</div>
                    <div className="text-[11px] text-slate-400">Head of IT (Approved)</div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 3 ? 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/40' : 'bg-slate-900 border-slate-800 opacity-70'}`}>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 block mb-1">STAGE 3: JUMP LOGIC</span>
                    <div className="font-bold text-white">VP Operations</div>
                    <div className="text-[11px] text-slate-400">Nominal &gt; 15M (Triggered)</div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 4 ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40' : 'bg-slate-900 border-slate-800 opacity-70'}`}>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-1">STAGE 4: COMPLETED</span>
                    <div className="font-bold text-white">Immutable Log</div>
                    <div className="text-[11px] text-slate-400">Audit Trail Recorded</div>
                  </div>
                </div>

                {/* Console Log Output */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1 text-xs max-w-xl">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-[#0078d4]" /> Output Konsol Eksekusi:
                    </span>
                    <p className="font-mono text-xs font-bold text-cyan-300 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                      {isSimulatingAction ? "Memproses aksi node..." : simulatedConsoleLog}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSimulateApprove}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" /> Simulasikan Approve (WA)
                    </button>
                    <button
                      onClick={handleSimulateRollback}
                      className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" /> Uji Rollback
                    </button>
                    <button
                      onClick={handleSimulateJump}
                      className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 font-bold text-xs shadow flex items-center gap-1.5 transition-all"
                    >
                      <Zap className="w-4 h-4" /> Uji Jump Logic
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Visual Blueprint (Using Provided Image Asset /interactive_workflow_hub.png) */}
            {canvasTab === "blueprint" && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">Visual Workflow Blueprint Architecture</h4>
                    <p className="text-slate-400 text-[11px]">Skema arsitektur logika node persetujuan dan pengambilan keputusan otomatis.</p>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 bg-blue-950 px-2.5 py-1 rounded font-semibold border border-blue-800">
                    High Resolution Vector
                  </span>
                </div>
                <div className="w-full rounded-2xl overflow-hidden border border-slate-800 max-h-[380px] bg-slate-950 flex items-center justify-center p-2">
                  <img
                    src="/interactive_workflow_hub.png"
                    alt="Workflow Architecture Blueprint"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Live E-Form Builder */}
            {canvasTab === "form" && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-sm">Dynamic E-Form Input Components</h4>
                  <span className="text-xs font-semibold text-cyan-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                    15+ Tipe Input Enterprise
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="font-bold text-slate-300 block">Currency Cost Input (Rupiah Formatted)</label>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold text-base flex justify-between items-center">
                      <span>Rp 85.000.000</span>
                      <span className="text-[10px] text-slate-500 font-sans font-semibold bg-slate-900 px-2 py-0.5 rounded">Auto Format</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="font-bold text-slate-300 block">Searchable API Select (ERP Synced)</label>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex justify-between items-center">
                      <span className="truncate">PT Hardware Nusantara Jaya (Code: VND-99)</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 md:col-span-2">
                    <label className="font-bold text-slate-300 block">Attachment & Signature Hash Validator</label>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-between font-mono text-[11px]">
                      <span className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Kuitansi_Server_Rak.pdf (Verified SHA-256)
                      </span>
                      <span className="text-slate-500">Digital Signature Attached</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Multi-Tenant Console */}
            {canvasTab === "multitenant" && (
              <div className="space-y-4 text-xs animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-sm">Konsol Holding BUMN & Multi-Tenant Switcher</h4>
                  <span className="text-xs font-semibold text-indigo-300 bg-indigo-950 px-3 py-1 rounded border border-indigo-800">
                    1-Click Switch Organization
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div
                    onClick={() => setActiveTenant("master")}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      activeTenant === "master" ? "bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/40" : "bg-slate-900 border-slate-800 opacity-70"
                    }`}
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>PT Semen Indonesia (Holding)</span>
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">Master</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Master Tenant • 1.250 Users • All Flows Active</div>
                  </div>

                  <div
                    onClick={() => setActiveTenant("subA")}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      activeTenant === "subA" ? "bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/40" : "bg-slate-900 border-slate-800 opacity-70"
                    }`}
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>PT Solusi Bangun Indonesia</span>
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">Sub-Tenant A</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Anak Perusahaan A • 450 Users • Isolated Schema</div>
                  </div>

                  <div
                    onClick={() => setActiveTenant("subB")}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      activeTenant === "subB" ? "bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/40" : "bg-slate-900 border-slate-800 opacity-70"
                    }`}
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>PT Logistik Nusantara</span>
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">Sub-Tenant B</span>
                    </div>
                    <div className="text-[11px] text-slate-400">Anak Perusahaan B • 180 Users • Custom SLA</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 04: FIELD USE CASES */}
      <section id="scenarios" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-left">
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#0078d4] font-bold">PENERAPAN LAPANGAN</span>
            <span className="h-px bg-slate-800 flex-grow"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Skenario Penggunaan Lapangan</h2>
          <p className="text-slate-400 text-sm">Contoh penerapan pada divisi operasional korporat Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-1 flex flex-col gap-2.5">
            <button
              onClick={() => setActiveCase("procurement")}
              className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                activeCase === "procurement" ? "bg-[#0078d4]/20 border-[#0078d4] text-white" : "bg-[#0a0f1d] border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-cyan-400">01. CAPEX / OPEX PROCUREMENT</span>
              <span className="font-bold text-sm text-white">Pengadaan Barang & Jasa Kantor</span>
            </button>

            <button
              onClick={() => setActiveCase("reimbursement")}
              className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                activeCase === "reimbursement" ? "bg-[#0078d4]/20 border-[#0078d4] text-white" : "bg-[#0a0f1d] border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-cyan-400">02. TRAVEL & CLAIM</span>
              <span className="font-bold text-sm text-white">Reimbursement Perjalanan Dinas</span>
            </button>

            <button
              onClick={() => setActiveCase("directors")}
              className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                activeCase === "directors" ? "bg-[#0078d4]/20 border-[#0078d4] text-white" : "bg-[#0a0f1d] border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-cyan-400">03. BOARD SIGN-OFF</span>
              <span className="font-bold text-sm text-white">Otorisasi Dokumen Direksi (LDAP)</span>
            </button>

            <button
              onClick={() => setActiveCase("vendor")}
              className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                activeCase === "vendor" ? "bg-[#0078d4]/20 border-[#0078d4] text-white" : "bg-[#0a0f1d] border-slate-800 text-slate-400 hover:bg-slate-900"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-cyan-400">04. STRANGER MODE</span>
              <span className="font-bold text-sm text-white">Klaim Pihak Luar & Vendor</span>
            </button>
          </div>

          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-slate-800 bg-[#0a0f1d] shadow-xl min-h-[340px] flex flex-col justify-center text-xs space-y-4">
            {activeCase === "procurement" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-base">Alur Pengadaan Barang & Jasa (CAPEX / OPEX)</h4>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold text-[10px]">Jump Logic Enabled</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between font-mono text-[11px] text-slate-400">
                    <span>Vendor: PT Hardware Utama</span>
                    <span>Total Nominal: Rp 65.000.000</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-2 p-3 bg-slate-950 rounded-lg text-slate-300 font-semibold border border-slate-800">
                    <div>1. Staff IT (Submit)</div>
                    <span className="text-slate-600">➔</span>
                    <div>2. Head of IT (Approved)</div>
                    <span className="text-slate-600">➔</span>
                    <div className="text-cyan-400 font-bold bg-blue-950 px-2 py-1 rounded">3. Jump to Ops Director</div>
                  </div>
                </div>
              </div>
            )}

            {activeCase === "reimbursement" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-base">Reimbursement Perjalanan Dinas</h4>
                  <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 font-mono font-bold text-[10px]">Precise Rollback</span>
                </div>
                <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl space-y-2">
                  <div className="font-bold text-rose-300 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4" /> Reverted to Stage 1 (Drafting Correction)
                  </div>
                  <p className="text-slate-300 text-xs">
                    Catatan Koreksi: "Mohon upload ulang kuitansi hotel dalam resolusi jelas."
                  </p>
                </div>
              </div>
            )}

            {activeCase === "directors" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-base">Otorisasi Dokumen Direksi</h4>
                  <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono font-bold text-[10px]">Active Directory Synced</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">Direktur Utama: Bpk. Suhartono</span>
                    <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded font-mono text-[10px] font-bold border border-emerald-800">LDAP SSO ACTIVE</span>
                  </div>
                  <p className="text-slate-400 text-xs">Pengguna login menggunakan credential Single Sign-On (SSO) internal kantor.</p>
                </div>
              </div>
            )}

            {activeCase === "vendor" && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-base">Klaim Pihak Luar & Vendor</h4>
                  <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono font-bold text-[10px]">Stranger Mode Link</span>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="font-mono text-slate-400 text-[10px] uppercase block">Public Link</span>
                  <div className="font-mono text-cyan-400 font-bold bg-slate-950 p-2 rounded border border-slate-800">
                    https://approva.ai/p/PT-Semen-Indonesia-reimburse
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 05: FINANCIAL ROI CALCULATOR */}
      <section id="roi-calculator" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-left">
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#0078d4] font-bold">ANALISIS EFISIENSI BIAYA</span>
            <span className="h-px bg-slate-800 flex-grow"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Laporan Efisiensi Finansial & ROI</h2>
          <p className="text-slate-400 text-sm">Hitung kalkulasi jam kerja manajerial & biaya operasional yang terhemat.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center border border-slate-800 bg-[#0a0f1d] rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Kalkulator Potensi Penghematan Bulanan</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Jumlah Karyawan / User:</span>
                  <span className="text-cyan-400 font-mono text-base font-bold">{employeeCount} Karyawan</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#0078d4]"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Rata-rata Lama Approval Manual saat Ini:</span>
                  <span className="text-indigo-400 font-mono text-base font-bold">{avgApprovalTimeDays} Hari Kerja</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="1"
                  value={avgApprovalTimeDays}
                  onChange={(e) => setAvgApprovalTimeDays(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 text-center shadow-xl">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider block">
              Potensi Penghematan Per Bulan
            </span>

            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono">
                Rp {monthlySavingsRp.toLocaleString("id-ID")}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">/ bulan dalam efisiensi jam manajerial</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Pengajuan / Bln:</span>
                <span className="font-bold text-white text-sm font-mono">{monthlyApprovalCount} Berkas</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block mb-1">Jam Terhemat:</span>
                <span className="font-bold text-emerald-400 text-sm font-mono">{Math.round(monthlyApprovalCount * hoursSavedPerApproval)} Jam</span>
              </div>
            </div>

            <button
              onClick={() => setIsRoiModalOpen(true)}
              className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0078d4] via-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Printer className="w-4 h-4" />
              <FileText className="w-4 h-4" />
              <span>Cetak / Ekspor Laporan Finansial (PDF)</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 06: FAQ ACCORDION */}
      <section id="faq" className="py-16 px-6 sm:px-12 max-w-5xl mx-auto text-left">
        <div className="space-y-3 mb-8 text-center">
          <span className="font-mono text-xs text-[#0078d4] font-bold uppercase tracking-widest">
            PERTANYAAN UMUM & DUKUNGAN TEKNIS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Pertanyaan Umum (FAQ)</h2>
          <p className="text-slate-400 text-sm">Informasi teknis seputar Lisensi Beli Putus dan On-Premise VPS.</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-slate-800 rounded-2xl bg-[#0a0f1d] overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-5 text-left font-bold text-white text-sm sm:text-base flex items-center justify-between gap-4 hover:text-cyan-300 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 bg-slate-900/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 07: CERTIFICATE OF LICENSE & BUYOUT GUARANTEE */}
      <section id="license-certificate" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-left">
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#0078d4] font-bold">JAMINAN HAK CIPTA & LISENSI</span>
            <span className="h-px bg-slate-800 flex-grow"></span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Sertifikat Lisensi Beli Putus</h2>
          <p className="text-slate-400 text-sm">Satu kali investasi tanpa langganan per-user selamanya.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#0a0f1d] border-2 border-amber-500/60 rounded-3xl p-8 sm:p-12 relative shadow-2xl space-y-8">
          
          {/* Gold Certificate Seal Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/30 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center text-slate-950">
                <Award className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest block">
                  PERPETUAL BUYOUT LICENSE GUARANTEE
                </span>
                <h3 className="text-xl font-bold text-white">Approva.ai Corporate License</h3>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-emerald-400 font-bold block">100% DATA SOVEREIGNTY</span>
              <span className="text-slate-400 text-[10px]">ON-PREMISE VPS DEPLOYMENT</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="text-4xl font-black text-white font-mono">
                Rp 45.000.000
                <span className="text-xs font-sans font-normal text-amber-400 block mt-1">Mulai dari (One-Time Buyout License)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Di-host langsung di VPS / Server fisik milik perusahaan Anda. Kontrol penuh atas seluruh data perusahaan tanpa biaya bulanan per-user.
              </p>
            </div>

            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">SME (30-100 karyawan)</span>
                <span className="text-amber-400 font-bold">Rp 45jt – Rp 65jt</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Enterprise (100-500+ user)</span>
                <span className="text-amber-400 font-bold">Rp 85jt – Rp 150jt</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Annual Maintenance (Thn 2+)</span>
                <span className="text-emerald-400 font-bold">~10% / thn (Opsional)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Termasuk Setup 3 Hari Kerja & SLA On-Premise Support</span>
            </div>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20"
            >
              Minta Penawaran Resmi Perusahaan
            </button>
          </div>
        </div>
      </section>

      {/* FINAL ENTERPRISE CALL TO ACTION */}
      <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto bg-gradient-to-r from-[#0078d4] via-blue-700 to-indigo-900 text-white rounded-3xl my-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
          Transformasikan Alur Otorisasi Perusahaan Anda Hari Ini.
        </h2>
        <p className="text-blue-100 text-sm max-w-xl mx-auto font-normal">
          Dapatkan sesi konsultasi & simulasi demonstrasi 1-on-1 khusus sesuai kebutuhan operasional korporat Anda dalam 15 menit.
        </p>
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-8 py-4 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-black text-sm shadow-2xl transition-all flex items-center gap-3 transform hover:scale-105"
          >
            <Calendar className="w-5 h-5 text-[#0078d4]" />
            <span>Jadwalkan Sesi Konsultasi 1-on-1</span>
            <ArrowRight className="w-5 h-5 text-[#0078d4]" />
          </button>
        </div>
      </section>

      {/* ENTERPRISE FOOTER */}
      <footer className="border-t border-slate-800 bg-[#070a11] py-12 px-6 sm:px-12 text-xs text-slate-500 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Approva Official Logo"
            className="w-6 h-6 object-contain"
          />
          <span className="font-bold text-white text-sm">Approva.ai</span>
          <span>© 2026 Enterprise Dynamic E-Form & Approval Control Platform.</span>
        </div>
        <div className="flex gap-6 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => handleOpenLegalModal("privacy")}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => handleOpenLegalModal("terms")}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Terms of License
          </button>
          <button
            type="button"
            onClick={() => handleOpenLegalModal("whitepaper")}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Security Whitepaper
          </button>
        </div>
      </footer>

      {/* LEAD CONSULTATION MODAL */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-left">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-100">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 text-cyan-300 text-xs font-semibold border border-blue-800">
                    <Calendar className="w-3.5 h-3.5" /> Direct 1-on-1 Consultation Booking
                  </div>
                  <h3 className="text-xl font-bold text-white">Jadwalkan Konsultasi Approva.ai</h3>
                  <p className="text-slate-400 text-xs">
                    Isi data kualifikasi singkat agar tim solusi kami dapat menyiapkan simulasi yang tepat sesuai industri perusahaan Anda.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan / Organisasi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Bangun Jaya Utama (Persero)"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#0078d4]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Jumlah Karyawan *</label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#0078d4]"
                      >
                        <option value="<30">&lt; 30 Karyawan</option>
                        <option value="30-100">30 - 100 Karyawan</option>
                        <option value="100-500">100 - 500 Karyawan</option>
                        <option value=">500">&gt; 500 Karyawan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Jabatan Anda *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#0078d4]"
                      >
                        <option value="C-Level / Director">C-Level / Director</option>
                        <option value="Head of Operations / COO">Head of Operations / COO</option>
                        <option value="HR / GA Manager">HR / GA Manager</option>
                        <option value="IT Manager / CTO">IT Manager / CTO</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Kantor (Corporate Email) *</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@perusahaan.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#0078d4]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-[#0078d4]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0078d4] to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-4"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lanjutkan Pilih Jadwal Demo</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-4 font-sans">
                <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Sesi Konsultasi Berhasil Di-Booking!</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  Terima kasih <strong className="text-white">{formData.companyName}</strong>. Undangan meeting & kalender sesi 15 menit telah dikirimkan ke <strong className="text-cyan-300">{formData.email}</strong>. Tim solusi kami akan menghubungi Anda via WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsBookingOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors mt-4"
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
        totalHoursSaved={Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5)}
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
