import { useEffect, useState } from "react";
import { useResponseCollector } from "@/store";
import { CheckCircle2, XCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function ApprovalButton({
  isOnlyPreview,
  handleSubmitStatus,
  isLoadinghandleSubmitStatus,
}) {
  const {
    statuses,
    setStatuses,
    currentStatusIndex,
    setSelectedAuthorized,
    selectedAuthorized,
  } = useResponseCollector();
  const verdict = statuses[currentStatusIndex]?.verdict;
  const rejectedReason = statuses[currentStatusIndex]?.rejectedReason;
  const [isApprovalButtonVisible, setIsApprovalButtonVisible] = useState(false);

  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  function handleSelect(verdict) {
    const statusesCopy = [...statuses];
    console.log(statusesCopy);
    statusesCopy[currentStatusIndex].verdict = verdict;
    setStatuses(statusesCopy);
  }

  function onChangeRejectedReason(e) {
    const statusesCopy = [...statuses];
    statusesCopy[currentStatusIndex].rejectedReason = e.target.value;
    setStatuses(statusesCopy);
  }

  useEffect(() => {
    if (action && verdict === "pending") {
      if (action == "approve") {
        handleSelect("approved");
      }
      if (action == "reject") {
        handleSelect("rejected");
      }
    }
  }, [statuses, action]);

  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      id={"verdict"}
      className="space-y-4 p-4 rounded-lg backdrop border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* Tampilan Preview (isOnlyPreview true) */}
      {isOnlyPreview ? (
        <div
          className={`
            text-sm sm:text-base font-semibold text-center px-4 py-3 rounded-lg border-2 flex items-center justify-center gap-2
            ${
              verdict === "approved"
                ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                : verdict === "rejected"
                ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 italic"
            }
          `}
        >
          {verdict === "approved" ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Disetujui
            </>
          ) : verdict === "rejected" ? (
            <>
              <XCircle className="w-4 h-4" /> Ditolak
            </>
          ) : (
            "Menunggu Keputusan" // Teks default jika verdict tidak ada
          )}
        </div>
      ) : (
        /* Tampilan Pilihan (isOnlyPreview false) */ <div className="dropdown dropdown-top w-full">
          <label
            tabIndex={0}
            className="h-6 cursor-pointer text-center bg-primary rounded-md flex items-center justify-center text-white w-full sm:w-auto"
          >
            Continue
          </label>

          <div
            tabIndex={0}
            className="dropdown-content z-[1] card card-compact w-full shadow-xl"
          >
            <div className="card-body w-full space-y-4 bg-white">
              {/* Bagian Deskripsi dan Info Badge */}
              {verdict != "rejected" &&
                currentStatusIndex < statuses.length - 1 && (
                  <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {/* Untuk memilih authorized User  */}
                    <div className="mb-6">
                      {/* Toggle Button */}
                      <button
                        onClick={() => setIsVisible(!isVisible)}
                        className="flex items-center gap-2 mb-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span className="font-medium">
                          {isVisible ? "Sembunyikan" : "Tampilkan"} Pilihan
                          Pemberitahuan
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transition-transform ${
                            isVisible ? "rotate-180" : ""
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Content */}
                      {isVisible && (
                        <div className="flex flex-col p-2 bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 overflow-y-auto ">
                          <p className="text-lg font-medium text-gray-700 mb-4 px-2">
                            Berikut Pilihan yang telah ditetapkan untuk
                            pemberitahuan langsung
                            <span className="block text-sm text-gray-500 mt-1 font-normal">
                              (yang tidak dipilih juga dapat mengisi persetujuan
                              sebagai alternatif)
                            </span>
                          </p>

                          <div className="flex flex-wrap gap-3 p-2">
                            {statuses[currentStatusIndex + 1]?.authorized?.map(
                              (authorized) => {
                                const isSelected = selectedAuthorized?.includes(
                                  authorized._id
                                );
                                return (
                                  <button
                                    key={authorized._id}
                                    className={`cursor-pointer px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 flex-shrink-0 
                flex items-center space-x-2 border-2
                ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-700 shadow-md transform scale-105"
                    : "bg-white text-gray-700 hover:bg-blue-50 border-gray-200 hover:border-blue-300"
                }`}
                                    onClick={() => {
                                      setSelectedAuthorized(authorized._id);
                                    }}
                                  >
                                    <span className="font-medium">
                                      {authorized.displayName ||
                                        authorized.username}
                                    </span>
                                    {isSelected && (
                                      <span className="bg-white text-blue-600 rounded-full p-0.5">
                                        ✓
                                      </span>
                                    )}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="mb-2 font-medium">
                      Pilih keputusan akhir untuk melanjutkan proses atau
                      menolak.
                    </p>
                  </div>
                )}

              {/* Loader */}
              {isLoadinghandleSubmitStatus && (
                <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="loading loading-spinner loading-sm mr-2 text-blue-500"></span>
                  Mengirim email...
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {/* Approve Button */}
                <button
                  disabled={isOnlyPreview || isLoadinghandleSubmitStatus}
                  onClick={() => {
                    if (!isVisible) return setIsVisible(true);
                    handleSelect("approved");
                    onChangeRejectedReason({ target: { value: "" } });
                    handleSubmitStatus();
                  }}
                  className={`btn py-3 px-4 font-semibold text-white transition-all duration-300 shadow flex items-center justify-center gap-2
            ${
              verdict === "approved"
                ? "bg-green-600 dark:bg-green-700 border-2 border-green-800 ring-2 ring-green-400"
                : "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
            }
            ${isOnlyPreview ? "opacity-50 cursor-not-allowed" : ""}
          `}
                >
                  {isLoadinghandleSubmitStatus ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </>
                  )}
                </button>

                {/* Reject Button */}
                <button
                  disabled={isOnlyPreview || isLoadinghandleSubmitStatus}
                  onClick={() => handleSelect("rejected")}
                  className={`btn py-3 px-4 font-semibold text-white transition-all duration-300 shadow flex items-center justify-center gap-2
            ${
              verdict === "rejected"
                ? "bg-red-600 dark:bg-red-700 border-2 border-red-800 ring-2 ring-red-400"
                : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            }
            ${isOnlyPreview ? "opacity-50 cursor-not-allowed" : ""}
          `}
                >
                  {isLoadinghandleSubmitStatus ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Reject
                    </>
                  )}
                </button>
              </div>

              {/* Reject Reason */}
              {verdict === "rejected" && (
                <div className="flex flex-col gap-3 w-full">
                  <textarea
                    onChange={onChangeRejectedReason}
                    autoFocus
                    value={rejectedReason || ""}
                    placeholder="Berikan alasan penolakan di sini..."
                    className="textarea textarea-bordered w-full min-h-[80px] rounded-lg
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500
              transition-colors resize-y"
                  />
                  <button
                    onClick={handleSubmitStatus}
                    disabled={!rejectedReason || isLoadinghandleSubmitStatus}
                    className="btn btn-error w-full sm:w-auto"
                  >
                    Kirim Penolakan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
