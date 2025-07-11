import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useResponseCollector } from "@/store";
import flowInstanceApi from "@/api/flowInstanceApi";
import flowApi from "@/api/flowApi";
import PreviewFlow from "@/components/PreviewFlow";
import toast from "react-hot-toast";
import { CheckCircle, Save, Trash } from "lucide-react";

export default function RequestStartCreatePage() {
  const { id } = useParams();
  const {
    instanceTitle,
    requestData,
    setRequestData,
    resetRequestData,
    overallStatus,
    setOveralStatus,
  } = useResponseCollector();

  // Fetch flow data
  const {
    data: flowData,
    isLoading: isFlowLoading,
    isError: isFlowError,
  } = useQuery({
    queryKey: ["flowTemplate", id],
    queryFn: () => flowApi.getFlowById(id),
    enabled: !!id,
  });

  const navigate = useNavigate();

  //flow Data instance untuk memulai flow instance baru
  const { mutateAsync: handleSubmitNewRequest } = useMutation({
    mutationKey: ["flowInstance", id],
    mutationFn: async () =>
      await flowInstanceApi.requestNewFlowInstance({
        instanceTitle,
        flowTemplateId: id,
        overallStatus,
        requestData,
      }),
    onSuccess: (res) => {
      toast.success(res?.message);
      //kembali instance Id
      navigate(`/process?isMyRequestOnlyQuery=true`);
      resetRequestData();
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.message);
    },
  });

  if (isFlowLoading) {
    return <div className="text-center py-10">Loading...</div>;
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
          onClick={handleSubmitNewRequest}
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
          onClick={resetRequestData}
          className="
          flex-1 min-w-[150px] sm:min-w-[180px] px-6 py-3
          bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg
          shadow-md transition-all duration-300 ease-in-out
          flex items-center justify-center gap-2
          focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Clear all input fields"
        >
          <Trash className="w-5 h-5" />
          Bersihkan
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
        onChange={setRequestData}
        jsonFlow={flowData?.data}
        isForRequest={true}
        key={"request-form"}
      />
    </div>
  );
}
