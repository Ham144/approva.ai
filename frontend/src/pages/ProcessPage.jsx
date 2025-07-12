import { getAllAccount } from "@/api/authApi";
import flowApi from "@/api/flowApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search, Sliders, XCircle } from "lucide-react"; // Contoh ikon, Anda bisa gunakan library ikon lain
import { useParams, useSearchParams } from "react-router-dom";
import flowInstanceApi from "@/api/flowInstanceApi";
import ProcessActionOption from "@/components/ProcessActionOption";

// Nilai awal untuk filter, berguna untuk reset
const initialFilterState = {
  flowTemplateCategory: "all",
  overallStatus: "all",
  requestedBy: "all",
  requestDate: "", // Gunakan string kosong untuk input tanggal yang kosong
  isMyRequestOnly: false,
};

export default function ProcessPage() {
  const [filter, setFilter] = useState(initialFilterState);

  const [selectedInstance, setSelectedInstance] = useState(null);

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
    queryFn: () => flowApi.getAllFlowNameAndDesc(),
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
                value={filter.flowTemplateCategory}
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
                value={filter.overallStatus}
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
                value={filter.requestedBy}
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
                value={filter.requestDate}
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

        <div className="flex justify-start">
          <div
            onClick={() =>
              setFilter((prev) => ({
                ...prev,
                isMyRequestOnly: false,
              }))
            }
            className={`badge rounded-lg p-2 cursor-pointer ${
              filter.isMyRequestOnly == false ? "bg-blue-300" : "bg-gray-100"
            }`}
          >
            Public
          </div>
          <div
            onClick={() =>
              setFilter((prev) => ({ ...prev, isMyRequestOnly: true }))
            }
            className={`badge rounded-lg p-2 cursor-pointer ${
              filter.isMyRequestOnly == true ? "bg-blue-300" : "bg-gray-100"
            }`}
          >
            hanya request saya
          </div>
        </div>

        {/* --- Area Konten / Hasil --- */}
        <div className="space-y-4 overflow-y-auto  ">
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
            <div className="overflow-x-auto shadow-xl rounded-2xl bg-white p-6 border border-gray-100">
              <table className="table w-full border-separate border-spacing-y-2">
                {/* Header Tabel yang Lebih Menarik */}
                <thead className="bg-gray-100 text-gray-700 uppercase tracking-wider text-sm rounded-t-lg">
                  <tr>
                    <th className="py-4 px-6 rounded-tl-xl">Judul Request</th>
                    <th className="py-4 px-6">Jenis Flow</th>
                    <th className="py-4 px-6">Pemohon</th>
                    <th className="py-4 px-6">Tanggal</th>
                    <th className="py-4 px-6">Status</th>
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
                      (currentIndex / (statusLength - 1)) * 100
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

                        {/* Badge Status yang Ditingkatkan */}
                        <td className="py-4 px-6">
                          <span
                            className={`badge ${getStatusBadge(
                              instance?.overallStatus
                            )} text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm w-28`}
                          >
                            {instance?.overallStatus}
                          </span>
                        </td>

                        {/* Visualisasi Progres yang Lebih Jelas */}
                        <td className="w-[150px] py-4 px-6">
                          <div className="text-xs font-semibold text-gray-500 mb-2 text-center">
                            {currentIndex}/{statusLength - 1}
                          </div>
                          <progress
                            className="progress progress-primary w-full h-2 rounded-full"
                            value={progress}
                            max="100"
                          ></progress>
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
