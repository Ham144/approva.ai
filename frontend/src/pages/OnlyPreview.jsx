import flowInstanceApi from "@/api/flowInstanceApi";
import PreviewFlow from "@/components/PreviewFlow";
import { useResponseCollector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Save, Trash, ChevronUp, ChevronDown, Eye } from "lucide-react";

export default function OnlyPreview() {
  const { instanceId } = useParams();

  const {
    setRequestData,
    setFullRequestData,
    setOveralStatus,
    setInstanceTitle,
    setStatuses,
    setCurrentStatusIndex,
    statuses,
    currentStatusIndex,
  } = useResponseCollector();

  const {
    data: flowInstanceData,
    isLoading: isIsntanceAndTempalteLoading,
    isError: isFlowError,
  } = useQuery({
    queryKey: ["instance", instanceId],
    queryFn: () => flowInstanceApi.getFlowInstanceById(instanceId),
    enabled: !!instanceId,
  });
  useEffect(() => {
    if (flowInstanceData?.data?.requestData) {
      setFullRequestData(flowInstanceData.data.requestData);
      setOveralStatus(flowInstanceData.data.overallStatus);
      setInstanceTitle(flowInstanceData.data.instanceTitle);
      setStatuses(
        flowInstanceData.data.statuses.map((status, index) => ({
          ...status,
          ...flowInstanceData?.data.flowTemplate?.status[index],
        })),
      );
      setCurrentStatusIndex(flowInstanceData.data.currentStatusIndex);
    }
  }, [flowInstanceData?.data?.requestData, setRequestData]);

  let flowTemplate = flowInstanceData?.data.flowTemplate;

  const [openSystemInfo, setOpenSystemInfo] = useState(true);
  if (isIsntanceAndTempalteLoading) {
    return (
      <div className="min-h-screen mx-auto flex justify-center items-center ">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  if (isFlowError) {
    return (
      <div className="text-center py-10 text-red-500">
        Terjadi kesalahan saat memuat data.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-blue-100 dark:bg-gray-900">
      {/* HEADER (Selalu Tampak) */}
      <div className="sticky top-0 z-20 mx-4 sm:mx-6 lg:mx-8 mt-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50/80 via-white/90 to-cyan-50/80 dark:from-blue-900/30 dark:via-gray-800/90 dark:to-cyan-900/30 backdrop-blur-xl shadow-lg border border-blue-100/50 dark:border-blue-800/30 p-1">
          {/* Decorative Elements */}
          <div className="absolute inset-0 bg-grid-blue-100/50 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-200/20 via-transparent to-cyan-200/20 blur-xl"></div>

          {/* Main Content */}
          <div className="relative flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4">
            {/* Icon Container with Glass Effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-md"></div>
              <div className="relative bg-gradient-to-br from-blue-400 to-cyan-400 p-2 rounded-full shadow-inner">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
              </div>
            </div>

            {/* Text Container */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-700 to-cyan-700 dark:from-blue-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  Preview Only Mode
                </h2>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm">
                  Read Only
                </span>
              </div>
            </div>

            {/* Additional Badge/Indicator (optional) */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white/40 dark:bg-gray-800/40 rounded-lg border border-blue-200/30 dark:border-blue-800/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Live
              </span>
            </div>
          </div>

          {/* Bottom Shine Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200/50 to-transparent"></div>
        </div>
      </div>
      {/* Konten Utama yang Bisa di-Scroll */}
      <div className="flex-1  overflow-y-auto px-2 pb-36 pt-2 custom-scrollbar">
        {" "}
        {/* Added custom-scrollbar class */}
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Informasi Sistem */}
          <div className="relative rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-blue-100/50 dark:border-blue-800/30 shadow-sm overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setOpenSystemInfo(!openSystemInfo)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <svg
                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  Informasi Sistem
                </span>
              </div>
              {openSystemInfo ? (
                <ChevronUp size={18} className="text-gray-500" />
              ) : (
                <ChevronDown size={18} className="text-gray-500" />
              )}
            </button>

            {/* Content */}
            {openSystemInfo && (
              <div className="px-4 pb-4 text-sm border-t border-blue-100/50 dark:border-blue-800/30 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Global Index:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 break-all">
                    {flowInstanceData.data.globalIndex || "-"}
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Requested By:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 break-all">
                    {flowInstanceData.data.requestedBy?.username}
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Overall Status:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        flowInstanceData.data.overallStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : flowInstanceData.data.overallStatus === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {flowInstanceData.data.overallStatus}
                    </span>
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Current Due:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {flowTemplate?.status[
                      flowInstanceData.data.currentStatusIndex
                    ]?.authorized
                      .map((user) => user.username)
                      .join(" & ")}
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Private:
                  </p>
                  <p
                    className={`font-medium ${flowInstanceData?.data.isPrivateRequest ? "text-amber-600" : "text-emerald-600"}`}
                  >
                    {flowInstanceData?.data.isPrivateRequest ? "Yes" : "No"}
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Total Status:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {flowTemplate.status.length || "-"}
                  </p>

                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    Current Index:
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {flowInstanceData?.data?.currentStatusIndex} dari{" "}
                    {flowTemplate.status.length - 1}
                    <span className="text-xs text-gray-500 ml-1">
                      (dimulai dari 0)
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* PreviewFlow only */}
          <div className="">
            <PreviewFlow
              isForApproval={false}
              isForRequest={false}
              isOnlyPreview={true}
              jsonFlow={flowTemplate}
              key={"only-preview"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
