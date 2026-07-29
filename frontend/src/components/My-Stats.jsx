import flowInstanceApi from "@/api/flowInstanceApi";
import { useUserInfo } from "@/store";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Activity, TrendingUp, Clock, FileText, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const months = [
  { value: 0, label: "Januari" },
  { value: 1, label: "Februari" },
  { value: 2, label: "Maret" },
  { value: 3, label: "April" },
  { value: 4, label: "Mei" },
  { value: 5, label: "Juni" },
  { value: 6, label: "Juli" },
  { value: 7, label: "Agustus" },
  { value: 8, label: "September" },
  { value: 9, label: "Oktober" },
  { value: 10, label: "November" },
  { value: 11, label: "Desember" },
];

const MyStats = () => {
  const { userInfo } = useUserInfo();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getDateRangeText = () => {
    const monthName = months.find((m) => m.value === selectedMonth)?.label;
    return `${monthName} ${selectedYear}`;
  };

  const { data: myStats, isLoading } = useQuery({
    queryKey: ["myStats", selectedMonth, selectedYear, userInfo],
    queryFn: async () => {
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0); 

      const filter = {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      };

      return flowInstanceApi.getMyStats(filter);
    },
    enabled: !!userInfo,
  });

  const handleMonthSelect = (monthValue) => {
    setSelectedMonth(monthValue);
    setIsDropdownOpen(false);
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="animate-pulse relative z-10">
          <div className="h-6 bg-slate-800 rounded w-48 mb-4 shadow-inner" />
          <div className="h-4 bg-slate-800 rounded w-64 mb-8 shadow-inner" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-[320px] bg-slate-800/50 rounded-2xl border border-white/5" />
            <div className="space-y-4">
              <div className="h-24 bg-slate-800/50 rounded-2xl border border-white/5" />
              <div className="h-24 bg-slate-800/50 rounded-2xl border border-white/5" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-800/50 rounded-2xl border border-white/5" />
                <div className="h-24 bg-slate-800/50 rounded-2xl border border-white/5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!myStats) {
    return (
      <div className="mt-8 bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-8 border border-white/10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-2xl text-slate-500 mb-4">
          <Activity className="w-8 h-8" />
        </div>
        <p className="text-slate-400 font-medium">Tidak ada data statistik tersedia saat ini.</p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Dark Glass Main Container */}
      <div className="mt-8 bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        {/* Subtle inner top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 relative z-20">
          <div className="flex flex-col ">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              Statistik Kinerja Anda
            </h2>
            {myStats.tanggalAktifitasTerakhir && (
              <p className="text-sm text-slate-400 mt-2 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                Terakhir sinkronisasi: {myStats.tanggalAktifitasTerakhir} {myStats.jamAktifitasTerakhir || ""}
              </p>
            )}
          </div>

          {/* Sleek Dark Month Filter */}
          <div className="flex items-center gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md ">
            <button
              onClick={handlePrevMonth}
              className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <div className="relative ">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-5 py-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl hover:bg-cyan-500/20 hover:text-cyan-300 transition-all border border-cyan-500/20 text-sm min-w-[170px] justify-between shadow-[0_0_15px_rgba(6,182,212,0.15)] "
              >
                <Calendar className="w-4 h-4 opacity-80" />
                <span className="font-bold tracking-wide">{getDateRangeText()}</span>
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-56 bg-slate-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-700/80 p-3 z-50 backdrop-blur-xl"
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      {months.map((month) => (
                        <button
                          key={month.value}
                          onClick={() => handleMonthSelect(month.value)}
                          className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                            selectedMonth === month.value
                              ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                              : "text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {month.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Tahun</label>
                      <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) =>
                          setSelectedYear(parseInt(e.target.value) || currentYear)
                        }
                        className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 text-white font-bold transition-all outline-none"
                        min="2020"
                        max={currentYear + 5}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-slate-400 hover:text-white group disabled:opacity-30 disabled:hover:bg-transparent"
              disabled={
                selectedYear === currentYear && selectedMonth === currentMonth
              }
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          {/* Neon Pie Chart Container */}
          <div className="h-[340px] bg-slate-950/50 rounded-3xl border border-white/5 shadow-inner p-4 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Total Request",
                      value: Number(myStats["QTY request"]) || 0,
                    },
                    {
                      name: "Approved / Rejected",
                      value: Number(myStats["QTY approved&reject"]) || 0,
                    },
                    {
                      name: "Pending di Saya",
                      value: Number(myStats["Pending Di Saya"]) || 0,
                    },
                  ]}
                  cx="50%"
                  cy="45%"
                  innerRadius={75}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  label={({ name, percent }) =>
                    percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                  labelLine={false}
                  stroke="none"
                >
                  {/* Neon Color Palette */}
                  <Cell key="request" fill="#06b6d4" /> {/* Cyan 500 */}
                  <Cell key="approved" fill="#10b981" /> {/* Emerald 500 */}
                  <Cell key="pending" fill="#f59e0b" /> {/* Amber 500 */}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} Tugas`, "Volume"]}
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.95)",
                    borderRadius: "16px",
                    padding: "12px 16px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    color: "#f8fafc",
                    fontWeight: "bold",
                    fontSize: "12px"
                  }}
                  itemStyle={{ color: "#38bdf8", fontWeight: "bold" }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-300 font-semibold text-xs ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label Overlay */}
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-3xl font-black text-white">{Number(myStats["QTY AlL"]) || 0}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total</p>
            </div>
          </div>

          {/* Translucent Neon Summary Cards */}
          <div className="space-y-4">
            {/* Total Tasks Highlight */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/5 rounded-3xl p-6 border border-cyan-500/20 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-2xl group-hover:bg-cyan-500/30 transition-colors duration-500" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold text-sm">Volume Keseluruhan</span>
                    <p className="text-xs text-cyan-500/70 font-medium mt-0.5">Semua tipe aktivitas flow</p>
                  </div>
                </div>
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                  {Number(myStats["QTY AlL"]) || 0}
                </span>
              </div>
            </div>

            {/* Pending Alert Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/5 rounded-3xl p-6 border border-amber-500/20 relative overflow-hidden group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors duration-500" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-amber-400 font-bold text-sm">Butuh Perhatian</span>
                    <p className="text-xs text-amber-500/70 font-medium mt-0.5">Tugas pending di antrean Anda</p>
                  </div>
                </div>
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]">
                  {Number(myStats["Pending Di Saya"]) || 0}
                </span>
              </div>
            </div>

            {/* Sub-metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 rounded-3xl p-5 border border-white/5 shadow-inner flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Total Request
                </span>
                <p className="text-2xl font-black text-white">
                  {Number(myStats["QTY request"]) || 0}
                </p>
              </div>
              <div className="bg-slate-950/50 rounded-3xl p-5 border border-white/5 shadow-inner flex flex-col justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Approve / Reject
                </span>
                <p className="text-2xl font-black text-white">
                  {Number(myStats["QTY approved&reject"]) || 0}
                </p>
              </div>
            </div>

            {/* Footer Period Info */}
            <div className="pt-2 text-[11px] text-slate-500 font-bold flex items-center justify-end gap-1.5 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Periode Data: <span className="text-cyan-400">{getDateRangeText()}</span></span>
            </div>
          </div>
        </div>

        {/* Info Footer Line */}
        <div className="mt-8 pt-5 border-t border-slate-800/80">
          <p className="text-[10px] text-slate-500 font-bold text-center tracking-widest uppercase">
            Data real-time disinkronisasi pada:{" "}
            <span className="text-slate-400">
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyStats;