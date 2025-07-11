import { useEffect, useState } from "react";
import { renderHelpText } from "./PreviewFlow";
import { useResponseCollector } from "@/store";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ApprovalButton({ isOnlyPreview }) {
  const { statuses, setStatuses, currentStatusIndex } = useResponseCollector();
  const verdict = statuses[currentStatusIndex]?.verdict;
  const rejectedReason = statuses[currentStatusIndex]?.rejectedReason;

  function handleSelect(verdict) {
    const statusesCopy = [...statuses];
    statusesCopy[currentStatusIndex].verdict = verdict;
    setStatuses(statusesCopy);
  }

  function onChangeRejectedReason(e) {
    const statusesCopy = [...statuses];
    statusesCopy[currentStatusIndex].rejectedReason = e.target.value;
    setStatuses(statusesCopy);
  }

  return (
    <div
      id={"verdict"}
      className="space-y-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      {/* Bagian Deskripsi dan Info Badge */}
      <div className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
        <p className="mb-2 font-medium">
          Pilih keputusan akhir untuk melanjutkan proses atau menolak.
        </p>
      </div>

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
        /* Tampilan Pilihan (isOnlyPreview false) */
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex flex-1 w-full sm:w-auto gap-3">
            <button
              disabled={isOnlyPreview}
              className={`
                btn flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-md
                ${
                  verdict === "rejected"
                    ? "bg-red-600 dark:bg-red-700 border-2 border-red-800 dark:border-red-900 ring-2 ring-red-400 dark:ring-red-600" // Aktif dan terpilih
                    : "bg-red-500 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700" // Normal
                }
              `}
              onClick={() => handleSelect("rejected")}
            >
              <XCircle className="w-4 h-4 mr-1" /> Reject
            </button>

            <button
              disabled={isOnlyPreview}
              className={`
                btn flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 shadow-md
                ${
                  verdict === "approved"
                    ? "bg-green-600 dark:bg-green-700 border-2 border-green-800 dark:border-green-900 ring-2 ring-green-400 dark:ring-green-600" // Aktif dan terpilih
                    : "bg-green-500 dark:bg-green-600 hover:bg-green-700 dark:hover:bg-green-700" // Normal
                }
              `}
              onClick={() => {
                handleSelect("approved");
                onChangeRejectedReason({ target: { value: "" } });
              }}
            >
              <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
            </button>
          </div>

          {/* Input Alasan Penolakan */}
          {verdict === "rejected" && (
            <textarea
              onChange={(e) => onChangeRejectedReason(e)}
              value={rejectedReason || ""} // Pastikan value tidak undefined
              placeholder="Berikan alasan penolakan di sini..."
              className="
                textarea textarea-bordered w-full sm:w-2/3 md:w-1/2 min-h-[80px] p-3 rounded-lg border border-gray-300 dark:border-gray-600
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-500
                transition-colors duration-200 resize-y
              "
              rows="3" // Tetapkan tinggi awal yang lebih responsif
            />
          )}
        </div>
      )}
    </div>
  );
}
