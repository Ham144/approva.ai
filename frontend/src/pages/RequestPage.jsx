import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import flowApi from "@/api/flowApi";
import ModalOption from "@/components/ModalOption";
import { FlowStatusModal } from "@/components/StatusPreviewModal";

export const initialFilterRequestPage = {
  forMe: true,
};

export default function RequestPage() {
  const [searchKey, setSearchKey] = useState("");
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [filter, setFilter] = useState(initialFilterRequestPage);

  const { data: flowList } = useQuery({
    queryKey: ["flows", searchKey],
    queryFn: () => flowApi.getAllFlowNameAndDescForRequest(searchKey, filter),
  });

  const closeStatusModal = () => {
    setSelectedFlow(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Area Pencarian dengan Ikon */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Cari alur berdasarkan judul atau deskripsi..."
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition duration-200 text-gray-700"
        />
        {/* Tambahkan ikon pencarian (misal: dari Heroicons) */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      </div>
      {/* Pesan Informatif dengan Gaya Alert */}
      <div
        className="bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 p-4 rounded-lg mb-8 shadow-sm"
        role="alert"
      >
        <p className="font-medium text-sm">Informasi Alur:</p>
        <p className="text-sm mt-1">
          Ini adalah daftar alur permintaan yang tersedia untuk akun Anda.
          Beberapa flow mungkin disembunyikan
        </p>
      </div>
      <div className="flex mb-4 flex-wrap gap-1">
        <button
          onClick={() =>
            setFilter((prev) => ({
              ...prev,
              forMe: true,
            }))
          }
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            filter.forMe
              ? "bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-inner"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Untuk saya
        </button>
      </div>
      <div className="flex flex-col gap-y-3 pb-10">
        {flowList?.data?.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-2 bg-gray-50 p-10 rounded-xl shadow-inner border border-gray-200 text-center">
            <p className="text-xl font-semibold text-gray-500">
              Tidak ada alur yang ditemukan.
            </p>
            <p className="text-gray-400 mt-2">
              Coba kata kunci pencarian lain.
            </p>
          </div>
        ) : (
          flowList?.data?.map((flow) => (
            <div
              key={flow._id}
              className={`relative  border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group cursor-pointer`}
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl z-0"></div>
              <div className="relative z-10 p-6 space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 leading-snug">
                      {flow.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 italic">
                      {flow.desc}
                    </p>

                    {/* Department */}
                    <div className="flex flex-wrap mt-2 gap-2">
                      {flow?.isAllowanceModeRequest ? (
                        flow.allowedDepartmentToRequest?.map((f) => (
                          <span
                            key={f._id}
                            className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                          >
                            {f.name}
                          </span>
                        ))
                      ) : (
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                          All
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-indigo-500 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6M10 9h4m-4 4h4m-4 4h4" />
                      </svg>
                      {flow.status?.length || 0} Langkah
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        flow.isAllowanceModeRequest
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {flow.isAllowanceModeRequest
                        ? "Allowance Mode"
                        : "Standard Mode"}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-gray-100 gap-4">
                  <div className="text-xs text-gray-500 italic">
                    Diatur oleh:{" "}
                    {flow?.designedBy?.length === 0
                      ? "SISTEM"
                      : flow?.designedBy?.map((user, idx) => (
                          <span
                            key={user._id}
                            className="font-semibold text-gray-700"
                          >
                            {user?.displayName || user?.username}
                            {idx < flow.designedBy.length - 1 ? ", " : ""}
                          </span>
                        ))}
                  </div>

                  <div className="grid  grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setSelectedFlow(flow);
                        document.getElementById("statusmodal")?.showModal();
                      }}
                      className="btn rounded-lg btn-md bg-indigo-600 text-white hover:bg-indigo-700 w-full"
                    >
                      Lihat Alur
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFlow(flow);
                        document
                          .getElementById("modalactionrequestlist")
                          ?.showModal();
                      }}
                      className="btn rounded-lg btn-md bg-amber-500 text-white hover:bg-amber-600 w-full"
                    >
                      Aksi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <FlowStatusModal
        key={"statusmodal"}
        selectedFlow={selectedFlow}
        onClose={closeStatusModal}
      />
      <ModalOption key={"modalactionrequestlist"} selectedFlow={selectedFlow} />
    </div>
  );
}
