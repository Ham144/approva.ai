import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  User,
  Settings,
  LogOut,
  KeyRound,
  Info,
  Hotel,
  EyeClosed,
  Eye,
  ShieldCheck,
  Activity,
  Calendar,
  Database,
  Users,
  GitMerge,
  Crown
} from "lucide-react";
import { ErrorIcon, toast, Toaster } from "react-hot-toast";
import { useUserInfo } from "@/store";
import { logout, resetPassword } from "@/api/authApi";
import OrgApi from "@/api/orgApi";
import { IconLockPassword } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

const ManagementButton = () => {
  const managementMenus = [
    {
      title: "Source Data Options",
      description: "Manajemen untuk tiap source data select/options yang telah dibuat.",
      icon: <Database className="w-6 h-6" />,
      color: "cyan",
      url: "/management/sourceData/options",
    },
    {
      title: "User Management",
      description: "Melihat dan mengelola daftar pengguna aplikasi ini.",
      icon: <Users className="w-6 h-6" />,
      color: "emerald",
      url: "/management/user",
    },
    {
      title: "Flow Template Config",
      description: "Manajemen untuk melihat dan mengedit desain alur.",
      icon: <GitMerge className="w-6 h-6" />,
      color: "purple",
      url: "/management/flow",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {managementMenus.map((menu, index) => {
        const hoverColor = 
          menu.color === 'cyan' ? 'hover:border-cyan-500/50 hover:bg-cyan-900/20' :
          menu.color === 'emerald' ? 'hover:border-emerald-500/50 hover:bg-emerald-900/20' :
          'hover:border-cyan-500/50 hover:bg-cyan-900/20';
          
        const iconColor = 
          menu.color === 'cyan' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' :
          menu.color === 'emerald' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
          'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';

        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => navigate(menu.url)}
            className={`p-6 text-left rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${hoverColor} transition-all duration-300 group overflow-hidden relative`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className={`inline-flex p-3 rounded-2xl border mb-4 shadow-inner transition-colors ${iconColor}`}>
                {menu.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400">
                {menu.title}
              </h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">
                {menu.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, clearUserInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const { data: myOrg } = useQuery({
    queryKey: ["org"],
    queryFn: async () => {
      const res = await OrgApi.getMyOrg(userInfo?.org);
      return res?.data;
    },
    enabled: !!userInfo?.org,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [activeTab, setActiveTab] = useState("profile");

  const { mutate: handleLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUserInfo();
      queryClient.clear();
      navigate("/login");
      toast.success("Berhasil logout.");
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Gagal logout.";
      toast.error(errorMessage);
    },
  });

  const { mutateAsync: handlePasswordReset, isPending: isReseting } =
    useMutation({
      mutationKey: ["auth"],
      mutationFn: async () => {
        if (validateForm(newPassword)) {
          const res = await resetPassword({
            oldPassword,
            newPassword,
          });
          return res?.data;
        }
      },
      onSuccess: () => {
        toast.success("Password berhasil diperbarui");
        window.location.reload();
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || "Gagal reset.";
        toast.error(errorMessage);
      },
    });

  const validateForm = (newPassword) => {
    setPasswordError("");
    if (!newPassword) {
      setPasswordError("Password baru diperlukan.");
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const isLongEnough = newPassword.length >= 6;

    if (!isLongEnough) {
      setPasswordError("Minimal 6 karakter.");
      return false;
    }
    if (!hasUpperCase) {
      setPasswordError("Harus memiliki huruf besar.");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("Harus memiliki angka.");
      return false;
    }
    return true;
  };

  useEffect(() => {
    setPasswordError("");
    if (newPassword?.length) {
      validateForm(newPassword);
    }
  }, [newPassword]);

  const tabs = [
    { id: "profile", label: "Executive Profile", icon: <User className="w-4 h-4" /> },
    { id: "settings", label: "System Management", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-white pb-24 relative z-10 selection:bg-cyan-500/30 font-sans">
      <Toaster 
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }} 
      />

      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-3xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-white/5 w-full sm:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold
                  transition-all duration-300 flex-1 sm:flex-initial relative
                  ${activeTab === tab.id
                      ? "text-cyan-300 shadow-md bg-white/5"
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="profileTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl" 
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (window.confirm("Apakah Anda yakin ingin mengakhiri sesi ini?")) {
                handleLogout();
              }
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)] w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" />
            <span>Akhiri Sesi</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto relative z-10 mt-4">
        


        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                Identitas Kredensial
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username Card */}
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/10 group relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-500">Nama Pengguna</h4>
                      <p className="text-xl font-bold text-white mt-1 break-words">
                        {userInfo?.displayName || userInfo?.username || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organization Card */}
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/10 group relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-500" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-500">Organisasi Induk</h4>
                      <p className="text-xl font-bold text-white mt-1 break-words">
                        {myOrg?.organizationName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Role Card */}
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/10 group relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-500">Tingkat Akses (Role)</h4>
                      <p className="text-xl font-bold text-white mt-1 capitalize">
                        {userInfo?.role || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Department Card */}
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-white/10 group relative overflow-hidden">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
                      <Hotel className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-500">Departemen</h4>
                      <p className="text-xl font-bold text-white mt-1 capitalize">
                        {userInfo?.department?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Reset Password Action */}
                <div className={`${userInfo.authMethod !== "app" && "hidden"} md:col-span-2 bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-300">
                      <IconLockPassword className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Keamanan Kredensial</h4>
                      <p className="text-sm font-medium text-slate-400 mt-1">Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setNewPassword("");
                      document.getElementById("reset-password-modal").showModal();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 text-white font-bold rounded-xl transition-all shadow-md group"
                  >
                    Ubah Kata Sandi <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-indigo-600 rounded-full" />
                Sistem Manajemen
              </h2>
              
              {userInfo?.role === "owner" ? (
                <ManagementButton />
              ) : (
                <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl p-10 border border-white/10 text-center shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                  <div className="inline-flex p-4 bg-slate-800/50 border border-white/5 rounded-3xl text-slate-500 mb-4 shadow-inner">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Akses Terbatas</h4>
                  <p className="text-slate-400 font-medium max-w-md mx-auto">
                    Panel manajemen sistem hanya tersedia untuk role <span className="text-amber-400 font-bold uppercase tracking-wider">Owner</span>. Hak akses Anda saat ini adalah <span className="text-cyan-400 font-bold capitalize">{userInfo?.role}</span>.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Reset Password Modal */}
      <dialog id="reset-password-modal" className="modal backdrop-blur-md bg-[#07090e]/80 transition-all duration-300">
        <div className="modal-box w-11/12 max-w-md bg-slate-900/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <IconLockPassword className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-2xl text-white">Reset Password</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">
                Tingkatkan keamanan kredensial Anda.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Current Password */}
            <div className="form-control">
              <label className="label pb-1.5 px-1">
                <span className="label-text text-xs font-bold uppercase tracking-widest text-slate-500">Password Lama</span>
              </label>
              <input
                type="password"
                placeholder="Masukkan sandi saat ini"
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            {/* New Password */}
            <div className="form-control">
              <label className="label pb-1.5 px-1">
                <span className="label-text text-xs font-bold uppercase tracking-widest text-slate-500">Password Baru</span>
              </label>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Kombinasi huruf besar & angka (Min 6)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-4 pr-12 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!isPasswordVisible)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                >
                  {isPasswordVisible ? <Eye className="w-5 h-5" /> : <EyeClosed className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-xs font-bold text-red-400 flex items-center bg-red-500/10 border border-red-500/20 py-1.5 px-2 rounded-lg">
                  <ErrorIcon className="w-3 h-3 mr-1.5" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label pb-1.5 px-1">
                <span className="label-text text-xs font-bold uppercase tracking-widest text-slate-500">Konfirmasi Password</span>
              </label>
              <input
                type="password"
                placeholder="Ketik ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                autoComplete="new-password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-2 text-xs font-bold text-red-400 flex items-center bg-red-500/10 border border-red-500/20 py-1.5 px-2 rounded-lg">
                  <ErrorIcon className="w-3 h-3 mr-1.5" />
                  Sandi tidak cocok
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <form method="dialog" className="flex-1">
              <button className="w-full px-4 py-3.5 rounded-xl font-bold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
                Batal
              </button>
            </form>
            <button
              onClick={handlePasswordReset}
              disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="flex-1 px-4 py-3.5 rounded-xl font-bold text-slate-900 bg-cyan-400 border border-cyan-300 hover:bg-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isReseting ? (
                <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin inline-block align-middle"></span>
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default">close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Profile;
