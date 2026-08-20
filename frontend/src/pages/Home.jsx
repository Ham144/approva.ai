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
        rotate: [0, 180, 360],
      }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -top-[20%] -left-[10%] w-[850px] h-[850px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent rounded-full filter blur-[120px]"
    />

    <motion.div
      animate={{
        x: [80, -110, 80],
        y: [70, -90, 70],
        scale: [1, 1.3, 0.85, 1],
        rotate: [360, 180, 0],
      }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-[25%] -right-[12%] w-[950px] h-[950px] bg-gradient-to-tl from-teal-400/20 via-sky-600/12 to-transparent rounded-full filter blur-[140px]"
    />

    <motion.div
      animate={{
        x: [-50, 70, -50],
        y: [90, -70, 90],
        scale: [0.85, 1.15, 0.85],
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
            opacity: [0.15, 0.75, 0.15],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
          className="absolute w-1 h-1 bg-cyan-400/40 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
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
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 font-mono text-xs text-zinc-400 gap-3">
        <span className="w-5 h-5 border-2 border-zinc-700 border-t-teal-400 rounded-full animate-spin" />
        <span>SWITCHING TENANT ENVIRONMENT...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased px-4 py-8 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* HEADER SECTION */}
        <div className="border-b border-zinc-800/80 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-wider">
              <span>WORKSPACE // CONSOLE</span>
              <span>/</span>
              <span className="text-teal-400">ACTIVE SESSION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
              E-Form{" "}
              <span className="text-zinc-400 font-normal">
                —{" "}
                {orgList?.data?.find((org) => org._id === userInfo.org)
                  ?.organizationName || "Management"}
              </span>
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed pt-1">
              {APP_DESC}
            </p>
          </div>

          {/* Tenant Switcher */}
          <div className="w-full md:w-64 space-y-1">
            <label className="block text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
              Unit Organisasi
            </label>
            <div className="relative">
              <select
                value={userInfo?.org}
                onChange={(e) => handleSwitchOrg(e.target.value)}
                className="w-full pl-3 pr-8 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 appearance-none cursor-pointer"
              >
                {orgList?.data?.map((org) => (
                  <option
                    key={org._id}
                    value={org._id}
                    className="bg-zinc-900 text-zinc-200"
                  >
                    {org?.organizationName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <MyStats />

        {/* QUICK ACTION CARDS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-teal-400 font-medium uppercase tracking-wider">
              OPERATIONAL ACTIONS
            </span>
            <span className="h-px bg-zinc-800 flex-grow" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Owner Control Action */}
            <button
              onClick={() => navigate("/management/flow")}
              className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-colors text-left space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 group-hover:text-teal-400 transition-colors">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  ADMIN ACCESS
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-teal-400 transition-colors">
                  Organization Owner
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {userInfo?.displayName || userInfo?.username}
                </p>
              </div>
              <div className="pt-2 border-t border-zinc-850">
                <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                  <span>Manage Workflows &amp; Schema</span>
                  <span className="text-zinc-600">→</span>
                </span>
              </div>
            </button>

            {/* Dynamic Quick Actions */}
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 transition-colors text-left space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 group-hover:text-teal-400 transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    SHORTCUT 0{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-teal-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                    {action.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-850">
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <span>Buka Modul</span>
                    <span className="text-zinc-600">→</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MY TASKS / QUEUE TABLE */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-teal-400 font-medium uppercase tracking-wider">
                  APPROVAL QUEUE
                </span>
              </div>
              <h2 className="text-base font-semibold text-zinc-100 mt-0.5">
                Antrean Persetujuan Anda
              </h2>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                PENDING:{" "}
                <strong className="text-teal-400">
                  {myTasksQuery?.data?.length || 0}
                </strong>
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="py-16 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col items-center justify-center gap-2 text-zinc-500 font-mono text-xs">
              <span className="w-5 h-5 border-2 border-zinc-700 border-t-teal-400 rounded-full animate-spin" />
              <span>MEMUAT ANTREAN TUGAS...</span>
            </div>
          ) : !myTasksQuery?.data?.length ? (
            <div className="py-16 rounded-xl bg-zinc-900/40 border border-zinc-800 text-center space-y-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-teal-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-semibold text-zinc-200">
                Antrean Bersih
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Tidak ada dokumen yang memerlukan otorisasi persetujuan Anda
                saat ini.
              </p>
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-zinc-950 text-zinc-400 font-mono uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Tanggal Dibuat</th>
                      <th className="py-3 px-4">Permintaan / Perihal</th>
                      <th className="py-3 px-4">Tahapan Status</th>
                      <th className="py-3 px-4">Pemohon</th>
                      <th className="py-3 px-4">Index Ref</th>
                      <th className="py-3 px-4">Template Flow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-sans">
                    {myTasksQuery.data.map((task) => (
                      <tr
                        key={task._id}
                        onClick={() =>
                          navigate(`/status/fulfillment/${task._id}`)
                        }
                        className="hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                          <div>
                            {new Date(task.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-600">
                            {new Date(task.createdAt).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-medium text-zinc-200 truncate">
                            {task.instanceTitle || "Untitled Request"}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {task.flowTemplate?.title || "-"}
                          </p>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-800 border border-zinc-700 text-teal-400">
                            {task.currentStatusTitle || "Pending Review"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-zinc-300 whitespace-nowrap">
                          {task.requestedByUsername || "Stranger"}
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-400 whitespace-nowrap">
                          {task.globalIndex || "-"}
                        </td>

                        <td className="py-3 px-4 text-zinc-400 whitespace-nowrap">
                          {task.flowTemplateTitle || "-"}
                        </td>
                      </tr>
                    ))}
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
