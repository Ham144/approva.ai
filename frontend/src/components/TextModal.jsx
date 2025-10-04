import React from "react";

const TextModal = ({ isOpen, onClose, text, title = "Detail Teks" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Konten Lengkap:</span>
            </label>
            <div className="bg-gray-50 p-4 rounded-lg border max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono break-words">
                {text || "Tidak ada teks"}
              </pre>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Jumlah Karakter</div>
              <div className="stat-value text-primary">
                {text ? text.length : 0}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Jumlah Kata</div>
              <div className="stat-value text-secondary">
                {text
                  ? text.split(/\s+/).filter((word) => word.length > 0).length
                  : 0}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>
            Tutup
          </button>
          <button
            className="btn btn-outline"
            onClick={() => {
              if (text) {
                navigator.clipboard.writeText(text);
                // You can add a toast notification here
              }
            }}
          >
            📋 Salin Teks
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default TextModal;
