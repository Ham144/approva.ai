import { useState } from "react";
import { Check, Clock, Search, Terminal } from "lucide-react";
import { logs } from "@/api/constant";

export default function UpdateLogsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((item) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "done" && item.done) ||
      (filter === "upcoming" && !item.done) ||
      item.type === filter;

    const matchesSearch =
      item.text.toLowerCase().includes(search.toLowerCase()) ||
      item.date.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-teal-500 selection:text-zinc-950 px-4 py-8 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="border-b border-zinc-800 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-teal-400" />
              <span>SYSTEM LOGS</span>
              <span>/</span>
              <span className="text-zinc-300">
                TOTAL: {logs.length} ENTRIES
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
              Changelog &amp; Riwayat Patch
            </h1>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
              RELEASED:{" "}
              <strong className="text-teal-400">
                {logs.filter((l) => l.done).length}
              </strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
              ROADMAP:{" "}
              <strong className="text-zinc-400">
                {logs.filter((l) => !l.done).length}
              </strong>
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-zinc-900/60 border border-zinc-800 p-2 rounded-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari patch atau keyword log..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
            />
          </div>

          <div className="flex items-center gap-1 font-mono text-[11px] overflow-x-auto">
            {[
              { id: "all", label: "Semua" },
              { id: "done", label: "Selesai" },
              { id: "upcoming", label: "Roadmap" },
              { id: "feat", label: "Feat" },
              { id: "fix", label: "Fix" },
              { id: "core", label: "Core" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-zinc-800 text-teal-400 font-semibold border border-zinc-700"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1-DIMENSION FLAT LIST */}
        <div className="border border-zinc-800 rounded-lg bg-zinc-900/40 divide-y divide-zinc-850 font-mono text-xs">
          {filteredLogs.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 sm:px-4 flex items-start sm:items-center justify-between gap-3 hover:bg-zinc-900/80 transition-colors ${
                !item.done ? "bg-zinc-950/40 opacity-80" : ""
              }`}
            >
              {/* Left Side: Status Icon, Date & Type */}
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                {/* Status Indicator */}
                <div className="mt-0.5 sm:mt-0 shrink-0">
                  {item.done ? (
                    <div className="w-4 h-4 rounded bg-teal-950 border border-teal-800 text-teal-400 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded bg-zinc-900 border border-zinc-700 text-zinc-500 flex items-center justify-center">
                      <Clock className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                {/* Date Stamp */}
                <span className="text-[11px] text-zinc-500 shrink-0 w-24 hidden sm:inline-block">
                  {item.date}
                </span>

                {/* Badge Tag */}
                <span
                  className={`text-[9px] uppercase px-1.5 py-0.2 rounded border shrink-0 ${
                    item.type === "feat"
                      ? "bg-zinc-900 border-zinc-700 text-zinc-300"
                      : item.type === "fix"
                        ? "bg-zinc-900 border-zinc-700 text-zinc-400"
                        : item.type === "sec"
                          ? "bg-red-950/40 border-red-900 text-red-400"
                          : "bg-teal-950/40 border-teal-900 text-teal-400"
                  }`}
                >
                  {item.type}
                </span>

                {/* Log Description */}
                <p
                  className={`font-sans text-xs sm:text-xs leading-relaxed truncate ${
                    item.done ? "text-zinc-200" : "text-zinc-400 italic"
                  }`}
                >
                  {item.text}
                </p>
              </div>

              {/* Right Side: Mobile Date Indicator */}
              <span className="text-[10px] text-zinc-600 sm:hidden shrink-0">
                {item.date}
              </span>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Tidak ada log yang cocok dengan kriteria pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
