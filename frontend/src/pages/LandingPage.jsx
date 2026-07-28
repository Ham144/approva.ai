import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Bot,
  FileText,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Play,
  Calculator,
  Calendar,
  X,
  Users,
  Clock,
  Briefcase,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  Star,
  Lock,
  Globe,
  Award,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  // Booking / Lead Qualification Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
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

  // Active AI Demo Tab
  const [activeTab, setActiveTab] = useState("prompt-to-workflow");

  // ROI Calculator State
  const [employeeCount, setEmployeeCount] = useState(75);
  const [avgApprovalTimeDays, setAvgApprovalTimeDays] = useState(5);

  // ROI Calculations
  const hourlyCost = 80000; // Rp 80k / hour estimated manager rate
  const monthlyApprovalCount = Math.round(employeeCount * 1.8);
  const hoursSavedPerApproval = avgApprovalTimeDays * 1.5;
  const monthlySavingsRp = Math.round(
    monthlyApprovalCount * hoursSavedPerApproval * (hourlyCost * 0.4)
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden">
      {/* Top AI Glow Announcement Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-xs py-2.5 px-4 text-center border-b border-purple-500/30 flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-400/30 animate-pulse">
          <Sparkles className="w-3 h-3 text-purple-400" /> NEW: AI Engine 3.0
        </span>
        <span className="text-slate-300 hidden md:inline">
          Otomatisasi Alur Persetujuan Korporat dengan Generative AI & On-Premise Security.
        </span>
        <button
          onClick={() => setIsBookingOpen(true)}
          className="underline font-semibold text-purple-200 hover:text-white ml-2 transition-colors"
        >
          Klaim Sesi Demo 15-Min &rarr;
        </button>
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-400/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  Approva<span className="text-purple-400">.ai</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  Enterprise AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Smart Approval Management</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#ai-features" className="hover:text-purple-400 transition-colors">
              Fitur AI Super
            </a>
            <a href="#demo-section" className="hover:text-purple-400 transition-colors">
              Simulasi AI Workflow
            </a>
            <a href="#comparison" className="hover:text-purple-400 transition-colors">
              Mengapa Approva.ai?
            </a>
            <a href="#roi-calculator" className="hover:text-purple-400 transition-colors">
              Kalkulator ROI
            </a>
            <a href="#pricing" className="hover:text-purple-400 transition-colors">
              Lisensi Corporate
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsBookingOpen(true)}
              className="relative group overflow-hidden rounded-xl p-px font-semibold text-xs sm:text-sm shadow-xl shadow-purple-900/30"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 transition-all duration-300 group-hover:opacity-90"></span>
              <span className="relative block px-4 sm:px-5 py-2.5 rounded-[11px] bg-slate-950 transition-colors group-hover:bg-opacity-0">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400 group-hover:text-white" />
                  <span>Book Demo Call</span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-600/15 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="text-center max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-purple-500/30 backdrop-blur-md shadow-inner">
            <Cpu className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs font-medium bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">
              Next-Gen Enterprise Approval Engine Powered by Generative AI
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Pangkas Birokrasi Approval Kantor Dari <span className="text-rose-400 line-through">7 Hari</span> Menjadi{" "}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              15 Menit dengan AI & WhatsApp
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Platform E-Form & Approval otomatis berbasis AI terintegrasi dengan <span className="text-emerald-400 font-semibold">Notifikasi WhatsApp</span>. Lengkap dengan{" "}
            <span className="text-purple-300 font-semibold">Prompt-to-Workflow Builder</span>,{" "}
            <span className="text-purple-300 font-semibold">AI RAG Document Summarizer</span>, dan lisensi{" "}
            <span className="text-emerald-400 font-semibold">Beli Putus</span> untuk diinstal mandiri di VPS perusahaan Anda.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-base shadow-2xl shadow-purple-600/40 hover:shadow-purple-500/60 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
            >
              <Calendar className="w-5 h-5 text-purple-200 group-hover:scale-110 transition-transform" />
              <span>Jadwalkan Live Demo 1-on-1</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#demo-section"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-base flex items-center justify-center gap-2.5 transition-all"
            >
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span>Coba Simulasi AI (Interactive)</span>
            </a>
          </div>

          {/* Micro Trust Indicators */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-xs text-slate-400 border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>On-Premise VPS Aman</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Alert Instan</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <span>AI Prompt-to-Workflow</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Lisensi Beli Putus (No SaaS)</span>
            </div>
          </div>
        </div>

        {/* Dynamic App Dashboard Mockup with AI Overlay */}
        <div className="mt-14 relative max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-2 shadow-2xl shadow-purple-950/50 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-slate-950/60 rounded-t-xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              <span className="ml-2 text-xs font-mono text-slate-400">approva.ai/enterprise/dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 text-[11px] font-mono border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                AI Active & Learning
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-slate-950/80 rounded-b-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left AI Assistant Badge */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm">AI Recommendation Engine</h3>
                    <span className="text-[10px] bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded font-mono">99.4% Accuracy</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    "Pengajuan Pembelian Server #REQ-8891 dari IT Department aman disetujui. Proposal PDF 18 halaman telah diringkas: Tidak ada potensi resiko anggaran lebih."
                  </p>
                </div>
              </div>

              {/* Sample Approval Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                      Pending Manager Finance
                    </span>
                    <span className="text-xs text-slate-400">Index: #EXP-2026-042</span>
                  </div>
                  <span className="text-xs text-slate-400">2 menit yang lalu</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="font-semibold text-white">Reimbursement Travel & Operational Client Meeting</h4>
                    <p className="text-xs text-slate-400">Pemohon: Yafizham (Sales Manager) • Nominal: Rp 14.500.000</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                      Redo/Rollback
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Live Analytics Mock */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Kecepatan Approval AI</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </h4>
                <div className="text-2xl font-bold text-white">12.4 Menit <span className="text-xs font-normal text-emerald-400">(-89% vs Manual)</span></div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full w-[85%]"></div>
                </div>
                <p className="text-[11px] text-slate-400">420 Pengajuan terproses otomatis bulan ini tanpa hambatan birokrasi.</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/40 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-semibold text-xs">
                  <Bot className="w-4 h-4" /> AI Auto-Routing Rules Active
                </div>
                <p className="text-[11px] text-purple-200/80">
                  Semua pengajuan &gt; Rp 10 Juta otomatis memerlukan tambahan otorisasi Direktur Operasional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid: AI-Powered Super Capabilities */}
      <section id="ai-features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800">
            Powered by Generative AI Engine 3.0
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Fitur Cerdas yang Dirancang Khusus untuk Kebutuhan Korporat Modern
          </h2>
          <p className="text-slate-400 text-base">
            Menggabungkan fleksibilitas dynamic form dengan kecerdasan buatan untuk mengeliminasi kesalahan manusia dan mempercepat alur kerja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-purple-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-purple-400 font-semibold uppercase tracking-wider">01. AI Workflow Generator</span>
            <h3 className="text-xl font-bold text-white mt-2 mb-3">Prompt-to-Workflow Builder</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Cukup ketik instruksi bahasa alami: <em>"Buat alur persetujuan pengadaan barang &gt;10 juta butuh persetujuan Manager & Direktur Ops."</em> AI membuatkan alur dan formnya dalam 5 detik.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">02. Smart AI Summarizer</span>
            <h3 className="text-xl font-bold text-white mt-2 mb-3">Proposal & Risk RAG Reader</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Direktur & Approver yang sibuk tak perlu lagi membaca dokumen PDF 30 halaman. AI secara otomatis merangkum proposal menjadi 3 poin kunci + analisis risiko anggaran.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-blue-$1600/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-blue-500/30">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">03. External Stranger Mode</span>
            <h3 className="text-xl font-bold text-white mt-2 mb-3">Form Publik Eksternal Cerdas</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Vendor, Klien, atau publik dapat menginput formulir tanpa perlu membuat akun login, namun secara otomatis mentrigger alur persetujuan internal korporat.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">04. WhatsApp Notification</span>
            <h3 className="text-xl font-bold text-white mt-2 mb-3">Notifikasi & Approval Instan WhatsApp</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Percepat keputusan approval. Approver menerima notifikasi chat WA otomatis saat giliran mereka tiba, lengkap dengan ringkasan AI dan tombol cepat untuk memberikan keputusan langsung.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-amber-500/30">
              <Zap className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">05. Dynamic Stage & JumpTo Logic</span>
            <h3 className="text-xl font-bold text-white mt-2 mb-3">Form Dinamis & Logika Lompatan</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Formulir berubah otomatis di tiap status. Dilengkapi logika kondisional (misal: pengajuan &lt; Rp 5 Juta otomatis melompati Direktur langsung ke Pembayaran).
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-8 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all group relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-rose-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono text-rose-400 font-semibold uppercase tracking-wider">06. Security & Auditability</span>
            <h3 className="text-xl font-bold text-white mt-2 mb-3">Riwayat Persetujuan & Redo/Rollback</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Pencatatan riwayat persetujuan transparan lengkap dengan timestamp, pelacakan pemohon per departemen, serta fitur Redo/Rollback 1-langkah jika terdapat kesalahan.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive AI Feature Playground Section */}
      <section id="demo-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/40 rounded-3xl border border-slate-800 my-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Interactive Showcase</span>
          <h2 className="text-3xl font-bold text-white">Lihat Bagaimana AI Mengubah Cara Kerja Kantor Anda</h2>
          <p className="text-slate-400 text-sm">Pilih fitur di bawah untuk melihat simulasi langsung alur kerja berbasis kecerdasan buatan.</p>
        </div>

        {/* Tab Selection Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveTab("prompt-to-workflow")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "prompt-to-workflow"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Prompt-to-Workflow</span>
          </button>
          <button
            onClick={() => setActiveTab("summarizer")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "summarizer"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AI Document Summarizer</span>
          </button>
          <button
            onClick={() => setActiveTab("stranger-mode")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "stranger-mode"
                ? "bg-blue-$1600 text-white shadow-lg shadow-blue-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Stranger Mode (Public Request)</span>
          </button>
          <button
            onClick={() => setActiveTab("whatsapp-notif")}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "whatsapp-notif"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Quick Approval</span>
          </button>
        </div>

        {/* Interactive Tab Content Display */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl">
          {activeTab === "prompt-to-workflow" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
                  <Sparkles className="w-5 h-5" /> Simulasi Input Prompt Admin
                </div>
                <span className="text-xs text-slate-400 font-mono">Response Time: 3.2 Seconds</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300">
                &gt; "Buat alur approval pengadaan barang hardware kantor. Jika nominal &gt; Rp 15 juta butuh persetujuan Manager IT & Direktur Operasional. Tambahkan input lampiran invoice."
              </div>
              <div className="space-y-3">
                <div className="text-xs font-semibold text-slate-400">AI Generated Workflow Output Structure:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/50">
                    <span className="text-purple-400 font-bold block mb-1">Stage 1: Pengajuan</span>
                    <p className="text-slate-300 text-[11px]">Input: Item, Jumlah, Vendor, Nominal, Invoice PDF</p>
                  </div>
                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50">
                    <span className="text-indigo-400 font-bold block mb-1">Stage 2: Logic Check</span>
                    <p className="text-slate-300 text-[11px]">If Nominal &gt; 15M -&gt; JumpTo Direktur Ops, Else -&gt; Finance</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50">
                    <span className="text-emerald-400 font-bold block mb-1">Stage 3: Auto Completed</span>
                    <p className="text-slate-300 text-[11px]">Kirim Notifikasi Email & Notifikasi Audit Log</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "summarizer" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                  <FileText className="w-5 h-5" /> AI RAG Executive Summary
                </div>
                <span className="text-xs text-emerald-400 font-mono">Attachment: Proposal_Server_Upgrade_2026.pdf</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-white text-sm">📌 3 Ringkasan Utama Dokumen:</div>
                <ul className="space-y-2 text-slate-300 list-disc list-inside">
                  <li>Pengajuan peremajaan 4 unit server database utama yang telah berusia 5 tahun.</li>
                  <li>Total estimasi biaya Rp 85.000.000 (Termasuk garansi on-site 3 tahun dari vendor).</li>
                  <li>Diestimasikan meningkatkan efisiensi query database hingga 300%.</li>
                </ul>
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/50 text-amber-300 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>AI Risk Flag:</strong> Nominal diajukan sesuai rencana anggaran Q3. Risiko penolakan atau over-budget 0%.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stranger-mode" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                  <Globe className="w-5 h-5" /> Form Publik Tanpa Authentication (Stranger Mode)
                </div>
                <span className="text-xs text-cyan-400 font-mono">Protected by Rate-Limiter</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                <p className="text-slate-300">
                  Vendor luar/publik membuka link <code>approva.ai/public/form/vendor-claim</code> tanpa perlu password.
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex items-center justify-between">
                  <span>Public Form Submission Submitted by external_vendor@company.com</span>
                  <span className="text-emerald-400 font-semibold">&rarr; Triggered Internal Stage 1 Approval</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "whatsapp-notif" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <MessageSquare className="w-5 h-5" /> Simulasi Notifikasi Chat WhatsApp (Real-Time)
                </div>
                <span className="text-xs text-emerald-400 font-mono">Status: Delivered & Active</span>
              </div>
              <div className="max-w-md mx-auto rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
                <div className="bg-emerald-800 px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100/20 flex items-center justify-center font-bold text-white text-sm">
                    A
                  </div>
                  <div>
                    <div className="text-white text-xs font-semibold">Approva.ai System</div>
                    <div className="text-[10px] text-emerald-200">Online</div>
                  </div>
                </div>
                <div className="p-4 space-y-3 bg-slate-950">
                  <div className="bg-slate-900 text-white p-3 rounded-lg rounded-tl-none border border-slate-800 max-w-[85%] text-xs space-y-2 relative shadow-md">
                    <p className="font-semibold text-emerald-400">📝 PERMINTAAN APPROVAL BARU</p>
                    <p>Halo <strong>Bpk. Manager Finance</strong>,</p>
                    <p>Anda menerima berkas approval untuk <strong>"Reimbursement Operational Client"</strong>.</p>
                    <p>• <strong>Pemohon</strong>: Yafizham (Sales)<br/>• <strong>Nominal</strong>: Rp 14.500.000<br/>• <strong>Ringkasan AI</strong>: Dana sesuai dengan budget Q3 divisi sales. Tidak ada resiko anggaran.</p>
                    <p className="text-slate-400 text-[10px]">Silakan klik tombol di bawah untuk respon cepat:</p>
                    <div className="pt-2 flex flex-col gap-1.5 font-sans font-bold">
                      <button onClick={() => alert('Simulasi Approve Berhasil!')} className="block text-center py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors text-[11px]">
                        ✅ Approve Langsung
                      </button>
                      <button onClick={() => alert('Simulasi Membuka Detail...')} className="block text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors text-[11px]">
                        🔍 Lihat Berkas & Input Form
                      </button>
                    </div>
                    <span className="block text-right text-[9px] text-slate-500 mt-1 font-mono">10:04 AM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Comparison Section: Approva.ai vs Alternatives */}
      <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Enterprise Positioning</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Mengapa Approva.ai Berada di "Sweet Spot" Pasar?</h2>
          <p className="text-slate-400 text-base">
            Perbandingan solusi manajemen approval perusahaan Anda saat ini dibanding Approva.ai.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="p-4 font-semibold text-white">Fitur & Kriteria</th>
                <th className="p-4 font-semibold text-slate-400">Google Form / Excel</th>
                <th className="p-4 font-semibold text-slate-400">SAP / ServiceNow</th>
                <th className="p-4 font-semibold text-slate-400">Talenta / Mekari (HRIS)</th>
                <th className="p-4 font-bold text-purple-400 bg-purple-950/40 rounded-t-xl">Approva.ai Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr>
                <td className="p-4 font-medium text-white">Biaya / Investasi</td>
                <td className="p-4 text-emerald-400">Gratis</td>
                <td className="p-4 text-rose-400">Sangat Mahal (&gt;Rp 500jt)</td>
                <td className="p-4 text-slate-400">SaaS Berlangganan Per-User</td>
                <td className="p-4 font-bold text-purple-300 bg-purple-950/30">Lisensi Putus Terjangkau</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Waktu Setup / Deploiement</td>
                <td className="p-4">1 Hari</td>
                <td className="p-4 text-rose-400">6 Bulan - 1 Tahun</td>
                <td className="p-4">1 - 2 Minggu</td>
                <td className="p-4 font-bold text-purple-300 bg-purple-950/30">3 Hari Siap Pakai</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">AI Workflow Generator</td>
                <td className="p-4 text-rose-400">Tidak Ada</td>
                <td className="p-4 text-rose-400">Tidak Ada / Complex Add-on</td>
                <td className="p-4 text-rose-400">Tidak Ada</td>
                <td className="p-4 font-bold text-emerald-400 bg-purple-950/30">✅ Prompt-to-Workflow Included</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">AI Proposal Summarizer</td>
                <td className="p-4 text-rose-400">Tidak Ada</td>
                <td className="p-4 text-rose-400">Tidak Ada</td>
                <td className="p-4 text-rose-400">Tidak Ada</td>
                <td className="p-4 font-bold text-emerald-400 bg-purple-950/30">✅ RAG Document Risk Reader</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Custom Form Publik (Stranger Mode)</td>
                <td className="p-4">Bisa (Tanpa Approval)</td>
                <td className="p-4 text-rose-400">Sangat Rumit</td>
                <td className="p-4 text-rose-400">Khusus Karyawan Internal</td>
                <td className="p-4 font-bold text-emerald-400 bg-purple-950/30">✅ Stranger Mode Ready</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Dynamic Stage Inputs & JumpTo Logic</td>
                <td className="p-4 text-rose-400">Satu Form Statis</td>
                <td className="p-4">Bisa (Butuh Coding)</td>
                <td className="p-4 text-rose-400">Kaku (Khusus HR)</td>
                <td className="p-4 font-bold text-emerald-400 bg-purple-950/30">✅ Visual Drag & Drop Builder</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Business ROI Calculator */}
      <section id="roi-calculator" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/60 rounded-3xl border border-slate-800 my-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> Hitung Potensi Hemat Perusahaan Anda
            </span>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Berapa Banyak Biaya Operasional yang Terbuang Karena Approval Manual?
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gunakan kalkulator interaktif ini untuk melihat estimasi penghematan jam kerja manajerial & biaya operasional yang didapatkan setelah beralih ke Approva.ai.
            </p>

            {/* Sliders */}
            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Jumlah Karyawan / User:</span>
                  <span className="text-purple-400 font-mono text-base">{employeeCount} Karyawan</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-300">Rata-rata Lama Approval Manual Saat Ini:</span>
                  <span className="text-indigo-400 font-mono text-base">{avgApprovalTimeDays} Hari Kerja</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="1"
                  value={avgApprovalTimeDays}
                  onChange={(e) => setAvgApprovalTimeDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* ROI Result Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-slate-950 border border-purple-500/30 space-y-6 text-center shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Estimasi Penghematan Per Bulan
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Potensi Hemat Man-Hours & Cost:</div>
              <div className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent font-mono">
                Rp {monthlySavingsRp.toLocaleString("id-ID")}
              </div>
              <span className="text-xs text-slate-400">/ bulan dalam efisiensi jam manajerial</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-left text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Total Pengajuan / Bln:</span>
                <span className="font-bold text-white text-sm font-mono">{monthlyApprovalCount} Pengajuan</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Jam Kerja Terhemat:</span>
                <span className="font-bold text-emerald-400 text-sm font-mono">{Math.round(monthlyApprovalCount * hoursSavedPerApproval)} Jam</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
            >
              <span>Klaim Efisiensi Ini Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Models Section: Corporate License */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Model Lisensi B2B Corporate (Beli Putus)</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Satu Kali Investasi untuk Kebebasan Penuh</h2>
          <p className="text-slate-400 text-base">
            Tanpa biaya bulanan atau langganan per-user yang membakar anggaran. Lisensi putus untuk satu organisasi selamanya, disesuaikan berdasarkan skala perusahaan.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-gradient-to-b from-purple-950/40 via-slate-900 to-slate-950 border-2 border-purple-500 rounded-3xl p-8 sm:p-10 relative shadow-2xl shadow-purple-900/20 space-y-8">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
            Lisensi Korporat Mandiri
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-slate-800/80 pb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Corporate License</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pasang sistem di server internal/private VPS Anda sendiri. Kontrol penuh atas seluruh data perusahaan tanpa ketergantungan pihak ketiga.
              </p>
              <div className="text-4xl font-extrabold text-white font-mono">
                Rp 45.000.000
                <span className="text-xs font-normal text-purple-300 block font-sans mt-1">Mulai dari (One-Time License)</span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Penyesuaian Skala Karyawan:</div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50">
                <span className="text-slate-400">SME (30 - 100 karyawan)</span>
                <span className="font-mono text-purple-400 font-bold">Rp 45jt – Rp 65jt</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Enterprise (100 - 500 karyawan)</span>
                <span className="font-mono text-purple-400 font-bold">Rp 85jt – Rp 150jt</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-slate-400">Annual Maintenance (Tahun ke-2 dst)</span>
                <span className="font-mono text-emerald-400 font-bold">~10% / tahun (Murah & Opsional)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">Fitur Utama Termasuk:</div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Setup Cepat di VPS Anda (Hanya 3 Hari)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>AI Prompt-to-Workflow Builder & RAG Summarizer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Integrasi Notifikasi WhatsApp & Email Instan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Stranger Mode (Form Publik Tanpa Login)</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Active Directory / LDAP & Switch Org Instan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Form Dinamis & Logika Lompatan Alur (JumpTo)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Free Tech Support & Garansi Sistem 6 Bulan</span>
                </li>
              </ul>

              <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30 text-[10px] text-red-300/90 leading-normal">
                ⚠️ <strong>Ketentuan Lisensi:</strong> Khusus penggunaan internal 1 perusahaan. Bukan program white-label untuk dijual ulang (No Resale).
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-purple-600/40 text-center"
            >
              Minta Penawaran Lisensi Perusahaan Anda
            </button>
            <p className="text-[10px] text-slate-400">
              Tim engineer kami akan menangani seluruh proses instalasi, integrasi LDAP, dan deployment.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-8 text-xs text-slate-500 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-purple-400" />
          <span className="font-bold text-slate-300 text-sm">Approva.ai</span>
          <span>© 2026 Enterprise Dynamic E-Form & AI Approval Platform.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">Terms of License</a>
          <a href="#" className="hover:text-slate-300">Security Whitepaper</a>
        </div>
      </footer>

      {/* Lead Qualification & Booking Call Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5" /> Direct 1-on-1 Demo Booking
                  </div>
                  <h3 className="text-xl font-bold text-white">Jadwalkan Live Demo Approva.ai</h3>
                  <p className="text-slate-400 text-xs">
                    Isi kualifikasi singkat ini agar tim engineer & solusi bisnis kami menyiapkan simulasi yang tepat sesuai industri perusahaan Anda.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nama Perusahaan / Organisasi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Bangun Jaya Utama"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Jumlah Karyawan *</label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
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
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
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
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
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
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 mt-4"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lanjutkan Pilih Jadwal Demo</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Sesi Demo Berhasil Di-Booking!</h3>
                <p className="text-slate-300 text-xs max-w-sm mx-auto">
                  Terima kasih <strong>{formData.companyName}</strong>. Undangan meeting & kalender sesi 15 menit telah dikirimkan ke <strong>{formData.email}</strong>. Tim solusi kami akan menghubungi Anda via WhatsApp.
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
    </div>
  );
};

export default LandingPage;
