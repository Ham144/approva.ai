import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Trash, ChevronUp, ChevronDown, History } from "lucide-react";
import PreviewFlow from "./PreviewFlow";
import { useResponseCollector, useUserInfo } from "@/store";
import flowInstanceApi from "@/api/flowInstanceApi";
import toast from "react-hot-toast";
import ApprovalButton from "./ApprovalButton";

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
        [selectedAuthorized]
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
    queryFn: () => flowInstanceApi.getFlowInstanceById(instanceId),
    enabled: !!instanceId,
  });

  const { userInfo } = useUserInfo();
  useEffect(() => {
    if (flowInstanceData?.data?.requestData) {
      setFullRequestData(flowInstanceData.data.requestData);
      setOveralStatus(flowInstanceData.data.overallStatus);
      setInstanceTitle(flowInstanceData.data.instanceTitle);
      setStatuses(
        flowInstanceData.data?.statuses?.map((status, index) => ({
          ...status,
          ...flowInstanceData?.data.flowTemplate?.status[index],
        }))
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
              "Status ini telah berlalu, mungkin tahap telah didelegasikan kepada orang lain"
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
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
      {/* HEADER KONTROL (Selalu Tampak) */}
      <div className="sticky top-0 z-20 bg-gray-100 dark:bg-gray-900 p-2 sm:p-3 shadow-md border-b border-gray-200 dark:border-gray-700 ">
        <div className="flex gap-x-3">
          <button
            onClick={() => {
              navigate(-1);
            }}
            className=" btn  btn-outline text-primary-focus dark:text-primary-content border-primary-focus dark:border-primary-content hover:bg-primary-focus hover:text-white dark:hover:bg-primary-content dark:hover:text-gray-900 rounded py-2 px-4 flex items-center justify-center font-semibold text-sm"
          >
            <Trash size={18} className="mr-1" /> Bersihkan Input
          </button>
          <button
            onClick={() => {
              toast("Belum tersedia");
            }}
            className=" btn  btn-outline text-primary-focus dark:text-primary-content border-primary-focus dark:border-primary-content hover:bg-primary-focus hover:text-white dark:hover:bg-primary-content dark:hover:text-gray-900 rounded py-2 px-4 flex items-center justify-center font-semibold text-sm"
          >
            <History size={18} className="mr-1" /> Meminta Rollback
          </button>
        </div>
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
                    ?.map((user) => user.username)
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

          {/* PreviewFlow Component */}
          <div className="">
            <PreviewFlow
              isForApproval={true}
              isForRequest={false}
              isOnlyPreview={false}
              jsonFlow={flowTemplate}
              key={"approval"}
            />
          </div>
        </div>
      </div>

      {/* FOOTER KONTROL (ApprovalButton - Selalu Tampak) */}
      <div className="fixed bottom-14 left-0 right-0 z-20 dark:bg-gray-800 p-3 sm:p-4 shadow-lg  border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-4xl">
          <ApprovalButton
            handleSubmitStatus={handleSubmitStatus}
            isOnlyPreview={false}
            isLoadinghandleSubmitStatus={isLoadinghandleSubmitStatus}
            key={"approval-button"}
          />
        </div>
      </div>
    </div>
  );
}
