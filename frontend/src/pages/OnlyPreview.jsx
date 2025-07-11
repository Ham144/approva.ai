import flowInstanceApi from "@/api/flowInstanceApi";
import PreviewFlow from "@/components/PreviewFlow";
import { useResponseCollector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Save, Trash, ChevronUp, ChevronDown } from "lucide-react";

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
      setStatuses(flowInstanceData.data.statuses);
      setCurrentStatusIndex(flowInstanceData.data.currentStatusIndex);
    }
  }, [flowInstanceData?.data?.requestData, setRequestData]);

  let flowTemplate = flowInstanceData?.data.flowTemplate;

  const [openSystemInfo, setOpenSystemInfo] = useState(false);
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
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* HEADER (Selalu Tampak) */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-2 sm:p-3 shadow-md border-b border-gray-200 dark:border-gray-700 backdrop-blur-md bg-opacity-50 dark:bg-opacity-50 rounded-md">
        <h2>Preview Only Mode (Read Only)</h2>
      </div>

      {/* Konten Utama yang Bisa di-Scroll */}
      <div className="flex-1  overflow-y-auto px-2 pb-36 pt-2 custom-scrollbar">
        {" "}
        {/* Added custom-scrollbar class */}
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Informasi Sistem */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setOpenSystemInfo(!openSystemInfo)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-800 dark:text-gray-200 font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Informasi Sistem
              {openSystemInfo ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {openSystemInfo && (
              <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                <p className="font-medium">Requested By:</p>
                <p className="break-all">
                  {flowInstanceData.data.requestedBy?.username}
                </p>

                <p className="font-medium">Overall Status:</p>
                <p>{flowInstanceData.data.overallStatus}</p>

                <p className="font-medium">Current Due:</p>
                <p>
                  {flowTemplate?.status[
                    flowInstanceData.data.currentStatusIndex
                  ]?.authorized
                    .map((user) => user.username)
                    .join("/")}
                </p>

                <p className="font-medium">Private:</p>
                <p>{flowInstanceData?.data.isPrivateRequest ? "Yes" : "No"}</p>

                <p className="font-medium">Status Length:</p>
                <p>{flowTemplate.status.length || "-"}</p>

                <p className="font-medium">Current Index:</p>
                <p>
                  {flowInstanceData?.data?.currentStatusIndex} (note: urutan
                  dimulai dari 0)
                </p>
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
