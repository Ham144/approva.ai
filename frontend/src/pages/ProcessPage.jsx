import { getAllAccount } from "@/api/authApi";
import flowApi from "@/api/flowApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowBigRight,
  ChevronDown,
  ChevronUp,
  Sliders,
  XCircle,
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  //untuk filter kategori request
  const { data: flowList } = useQuery({
    queryKey: ["flows"],
    queryFn: () => flowApi.getAllFlowNameAndDescForRequest(),
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
        Object.entries(filter).filter(([k, v]) => v !== "all" && v !== "")
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
        <div className="card glass shadow-lg"></div>
        {!filter?.verboseSearch && (
          <div className="backdrop  rounded-lg shadow-md mb-6 overflow-hidden">
            {/* Header Expandable */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer  hover:bg-gray-200 transition-colors duration-200"
              onClick={toggleExpand}
            >
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                Filter Pencarian
              </h3>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {/* Konten Filter - Animasi Expand/Collapse */}
            <div
              className={`
          grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 p-4
          transition-all duration-300 ease-in-out
          ${
            isExpanded
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }
        `}
            >
              {/* Kategori Request */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium text-gray-700">
                    Kategori Request
                  </span>
                </label>
                <select
                  name="flowTemplateCategory"
                  value={filter?.flowTemplateCategory}
                  onChange={handleFilterChange}
                  className="select select-bordered select-sm w-full bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">Semua Kategori</option>
                  {flowList?.data?.map((flow) => (
                    <option key={flow._id} value={flow._id}>
                      {flow?.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium text-gray-700">
                    Status
                  </span>
                </label>
                <select
                  name="overallStatus"
                  value={filter?.overallStatus}
                  onChange={handleFilterChange}
                  className="select select-bordered select-sm w-full bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="draft">Draft</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">completed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Pemohon */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium text-gray-700">
                    Pemohon
                  </span>
                </label>
                <select
                  name="requestedBy"
                  value={filter?.requestedBy}
                  onChange={handleFilterChange}
                  className="select select-bordered select-sm w-full bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">Semua Pemohon</option>
                  {users?.data?.map((u) => (
                    <option key={u?._id} value={u?._id}>
                      {u?.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal Request */}
              <div className="form-control w-full">
                <label className="label py-1">
                  <span className="label-text text-sm font-medium text-gray-700">
                    Tanggal Request
                  </span>
                </label>
                <input
                  type="date"
                  name="requestDate"
                  value={filter?.requestDate}
                  onChange={handleFilterChange}
                  className="input input-bordered input-sm w-full bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Tombol Aksi */}
              <div className="md:col-span-2 flex gap-3 justify-end pt-2">
                <button
                  onClick={resetFilters}
                  className="btn btn-ghost btn-sm text-gray-600 hover:bg-gray-200 transition-colors duration-200 flex items-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

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

          <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Cari..."
                className="pl-10 pr-4 py-2.5 w-full rounded-lg border-2 border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 shadow-sm"
                value={filter?.search}
                onChange={(e) => {
                  setFilter((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }));
                }}
              />
            </div>

            {/* Verbose Search Checkbox */}
            <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 ">
              {/* Toggle Switch */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={filter?.verboseSearch || false}
                    onChange={(e) => {
                      setFilter((prev) => ({
                        ...prev,
                        verboseSearch: e.target.checked,
                      }));
                    }}
                  />
                  <div className="relative w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Verbose Search
                    <span className="text-blue-600 font-semibold">
                      {filter?.verboseSearch ? " (ON)" : " (OFF)"}
                    </span>
                  </span>
                </label>
              </div>

              {/* Warning Message */}
              {filter?.verboseSearch && (
                <div className="flex items-start p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                  <svg
                    className="flex-shrink-0 h-5 w-5 mr-2 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm">
                    <span className="font-semibold">Perhatian:</span> Verbose
                    Search akan mencari kata kunci di setiap jawaban dan sangat
                    lambat. Pastikan Anda mencari dengan{" "}
                    <span className="font-medium">value</span> bukan{" "}
                    <span className="font-medium">key</span>.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Area Konten / Hasil --- */}
        <div className="space-y-4 overflow-y-auto pb-20 ">
          <div className="flex gap-x-4 items-center">
            <h3 className="text-lg font-semibold items-center gap-x-3">
              Ditemukan: {totalData ?? 0} Proses
            </h3>
            <h3 className="text-lg font-semibold items-center gap-x-3">
              Menampilkan: {flowInstanceData?.data.length ?? 0} Proses
            </h3>
            <div
              className="badge badge-sm mx-3 rounded cursor-pointer"
              onClick={() => resetFilters()}
            >
              Reset Filter
            </div>
          </div>

          {isLoadingInstance ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : flowInstanceData?.data.length > 0 ? (
            <>
              {/* tampilan mobile */}
              <div className="md:hidden flex-wrap text-wrap">
                <div className="grid gap-4 md:hidden flex-wrap text-wrap">
                  {flowInstanceData?.data.map((instance) => {
                    const statusLength =
                      instance?.flowTemplate?.status?.length || 1;
                    const currentIndex = instance?.currentStatusIndex ?? 0;
                    const progress = Math.round(
                      (currentIndex / statusLength) * 100
                    );
                    const currentApprovers = instance?.flowTemplate?.status?.[
                      currentIndex
                    ]?.authorized
                      ?.map((user) => user.username)
                      .join(" & ");

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
                              {instance?.requestedBy?.username || "-"}
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
                                }
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
                        (currentIndex / statusLength) * 100
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
                            {instance?.requestedBy?.username || "-"}
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
                                instance?.overallStatus
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
              Page {filter?.page} of {totalPage}
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

      <style jsx global>{`
        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }
        .animate-shine {
          animation: shine 2s linear infinite;
        }
      `}</style>
      <ProcessActionOption
        key={"modalprocessaction"}
        selectedInstance={selectedInstance}
      />
    </div>
  );
}
