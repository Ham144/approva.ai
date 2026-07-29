import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import flowApi from "@/api/flowApi";
import ModalOption from "@/components/ModalOption";
import FlowStatusModal from "@/components/StatusPreviewModal";
import toast from "react-hot-toast";
import { Search, Info, Grid, List, Activity, LayoutGrid, Sparkles, KeyRound, Eye, Share2, ShieldCheck, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const initialFilterRequestPage = {
  forMe: true,
};

export default function RequestPage() {
  const [searchKey, setSearchKey] = useState("");
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [filter, setFilter] = useState(initialFilterRequestPage);
  const [columns, setColumns] = useState(3);

  const { data: flowList, isLoading } = useQuery({
    queryKey: ["flows", searchKey],
    queryFn: () => flowApi.getAllFlowNameAndDescForRequest(searchKey, filter),
  });

  const closeStatusModal = () => {
    setSelectedFlow(null);
  };

  const handleCopyLink = (e, flowId) => {
    e.stopPropagation();

    if (!flowId) {
      toast.error("ID tidak ditemukan!");
      return;
    }

    const textToCopy = `${window.location.origin}/request/create/${flowId}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => toast.success("Link berhasil disalin!"))
        .catch(() => toast.error("Gagal menyalin link!"));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          toast.success("Link berhasil disalin! (via fallback)");
        } else {
          toast.error("Gagal menyalin link!");
        }
      } catch (err) {
        toast.error("Browser tidak mendukung fitur salin!");
      }

      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 relative z-10 text-white pb-32">
      {/* Header Section */}
      <div className="mb-10 text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-slate-900/60 border border-emerald-500/30 rounded-full shadow-lg backdrop-blur-xl group"
        >
          <Activity className="w-4 h-4 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
          <span className="text-xs font-bold text-slate-300 tracking-wider uppercase group-hover:text-white transition-colors">
            Request Center
          </span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-black tracking-tight mb-3"
        >
          Pusat <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">Permintaan</span>
        </motion.h1>
      </div>

      {/* Area Pencarian */}
      <div className="relative mb-6 max-w-4xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50" />
        <div className="relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.5)] group transition-all duration-300 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Search className="w-6 h-6 text-slate-400 ml-5 group-focus-within:text-emerald-400 transition-colors" />
          <input
            type="text"
            placeholder="Cari alur berdasarkan judul atau deskripsi..."
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="w-full bg-transparent border-none text-white px-5 py-4 focus:ring-0 placeholder-slate-500 font-medium text-lg outline-none"
          />
        </div>
      </div>

      {/* Alert Informatif */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-blue-600/5 border border-indigo-500/20 p-5 rounded-2xl mb-8 shadow-inner max-w-4xl mx-auto flex items-start gap-4">
        <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-400 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-indigo-300 text-sm tracking-wide">Pusat Alur Sistem</p>
          <p className="text-sm mt-1 text-slate-400 font-medium">
            Jelajahi dan ajukan permintaan dari daftar alur yang tersedia. Hak akses disesuaikan dengan konfigurasi organisasi Anda.
          </p>
        </div>
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-col sm:flex-row mb-6 items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 w-full sm:w-auto">
          <button
            onClick={() => setFilter({ forMe: true })}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              filter.forMe
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Untuk Saya
          </button>
          <button
            onClick={() => setFilter({ forMe: false })}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              !filter.forMe
                ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Semua Alur
          </button>
        </div>

        <div className="inline-flex p-1 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10">
          {[
            { id: 1, icon: <List className="w-4 h-4" />, label: "List" },
            { id: 2, icon: <Grid className="w-4 h-4" />, label: "Grid" },
            { id: 3, icon: <LayoutGrid className="w-4 h-4" />, label: "Dense" }
          ].map((col) => (
            <button
              key={col.id}
              onClick={() => setColumns(col.id)}
              className={`relative px-4 py-2.5 flex items-center gap-2 text-sm font-bold transition-all duration-300 rounded-lg ${
                columns === col.id
                  ? "text-white bg-white/10 shadow-md"
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              }`}
              title={`${col.label} View`}
            >
              {col.icon}
              <span className="hidden md:inline">{col.label}</span>
              {columns === col.id && (
                <span className="absolute inset-x-2 -bottom-1 h-0.5 bg-cyan-400 rounded-t-full shadow-[0_-2px_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Flow Grid List */}
      {isLoading ? (
        <div className="grid place-items-center h-64 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4">
            <span className="animate-spin h-10 w-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">Mencari Alur...</span>
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            columns === 1
              ? "grid-cols-1 max-w-4xl mx-auto"
              : columns === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          <AnimatePresence>
            {flowList?.data?.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full p-16 rounded-3xl bg-slate-900/40 border border-white/5 text-center backdrop-blur-xl"
              >
                <div className="inline-flex p-4 bg-slate-800/50 rounded-2xl text-slate-500 mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <p className="text-xl font-black text-white">Tidak Ada Alur Ditemukan</p>
                <p className="text-slate-400 font-medium mt-2">Coba gunakan kata kunci lain atau ubah filter Anda.</p>
              </motion.div>
            ) : (
              flowList?.data?.map((flow, index) => {
                const isAllowance = flow.isAllowanceModeRequest;
                const badgeColor = isAllowance ? "text-blue-400 bg-blue-500/10 border-blue-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
                const iconColor = isAllowance ? "text-blue-400" : "text-emerald-400";
                const hoverBorder = isAllowance ? "hover:border-blue-500/50" : "hover:border-emerald-500/50";
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={flow._id}
                    onClick={() => {
                      setSelectedFlow(flow);
                      document.getElementById("modalactionrequestlist")?.showModal();
                    }}
                    className={`relative bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${hoverBorder} transition-all duration-300 group cursor-pointer overflow-hidden flex flex-col`}
                  >
                    {/* Hover Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${isAllowance ? 'to-blue-600/10' : 'to-emerald-600/10'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative z-10 p-6 flex flex-col h-full">
                      {/* Header Section */}
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className={`p-3 rounded-2xl bg-slate-800/50 border border-white/5 shadow-inner ${iconColor}`}>
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 text-[10px] font-black rounded-lg border uppercase tracking-widest ${badgeColor}`}>
                            {isAllowance ? "Allowance" : "Standard"}
                          </span>
                          <div className="flex items-center text-[11px] font-bold text-slate-400 bg-slate-950/50 px-2.5 py-1 rounded-md border border-white/5">
                            <Activity className="w-3 h-3 mr-1.5" />
                            {flow.status?.length || 0} Step{flow.status?.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1">
                        <h2 className="text-xl font-black text-white leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                          {flow.title}
                        </h2>
                        <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {flow.desc}
                        </p>
                      </div>

                      {/* Department Restrictions */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {isAllowance ? (
                          flow.allowedDepartmentToRequest?.length > 0 ? (
                            flow.allowedDepartmentToRequest.map((f) => (
                              <span key={f._id} className="inline-flex items-center gap-1 bg-slate-800/80 text-slate-300 px-2 py-1 rounded-md border border-white/5 text-[10px] font-bold tracking-wide">
                                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                {f.name}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-800/80 text-slate-300 px-2 py-1 rounded-md border border-white/5 text-[10px] font-bold tracking-wide">
                              <ShieldAlert className="w-3 h-3 text-amber-400" />
                              No Dept Assigned
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-800/80 text-slate-300 px-2 py-1 rounded-md border border-white/5 text-[10px] font-bold tracking-wide">
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            Global Access
                          </span>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 truncate">
                          <KeyRound className="w-3 h-3" />
                          <span className="truncate">
                            {flow?.designedBy?.length === 0
                              ? "SYSTEM"
                              : flow?.designedBy?.map(u => u?.displayName || u?.username).join(", ")}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFlow(flow);
                              document.getElementById("statusmodal")?.showModal();
                            }}
                            className="p-2 bg-slate-800 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors border border-transparent hover:border-indigo-500/30"
                            title="Preview Alur"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleCopyLink(e, flow._id)}
                            className="p-2 bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-colors border border-transparent hover:border-cyan-500/30"
                            title="Copy Stranger Link"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Modals */}
      <FlowStatusModal
        key={"statusmodal"}
        selectedFlow={selectedFlow}
        onClose={closeStatusModal}
      />
      <ModalOption key={"modalactionrequestlist"} selectedFlow={selectedFlow} />
    </div>
  );
}
