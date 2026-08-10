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
  RotateCw,
  Sliders,
  Layers,
  FileSpreadsheet,
  Lock,
  Server,
  Key,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../store";

const LandingPage = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

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

  // Main Canvas Hub Active Tab State
  const [canvasTab, setCanvasTab] = useState("simulator"); // simulator, blueprint, form, multitenant

  // Live Simulator Node State
  const [simulatedStage, setSimulatedStage] = useState(2); // 1: Draft, 2: Manager, 3: Jump, 4: Approved
  const [simulatedConsoleLog, setSimulatedConsoleLog] = useState(
    "Pending Review by VP Operations. Outbound WA Alert sent (+62 812-****-889)."
  );

  // Asymmetric Case Selector State
  const [activeCase, setActiveCase] = useState("procurement"); // procurement, reimbursement, directors, vendor

  // Multi-Tenant Interactive Switcher State
  const [activeTenant, setActiveTenant] = useState("master"); // master, subA, subB

  // ROI Calculator State
  const [employeeCount, setEmployeeCount] = useState(75);
  const [avgApprovalTimeDays, setAvgApprovalTimeDays] = useState(5);

  // ROI Calculations
  const hourlyCost = 80000;
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
    setSimulatedStage(4);
    setSimulatedConsoleLog(
      "✅ Approved by VP Operations. Immutable Audit Log timestamp recorded: 2026-08-01T19:42:00Z."
    );
  };

  const handleSimulateRollback = () => {
    setSimulatedStage(1);
    setSimulatedConsoleLog(
      "⤶ Rollback executed to Stage 1 (Draft). Correction Note: 'Lampiran kuitansi blur'."
    );
  };

  const handleSimulateJump = () => {
    setSimulatedStage(3);
    setSimulatedConsoleLog(
      "⚡ JumpLogic Condition Met: Nominal > Rp 15M ➔ Skipping intermediate stages direct to Director."
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#0078d4] selection:text-white overflow-x-hidden relative">
      
      {/* SLA Announcement Banner */}
      <div className="bg-[#0078d4] text-white text-[11px] sm:text-xs py-2.5 px-4 text-center border-b border-blue-700 flex items-center justify-center gap-2 shadow-sm relative z-50">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white font-semibold text-[10px] border border-white/30">
          ENTERPRISE ON-PREMISE
        </span>
        <span className="text-white font-medium hidden sm:inline">
          Otomatisasi Alur Persetujuan Korporat Terenkripsi untuk BUMN, BUMD, & Holding.
        </span>
        <button
          onClick={() => setIsBookingOpen(true)}
          className="underline font-bold text-white hover:text-blue-100 ml-2 transition-colors flex items-center gap-1"
        >
          <span>Diskusi Kebutuhan Operasional</span>
          <ArrowRight className="w-3 h-3 inline" />
        </button>
      </div>

      {/* Minimalist Navigation Bar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-white/95 border-b border-slate-200/80 px-6 sm:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
              <img src="/logo.png" alt="Approva Logo" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Approva<span className="text-[#0078d4]">.ai</span>
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#canvas-hub" className="hover:text-slate-950 transition-colors">Interactive Hub</a>
            <a href="#operational-reality" className="hover:text-slate-950 transition-colors">Tantangan Nyata</a>
            <a href="#cases" className="hover:text-slate-950 transition-colors">Kasus Penggunaan</a>
            <a href="#comparison" className="hover:text-slate-950 transition-colors">Evolusi</a>
            <a href="#pricing" className="hover:text-slate-950 transition-colors">Lisensi Beli Putus</a>
          </div>

          <div className="flex items-center gap-3">
            {userInfo ? (
              <button
                onClick={() => navigate("/home")}
                className="px-4 py-2 text-xs font-bold text-[#0078d4] hover:text-blue-800 transition-colors border border-blue-200 rounded-xl bg-blue-50 shadow-sm"
              >
                Dashboard Utama
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#0078d4] hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/10 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwalkan Konsultasi</span>
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO & FULL-WIDTH INTERACTIVE CANVAS HUB */}
      <section id="canvas-hub" className="relative pt-16 pb-24 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-sm font-sans text-xs text-[#0078d4]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0078d4] animate-pulse"></span>
            <span className="font-bold">INTERACTIVE WORKSPACE CANVAS HUB</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
            Build enterprise{" "}
            <span className="bg-gradient-to-r from-[#0078d4] to-indigo-600 bg-clip-text text-transparent">
              approval workflows
            </span>{" "}
            for the AI era
          </h1>

          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Otomatisasi form dinamis & alur otorisasi internal grup korporasi. Lisensi Beli Putus selamanya, di-host On-Premise 100% aman di server VPS mandiri perusahaan Anda.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0078d4] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
            >
              Set Up a Demo
            </button>
            <a
              href="#cases"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-sm shadow-sm flex items-center justify-center gap-2.5 transition-all"
            >
              <span>Lihat Skenario Penggunaan</span>
            </a>
          </div>
        </div>

        {/* FULL-WIDTH INTERACTIVE WORKSPACE CANVAS HUB CONTAINER */}
        <div className="w-full max-w-6xl rounded-3xl border border-slate-300/80 bg-white p-3.5 shadow-[0_30px_70px_rgba(0,0,0,0.08)] text-left relative z-10">
          
          {/* Canvas Window Header Bar & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-slate-200 bg-slate-50/90 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="ml-2 font-mono text-xs text-slate-700 font-bold">Approva Live Interactive Canvas Hub</span>
            </div>

            {/* Interactive Tab Switcher */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setCanvasTab("simulator")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  canvasTab === "simulator" ? "bg-white text-[#0078d4] shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                1. Node Simulator
              </button>
              <button
                onClick={() => setCanvasTab("blueprint")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  canvasTab === "blueprint" ? "bg-white text-[#0078d4] shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                2. Visual Blueprint
              </button>
              <button
                onClick={() => setCanvasTab("form")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  canvasTab === "form" ? "bg-white text-[#0078d4] shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                3. Live E-Form
              </button>
              <button
                onClick={() => setCanvasTab("multitenant")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  canvasTab === "multitenant" ? "bg-white text-[#0078d4] shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                4. Multi-Tenant Console
              </button>
            </div>
          </div>

          {/* Canvas Hub Body */}
          <div className="p-6 sm:p-8 bg-slate-50/40 rounded-b-2xl min-h-[360px] flex flex-col justify-between space-y-6">
            
            {/* Tab 1: Live Interactive Node Simulator */}
            {canvasTab === "simulator" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">Instansi Permohonan #WF-2026-99</span>
                    <h3 className="font-bold text-slate-900 text-sm">Pengadaan Hardware Server & Lisensi Database Office</h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 w-fit">
                    SLA Status: 1.5 Hours Elapsed
                  </span>
                </div>

                {/* Node Diagram Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 1 ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono font-bold text-amber-700 block mb-1">STAGE 1: SUBMIT</span>
                    <div className="font-bold text-slate-900">Requestor (IT Staff)</div>
                    <div className="text-[11px] text-slate-500">Irfan Hakim</div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 2 ? 'bg-cyan-50 border-cyan-300 ring-2 ring-cyan-400' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono font-bold text-cyan-700 block mb-1">STAGE 2: REVIEW</span>
                    <div className="font-bold text-slate-900">Department Lock</div>
                    <div className="text-[11px] text-slate-500">Head of IT (Approved)</div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 3 ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono font-bold text-indigo-700 block mb-1">STAGE 3: JUMP LOGIC</span>
                    <div className="font-bold text-slate-900">VP Operations</div>
                    <div className="text-[11px] text-slate-500">Nominal &gt; 15M (Triggered)</div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-all ${simulatedStage === 4 ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400' : 'bg-white border-slate-200'}`}>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 block mb-1">STAGE 4: COMPLETED</span>
                    <div className="font-bold text-slate-900">Immutable Log</div>
                    <div className="text-[11px] text-slate-500">Audit Trail Recorded</div>
                  </div>
                </div>

                {/* Interactive Action Bar & Console Output */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Execution Output Log:</span>
                    <p className="font-mono text-xs font-bold text-slate-800">{simulatedConsoleLog}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleSimulateApprove}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" /> Simulasikan Approve (WA)
                    </button>
                    <button
                      onClick={handleSimulateRollback}
                      className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" /> Uji Rollback Stage
                    </button>
                    <button
                      onClick={handleSimulateJump}
                      className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                    >
                      <Zap className="w-4 h-4" /> Uji Jump Logic
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Visual Blueprint Diagram Image */}
            {canvasTab === "blueprint" && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Visual Workflow Blueprint Diagram</h4>
                    <p className="text-slate-500 text-[11px]">Skema arsitektur logika node persetujuan dan pengambilan keputusan otomatis.</p>
                  </div>
                  <span className="text-xs font-mono text-[#0078d4] bg-blue-50 px-2.5 py-0.5 rounded font-semibold border border-blue-200">
                    High Resolution Blueprint
                  </span>
                </div>
                <div className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md max-h-[400px] bg-white flex items-center justify-center">
                  <img
                    src="/interactive_workflow_hub.png"
                    alt="Workflow Architecture Blueprint"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* Tab 3: Live E-Form Builder */}
            {canvasTab === "form" && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">Dynamic E-Form Builder Input Preview</h4>
                  <span className="text-slate-500">15+ Tipe Input Khusus Korporasi</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <label className="font-bold text-slate-700 block">Currency Cost Input (Rupiah Formatted)</label>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 font-mono font-bold text-sm">
                      Rp 85.000.000
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <label className="font-bold text-slate-700 block">Searchable API Select (ERP Synced)</label>
                    <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-700 flex justify-between items-center">
                      <span>PT Hardware Nusantara Jaya (Code: VND-99)</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Holding Multi-Tenant Console */}
            {canvasTab === "multitenant" && (
              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <h4 className="font-bold text-slate-900 text-sm">Konsol Holding BUMN & Multi-Tenant</h4>
                  <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded">
                    1-Click Switch Organization
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white border border-purple-300 shadow-sm space-y-1">
                    <div className="font-bold text-purple-900">PT Semen Indonesia (Holding)</div>
                    <div className="text-[11px] text-slate-500">Master Tenant • 1.250 Users</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1 opacity-70">
                    <div className="font-bold text-slate-800">PT Solusi Bangun Indonesia</div>
                    <div className="text-[11px] text-slate-500">Anak Perusahaan A</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1 opacity-70">
                    <div className="font-bold text-slate-800">PT Logistik Nusantara</div>
                    <div className="text-[11px] text-slate-500">Anak Perusahaan B</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: OPERATIONAL REALITY (DARK MODE CONTRAST bg-slate-900) */}
      <section id="operational-reality" className="py-24 px-6 sm:px-12 bg-slate-900 text-white rounded-3xl max-w-7xl mx-auto my-12 text-left relative z-10">
        <div className="max-w-3xl space-y-4 mb-16">
          <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-widest px-3 py-1 bg-cyan-950/80 rounded-full border border-cyan-800">
            Perbandingan Operasional
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Merapikan Birokrasi Kerja Kantor Anda
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Menghilangkan kepanikan audit, dokumen terselip, dan kemacetan alur persetujuan saat pejabat berwenang dinas luar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-rose-400 border-b border-rose-950/50 pb-3">Sebelum Approva (Manual & Informal)</h3>
            <ul className="space-y-4 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <p>Persetujuan diberikan via WhatsApp chat personal tanpa log timestamps resmi untuk audit.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <p>Seluruh proses pengadaan terhenti berhari-hari saat direktur sedang dinas luar atau cuti.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold mt-0.5">✕</span>
                <p>Salah input data di tahap akhir memaksa staf membatalkan formulir dan mengulang kembali dari awal.</p>
              </li>
            </ul>
          </div>

          <div className="p-8 rounded-2xl bg-slate-950 border border-emerald-900/40 space-y-6">
            <h3 className="text-lg font-bold text-emerald-400 border-b border-emerald-950/50 pb-3">Dengan Approva (Otomatis & Terstruktur)</h3>
            <ul className="space-y-4 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <p>Immutable Audit Trail merekam setiap aksi persetujuan secara otomatis dan permanen.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <p>Wewenang persetujuan dialihkan secara transparan (Take Over) saat approver sedang berhalangan.</p>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                <p>Fitur Rollback mengembalikan dokumen ke tahapan sebelumnya untuk koreksi tanpa re-submit.</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 3: ASYMMETRIC STICKY CASE SELECTION (MINT LIGHT GREEN bg-[#f4fbf7]) */}
      <section id="cases" className="py-24 px-6 sm:px-12 bg-[#f4fbf7] rounded-3xl max-w-7xl mx-auto my-12 border border-emerald-100 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Left Column: Big Vertical Menu List */}
          <div className="lg:col-span-1 space-y-6 sticky top-28">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">Kasus Penggunaan</span>
              <h2 className="text-3xl font-extrabold text-slate-900">Skenario Lapangan Nyata</h2>
              <p className="text-slate-500 text-xs">Pilih salah satu modul di bawah ini untuk melihat struktur alur kerjanya di samping.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveCase("procurement")}
                className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                  activeCase === "procurement" ? "bg-white border-emerald-300 shadow-sm" : "border-transparent hover:bg-white/50"
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 font-bold">01. CAPEX / OPEX PROCUREMENT</span>
                <span className="font-bold text-sm text-slate-900">Pengadaan Barang & Jasa Kantor</span>
              </button>

              <button
                onClick={() => setActiveCase("reimbursement")}
                className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                  activeCase === "reimbursement" ? "bg-white border-emerald-300 shadow-sm" : "border-transparent hover:bg-white/50"
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 font-bold">02. TRAVEL & CLAIM</span>
                <span className="font-bold text-sm text-slate-900">Reimbursement Perjalanan Dinas</span>
              </button>

              <button
                onClick={() => setActiveCase("directors")}
                className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                  activeCase === "directors" ? "bg-white border-emerald-300 shadow-sm" : "border-transparent hover:bg-white/50"
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 font-bold">03. BOARD SIGN-OFF</span>
                <span className="font-bold text-sm text-slate-900">Otorisasi Dokumen Direksi</span>
              </button>

              <button
                onClick={() => setActiveCase("vendor")}
                className={`py-4 px-5 text-left rounded-xl transition-all border flex flex-col gap-1 ${
                  activeCase === "vendor" ? "bg-white border-emerald-300 shadow-sm" : "border-transparent hover:bg-white/50"
                }`}
              >
                <span className="text-[10px] font-mono text-slate-400 font-bold">04. STRANGER MODE</span>
                <span className="font-bold text-sm text-slate-900">Klaim Pihak Luar & Vendor</span>
              </button>
            </div>
          </div>

          {/* Right Columns: Dynamic Preview Container */}
          <div className="lg:col-span-2 p-8 rounded-2xl border border-slate-200 bg-white shadow-sm min-h-[350px] flex flex-col justify-center text-xs">
            {activeCase === "procurement" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm font-sans">Alur Pengadaan Barang & Jasa</h4>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Jump Logic Enabled</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Vendor: PT Jaya Utama</span>
                    <span>Budget: Rp 65.000.000</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-2 p-3 bg-slate-50 rounded-lg text-[11px] font-semibold text-slate-700">
                    <div>Staff IT (Submit)</div>
                    <span className="text-slate-400">➔</span>
                    <div>Head of IT (Approved)</div>
                    <span className="text-slate-400">➔</span>
                    <div className="text-[#0078d4]">Jump Logic (Nominal &gt; Rp 15M) ➔ Ops Director</div>
                  </div>
                </div>
              </div>
            )}

            {activeCase === "reimbursement" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm font-sans">Reimbursement Perjalanan Dinas</h4>
                  <span className="px-2.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Precise Rollback</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 block">Kuitansi Lampiran Upload</span>
                    <p className="text-slate-500 font-mono text-[10px]">Hotel Receipt Blur / Buram</p>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 font-bold">
                    <span>Reverted to Stage 1 (Draft)</span>
                    <span className="block font-normal text-[10px] mt-1">Note: Mohon perbaiki upload lampiran kuitansi Anda.</span>
                  </div>
                </div>
              </div>
            )}

            {activeCase === "directors" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm font-sans">Otorisasi Dokumen Direksi</h4>
                  <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-800 font-bold">LDAP Integration</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">Direktur Utama: Bpk. Suhartono</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono text-[9px] font-bold">ACTIVE LDAP ROLE</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Autentikasi login tunggal langsung sinkron dengan infrastruktur AD/LDAP server kantor.</p>
                </div>
              </div>
            )}

            {activeCase === "vendor" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm font-sans">Klaim Pihak Luar & Vendor</h4>
                  <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Public Stranger Mode Link</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-mono text-slate-400 text-[10px] block">Public Form Link</span>
                  <div className="font-bold text-[#0078d4]">approva.ai/p/PT-Semen-Indonesia-reimburse</div>
                  <p className="text-[10px] text-slate-500 mt-1">Vendor dapat mengirim berkas tagihan tanpa perlu memiliki akun login sistem internal perusahaan Anda.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: PARADIGM COMPARISON */}
      <section id="comparison" className="py-24 px-6 sm:px-12 border-t border-slate-100 max-w-7xl mx-auto text-left">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Evolusi Solusi Otorisasi</h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Perbandingan model platform approval menuju sweet spot efisiensi bisnis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">01. Form Builder</div>
            <h3 className="text-lg font-bold text-slate-800">Google Forms / Typeform</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mudah membuat formulir, tetapi <strong>tidak memiliki alur persetujuan bertingkat</strong>, hirarki wewenang, maupun log audit resmi.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">02. Workflow SaaS</div>
            <h3 className="text-lg font-bold text-slate-800">Kissflow / Pipefy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memiliki alur kerja fleksibel, namun <strong>biaya berlangganan per-user bulanan sangat mahal</strong> dan data tersimpan di cloud luar negeri.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">03. Enterprise BPM</div>
            <h3 className="text-lg font-bold text-slate-800">ProcessMaker / ServiceNow</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memiliki kapabilitas enterprise, tetapi <strong>sangat rumit, lambat diimplementasikan (&gt;6 bulan)</strong>, dan berbiaya miliaran Rupiah.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-b from-blue-50 via-white to-blue-50 border-2 border-blue-600 shadow-xl space-y-4 relative">
            <div className="text-xs font-mono font-bold text-[#0078d4] uppercase tracking-wider">04. Approva.ai</div>
            <h3 className="text-lg font-extrabold text-slate-900">Approva.ai Enterprise</h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Solusi ideal yang menggabungkan kemudahan Form Builder, fleksibilitas Workflow SaaS, dan kemampuan Enterprise BPM dalam satu platform.
            </p>
          </div>
        </div>

        {/* Strategic Quote Card */}
        <div className="mt-10 p-8 rounded-3xl bg-slate-950 text-white text-center shadow-2xl max-w-4xl mx-auto space-y-4">
          <blockquote className="text-xl sm:text-2xl font-extrabold leading-relaxed text-blue-100 italic ">
            "Approva.ai menggabungkan kemudahan Form Builder, fleksibilitas Workflow SaaS, dan kemampuan Enterprise BPM dalam satu platform yang dapat dimiliki sepenuhnya oleh perusahaan melalui lisensi beli putus."
          </blockquote>
        </div>
      </section>

      {/* SECTION 6: INTERACTIVE ROI CALCULATOR */}
      <section className="py-24 px-6 sm:px-12 border-t border-slate-100 max-w-7xl mx-auto bg-slate-50/50 rounded-3xl my-10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[10px] font-mono uppercase font-bold text-[#0078d4] tracking-widest px-3 py-1 bg-blue-50 rounded-full border border-blue-200 w-fit block">
              ROI & Cost Savings
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">
              Berapa Banyak Jam Kerja Manajerial Yang Terbuang Karena Approval Manual?
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Gunakan kalkulator interaktif ini untuk melihat estimasi penghematan jam kerja manajerial & biaya operasional yang didapatkan setelah beralih ke Approva.ai.
            </p>

            {/* Sliders */}
            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Jumlah Karyawan / User:</span>
                  <span className="text-[#0078d4] font-mono text-base font-bold">{employeeCount} Karyawan</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="5"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0078d4]"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-slate-700">Rata-rata Lama Approval Manual Saat Ini:</span>
                  <span className="text-indigo-700 font-mono text-base font-bold">{avgApprovalTimeDays} Hari Kerja</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  step="1"
                  value={avgApprovalTimeDays}
                  onChange={(e) => setAvgApprovalTimeDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* ROI Result Card */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 space-y-6 text-center shadow-xl">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider block mb-1">
              Potensi Penghematan Per Bulan
            </span>

            <div>
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-700 font-mono">
                Rp {monthlySavingsRp.toLocaleString("id-ID")}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">/ bulan dalam efisiensi jam manajerial</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-left text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Total Pengajuan / Bln:</span>
                <span className="font-bold text-slate-900 text-sm font-mono">{monthlyApprovalCount} Pengajuan</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block mb-1">Jam Kerja Terhemat:</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">{Math.round(monthlyApprovalCount * hoursSavedPerApproval)} Jam</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3.5 rounded-xl bg-[#0078d4] hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2"
            >
              <span>Klaim Efisiensi Ini Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 7: TRANSPARENT B2B PRICING */}
      <section id="pricing" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto text-left">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold text-cyan-700 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200">
            Model Lisensi B2B Corporate (Beli Putus)
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Satu Kali Investasi untuk Kebebasan Penuh</h2>
          <p className="text-slate-600 text-base">
            Tanpa biaya bulanan atau langganan per-user yang membakar anggaran. Lisensi putus untuk satu organisasi selamanya, disesuaikan berdasarkan skala perusahaan.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 relative shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-slate-200 pb-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">Corporate License</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pasang sistem di server internal/private VPS Anda sendiri. Kontrol penuh atas seluruh data perusahaan tanpa ketergantungan pihak ketiga.
              </p>
              <div className="text-4xl font-extrabold text-slate-900 font-mono">
                Rp 45.000.000
                <span className="text-xs font-normal text-cyan-700 block font-sans mt-1">Mulai dari (One-Time License)</span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Penyesuaian Skala Karyawan:</div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200">
                <span className="text-slate-600">SME (30 - 100 karyawan)</span>
                <span className="font-mono text-cyan-700 font-bold">Rp 45jt – Rp 65jt</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200">
                <span className="text-slate-600">Enterprise (100 - 500 karyawan)</span>
                <span className="font-mono text-cyan-700 font-bold">Rp 85jt – Rp 150jt</span>
              </div>
              <div className="flex justify-between items-center text-xs py-1">
                <span className="text-slate-600">Annual Maintenance (Tahun ke-2 dst)</span>
                <span className="font-mono text-emerald-700 font-bold">~10% / tahun (Murah & Opsional)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Fitur Utama Termasuk:</div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Setup Cepat di VPS Anda (Hanya 3 Hari)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Fitur Rollback, Take Over, & Department Lock</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Integrasi Notifikasi WhatsApp & Email Instan</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Active Directory / LDAP & Switch Org Instan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Form Dinamis & Logika Lompatan Alur (JumpTo)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center gap-3">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 text-center"
            >
              Minta Penawaran Lisensi Perusahaan Anda
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA */}
      <section className="py-20 px-6 sm:px-12 max-w-7xl mx-auto bg-gradient-to-r from-[#0078d4] via-indigo-700 to-blue-800 text-white rounded-3xl my-10 shadow-2xl text-center space-y-6 relative z-10">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
          Transformasikan Alur Kerja Persetujuan Perusahaan Anda Hari Ini.
        </h2>
        <p className="text-blue-100 text-sm max-w-xl mx-auto font-normal">
          Dapatkan simulasi demonstrasi 1-on-1 khusus disesuaikan dengan studi kasus industri perusahaan Anda dalam 15 menit.
        </p>
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-8 py-4 rounded-xl bg-white text-slate-900 hover:bg-slate-50 font-extrabold text-sm shadow-xl transition-all flex items-center gap-3 transform hover:scale-105"
          >
            <Calendar className="w-5 h-5 text-[#0078d4]" />
            <span>Jadwalkan Sesi Konsultasi 1-on-1</span>
            <ArrowRight className="w-5 h-5 text-[#0078d4]" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12 px-6 sm:px-12 text-xs text-slate-500 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Approva Logo" className="w-6 h-6 object-contain" />
          <span className="font-bold text-slate-800 text-sm">Approva.ai</span>
          <span>© 2026 Enterprise Dynamic E-Form & Approval Control Platform.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-500">Privacy Policy</a>
          <a href="#" className="hover:text-slate-500">Terms of License</a>
          <a href="#" className="hover:text-slate-500">Security Whitepaper</a>
        </div>
      </footer>

      {/* Lead Qualification & Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn text-left">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-900">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0078d4] text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5" /> Direct 1-on-1 Consultation Booking
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Jadwalkan Konsultasi Approva.ai</h3>
                  <p className="text-slate-500 text-xs">
                    Isi kualifikasi singkat ini agar tim konsultan solusi bisnis kami menyiapkan simulasi yang tepat sesuai industri perusahaan Anda.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Perusahaan / Organisasi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: PT Bangun Jaya Utama (Persero)"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Jumlah Karyawan *</label>
                      <select
                        value={formData.employeeCount}
                        onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600"
                      >
                        <option value="<30">&lt; 30 Karyawan</option>
                        <option value="30-100">30 - 100 Karyawan</option>
                        <option value="100-500">100 - 500 Karyawan</option>
                        <option value=">500">&gt; 500 Karyawan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Jabatan Anda *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600"
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
                    <label className="block text-slate-700 font-semibold mb-1">Email Kantor (Corporate Email) *</label>
                    <input
                      type="email"
                      required
                      placeholder="nama@perusahaan.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nomor WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-cyan-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0078d4] hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 mt-4"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lanjutkan Pilih Jadwal Demo</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="py-8 text-center space-y-4 font-sans">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-300">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Sesi Konsultasi Berhasil Di-Booking!</h3>
                <p className="text-slate-500 text-xs max-w-sm mx-auto">
                  Terima kasih <strong>{formData.companyName}</strong>. Undangan meeting & kalender sesi 15 menit telah dikirimkan ke <strong>{formData.email}</strong>. Tim solusi kami akan menghubungi Anda via WhatsApp.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsBookingOpen(false);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors mt-4"
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
