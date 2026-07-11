import React, { useEffect, useState } from "react";
import { useResponseCollector } from "@/store";
import ZoomableImage from "./ZoomableImage";
import SelectInputInsideTable from "./SelectInputInsideTable";
import TextModal from "./TextModal";
import FileApi from "@/api/fileApi";
import toast from "react-hot-toast";
import { FileText, Download } from "lucide-react";

const TableInput = ({
  input,
  inputRefs,
  baseProps,
  isRequirementInput,
  statusIndex,
}) => {
  const { requestData, setRequirement, setRequestData, statuses } =
    useResponseCollector();

  // State untuk modal text
  const [textModal, setTextModal] = useState({
    isOpen: false,
    text: "",
    title: "",
  });

  const keys = input?.table?.keys ?? [];
  const keysType = input?.table?.keysType ?? [];

  let tableRows = [];

  if (isRequirementInput) {
    const status = statuses?.[statusIndex];
    const requirementData = status?.requirementsData?.[input._id];
    tableRows = Array.isArray(requirementData) ? requirementData : [];
  } else {
    const data = requestData?.[input._id];
    tableRows = Array.isArray(data) ? data : [];
  }

  useEffect(() => {
    if (tableRows?.length === 0) {
      const initialEmptyRow = { values: keys.map(() => "") };
      if (isRequirementInput) {
        setRequirement(statusIndex, input._id, [initialEmptyRow]);
      } else {
        setRequestData(input._id, [initialEmptyRow]);
      }
    }
  }, [input._id, keys.length]);

  const handleChange = (rowIdx, colIdx, value) => {
    const updatedRows = [...tableRows];
    if (!updatedRows[rowIdx]) return;
    updatedRows[rowIdx].values ??= keys.map(() => "");
    updatedRows[rowIdx].values[colIdx] = value;

    if (isRequirementInput) {
      setRequirement(statusIndex, input._id, updatedRows);
    } else {
      setRequestData(input._id, updatedRows);
    }
  };

  const handleFileUpload = async (rowIdx, colIdx, file, colType) => {
    if (!file) {
      handleChange(rowIdx, colIdx, null);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipe", colType);

    try {
      const res = await FileApi.uploadImage(formData);
      handleChange(rowIdx, colIdx, res.url);
    } catch {
      toast.error("Gagal upload file.");
    }
  };

  const handleDownloadFile = async (fileName) => {
    if (!fileName) {
      toast.error("File tidak ditemukan");
      return;
    }

    try {
      const filename = fileName.includes("/")
        ? fileName.split("/").pop()
        : fileName;
      const blob = await FileApi.downloadFile(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("File berhasil didownload");
    } catch {
      toast.error("Gagal mendownload file");
    }
  };

  const addRow = () => {
    const newRow = { values: keys.map(() => "") };
    if (isRequirementInput) {
      setRequirement(statusIndex, input._id, [...tableRows, newRow]);
    } else {
      setRequestData(input._id, [...tableRows, newRow]);
    }
  };

  const removeRow = (rowIdx) => {
    if (isRequirementInput) {
      setRequirement(
        statusIndex,
        input._id,
        tableRows.filter((_, i) => i !== rowIdx),
      );
    } else {
      setRequestData(
        input._id,
        tableRows.filter((_, i) => i !== rowIdx),
      );
    }
  };

  // Fungsi untuk menangani pembukaan modal text
  const handleTextModal = (text, columnName) => {
    setTextModal({
      isOpen: true,
      text: text,
      title: `Detail - ${columnName}`,
    });
  };

  // Fungsi untuk menutup modal
  const closeTextModal = () => {
    setTextModal({
      isOpen: false,
      text: "",
      title: "",
    });
  };

  // Fungsi untuk mendeteksi apakah text overflow
  const isTextOverflow = (text, maxLength = 50) => {
    return text && text.length > maxLength;
  };

  return (
    <div
      ref={(el) => (inputRefs.current[input._id] = el)}
      id={input._id}
      className="space-y-2"
    >
      {input.help && <p className="text-sm text-gray-600 mb-1">{input.help}</p>}

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              {keys.map((key, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {key}
                </th>
              ))}
              {!baseProps?.disabled && (
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableRows?.map((row, rIdx) => {
              const values = Array.isArray(row.values)
                ? row.values
                : keys.map(() => "");

              return (
                <tr key={rIdx} className="hover:bg-gray-50">
                  {values.map((val, cIdx) => {
                    const colType = keysType[cIdx] || "text";

                    return (
                      <td key={cIdx} className="px-4 py-3 align-top">
                        {colType === "image" || colType === "pdf" ? (
                          <div className="space-y-3 max-w-40 text-wrap">
                            {baseProps?.disabled ? (
                              <>
                                {colType === "image" && val && (
                                  <div className="flex justify-center">
                                    <ZoomableImage
                                      src={val}
                                      className="max-h-28 rounded-lg border shadow-sm"
                                    />
                                  </div>
                                )}

                                {colType === "pdf" && val && (
                                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-base-200 to-base-100 rounded-lg border border-base-300 shadow-sm">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="p-2 bg-gradient-to-br from-error/20 to-error/10 rounded-lg flex-shrink-0">
                                        <FileText className="w-5 h-5 text-error" />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="font-semibold text-base-content truncate">
                                          {val}
                                        </div>
                                        <div className="text-xs text-base-content/60 flex items-center gap-1">
                                          <FileText className="w-3 h-3" />
                                          PDF Document
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadFile(val)}
                                      className="btn btn-sm btn-ghost text-success hover:bg-success/10 flex-shrink-0"
                                      title="Download PDF"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}

                                {!val && (
                                  <p className="text-sm text-base-content/50 italic text-center">
                                    Belum ada file.
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="flex flex-col gap-3">
                                <div className="flex flex-wrap gap-2">
                                  <label className="btn btn-primary btn-sm cursor-pointer text-white rounded-md">
                                    <span className="i-ph-upload-simple-duotone mr-2" />
                                    Upload File
                                    <input
                                      type="file"
                                      accept={
                                        colType === "image" ? "image/*" : ".pdf"
                                      }
                                      {...baseProps}
                                      className="hidden"
                                      onChange={(e) =>
                                        handleFileUpload(
                                          rIdx,
                                          cIdx,
                                          e.target.files?.[0],
                                          colType,
                                        )
                                      }
                                    />
                                  </label>

                                  {colType === "image" && (
                                    <label className="btn btn-secondary btn-sm cursor-pointer">
                                      <span className="i-ph-camera-duotone mr-2" />
                                      Ambil Foto
                                      <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        {...baseProps}
                                        className="hidden"
                                        onChange={(e) =>
                                          handleFileUpload(
                                            rIdx,
                                            cIdx,
                                            e.target.files?.[0],
                                            colType,
                                          )
                                        }
                                      />
                                    </label>
                                  )}
                                </div>

                                {colType === "image" && val && (
                                  <div className="relative group w-fit mx-auto">
                                    <ZoomableImage
                                      src={val}
                                      className="max-h-28 rounded-lg border shadow-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleDownloadFile(val)}
                                      className="absolute top-2 right-2 btn btn-sm btn-circle btn-primary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Download Image"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}

                                {colType === "pdf" &&
                                  val &&
                                  typeof val === "string" && (
                                    <div className="flex items-center justify-between gap-2 text-sm text-base-content/80 bg-base-200 p-2 rounded-md">
                                      <div className="flex items-center gap-2 overflow-hidden min-w-0">
                                        <span className="i-ph-file-pdf-duotone text-error flex-shrink-0" />
                                        <span className="truncate">
                                          File dipilih: <strong>{val}</strong>
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadFile(val)}
                                        className="btn btn-sm btn-ghost text-success hover:bg-success/10 flex-shrink-0"
                                        title="Download PDF"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                        ) : colType === "select" ? (
                          <div
                            ref={(el) => (inputRefs.current[input._id] = el)}
                            id={input._id}
                            className="space-y-1"
                          >
                            <SelectInputInsideTable
                              input={input?.table?.sourceDataList[cIdx]}
                              baseProps={baseProps}
                              value={val}
                              onChange={(v) => handleChange(rIdx, cIdx, v)}
                            />
                          </div>
                        ) : colType === "number" ? (
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            {...baseProps}
                            className={`p-4 rounded-md  w-full ${
                              baseProps.disabled
                                ? "bg-white font-bold text-black"
                                : "input input-bordered"
                            }`}
                            value={(() => {
                              const num = Number(
                                val?.toString().replace(/\./g, ""),
                              );
                              return !isNaN(num) && val !== ""
                                ? num.toLocaleString("id-ID")
                                : val;
                            })()}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\./g, "");
                              handleChange(rIdx, cIdx, raw);
                            }}
                          />
                        ) : (
                          <div className="space-y-2">
                            <input
                              type={colType === "date" ? "date" : colType}
                              className={`p-4 rounded-md  w-full ${
                                baseProps.disabled
                                  ? "bg-white font-bold text-black"
                                  : "input input-bordered"
                              }`}
                              value={val}
                              onChange={(e) =>
                                handleChange(rIdx, cIdx, e.target.value)
                              }
                              {...baseProps}
                            />

                            {/* Tombol lihat detail untuk text yang panjang */}
                            {colType === "text" && isTextOverflow(val) && (
                              <button
                                type="button"
                                className="btn btn-xs btn-outline btn-info w-full"
                                onClick={() => handleTextModal(val, keys[cIdx])}
                              >
                                <span className="i-ph-eye-duotone mr-1" />
                                Lihat Detail
                              </button>
                            )}

                            {/* Preview text untuk disabled mode */}
                            {baseProps?.disabled &&
                              colType === "text" &&
                              val && (
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-600 truncate">
                                    {val}
                                  </div>
                                  {isTextOverflow(val) && (
                                    <button
                                      type="button"
                                      className="btn btn-xs btn-outline btn-info"
                                      onClick={() =>
                                        handleTextModal(val, keys[cIdx])
                                      }
                                    >
                                      <span className="i-ph-eye-duotone mr-1" />
                                      Lihat Detail
                                    </button>
                                  )}
                                </div>
                              )}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {!baseProps?.disabled && (
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => removeRow(rIdx)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        ✕ Hapus
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!baseProps?.disabled && (
        <button
          className="btn btn-sm btn-outline mt-2 flex items-center gap-2"
          onClick={addRow}
        >
          ➕ Tambah Baris
        </button>
      )}

      {/* Modal untuk menampilkan teks lengkap */}
      <TextModal
        isOpen={textModal.isOpen}
        onClose={closeTextModal}
        text={textModal.text}
        title={textModal.title}
      />
    </div>
  );
};

export default TableInput; // Jangan lupa export komponen Anda
