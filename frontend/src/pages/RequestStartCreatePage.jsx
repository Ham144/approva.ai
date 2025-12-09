import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useResponseCollector } from "@/store";
import flowInstanceApi from "@/api/flowInstanceApi";
import flowApi from "@/api/flowApi";
import PreviewFlow from "@/components/PreviewFlow";
import toast from "react-hot-toast";
import { Check, CheckCircle, ChevronDown, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function RequestStartCreatePage() {
  const { id } = useParams();
  const {
    instanceTitle,
    requestData,
    setRequestData,
    resetRequestData,
    overallStatus,
    setOveralStatus,
    selectedAuthorized,
    setSelectedAuthorized,
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

  const [authorizedOptionBlinking, setAuthorizedOptionBlinking] =
    useState(false);
  const navigate = useNavigate();

  //flow Data instance untuk memulai flow instance baru
  const { mutateAsync: handleSubmitNewRequest, isPending: sendingEmail } =
    useMutation({
      mutationKey: ["flowInstance", id],
      mutationFn: async () =>
        await flowInstanceApi.requestNewFlowInstance({
          instanceTitle,
          flowTemplateId: id,
          overallStatus,
          requestData,
          selectedAuthorized,
        }),
      onSuccess: (res) => {
        toast.success(res?.message);
        //kembali instance Id
        setTimeout(() => {
          navigate(`/process?isMyRequestOnlyQuery=true`);
          resetRequestData();
        }, 500);
        setSelectedAuthorized([]);
      },
      onError: (err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      },
    });

  useEffect(() => {
    if (authorizedOptionBlinking) {
      const timer = setTimeout(() => {
        setAuthorizedOptionBlinking(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [authorizedOptionBlinking]);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-6">
        {/* Floating Action Bar - Sticky di atas */}
        <div className="sticky top-0 z-10 mb-4">
          <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Save/Update Button */}
            <button
              disabled={sendingEmail}
              onClick={async () => {
                if (selectedAuthorized?.length) {
                  await handleSubmitNewRequest();
                } else {
                  toast.error(
                    "Anda belum memilih next approval yang ditujukan langsung"
                  );
                  setAuthorizedOptionBlinking(true);
                }
              }}
              className="
                flex-1 min-w-[140px] sm:min-w-[160px] px-5 py-3
                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                text-white font-semibold rounded-xl
                shadow-md hover:shadow-lg transition-all duration-300
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              aria-label="Save or Update Request"
            >
              <Save className="w-5 h-5" />
              {sendingEmail ? "Mengirim..." : "Mulai Proses"}
            </button>

            {/* Clear Input Button */}
            <button
              onClick={resetRequestData}
              className="
                flex-1 min-w-[140px] sm:min-w-[160px] px-5 py-3
                bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700
                text-white font-semibold rounded-xl
                shadow-md hover:shadow-lg transition-all duration-300
                flex items-center justify-center gap-2
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
              "
              aria-label="Clear all input fields"
            >
              <Trash className="w-5 h-5" />
              Reset
            </button>

            {/* Status Dropdown */}
            <div className="relative flex-1 min-w-[140px] sm:min-w-[160px]">
              <select
                onChange={(e) => setOveralStatus(e.target.value)}
                value={overallStatus}
                className="
                  appearance-none w-full px-4 py-3 pr-10
                  bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600
                  rounded-xl shadow-sm text-gray-800 dark:text-gray-100 font-medium
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  transition-all duration-300 cursor-pointer
                  hover:border-gray-400 dark:hover:border-gray-500
                "
                aria-label="Select request status"
              >
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
              </select>
              {/* Custom dropdown arrow */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Authorized User Selection */}
        <div
          className={`mb-6 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-300 ${
            authorizedOptionBlinking
              ? "border-red-400 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Pemberitahuan Langsung
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Pilih penerima pemberitahuan utama (yang tidak dipilih tetap dapat
              memberikan persetujuan)
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {flowData?.data.status[0].authorized.map(
              (authorizedFirstStatus) => {
                const isSelected = selectedAuthorized?.includes(
                  authorizedFirstStatus._id
                );
                return (
                  <button
                    key={authorizedFirstStatus._id}
                    className={`
                    relative flex items-center gap-2 px-4 py-2.5 rounded-full
                    border-2 transition-all duration-300 hover:scale-[1.02]
                    active:scale-95 ${isSelected ? "z-10" : ""}
                    ${
                      isSelected
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg"
                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                    }
                  `}
                    onClick={() => {
                      console.log("Selected ID:", authorizedFirstStatus._id);
                      setSelectedAuthorized(authorizedFirstStatus._id);
                    }}
                  >
                    <span className="font-medium text-sm">
                      {authorizedFirstStatus.displayName ||
                        authorizedFirstStatus.username}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Main Content - Scrollable Area */}
        <div className="overflow-visible">
          <PreviewFlow
            isOnlyPreview={false}
            onChange={setRequestData}
            jsonFlow={flowData?.data}
            isForRequest={true}
            key="request-form"
          />
        </div>

        {/* Bottom Spacing untuk mobile */}
        <div className="h-16 sm:h-8"></div>
      </div>
    </div>
  );
}
