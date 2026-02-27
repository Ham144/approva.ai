import { getAllAccount } from "@/api/authApi";
import flowApi from "@/api/flowApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowBigRight,
  Calendar,
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
    <div className="p-4 md:p-6 lg:p-8  min-h-screen">
      <div className="space-y-6 ">
        <div className="w-full mb-8">
          {/* Card dengan glassmorphism effect */}
          <div
            className="card glass  rounded-2xl overflow-hidden border border-white/30 backdrop-blur-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(173, 216, 230, 0.15) 0%, rgba(176, 224, 230, 0.1) 100%)",
            }}
          >
            {/* Header dengan glass effect yang lebih smooth */}
            <div
              className="flex items-center justify-between p-5 cursor-pointer transition-all duration-300 hover:bg-white/10"
              onClick={toggleExpand}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex  md:gap-x-4 max-md:flex-col">
                  <h3 className="text-xl font-bold text-gray-800">
                    Filter Pencarian
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Saring data dengan filter yang tersedia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-white/30 backdrop-blur-sm">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-blue-700" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-blue-700" />
                  )}
                </div>
              </div>
            </div>

            {/* Konten Filter dengan animasi yang lebih smooth */}
            <div
              className={`
            transition-all duration-500 ease-in-out overflow-hidden
            ${isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}
          `}
            >
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Kategori Request dengan Search */}
                  <div className="space-y-2">
                    <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      Kategori Request
                    </label>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Cari kategori..."
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-300/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                      />
                    </div>

                    {/* List Kategori dengan Scroll */}
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-200/50 bg-white/60 backdrop-blur-sm">
                      <div className="p-2">
                        <button
                          onClick={() => handleCategoryChange("all")}
                          className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-300 ${
                            selectedCategory === "all"
                              ? "bg-blue-100/80 text-blue-700 font-medium border border-blue-200"
                              : "hover:bg-gray-100/70 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>Semua Kategori</span>
                            {selectedCategory === "all" && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </button>

                        {filteredCategories.map((flow) => (
                          <button
                            key={flow._id}
                            onClick={() => handleCategoryChange(flow._id)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-300 ${
                              selectedCategory === flow._id
                                ? "bg-blue-100/80 text-blue-700 font-medium border border-blue-200"
                                : "hover:bg-gray-100/70 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate">{flow.title}</span>
                              <span className="badge badge-primary text-white font-bold">
                                {flow.mode}
                              </span>
                              {selectedCategory === flow._id && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pemohon dengan Search */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Pemohon
                    </label>

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Cari pemohon..."
                        value={searchRequester}
                        onChange={(e) => setSearchRequester(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-300/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400"
                      />
                    </div>

                    {/* List Pemohon dengan Scroll */}
                    <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-200/50 bg-white/60 backdrop-blur-sm">
                      <div className="p-2">
                        <button
                          onClick={() => handleRequesterChange("all")}
                          className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-300 ${
                            selectedRequester === "all"
                              ? "bg-blue-100/80 text-blue-700 font-medium border border-blue-200"
                              : "hover:bg-gray-100/70 text-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>Semua Pemohon</span>
                            {selectedRequester === "all" && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </button>

                        {filteredRequesters.map((user) => (
                          <button
                            key={user._id}
                            onClick={() => handleRequesterChange(user._id)}
                            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all duration-300 ${
                              selectedRequester === user._id
                                ? "bg-blue-100/80 text-blue-700 font-medium border border-blue-200"
                                : "hover:bg-gray-100/70 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                  {user?.displayName || user?.username}
                                </div>
                                {user?.username && user.displayName && (
                                  <div className="text-xs text-gray-500 truncate">
                                    @{user.username}
                                  </div>
                                )}
                              </div>
                              {selectedRequester === user._id && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Filter Tambahan */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200/50">
                    {/* Status */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Status
                      </label>
                      <select
                        name="overallStatus"
                        value={filter?.overallStatus || "all"}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-700"
                      >
                        <option value="all">Semua Status</option>
                        <option value="draft">Draft</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    {/* Tanggal Request */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Tanggal Request
                      </label>
                      <input
                        type="date"
                        name="requestDate"
                        value={filter?.requestDate || ""}
                        onChange={handleFilterChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-700"
                      />
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-end space-x-3">
                      <button
                        onClick={handleResetAll}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300/50 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-gray-50/90 hover:border-gray-400/50 transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                      >
                        <X className="w-4 h-4" />
                        Reset All
                      </button>
                    </div>
                  </div>

                  {/* Status Filter Aktif */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-blue-50/30 backdrop-blur-sm border border-blue-100/50">
                      <span className="text-sm font-medium text-blue-700">
                        Filter Aktif:
                      </span>

                      {selectedCategory !== "all" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-sm">
                          Kategori:{" "}
                          {
                            flowList?.data?.find(
                              (f) => f._id === selectedCategory,
                            )?.title
                          }
                          <button
                            onClick={() => handleCategoryChange("all")}
                            className="ml-1 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {selectedRequester !== "all" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-sm">
                          Pemohon:{" "}
                          {
                            users?.data?.find(
                              (u) => u._id === selectedRequester,
                            )?.displayName
                          }
                          <button
                            onClick={() => handleRequesterChange("all")}
                            className="ml-1 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {filter?.overallStatus !== "all" && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-sm">
                          Status: {filter?.overallStatus}
                          <button
                            onClick={() =>
                              handleFilterChange({
                                target: { name: "overallStatus", value: "all" },
                              })
                            }
                            className="ml-1 hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      )}

                      {filter?.requestDate && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-sm">
                          Tanggal: {filter.requestDate}
                          <button
                            onClick={() =>
                              handleFilterChange({
                                target: { name: "requestDate", value: "" },
                              })
                            }
                            className="ml-1 hover:text-blue-900"
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
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2">
          <div className="flex flex-wrap gap-y-3 gap-x-4 items-center">
            <button
              disabled={userInfo?.role == "member"}
              onClick={() =>
                setFilter((prev) => ({
                  ...prev,
                  isMyRequestOnly: false,
                  isMyDepartmentOnly: false,
                }))
              }
              className={`px-4 disabled:bg-red-200  py-2 rounded-full text-sm font-medium transition-all ${
                !filter?.isMyRequestOnly && !filter?.isMyDepartmentOnly
                  ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-inner"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter?.isMyDepartmentOnly
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-inner"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter?.isMyRequestOnly
                  ? "bg-green-100 text-green-700 border border-green-200 shadow-inner"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Request Saya
            </button>
            <a
              className="text-blue-600 hover:link flex items-center gap-1"
              href="/process/download"
            >
              Ingin Mendownload data menjadi csv? <ArrowBigRight />
            </a>
          </div>

          <div className="relative flex-1 max-w-md shadow-md shadow-gray-200">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search color="gray" size={20} />
            </div>
            <input
              type="text"
              placeholder="Cari..."
              className="pl-10 pr-4 py-2.5 w-full rounded-lg border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm w"
              value={filter?.search}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  search: e.target.value,
                }));
              }}
            />
          </div>
        </div>

        {/* --- Area Konten / Hasil --- */}
        <div className="space-y-4 overflow-y-auto pb-20 ">
          <div
            className="flex flex-wrap items-center gap-4 p-4 rounded-xl mb-6"
            style={{
              background:
                "linear-gradient(135deg, rgba(173, 216, 230, 0.1) 0%, rgba(176, 224, 230, 0.05) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(173, 216, 230, 0.2)",
            }}
          >
            {/* Informasi Hasil */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Total Ditemukan */}
              {totalData ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg border border-gray-200/50">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Ditemukan:
                  </span>
                  <span className="font-semibold text-blue-600">
                    {totalData ?? 0}
                  </span>
                  <span className="text-gray-600">proses</span>
                </div>
              ) : null}

              {/* Sedang Ditampilkan */}
              <div className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg border border-gray-200/50">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Menampilkan:
                </span>
                <span className="font-semibold text-green-600">
                  {flowInstanceData?.data.length ?? 0}
                </span>
                <span className="text-gray-600">proses</span>
              </div>

              {/* Indikator Filter Aktif */}
              {Object.values(filter || {}).some(
                (v) => v && v !== "all" && v !== "",
              ) && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 rounded-lg border border-blue-100/50">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-blue-600">
                      Filter Aktif
                    </span>
                  </div>
                  <span className="text-xs text-blue-700">
                    {
                      Object.values(filter || {}).filter(
                        (v) => v && v !== "all" && v !== "",
                      ).length
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Tombol Reset */}
            <button
              onClick={resetFilters}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors duration-200 rounded-lg hover:bg-white/70 border border-gray-300/50"
            >
              X Reset Filter
            </button>
          </div>
          {isLoadingInstance ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : flowInstanceData?.data.length > 0 ? (
            <>
              {/* tampilan mobile */}
              <div className="md:hidden flex-wrap text-wrap ">
                <div className="grid gap-4 md:hidden flex-wrap text-wrap">
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
                          document
                            .getElementById("modalprocessaction")
                            .showModal();
                        }}
                        className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-200/70 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-blue-200/70 active:scale-[0.98]"
                      >
                        {/* Card Header */}
                        <p className="w-[60%]">
                          {instance.instanceTitle || "Untitled Request"}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
                          <div className="flex-shrink-0 ">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                instance?.overallStatus === "completed"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : instance?.overallStatus === "rejected"
                                    ? "bg-rose-50 text-rose-700"
                                    : "bg-blue-50 text-blue-700"
                              }`}
                            >
                              {instance?.overallStatus}
                            </span>
                          </div>
                        </div>

                        {/* Metadata Grid - Responsive */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-4">
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-500 font-medium">
                              Jenis Flow
                            </p>
                            <p className="text-sm text-gray-800 line-clamp-1">
                              {instance?.flowTemplate?.title || "-"}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-500 font-medium">
                              Pemohon
                            </p>
                            <p className="text-sm text-gray-800 line-clamp-1">
                              {instance?.requestedBy?.displayName ||
                                instance?.requestedBy?.username ||
                                "-"}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-500 font-medium">
                              Tanggal
                            </p>
                            <p className="text-sm text-gray-800">
                              {new Date(instance.createdAt).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs text-gray-500 font-medium">
                              Progress
                            </p>
                            <p className="text-sm text-gray-800">
                              {currentIndex}/{statusLength} ({progress}%)
                            </p>
                          </div>
                          {instance?.globalIndex && (
                            <div className="space-y-0.5 xs:col-span-2">
                              <p className="text-xs text-gray-500 font-medium">
                                Global Index
                              </p>
                              <p className="text-sm text-gray-800">
                                {instance?.globalIndex}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        {instance?.overallStatus !== "completed" && (
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Current Approver */}
                        <div className="flex items-start gap-3 pt-2 border-t border-gray-100/80">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5 text-blue-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium">
                              Proses Saat Ini
                            </p>
                            <p className="text-sm text-gray-800 truncate">
                              {instance.overallStatus === "completed"
                                ? "Selesai"
                                : currentApprovers || "Menunggu persetujuan"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* tampilan web */}
              <div className="overflow-x-auto backdrop max-md:hidden shadow-xl rounded-2xl p-6 border border-gray-100">
                <table className="table w-full border-separate border-spacing-y-2">
                  {/* Header Tabel yang Lebih Menarik */}
                  <thead className="bg-transparent text-gray-700 uppercase tracking-wider text-sm rounded-t-lg">
                    <tr>
                      <th className="py-4 px-6 rounded-tl-xl">Judul Request</th>
                      <th className="py-4 px-6 rounded-tl-xl">Global Index</th>
                      <th className="py-4 px-6">Jenis Flow</th>
                      <th className="py-4 px-6">Pemohon</th>
                      <th className="py-4 px-6">Tanggal</th>
                      <th className="py-4 px-6">Progress</th>
                      <th className="py-4 px-6">Proses Saat Ini</th>
                    </tr>
                  </thead>
                  <tbody>
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
                          data-tip="awd"
                          className="bg-transparent hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer shadow-sm rounded-xl"
                        >
                          {/* Data Baris yang Rapi */}
                          <td className="max-w-[200px] truncate py-4 px-6 font-medium text-gray-900 rounded-l-xl">
                            {instance.instanceTitle ||
                              "Judul Request Tidak Terisi"}
                          </td>
                          <td className="max-w-[200px] truncate py-4 px-6 font-medium text-gray-900 rounded-l-xl">
                            {instance?.globalIndex}
                          </td>
                          <td className="text-gray-600 py-4 px-6">
                            {instance?.flowTemplate?.title || "-"}
                          </td>
                          <td className="text-gray-600 py-4 px-6">
                            {instance?.requestedBy?.displayName ||
                              instance?.requestedBy?.username ||
                              "-"}
                          </td>
                          <td className="text-gray-600 py-4 px-6">
                            {new Date(instance.createdAt).toLocaleDateString()}
                          </td>

                          {/* Visualisasi Progres yang Lebih Jelas */}
                          <td className="w-[150px] py-4 px-4 text-center">
                            {instance?.overallStatus !== "completed" && (
                              <div className="text-xs text-gray-500 font-semibold mb-1">
                                {currentIndex}/{statusLength}
                                <progress
                                  className="progress progress-primary w-full h-2 rounded-full mb-2"
                                  value={progress}
                                  max="100"
                                ></progress>
                              </div>
                            )}

                            <span
                              className={`badge ${getStatusBadge(
                                instance?.overallStatus,
                              )} text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm w-full`}
                            >
                              {instance?.overallStatus}
                            </span>
                          </td>

                          <td className="text-xs text-gray-600 py-4 px-6">
                            {instance.overallStatus === "completed"
                              ? "Selesai"
                              : instance?.flowTemplate?.status?.[
                                  currentIndex
                                ]?.authorized
                                  ?.map((user) => user.username)
                                  .join(" & ") || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-base-100 rounded-lg shadow">
              <p className="text-xl font-semibold">Data Tidak Ditemukan</p>
              <p className="text-base-content/60 mt-2">
                Coba ubah kriteria filter Anda atau buat request baru.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="flex justify-center gap-4">
          <button
            disabled={filter?.page === 1}
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                page: prev.page > 1 ? prev.page - 1 : prev.page,
              }));
            }}
            className={`relative overflow-hidden px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
              filter?.page === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            }`}
          >
            {filter?.page === 1 ? (
              "Prev"
            ) : (
              <>
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Prev
                </span>
                <span className="absolute inset-0 bg-[length:200%_200%] animate-shine bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
            <span className="font-medium text-gray-700">
              Page {filter?.page} {totalPage ? `of ${totalPage}` : ""}
            </span>
          </div>

          <button
            disabled={filter?.page >= totalPage}
            onClick={() => {
              setFilter((prev) => ({
                ...prev,
                page: prev.page < totalPage ? prev.page + 1 : prev.page,
              }));
            }}
            className={`relative overflow-hidden px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
              filter?.page >= totalPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            }`}
          >
            {filter?.page >= totalPage ? (
              "Next"
            ) : (
              <>
                <span className="relative z-10 flex items-center gap-2">
                  Next
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-[length:200%_200%] animate-shine bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </>
            )}
          </button>
        </div>
      </div>

      <ProcessActionOption
        key={"modalprocessaction"}
        selectedInstance={selectedInstance}
      />
    </div>
  );
}
