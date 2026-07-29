import React from "react";
import {
  Package,
  History,
  Crown,
  CheckCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { APP_DESC, APP_NAME } from "@/api/constant";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import flowInstanceApi from "@/api/flowInstanceApi";
import OrgApi from "@/api/orgApi";
import { switchOrg } from "@/api/authApi";
import toast from "react-hot-toast";
import MyStats from "@/components/My-Stats";
import { motion, AnimatePresence } from "motion/react";

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

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  const { data: orgList } = useQuery({
    queryKey: ["orgList"],
    queryFn: () => OrgApi.getAllOrg("*"),
    enabled: !!userInfo._id,
  });

  const { mutateAsync: handleSwitchOrg, isPending: switching } = useMutation({
    mutationKey: ["userInfo"],
    mutationFn: async (id) => switchOrg({ targetOrg: id }),
    onSuccess: async () => {
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Terjadi kesalahan");
    },
  });

  const quickActions = [
    {
      title: "New Request",
      description: "Meminta request dengan kategory flow yang telah dibuat",
      icon: <Package className="w-5 h-5" />,
      baseColor: "cyan",
      path: "/request",
    },
    {
      title: "Semua Request In-Progress",
      description: "Lihat semua request yang sedang berjalan dan histori",
      icon: <History className="w-5 h-5" />,
      baseColor: "emerald",
      path: "/process?overallStatus=in-progress",
    },
  ];

  const { data: myTasksQuery, isLoading } = useQuery({
    queryKey: ["myTasks"],
    queryFn: flowInstanceApi.getMyTasks,
  });

  if (switching) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#07090e]">
        <div className="relative">
          <span className="animate-spin absolute -inset-4 border-2 border-transparent border-t-cyan-500 rounded-full" />
          <span className="animate-pulse w-8 h-8 rounded-full bg-cyan-500/20 block" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-20 min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 bg-[#07090e] font-sans">
      <AnimatedBackground />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="mb-10 text-center relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-cyan-500/20 rounded-full filter blur-3xl pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-slate-900/60 border border-slate-700/60 rounded-full shadow-lg backdrop-blur-xl group"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse group-hover:text-cyan-300 transition-colors" />
            <span className="text-xs font-bold text-slate-300 tracking-wider uppercase group-hover:text-white transition-colors">
              {APP_NAME} Platform
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white"
          >
            E-Form{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400">
              {
                orgList?.data?.find((org) => org._id === userInfo.org)
                  ?.organizationName || "Management"
              }
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl mx-auto font-medium text-sm leading-relaxed"
          >
            {APP_DESC}
          </motion.p>
        </div>

        <MyStats />
        
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2.5">
            <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
            Aksi Cepat
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Owner action */}
            <motion.button
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => navigate("/management/flow")}
              className="p-6 rounded-3xl border border-white/5 bg-slate-900/60 backdrop-blur-2xl hover:border-amber-400/50 hover:bg-slate-900/80 transition-all duration-300 text-left shadow-[0_8px_30px_rgba(0,0,0,0.4)] group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl group-hover:bg-amber-500/20 group-hover:text-amber-300 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors">
                    Organization Owner
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-3">
                    {userInfo?.displayName || userInfo?.username}
                  </p>
                  <span className="inline-flex items-center text-[10px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 uppercase tracking-widest">
                    Owner Control Panel
                  </span>
                </div>
              </div>
            </motion.button>

            {quickActions.map((action, index) => {
              const hoverBorder = action.baseColor === 'cyan' ? 'hover:border-cyan-400/50' : 'hover:border-emerald-400/50';
              const gradientTo = action.baseColor === 'cyan' ? 'to-cyan-500/5' : 'to-emerald-500/5';
              const iconBg = action.baseColor === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
              const titleHover = action.baseColor === 'cyan' ? 'group-hover:text-cyan-400' : 'group-hover:text-emerald-400';

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(action.path)}
                  className={`p-6 rounded-3xl border border-white/5 bg-slate-900/60 backdrop-blur-2xl hover:bg-slate-900/80 ${hoverBorder} transition-all duration-300 text-left shadow-[0_8px_30px_rgba(0,0,0,0.4)] group overflow-hidden relative`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent ${gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`p-3.5 rounded-2xl border transition-all duration-300 ${iconBg}`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-white text-base mb-1 transition-colors ${titleHover}`}>
                        {action.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* My Tasks Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <div className="w-1.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                Tugas Untuk Anda
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-1">
                Daftar permintaan yang membutuhkan persetujuan Anda
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-cyan-950/40 border border-cyan-500/30 px-4 py-2.5 rounded-2xl shadow-inner backdrop-blur-md">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </div>
                <span className="text-xs font-bold text-cyan-300 tracking-wide">
                  {myTasksQuery?.data?.length || 0} PENDING APPROVAL
                </span>
              </div>

              <div className="relative group w-full sm:w-72">
                <select
                  onChange={(e) => handleSwitchOrg(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-slate-700/80 rounded-2xl bg-slate-900/80 backdrop-blur-xl focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 focus:outline-none transition-all duration-300 shadow-inner font-semibold text-white appearance-none cursor-pointer text-sm"
                >
                  {orgList?.data?.map((org) => (
                    <option
                      selected={org._id === userInfo?.org}
                      key={org._id}
                      value={org._id}
                      className="bg-slate-900 text-white"
                    >
                      {org?.organizationName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
                <span className="absolute left-4 -top-2.5 px-2 text-[10px] font-bold bg-slate-900 border border-slate-700 rounded-md text-cyan-400 uppercase tracking-widest shadow-sm">
                  Organisasi
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid place-items-center h-64 rounded-3xl bg-slate-900/50 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="flex flex-col items-center gap-4">
                <span className="animate-spin h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                <span className="text-xs font-bold tracking-widest text-cyan-400 uppercase">Mengambil Data...</span>
              </div>
            </div>
          ) : !myTasksQuery?.data?.length ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-16 bg-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-900/10 pointer-events-none" />
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-10">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="font-black text-white text-2xl mb-2 relative z-10">Sistem Bersih</h3>
              <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto relative z-10">
                Tidak ada tugas yang menunggu persetujuan Anda saat ini. Anda dapat bersantai.
              </p>
            </motion.div>
          ) : (
            <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden relative">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800">
                      <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Tanggal</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Permintaan</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Requestor</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Index</th>
                      <th className="px-6 py-5 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest">Template</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    <AnimatePresence>
                      {myTasksQuery.data.map((task, idx) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={task._id}
                          onClick={() => navigate(`/status/fulfillment/${task._id}`)}
                          className="hover:bg-cyan-950/30 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            <p className="text-xs font-bold text-white group-hover:text-cyan-100 transition-colors">
                              {new Date(task.createdAt).toLocaleString("id-ID", {
                                day: "numeric",
                                month: "short",
                              })}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5 font-mono">
                              {new Date(task.createdAt).toLocaleString("id-ID", {
                                timeStyle: "short",
                              })}
                            </p>
                          </td>
                          <td className="px-6 py-5 max-w-xs">
                            <p className="font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                              {task.instanceTitle || "Untitled Request"}
                            </p>
                            <p className="text-xs text-slate-500 font-medium truncate mt-1">
                              {task.flowTemplate?.title}
                            </p>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                              {task.currentStatusTitle}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                            {task.requestedByUsername}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-slate-400 font-mono group-hover:text-cyan-300 transition-colors">
                            {task.globalIndex}
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                            {task.flowTemplateTitle}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);