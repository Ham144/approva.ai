// Component Modal untuk Zoom Attachment
export function AttachmentModal({ isOpen, onClose, attachments, isLoading }) {
  if (!isOpen) return null;

  // Extract attachment URLs from the new data format
  const attachmentUrls = attachments?.attachments?.map((att) => att.url) || [];

  return (
    <dialog className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mb-4">Attachments</h3>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : attachmentUrls.length === 0 ? (
          <div className="text-center text-gray-400">Tidak ada attachment</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attachmentUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Attachment ${idx + 1}`}
                  className="w-full h-full object-contain rounded-lg border"
                />
                {attachments?.attachments?.[idx]?.serialNumber && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    SN: {attachments.attachments[idx].serialNumber}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {attachments?.signature && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Signature</h4>
            <div className="relative aspect-[3/1]">
              <img
                src={attachments.signature.url}
                alt="Customer Signature"
                className="w-full h-full object-contain rounded-lg border"
              />
            </div>
          </div>
        )}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
