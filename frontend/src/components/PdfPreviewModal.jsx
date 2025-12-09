import React from "react";
import { FileText, Download, X } from "lucide-react";
import FileApi from "@/api/fileApi";

const PdfPreviewModal = ({
  selectedPDF,
  setSelectedPDF,
  handleDownloadPDF,
}) => {
  // Extract filename dari URL jika perlu
  const getFilename = (filePath) => {
    if (!filePath) return "";
    return filePath.includes("/") ? filePath.split("/").pop() : filePath;
  };

  const filename = getFilename(selectedPDF);
  const previewUrl = FileApi.getFileUrl(filename);

  // Fallback: jika filename adalah full URL, gunakan langsung
  const finalPreviewUrl = selectedPDF?.startsWith("http")
    ? selectedPDF
    : previewUrl;

  return (
    <dialog id="pdfPreviewModal" className="modal modal-open">
      <div className="modal-box max-w-6xl max-h-[90vh] p-0 overflow-y-scroll">
        <div className="bg-base-200 p-4 flex items-center justify-between border-b border-base-300">
          <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
            <FileText className="w-5 h-5 text-error" />
            Preview: {filename}
          </h3>
          <button
            onClick={() => setSelectedPDF(null)}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="h-[calc(90vh-120px)] bg-gray-100">
          {/* Coba object tag dulu */}
          <object
            data={`${finalPreviewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            type="application/pdf"
            className="w-full h-full"
            aria-label="PDF Preview"
          >
            {/* Fallback: coba embed tag */}
            <embed
              src={`${finalPreviewUrl}#toolbar=0&navpanes=0&scrollbar=1`}
              type="application/pdf"
              className="w-full h-full"
            />
            {/* Fallback terakhir: link ke tab baru */}
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <p className="text-gray-600 mb-4">
                Browser Anda tidak mendukung preview PDF langsung.
              </p>
              <a
                href={finalPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Buka PDF di Tab Baru
              </a>
            </div>
          </object>
        </div>
        <div className="modal-action p-4 border-t border-base-300">
          <button
            onClick={() => {
              if (handleDownloadPDF) {
                handleDownloadPDF(selectedPDF);
              }
            }}
            className="btn btn-success text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => setSelectedPDF(null)}
            className="btn btn-ghost"
          >
            Tutup
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default PdfPreviewModal;
