import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApp, loginLdap, checkUsername } from "@/api/authApi";
import { useNavigate } from "react-router";
import { useUserInfo } from "@/store";
import { APP_DESC, APP_NAME } from "@/api/constant";
import { motion, AnimatePresence } from "motion/react";
import { 
  Eye, EyeOff, AlertCircle, ArrowLeft, Info, CheckCircle2, 
  ShieldCheck, Zap, User, Lock, Sparkles, Building2, ArrowRight,
  Shield, Check, Fingerprint, Cpu
} from "lucide-react";

const AnimatedBackground = () => (
  <div className="absolute inset-0 overflow-hidden bg-[#07090e] pointer-events-none z-0">
    {/* Sub-pixel Isometric Cyber Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf80c_1px,transparent_1px),linear-gradient(to_bottom,#38bdf80c_1px,transparent_1px)] bg-[size:36px_36px] opacity-80" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e]/60" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#07090e_80%)]" />
    
    {/* Deep Atmospheric Lighting Orbs */}
    <motion.div
      animate={{
        x: [-80, 90, -80],
        y: [-60, 80, -60],
        scale: [1, 1.25, 0.9, 1],
        rotate: [0, 180, 360]
      }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[20%] -left-[10%] w-[850px] h-[850px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent rounded-full filter blur-[120px]"
    />
    
    <motion.div
      animate={{
        x: [80, -110, 80],
        y: [70, -90, 70],
        scale: [1, 1.3, 0.85, 1],
        rotate: [360, 180, 0]
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-[25%] -right-[12%] w-[950px] h-[950px] bg-gradient-to-tl from-teal-400/20 via-sky-600/12 to-transparent rounded-full filter blur-[140px]"
    />

    <motion.div
      animate={{
        x: [-50, 70, -50],
        y: [90, -70, 90],
        scale: [0.85, 1.15, 0.85]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[25%] left-[20%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full filter blur-[100px]"
    />

    {/* Floating Cyber Particles */}
    <div className="absolute inset-0">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40 - Math.random() * 60, 0],
            x: [0, (Math.random() - 0.5) * 50, 0],
            opacity: [0.15, 0.75, 0.15]
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-cyan-400/40 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
        />
      ))}
    </div>
  </div>
);

const FeatureBadge = ({ icon, title, desc, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35 + (index * 0.1) }}
    whileHover={{ 
      y: -3, 
      scale: 1.015,
      borderColor: "rgba(56, 189, 248, 0.4)",
    }}
    className="group relative flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:shadow-[0_12px_30px_rgba(6,182,212,0.15)] transition-all duration-300 overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10 p-2.5 bg-gradient-to-br from-cyan-500/20 via-cyan-600/10 to-transparent rounded-xl border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-300 shadow-md shadow-cyan-500/10 shrink-0">
      <div className="text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300">
        {icon}
      </div>
    </div>
    <div className="relative z-10 min-w-0">
      <h4 className="font-bold text-white text-xs tracking-wide group-hover:text-cyan-200 transition-colors">
        {title}
      </h4>
      <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 group-hover:text-slate-300 transition-colors truncate">
        {desc}
      </p>
    </div>
  </motion.div>
);

export default function Login({ className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // Step 1: Username, Step 2: Password & Org
  const [showPassword, setShowPassword] = useState(false);
  
  // Organization States
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  
  // UI States
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUserInfo } = useUserInfo();

  // LOGIKA PERPINDAHAN STEP 1 -> STEP 2 (Cek Username)
  const { mutateAsync: handleCheckUsername, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const res = await checkUsername({ username });
      return res.data;
    },
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setOrganizations(data);
        setSelectedOrg(data[0]);
        setErrorMsg("");
        setStep(2); 
      } else {
        setErrorMsg("Username tidak ditemukan di sistem kami.");
      }
    },
    onError: (err) => {
      setErrorMsg(err.response?.data?.message || "Terjadi kesalahan saat memeriksa username.");
    }
  });

  // LOGIKA LOGIN AKHIR (Berdasarkan authMethod)
  const handleSuccessLogin = (res) => {
    setUserInfo(res?.data);
    queryClient.invalidateQueries(["userInfo"]);
    navigate("/home");
    setTimeout(() => navigate("/home"), 1000);
  };

  const handleErrorLogin = (err) => {
    setErrorMsg(err?.response?.data?.message || "Login gagal. Periksa kembali kredensial Anda.");
    if (err.response?.status === 403) {
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const { mutateAsync: handleLoginLdap, isPending: isLoggingLdap } = useMutation({
    mutationFn: async () => {
      const res = await loginLdap({
        username,
        password,
        selectedOrg: selectedOrg?.orgId || selectedOrg?._id,
        captchaToken: "", 
      });
      return res.data;
    },
    retryDelay: 1000,
    mutationKey: ["userInfo"],
    onSuccess: handleSuccessLogin,
    onError: handleErrorLogin,
  });

  const { mutateAsync: handleLoginApp, isPending: isLoggingApp } = useMutation({
    mutationFn: async () => {
      const res = await loginApp({
        username,
        password,
        selectedOrg: selectedOrg?.orgId || selectedOrg?._id,
        captchaToken: "",
      });
      return res.data;
    },
    retryDelay: 1000,
    mutationKey: ["userInfo"],
    onSuccess: handleSuccessLogin,
    onError: handleErrorLogin,
  });

  const loginGate = () => {
    setErrorMsg("");
    if (!password) {
      setErrorMsg("Password wajib diisi.");
      return;
    }
    
    if (selectedOrg?.authMethod === "app") {
      handleLoginApp();
    } else {
      handleLoginLdap();
    }
  };

  const isLoggingIn = isLoggingApp || isLoggingLdap;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden font-sans bg-[#07090e]">
      {/* Ambient Moving Cyber Mesh Background */}
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl bg-slate-900/85 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.8),0_0_80px_rgba(6,182,212,0.15)] overflow-hidden"
      >
        {/* Left Side: 3D Graphic & Enterprise Branding Panel (5 Cols) */}
        <div className="relative lg:col-span-5 p-8 lg:p-10 hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-955 text-white border-r border-white/5">
          {/* Subtle Grid and Glow Overlays */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/15 rounded-full filter blur-3xl pointer-events-none" />

          {/* Header & Motto Logo */}
          <div className="relative z-10 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wide backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>SYSTEM OPERATIONAL • 99.99% UPTIME</span>
            </motion.div>

            <div>
              <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400 mb-2">
                {APP_NAME}
              </h1>
              <p className="text-cyan-100/70 text-xs font-medium leading-relaxed max-w-xs">
                {APP_DESC}
              </p>
            </div>
          </div>

          {/* 3D Isometric Workflow Hero Asset Container */}
          <div className="relative z-10 my-4 py-2 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_20px_50px_rgba(6,182,212,0.25)] bg-slate-950/70 backdrop-blur-xl p-1.5 group"
            >
              <img 
                src="/login_light_hero.png" 
                alt="3D Workflow Engine Asset" 
                className="w-full h-auto max-h-[210px] object-cover rounded-xl transition-transform duration-500 group-hover:scale-105 filter brightness-95 contrast-105"
                onError={(e) => {
                  e.target.src = "/login_tech_bg.png";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 tracking-wider uppercase px-3 py-1 rounded-md bg-slate-900/90 border border-cyan-500/40 backdrop-blur-md shadow-lg">
                  <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                  Intelligent Workflow Engine
                </span>
              </div>
            </motion.div>
          </div>

          {/* Feature Badges */}
          <div className="relative z-10 space-y-2.5">
            <FeatureBadge 
              icon={<ShieldCheck className="w-4 h-4" />} 
              title="Multi-Tenant Access Control" 
              desc="Granular division hierarchy & role-based security." 
              index={0}
            />
            <FeatureBadge 
              icon={<Zap className="w-4 h-4" />} 
              title="Automated AD Routing" 
              desc="Real-time Active Directory integration & fast approvals." 
              index={1}
            />
          </div>
        </div>

        {/* Right Side: Clean High-End Dark Glass Panel (7 Cols) */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-slate-900/60 backdrop-blur-2xl">
          <div className="w-full max-w-md mx-auto my-auto">
            {/* Step Navigation Indicator Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20">
                  {step === 1 ? "01" : "02"}
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-cyan-400 uppercase block">Langkah {step} / 02</span>
                  <span className="text-xs font-bold text-white tracking-tight">
                    {step === 1 ? "Identifikasi Akun" : "Verifikasi & Otentikasi"}
                  </span>
                </div>
              </div>
              
              {/* Step Progress Pills */}
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" : "w-2.5 bg-slate-700"}`} />
                <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? "w-8 bg-cyan-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" : "w-2.5 bg-slate-700"}`} />
              </div>
            </div>

            {/* Logo Header */}
            <div className="flex flex-col items-center mb-8 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-3 p-3 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 backdrop-blur-xl shadow-2xl group"
              >
                <div className="absolute inset-0 rounded-2xl bg-cyan-500/20 filter blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src="/approva-motto.png" 
                  alt="Approva Motto Logo" 
                  className="relative z-10 max-h-12 w-auto object-contain filter drop-shadow"
                  onError={(e) => {
                    e.target.src = "/logo-with-background.png";
                  }}
                />
              </motion.div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Enterprise Access Portal</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Sistem Otomatisasi Alur Kerja Kustom & Intelijen Persetujuan</p>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: Username Input */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <form onSubmit={(e) => { e.preventDefault(); handleCheckUsername(); }} className="space-y-5">
                    {/* Error Alert Toast */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-3 shadow-lg backdrop-blur-md">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                            <p className="leading-relaxed">{errorMsg}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Input Username */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Username / User ID
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase())}
                          type="text"
                          placeholder="Masukkan Username Anda"
                          required
                          autoFocus
                          className="w-full pl-12 pr-20 py-4 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white text-sm font-semibold placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 transition-all shadow-inner"
                          disabled={isChecking}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-400 group-focus-within:border-cyan-500/50 group-focus-within:text-cyan-300 transition-all">
                            ↵ ENTER
                          </span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={isChecking || !username}
                      className={`
                        relative overflow-hidden w-full py-4 rounded-2xl font-bold text-white text-sm tracking-wide
                        bg-gradient-to-r from-cyan-500 via-blue-600 to-teal-500
                        hover:from-cyan-400 hover:via-blue-500 hover:to-teal-400
                        shadow-[0_10px_35px_rgba(6,182,212,0.35)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.5)]
                        transition-all duration-300 flex items-center justify-center gap-2.5 group
                        ${(isChecking || !username) ? "opacity-50 cursor-not-allowed shadow-none hover:shadow-none" : ""}
                      `}
                    >
                      {/* Light Sweep Shimmer Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                      
                      {isChecking ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                          <span>Memeriksa Akun...</span>
                        </>
                      ) : (
                        <>
                          <span>Lanjut ke Langkah 2</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* STEP 2: Password & Organization Selector */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-4"
                >
                  {/* Verified Identity Card Header */}
                  <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 shadow-inner">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pengguna Terverifikasi</p>
                        <p className="font-bold text-white text-sm truncate">{username}</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setErrorMsg("");
                        setPassword("");
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 shrink-0"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Ubah</span>
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); loginGate(); }} className="space-y-4">
                    {/* Error Alert */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-start gap-3 shadow-lg backdrop-blur-md">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                            <p className="leading-relaxed">{errorMsg}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Organization Selector */}
                    {organizations.length > 1 && (
                      <div className="space-y-2 pb-1">
                        <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                          Pilih Organisasi Tujuan
                        </label>
                        <div className="grid gap-2 max-h-44 overflow-y-auto pr-1">
                          {organizations.map((org) => {
                            const isSelected = (selectedOrg?.orgId || selectedOrg?._id) === (org.orgId || org._id);
                            return (
                              <motion.div 
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                key={org.orgId || org._id}
                                onClick={() => setSelectedOrg(org)}
                                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between
                                  ${isSelected 
                                    ? 'border-cyan-400 bg-cyan-950/50 shadow-[0_0_20px_rgba(6,182,212,0.2)] text-white' 
                                    : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <Building2 className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                                  <p className="font-bold text-xs">{org.orgName}</p>
                                </div>
                                {isSelected && (
                                  <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                                    <Check className="w-3 h-3 stroke-[3]" />
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Auth Method Info Badge */}
                    {selectedOrg && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs text-slate-300 flex items-center gap-3 font-semibold shadow-inner"
                      >
                        <div className="p-1.5 bg-cyan-500/10 rounded-lg text-cyan-400 shrink-0">
                          <Info className="w-4 h-4" />
                        </div>
                        <span>
                          {selectedOrg.authMethod === 'ldap' 
                            ? "Metode Keamanan: Active Directory (LDAP Enterprise)" 
                            : "Metode Keamanan: Enkripsi Akun Aplikasi Lokal"}
                        </span>
                      </motion.div>
                    )}

                    {/* Password Input */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors pointer-events-none">
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Masukkan Password Anda"
                          required
                          autoFocus
                          className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-950/70 border border-slate-700/80 text-white text-sm font-semibold placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/15 transition-all shadow-inner"
                          disabled={isLoggingIn}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none transition-colors p-1"
                          tabIndex="-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      type="submit"
                      disabled={isLoggingIn || !password}
                      className={`
                        relative overflow-hidden w-full py-4 rounded-2xl font-bold text-white text-sm tracking-wide
                        bg-gradient-to-r from-cyan-500 via-blue-600 to-teal-500
                        hover:from-cyan-400 hover:via-blue-500 hover:to-teal-400
                        shadow-[0_10px_35px_rgba(6,182,212,0.35)] hover:shadow-[0_15px_40px_rgba(6,182,212,0.5)]
                        transition-all duration-300 flex items-center justify-center gap-2.5 mt-2 group
                        ${(isLoggingIn || !password) ? "opacity-50 cursor-not-allowed shadow-none hover:shadow-none" : ""}
                      `}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
                      
                      {isLoggingIn ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                          <span>Memverifikasi Kredensial...</span>
                        </>
                      ) : (
                        <>
                          <span>Masuk ke Dashboard</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>
      </motion.div>
    </div>
  );
}
