import { getAllAccount } from "@/api/authApi";
import flowApi from "@/api/flowApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Sliders, XCircle } from "lucide-react"; // Contoh ikon, Anda bisa gunakan library ikon lain
import { useParams, useSearchParams } from "react-router-dom";
import flowInstanceApi from "@/api/flowInstanceApi";
import ProcessActionOption from "@/components/ProcessActionOption";
import { useUserInfo } from "@/store";

// Nilai awal untuk filter, berguna untuk reset
const initialFilterState = {
  flowTemplateCategory: "all",
  overallStatus: "all",
  requestedBy: "all",
  requestDate: "", // Gunakan string kosong untuk input tanggal yang kosong
  isMyRequestOnly: false,
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isExpanded, setIsExpanded] = useState(false);

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
        page,
        limit,
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
    <div className="p-4 md:p-6 lg:p-8 bg-base-200 min-h-screen">
      <div className="space-y-6 ">
        <div className="card bg-base-100 shadow-lg"></div>
        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
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

        <div className="flex flex-wrap gap-2">
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
        </div>

        {/* --- Area Konten / Hasil --- */}
        <div className="space-y-4 overflow-y-auto pb-20 ">
          <h3 className="text-lg font-semibold items-center gap-x-3">
            Ditemukan: {totalData ?? 0} Proses
            <div
              className="badge badge-sm mx-3 rounded cursor-pointer"
              onClick={() => resetFilters()}
            >
              Reset Filter
            </div>
          </h3>

          {isLoadingInstance ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : flowInstanceData?.data.length > 0 ? (
            <>
              {/* tampilan mobile */}
              <div className="md:hidden">
                <div className="grid gap-4 md:hidden">
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
                        className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        {/* Card Header with Status Chip */}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {instance.instanceTitle || "Untitled Request"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              instance?.overallStatus === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : instance?.overallStatus === "rejected"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {instance?.overallStatus}
                          </span>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Jenis Flow
                            </p>
                            <p className="font-medium text-sm">
                              {instance?.flowTemplate?.title || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Pemohon
                            </p>
                            <p className="font-medium text-sm">
                              {instance?.requestedBy?.username || "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Tanggal
                            </p>
                            <p className="font-medium text-sm">
                              {new Date(instance.createdAt).toLocaleDateString(
                                "id-ID"
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Progress
                            </p>
                            <p className="font-medium text-sm">
                              {currentIndex}/{statusLength} ({progress}%)
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {instance?.overallStatus !== "completed" && (
                          <div className="mb-4">
                            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {/* Current Approver */}
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-blue-500"
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
                          <div>
                            <p className="text-xs text-gray-500">
                              Proses Saat Ini
                            </p>
                            <p className="font-medium text-sm">
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
              <div className="overflow-x-auto max-md:hidden shadow-xl rounded-2xl bg-white p-6 border border-gray-100">
                <table className="table w-full border-separate border-spacing-y-2">
                  {/* Header Tabel yang Lebih Menarik */}
                  <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-sm rounded-t-lg">
                    <tr>
                      <th className="py-4 px-6 rounded-tl-xl">Judul Request</th>
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
                          className="bg-white hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer shadow-sm rounded-xl"
                        >
                          {/* Data Baris yang Rapi */}
                          <td className="max-w-[200px] truncate py-4 px-6 font-medium text-gray-900 rounded-l-xl">
                            {instance.instanceTitle ||
                              "Judul Request Tidak Terisi"}
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

                            <div>
                              <span
                                className={`badge ${getStatusBadge(
                                  instance?.overallStatus
                                )} text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm w-full`}
                              >
                                {instance?.overallStatus}
                              </span>
                            </div>
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
      <div className="grid grid-cols-2 absolute  bottom-20">
        <button
          disabled={page == 1}
          className="btn"
          onClick={() =>
            setPage((prev) => {
              if (prev == 1) return 1;
              return prev - 1;
            })
          }
        >
          Prev
        </button>
        <button
          className="btn"
          onClick={() => {
            setPage((prev) => {
              if (prev + 1 == totalPage) {
                return prev;
              }
              return prev + 1;
            });
          }}
        >
          Next
        </button>
      </div>
      <ProcessActionOption
        key={"modalprocessaction"}
        selectedInstance={selectedInstance}
      />
    </div>
  );
}
