import { Check } from "lucide-react";
import React from "react";

const FlowStatusModal = ({
  selectedFlow,
  onClose,
  mode = "previewStatus",
  onClick,
}) => {
  if (!selectedFlow) return null;

  return (
    <dialog id="statusmodal" className="modal">
      <div className="modal-box">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 transition-colors bg-red-200 rounded-lg p-4"
          aria-label="Tutup modal"
        >
          ✕{" "}
        </button>

        {/* Konten Modal */}
        <div className="p-6">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-4 border-b pb-3">
            Alur Persetujuan: {selectedFlow.title}
          </h3>

          <p className="text-gray-700 text-sm mb-6">{selectedFlow.desc}</p>

          <div className="space-y-5">
            <h4 className="text-lg font-bold text-indigo-700">
              Langkah-langkah Proses: {selectedFlow.status?.length} Langkah
            </h4>

            {/* Daftar Langkah dengan Visual Garis */}
            <ol className="relative border-l-2 border-indigo-400 pl-4 space-y-4">
              {selectedFlow.status.map((step, index) => (
                <li
                  onClick={(e) => {
                    if (mode === "undo") {
                      onSelectIndex(index);
                    }
                  }}
                  key={index}
                  className="relative py-1 hover:bg-indigo-300 rounded-lg  cursor-pointer"
                >
                  {/* Lingkaran Indikator Langkah yang lebih kecil */}
                  <span className="absolute  flex items-center justify-center w-7 h-7 rounded-full -left-7 bg-indigo-600 text-white font-bold text-xs shadow-md ring-4 ">
                    {index + 1}
                  </span>
                  <div className=" p-3 rounded-lg shadow-sm border ">
                    <h5 className="text-md font-medium text-gray-800">
                      {JSON.stringify(step)}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {step.authorized
                        .map((u) => u?.displayName || u?.username)
                        .join(" atau ")}
                    </p>
                  </div>
                </li>
              ))}
              <span className="absolute flex items-center justify-center w-7 h-7 rounded-full -left-4 bg-success text-white font-bold text-xs shadow-md ring-4 ring-white">
                <Check />
              </span>
              <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h5 className="text-md font-medium text-gray-800">Completed</h5>
              </div>
            </ol>
          </div>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default FlowStatusModal;
