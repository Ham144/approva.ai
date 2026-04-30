import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Trash, ChevronUp, ChevronDown, History, Menu } from "lucide-react";
import PreviewFlow from "./PreviewFlow";
import { useResponseCollector, useUserInfo } from "@/store";
import flowInstanceApi from "@/api/flowInstanceApi";
import toast from "react-hot-toast";
import ApprovalButton from "./ApprovalButton";
import ProcessActionOption from "./ProcessActionOption";

export default function StatusFullfillmentPage() {
  const navigate = useNavigate();

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
    selectedAuthorized,
    setSelectedAuthorized,
  } = useResponseCollector();

  const queryClient = useQueryClient();
  const {
    mutateAsync: handleSubmitStatus,
    isPending: isLoadinghandleSubmitStatus,
  } = useMutation({
    mutationKey: ["flowInstance", "status", "fullfillment"],
    mutationFn: async () =>
      flowInstanceApi.submitStatusFulfillment(
        instanceId,
        statuses[currentStatusIndex],
        [selectedAuthorized],
      ),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["instance", instanceId] });
      toast.success(res?.message);
      toast.loading("memeriksa status untuk anda...");
      setTimeout(() => {
        navigate(`/`);
        toast.dismiss();
      }, 1000);
      setSelectedAuthorized([]);
    },
    onError: (er) => {
      toast.error(er?.response?.data?.message);
    },
  });

  const {
    data: flowInstanceData,
    isLoading: isIsntanceAndTempalteLoading,
    isError: isFlowError,
    refetch: resetCurrentStatusIndex,
  } = useQuery({
    queryKey: ["instance", instanceId],
    queryFn: async () => {
      const res = await flowInstanceApi.getFlowInstanceById(instanceId);

      if (res.status == 200) {
        toast.success(res?.response?.data?.message);
      }
      return res;
    },
    enabled: !!instanceId,
  });

  const { userInfo, setUserInfo } = useUserInfo();
  useEffect(() => {
    if (flowInstanceData?.userInfo) {
      setUserInfo(flowInstanceData.userInfo);
    }
    if (flowInstanceData?.data?.requestData) {
      setFullRequestData(flowInstanceData.data.requestData);
      setOveralStatus(flowInstanceData.data.overallStatus);
      setInstanceTitle(flowInstanceData.data.instanceTitle);
      setStatuses(
        flowInstanceData.data?.statuses?.map((status, index) => ({
          ...status,
          ...flowInstanceData?.data?.flowTemplate?.status[index],
        })),
      );
      setCurrentStatusIndex(flowInstanceData.data.currentStatusIndex);

      if (
        flowInstanceData?.data?.flowTemplate?.status[currentStatusIndex]
          ?.authorized
      ) {
        const isMyTurn = flowInstanceData?.data?.flowTemplate?.status[
          currentStatusIndex
        ].authorized.findIndex((current) => current?._id === userInfo?._id);
        setTimeout(() => {
          if (isMyTurn === -1 && instanceId) {
            toast.error(
              "Status ini telah berlalu, mungkin tahap telah didelegasikan kepada orang lain",
            );
            setTimeout(() => {
              navigate(`/status/isOnlyPreview/${instanceId}`);
            }, 300);
          }
        }, 0);
      }
    }
  }, [
    flowInstanceData?.data?.requestData,
    setRequestData,
    flowInstanceData?.data?.flowTemplate?.status[currentStatusIndex]
      ?.authorized,
  ]);

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
    <div className="flex flex-col h-screen bg-blue-100 dark:bg-gray-900">
      {/* Konten Utama yang Bisa di-Scroll */}
      <div className="flex-1  overflow-y-auto px-2 pb-36 pt-2 custom-scrollbar">
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
          {/* PreviewFlow Component */}
          <PreviewFlow
            isForApproval={true}
            isForRequest={false}
            isOnlyPreview={false}
            jsonFlow={flowTemplate}
            key={"approval"}
          />
        </div>
      </div>

      {/* FOOTER KONTROL (ApprovalButton - Selalu Tampak) */}
      <div className="fixed bottom-14 left-0 right-0 z-20 dark:bg-gray-800 p-3 sm:p-4 shadow-lg  border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-5 gap-3 items-center bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            {/* Menu Button - 1 kolom (20%) */}
            <button
              onClick={() =>
                document.getElementById("modalprocessaction").showModal()
              }
              className="col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 
               bg-gradient-to-r from-gray-50 to-gray-100 
               hover:from-gray-100 hover:to-gray-200
               text-gray-700 rounded-lg transition-all duration-200
               border border-gray-200 shadow-sm hover:shadow
               group"
            >
              <Menu className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
              <span className="text-sm font-medium hidden sm:inline">Menu</span>
            </button>

            {/* Approval Button Container - 4 kolom (80%) */}
            <div className="col-span-4">
              <div className="w-full max-w-full">
                <ApprovalButton
                  handleSubmitStatus={handleSubmitStatus}
                  isOnlyPreview={false}
                  isLoadinghandleSubmitStatus={isLoadinghandleSubmitStatus}
                  logics={flowTemplate?.logics}
                  allStatuses={statuses}
                  key={"approval-button"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProcessActionOption
        key={"modalprocessaction"}
        selectedInstance={flowInstanceData?.data}
      />
    </div>
  );
}
