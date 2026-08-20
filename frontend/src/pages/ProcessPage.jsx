import { getAllAccount } from "@/api/authApi";
import flowApi from "@/api/flowApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowBigRight,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  Hash,
  Search,
  User,
  X,
} from "lucide-react"; // Contoh ikon, Anda bisa gunakan library ikon lain
import { useParams, useSearchParams } from "react-router-dom";
import flowInstanceApi from "@/api/flowInstanceApi";
import ProcessActionOption from "@/components/ProcessActionOption";
import { useUserInfo } from "@/store";

// Nilai awal untuk filter, berguna untuk reset
const initialFilterState = {
  flowTemplateCategory: "all",
  overallStatus: "in-progress", // all untuk semua defaultnya "in-progress"
  requestedBy: "all",
  requestDate: "", // Gunakan string kosong untuk input tanggal yang kosong
  isMyRequestOnly: false,
  isMyDepartmentOnly: true,
  page: 1,
  limit: 25,
  search: "",
};

export default function ProcessPage() {
  const [filter, setFilter] = useState();

  const [selectedInstance, setSelectedInstance] = useState(null);

  const { userInfo } = useUserInfo();
  const { instanceId } = useParams();

  const [searchParams] = useSearchParams();
  const overallStatusquery = searchParams.get("overallStatus");
  const flowTemplateCategoryquery = searchParams.get("flowTemplateCategory");
  const isMyRequestOnlyQuery = searchParams.get("isMyRequestOnlyQuery");

  const [isExpanded, setIsExpanded] = useState(true);
  const [searchCategory, setSearchCategory] = useState("");
  const [searchRequester, setSearchRequester] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRequester, setSelectedRequester] = useState("all");

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  //untuk filter kategori request
  const { data: flowList } = useQuery({
    queryKey: ["flows"],
    queryFn: () => flowApi.getFlowForDownload(),
    enabled: !instanceId,
  });

  //requested By
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: getAllAccount,
    refetchOnWindowFocus: false,
    enabled: !instanceId,
  });

  //untuk multi result
  const { data: flowInstanceData, isLoading: isLoadingInstance } = useQuery({
    queryKey: ["instances", filter],
    queryFn: async () => {
      // Buat query string dari filter, skip jika value 'all' atau kosong
      const queryObj = Object.fromEntries(
        Object.entries(filter).filter(([k, v]) => v !== "all" && v !== ""),
      );
      const queryString = new URLSearchParams(queryObj).toString();
      return await flowInstanceApi.getFlowInstanceList({
        query: queryString,
      });
    },
    refetchOnWindowFocus: false,
    enabled: !instanceId,
  });
  const totalPage = flowInstanceData?.totalPage;
  const totalData = flowInstanceData?.totalData;

  // --- Event Handlers ---
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilter(initialFilterState);
  };

  // --- Helper untuk Badge Status ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return "badge-success rounded-md";
      case "in-progress":
        return "badge-info rounded-md";
      case "rejected":
        return "badge-error rounded-md";
      case "draft":
        return "badge-warning rounded-md";
      default:
        return "badge-ghost";
    }
  };

  // Filter kategori berdasarkan pencarian
  const filteredCategories = useMemo(() => {
    if (!flowList?.data) return [];
    return flowList.data.filter((flow) =>
      flow.title.toLowerCase().includes(searchCategory.toLowerCase()),
    );
  }, [flowList, searchCategory]);

  // Filter pemohon berdasarkan pencarian
  const filteredRequesters = useMemo(() => {
    if (!users?.data) return [];
    return users.data.filter((user) => {
      const displayName = user?.displayName?.toLowerCase() || "";
      const username = user?.username?.toLowerCase() || "";
      const searchTerm = searchRequester.toLowerCase();
      return displayName.includes(searchTerm) || username.includes(searchTerm);
    });
  }, [users, searchRequester]);

  // Handler untuk perubahan kategori
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    handleFilterChange({
      target: {
        name: "flowTemplateCategory",
        value: categoryId,
      },
    });
  };

  // Handler untuk perubahan pemohon
  const handleRequesterChange = (userId) => {
    setSelectedRequester(userId);
    handleFilterChange({
      target: {
        name: "requestedBy",
        value: userId,
      },
    });
  };
  // Reset semua filter termasuk pencarian
  const handleResetAll = () => {
    resetFilters();
    setSearchCategory("");
    setSearchRequester("");
    setSelectedCategory("all");
    setSelectedRequester("all");
  };

  useEffect(() => {
    if (overallStatusquery) {
      setFilter((prev) => ({
        ...prev,
        overallStatus: overallStatusquery,
      }));
    }
    if (flowTemplateCategoryquery) {
      setFilter((prev) => ({
        ...prev,
        flowTemplateCategory: flowTemplateCategoryquery,
      }));
    }
    if (isMyRequestOnlyQuery) {
      setFilter((prev) => ({
        ...prev,
        isMyRequestOnly: isMyRequestOnlyQuery,
      }));
    }
    if (userInfo?.role == "member") {
      const initialFilterforMember = {
        ...initialFilterState,
        isMyDepartmentOnly: true,
      };
      setFilter(initialFilterforMember);
    } else if (
      userInfo.role != "member" &&
      !isMyRequestOnlyQuery &&
      !flowTemplateCategoryquery &&
      !overallStatusquery
    ) {
      setFilter(initialFilterState);
    }
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* FILTER ACCORDION CARD */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          {/* Header Filter Panel */}
          <div
            className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/60"
            onClick={toggleExpand}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-teal-400">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-zinc-100 tracking-tight">
                  Filter Parameter &amp; Kueri
                </h3>
                <p className="text-xs text-zinc-400">
                  Saring antrean proses berdasarkan kategori, pemohon, dan
                  metadata status.
                </p>
              </div>
            </div>

            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          {/* Filter Content */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded
                ? "max-h-[850px] opacity-100 p-5 sm:p-6"
                : "max-h-0 opacity-0 p-0"
            }`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kategori Request */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-zinc-500" />
                  Kategori Flow
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari kategori spesifik..."
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/70 p-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedCategory === "all"
                        ? "bg-zinc-800 text-teal-400 font-medium border border-zinc-700"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <span>Semua Kategori</span>
                    {selectedCategory === "all" && (
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                    )}
                  </button>

                  {filteredCategories.map((flow) => {
                    const isSelected = selectedCategory === flow._id;
                    return (
                      <button
                        key={flow._id}
                        type="button"
                        onClick={() => handleCategoryChange(flow._id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-zinc-800 text-teal-400 font-medium border border-zinc-700"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        }`}
                      >
                        <span className="truncate">{flow.title}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                            {flow.mode}
                          </span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-teal-400" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pemohon */}
              <div className="space-y-2">
                <label className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  Pemohon (Requester)
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Cari user pemohon..."
                    value={searchRequester}
                    onChange={(e) => setSearchRequester(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950/70 p-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => handleRequesterChange("all")}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedRequester === "all"
                        ? "bg-zinc-800 text-teal-400 font-medium border border-zinc-700"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                    }`}
                  >
                    <span>Semua Pemohon</span>
                    {selectedRequester === "all" && (
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                    )}
                  </button>

                  {filteredRequesters.map((user) => {
                    const isSelected = selectedRequester === user._id;
                    return (
                      <button
                        key={user._id}
                        type="button"
                        onClick={() => handleRequesterChange(user._id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between gap-2 ${
                          isSelected
                            ? "bg-zinc-800 text-teal-400 font-medium border border-zinc-700"
                            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-medium text-zinc-200">
                            {user?.displayName || user?.username}
                          </span>
                          {user?.username && user.displayName && (
                            <span className="text-zinc-500 text-[11px] ml-1.5 font-mono">
                              @{user.username}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Tambahan Row */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400 block">
                    Status Eksekusi
                  </label>
                  <select
                    name="overallStatus"
                    value={filter?.overallStatus || "all"}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors"
                  >
                    <option value="all">Semua Status</option>
                    <option value="draft">Draft</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    Tanggal Dibuat
                  </label>
                  <input
                    type="date"
                    name="requestDate"
                    value={filter?.requestDate || ""}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 text-xs text-zinc-300 font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Reset Form Filter</span>
                  </button>
                </div>
              </div>

              {/* Active Filters Tag Pills */}
              <div className="lg:col-span-2 pt-2">
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                  <span className="font-mono text-zinc-500 text-[11px] uppercase tracking-wider mr-1">
                    Active Filter:
                  </span>

                  {selectedCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px]">
                      <span>
                        Kategori:{" "}
                        {
                          flowList?.data?.find(
                            (f) => f._id === selectedCategory,
                          )?.title
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCategoryChange("all")}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedRequester !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px]">
                      <span>
                        Pemohon:{" "}
                        {
                          users?.data?.find((u) => u._id === selectedRequester)
                            ?.displayName
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRequesterChange("all")}
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {filter?.overallStatus !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px]">
                      <span className="capitalize">
                        Status: {filter?.overallStatus}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleFilterChange({
                            target: { name: "overallStatus", value: "all" },
                          })
                        }
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {filter?.requestDate && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 text-[11px]">
                      <span>Tgl: {filter.requestDate}</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleFilterChange({
                            target: { name: "requestDate", value: "" },
                          })
                        }
                        className="text-zinc-400 hover:text-zinc-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK SCOPE TABS & SEARCH BAR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              disabled={userInfo?.role === "member"}
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  isMyRequestOnly: false,
                  isMyDepartmentOnly: false,
                }))
              }
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !filter?.isMyRequestOnly && !filter?.isMyDepartmentOnly
                  ? "bg-zinc-100 text-zinc-950 font-semibold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              Semua Request
            </button>

            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  isMyRequestOnly: false,
                  isMyDepartmentOnly: true,
                }))
              }
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter?.isMyDepartmentOnly
                  ? "bg-zinc-100 text-zinc-950 font-semibold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              Departemen Saya
            </button>

            <button
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  isMyRequestOnly: true,
                  isMyDepartmentOnly: false,
                }))
              }
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter?.isMyRequestOnly
                  ? "bg-zinc-100 text-zinc-950 font-semibold"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              Request Saya
            </button>

            <a
              className="text-xs text-zinc-400 hover:text-teal-400 flex items-center gap-1 ml-2 font-mono transition-colors"
              href="/process/download"
            >
              <span>Export CSV</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Fast Instant Search */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari ID, dokumen, requester..."
              className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              value={filter?.search || ""}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  search: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        {/* METRIC STRIP SUMMARY */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs font-mono">
          <div className="flex items-center gap-4 text-zinc-400">
            <div>
              TOTAL:{" "}
              <span className="text-zinc-100 font-semibold">
                {totalData ?? 0}
              </span>
            </div>
            <span className="text-zinc-700">/</span>
            <div>
              RENDERED:{" "}
              <span className="text-teal-400 font-semibold">
                {flowInstanceData?.data.length ?? 0}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-zinc-400 hover:text-red-400 transition-colors text-[11px] uppercase tracking-wider"
          >
            Clear Query Filters
          </button>
        </div>

        {/* TABLE / CONTENT AREA */}
        {isLoadingInstance ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-xs font-mono text-zinc-500 animate-pulse">
              MEMUAT DATA SISTEM...
            </span>
          </div>
        ) : flowInstanceData?.data.length > 0 ? (
          <>
            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
              {flowInstanceData?.data.map((instance) => {
                const statusLength =
                  instance?.flowTemplate?.status?.length || 1;
                const currentIndex = instance?.currentStatusIndex ?? 0;
                const progress = Math.round(
                  (currentIndex / statusLength) * 100,
                );
                const currentApprovers =
                  instance?.flowTemplate?.status?.[currentIndex]?.authorized
                    ?.map((user) => user?.username)
                    ?.filter(Boolean)
                    ?.join(" & ") || "No approvers assigned";

                return (
                  <div
                    key={instance._id}
                    onClick={() => {
                      setSelectedInstance(instance);
                      document.getElementById("modalprocessaction").showModal();
                    }}
                    className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3 active:border-zinc-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono text-zinc-500">
                          {instance?.globalIndex || "NO-REF"}
                        </span>
                        <p className="text-sm font-medium text-zinc-100 leading-snug">
                          {instance.instanceTitle || "Untitled Request"}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                          instance?.overallStatus === "completed"
                            ? "bg-teal-950/60 border-teal-800 text-teal-400"
                            : instance?.overallStatus === "rejected"
                              ? "bg-red-950/60 border-red-800 text-red-400"
                              : "bg-zinc-800 border-zinc-700 text-zinc-300"
                        }`}
                      >
                        {instance?.overallStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-zinc-800/80 pt-2.5">
                      <div>
                        <span className="text-zinc-500 text-[10px] block">
                          Flow:
                        </span>
                        <span className="text-zinc-300 truncate block">
                          {instance?.flowTemplate?.title || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] block">
                          Requester:
                        </span>
                        <span className="text-zinc-300 truncate block">
                          {instance?.requestedBy?.displayName ||
                            instance?.requestedBy?.username ||
                            "Stranger"}
                        </span>
                      </div>
                    </div>

                    {/* Progress Line */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                        <span>
                          STEP {currentIndex}/{statusLength}
                        </span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 pt-1 flex items-center justify-between font-mono">
                      <span className="text-zinc-500">CURRENT:</span>
                      <span className="text-zinc-300 truncate max-w-[200px]">
                        {instance.overallStatus === "completed"
                          ? "Selesai"
                          : currentApprovers}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Clean Table */}
            <div className="hidden md:block bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase font-mono tracking-wider border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Judul Request</th>
                    <th className="py-3 px-4">Global Index</th>
                    <th className="py-3 px-4">Jenis Flow</th>
                    <th className="py-3 px-4">Pemohon</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4 w-32">Progress</th>
                    <th className="py-3 px-4">Status / Approver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {flowInstanceData?.data.map((instance) => {
                    const statusLength =
                      instance?.flowTemplate?.status?.length || 1;
                    const currentIndex = instance?.currentStatusIndex ?? 0;
                    const progress = Math.round(
                      (currentIndex / statusLength) * 100,
                    );

                    return (
                      <tr
                        key={instance._id}
                        onClick={() => {
                          setSelectedInstance(instance);
                          document
                            .getElementById("modalprocessaction")
                            .showModal();
                        }}
                        className="hover:bg-zinc-800/40 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-medium text-zinc-200 max-w-[220px] truncate">
                          {instance.instanceTitle || "Judul Tidak Terisi"}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-400">
                          {instance?.globalIndex || "-"}
                        </td>
                        <td className="py-3 px-4 text-zinc-300 max-w-[180px] truncate">
                          {instance?.flowTemplate?.title || "-"}
                        </td>
                        <td className="py-3 px-4 text-zinc-300">
                          {instance?.requestedBy?.displayName ||
                            instance?.requestedBy?.username ||
                            "Stranger"}
                        </td>
                        <td className="py-3 px-4 font-mono text-zinc-400">
                          {new Date(instance.createdAt).toLocaleDateString(
                            "id-ID",
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                              <span>
                                {currentIndex}/{statusLength}
                              </span>
                              <span>{progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold border ${
                              instance?.overallStatus === "completed"
                                ? "bg-teal-950/60 border-teal-800 text-teal-400"
                                : instance?.overallStatus === "rejected"
                                  ? "bg-red-950/60 border-red-800 text-red-400"
                                  : "bg-zinc-800 border-zinc-700 text-zinc-300"
                            }`}
                          >
                            {instance?.overallStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-1">
            <p className="text-sm font-semibold text-zinc-200">
              Data Tidak Ditemukan
            </p>
            <p className="text-xs text-zinc-500">
              Kueri pencarian atau filter saat ini tidak menghasilkan antrean
              aktif.
            </p>
          </div>
        )}

        {/* PAGINATION BAR */}
        <div className="flex justify-center items-center gap-3 pt-4">
          <button
            disabled={filter?.page === 1}
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                page: prev.page > 1 ? prev.page - 1 : prev.page,
              }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400">
            Page {filter?.page} {totalPage ? `of ${totalPage}` : ""}
          </div>

          <button
            disabled={filter?.page >= totalPage}
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                page: prev.page < totalPage ? prev.page + 1 : prev.page,
              }));
            }}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        <ProcessActionOption
          key={"modalprocessaction"}
          selectedInstance={selectedInstance}
        />
      </div>
    </div>
  );
}