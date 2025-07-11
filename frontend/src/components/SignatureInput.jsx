import React, { useRef, useEffect, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useResponseCollector } from "../store";

const SignatureInput = ({ input, isOnlyPreview, inputRefs }) => {
  const sigRef = useRef();
  const containerRef = useRef();
  const { requestData, setRequestData } = useResponseCollector();

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  const existingSignature = requestData[input._id];

  useEffect(() => {
    const updateCanvasDimensions = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const newHeight = (parentWidth / 5) * 2; // Menjaga rasio 5:2
        setCanvasDimensions({ width: parentWidth, height: newHeight });
      }
    };

    updateCanvasDimensions();
    window.addEventListener("resize", updateCanvasDimensions);

    return () => {
      window.removeEventListener("resize", updateCanvasDimensions);
    };
  }, []);

  useEffect(() => {
    if (sigRef.current && existingSignature && canvasDimensions.width > 0) {
      // Pastikan untuk menghapus konten kanvas sebelumnya jika Anda memuat ulang
      // Ini penting untuk mencegah "double" tanda tangan jika state di-reapply
      if (!sigRef.current.isEmpty()) {
        sigRef.current.clear();
      }
      sigRef.current.fromDataURL(existingSignature);
    }
  }, [existingSignature, canvasDimensions]);

  // --- Pastikan fungsi-fungsi ini didefinisikan di sini ---
  const handleSignatureEnd = () => {
    if (sigRef.current.isEmpty()) {
      setRequestData(input._id, null);
    } else {
      setRequestData(input._id, sigRef.current.toDataURL());
    }
  };

  const handleClearSignature = () => {
    sigRef.current.clear();
    setRequestData(input._id, null);
  };
  // --- Akhir definisi fungsi ---

  return (
    <div
      ref={(el) => {
        inputRefs.current[input._id] = el;
        containerRef.current = el;
      }}
      id={input._id}
      className="border rounded-lg p-4 bg-white shadow-sm"
    >
      <p className="text-sm text-gray-600 mb-3">{input.help}</p>
      {canvasDimensions.width > 0 && (
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{
            width: canvasDimensions.width,
            height: canvasDimensions.height,
            className: "border border-gray-300 w-full bg-white rounded",
          }}
          onEnd={handleSignatureEnd}
        />
      )}
      {!isOnlyPreview && (
        <button
          onClick={handleClearSignature}
          className="btn btn-sm btn-outline mt-3"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear Signature
        </button>
      )}
    </div>
  );
};

export default SignatureInput;
