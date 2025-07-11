import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useResponseCollector } from "@/store";
import flowInstanceApi from "@/api/flowInstanceApi";
import PreviewFlow from "@/components/PreviewFlow";
import toast from "react-hot-toast";
import { CheckCircle, Save, Trash } from "lucide-react";
import { useEffect } from "react";

export default function RequestEditPage() {
  const { instanceId } = useParams();
  const {
    instanceTitle,
    requestData,
    setRequestData,
    setFullRequestData,
    overallStatus,
    setOveralStatus,
    setInstanceTitle,
  } = useResponseCollector();

  const {
    data: flowInstanceData,
    isLoading: isFlowInstanceLoading,
    isError: isFlowError,
    refetch: refetchFlowInstanceById,
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
    }
  }, [flowInstanceData?.data?.requestData, setRequestData]);
  const flowTemplate = flowInstanceData?.data.flowTemplate;

  const navigate = useNavigate();

  //flow Data instance untuk memulai flow instance baru
  const { mutateAsync: handleSubmitEditRequest } = useMutation({
    mutationKey: ["flowInstance", instanceId],
    mutationFn: () =>
      flowInstanceApi.editRequestFlowInstance({
        instanceId,
        instanceTitle,
        overallStatus,
        requestData,
      }),
    onSuccess: (res) => {
      toast.success(res?.response?.data?.message || "berhasil update");
      //kembali instance Id
      navigate(`/process?isMyRequestOnlyQuery=true`);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  const resetToInitialRequestData = async () => {
    await refetchFlowInstanceById();
    await setRequestData(flowInstanceData?.data?.requestData);
  };

  if (isFlowInstanceLoading) {
    return (
      <div className="flex justify-center items-center mx-auto min-h-screen">
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
    <div className="flex flex-col mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-b-xl shadow-md border-t border-gray-200 dark:border-gray-700">
        {/* Save/Update Button */}
        <button
          onClick={handleSubmitEditRequest}
          className="
          flex-1 min-w-[150px] sm:min-w-[180px] px-6 py-3
          bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg
          shadow-md transition-all duration-300 ease-in-out
          flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        "
          aria-label="Save or Update Request"
        >
          <Save className="w-5 h-5" />
          Simpan
        </button>

        {/* Clear Input Button */}
        <button
          onClick={resetToInitialRequestData}
          className="
          flex-1 min-w-[150px] sm:min-w-[180px] px-6 py-3
          bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg
          shadow-md transition-all duration-300 ease-in-out
          flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Clear all input fields"
        >
          <Trash className="w-5 h-5" />
          Batal
        </button>

        {/* Status Dropdown */}
        <div className="relative flex-1 min-w-[150px] sm:min-w-[180px]">
          <select
            onChange={(e) => setOveralStatus(e.target.value)}
            value={overallStatus}
            className="
            appearance-none w-full px-5 py-3 pr-10
            bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
            rounded-lg shadow-sm text-gray-800 dark:text-gray-100 font-medium
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
            transition-all duration-300 ease-in-out cursor-pointer
          "
            aria-label="Select request status"
          >
            <option value={"draft"}>Draft</option>
            <option value={"in-progress"}>In Progress</option>
            {/* Tambahkan opsi lain jika ada, misal: */}
            <option disabled value={"rejected"}>
              Rejected
            </option>
            <option disabled value={"completed"}>
              Completed / Approved
            </option>
          </select>
          {/* Ikon panah kustom untuk dropdown */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
            <CheckCircle className="w-5 h-5" />{" "}
            {/* Atau gunakan ChevronDown jika lebih sesuai */}
          </div>
        </div>
      </div>
      <PreviewFlow
        isOnlyPreview={false}
        jsonFlow={flowTemplate}
        isForRequest={true}
        key={"request-form"}
        isForApproval={false}
      />
    </div>
  );
}
