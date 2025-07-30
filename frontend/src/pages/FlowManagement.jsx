import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import flowApi from "@/api/flowApi";
import { useQuery } from "@tanstack/react-query";
import {
  AudioWaveform,
  Building,
  GitPullRequest,
  Globe,
  Key,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router";
import ActionFlowModal from "@/components/ActionFlowModal";
import { useState } from "react";

export default function FlowManagement() {
  const navigate = useNavigate();
  const [selectedFlow, setSelectedFlow] = useState();

  const { data: flowDataList } = useQuery({
    queryKey: ["flows"],
    queryFn: async () => await flowApi.getAllFlowNameAndDesc(),
  });

  return (
    <PengelolaSideBarMenu>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8  min-h-screen">
        {/* Header Halaman */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            Manajemen Flow
            <span className="badge badge-accent bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full ml-2">
              Beta
            </span>
          </h1>
        </div>

        {/* Kontainer Utama untuk Tabel dan Tombol - ini yang akan menyatu */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Tabel */}
          <div className="overflow-x-auto">
            <table className="table w-full text-left">
              <thead>
                <tr className="bg-blue-600 dark:bg-blue-800 text-white text-base font-semibold">
                  <th className="p-4 sm:p-5 whitespace-nowrap">Judul Flow</th>
                  <th className="p-4 sm:p-5">Deskripsi</th>
                  <th className="p-4 sm:p-5 whitespace-nowrap">
                    Didesain Oleh
                  </th>
                  <th className="p-4 sm:p-5 whitespace-nowrap">Department</th>
                  <th className="p-4 sm:p-5 whitespace-nowrap">Mode</th>
                </tr>
              </thead>
              <tbody>
                {flowDataList?.data?.length > 0 ? (
                  flowDataList.data.map((flow, index) => (
                    <tr
                      key={flow._id || index}
                      className={`
                      ${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-700"
                      }
                      hover:bg-blue-50 dark:hover:bg-gray-600
                      transition-colors duration-200 cursor-pointer
                      border-b border-gray-200 dark:border-gray-700
                    `}
                      onClick={() => {
                        setSelectedFlow(flow);
                        setTimeout(() => {
                          document.getElementById("action-flow").showModal();
                        }, 0);
                      }}
                    >
                      <td className="p-4 sm:p-5 text-gray-900 dark:text-gray-100 font-medium">
                        {flow?.title}
                      </td>
                      <td className="p-4 sm:p-5 text-gray-700 dark:text-gray-300">
                        {flow?.desc || "-"}{" "}
                        {/* Tambahkan fallback jika desc kosong */}
                      </td>
                      <td className="p-4 sm:p-5">
                        <div className="flex flex-wrap gap-2">
                          {" "}
                          {/* Naikkan gap */}
                          {flow.designedBy?.length > 0 ? (
                            flow.designedBy.map((designer) => (
                              <span
                                key={designer._id}
                                className="badge bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700 px-3 py-1 text-xs rounded-full font-semibold"
                              >
                                {designer.displayName || designer.username}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              Tidak ditentukan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        <div className="flex flex-wrap gap-2">
                          {flow?.isAllowanceModeRequest ? (
                            flow?.allowedDepartmentToRequest?.map((dep) => (
                              <span
                                key={dep._id}
                                className="badge bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700 px-3 py-1 text-xs rounded-full font-semibold"
                              >
                                {dep.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              Tidak ditentukan
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 sm:p-5">
                        {flow?.mode ? (
                          <div className="flex items-center gap-2">
                            {flow.mode === "public" && (
                              <>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  <Globe />
                                  Public
                                </span>
                              </>
                            )}
                            {flow.mode === "private" && (
                              <>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                  <Key />
                                  Private
                                </span>
                              </>
                            )}
                            {flow.mode === "department" && (
                              <>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  <Building />
                                  Department
                                </span>
                              </>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center p-8 text-gray-500 dark:text-gray-400 text-lg"
                    >
                      <p className="mb-2">Tidak ada data Flow ditemukan.</p>
                      <p>Mulai dengan membuat flow baru!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tombol "Flow Baru" - menyatu dengan tabel */}
          <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={() => navigate("/management/flow/create/design")}
              className="
              btn bg-blue-600 hover:bg-blue-700 text-white font-semibold
              shadow-lg transition-all duration-300 ease-in-out
              flex items-center gap-2 px-6 py-3 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <AudioWaveform className="w-5 h-5" />
              Buat Flow Baru
            </button>
          </div>
        </div>
        <ActionFlowModal key={"action-flow"} selectedFlow={selectedFlow} />
      </div>
    </PengelolaSideBarMenu>
  );
}
