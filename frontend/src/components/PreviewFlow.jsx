import { useEditor, useResponseCollector } from "../store";
import React, { useState, useEffect, useRef } from "react";
import SignatureInput from "./SignatureInput";
import NumberInput from "./NumberInput";
import TableInput from "./TableInput";
import SelectInput from "./SelectInput";
import MultipleCheckboxInput from "./MultipleCheckboxInput";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquareText,
  User2,
  FileText,
  Download,
} from "lucide-react";
import FileApi from "@/api/fileApi";
import toast from "react-hot-toast";
// import PdfPreviewModal from "./PdfPreviewModal";

export const renderHelpText = (input) => (
  <div className="mb-1 flex items-center gap-2">
    <p className="text-xs text-gray-500">{input.help}</p>
    {input.isNullable ? (
      <span className="text-xs text-gray-400 italic">(Opsional)</span>
    ) : (
      <span className="text-xs text-red-500 font-semibold">*</span>
    )}
  </div>
);

export default function PreviewFlow({
  jsonFlow,
  isOnlyPreview,
  isForRequest,
  isForApproval,
  forEditing = false,
}) {
  const [tableData, setTableData] = useState({});
  const [isJsonMode, setIsJsonMode] = useState(false);
  const { currentEditingInputID } = useEditor();
  const inputRefs = useRef({});

  const {
    instanceTitle,
    setInstanceTitle,
    requestData,
    setRequestData,
    statuses,
    currentStatusIndex,
    setRequirement,
  } = useResponseCollector();

  //pdf states
  // const [selectedPDF, setSelectedPDF] = useState(null);

  const flatInputs = jsonFlow
    ? [
        ...(jsonFlow?.request || []),
        ...(jsonFlow?.status || []).flatMap((s) => s.requirements),
      ]
    : [];

  // Fungsi untuk handle download file (PDF dan gambar)
  const handleDownloadPDF = async (fileName) => {
    if (!fileName) {
      toast.error("File tidak ditemukan");
      return;
    }

    try {
      // Extract filename dari URL jika perlu (jika fileName adalah full URL)
      const filename = fileName.includes("/")
        ? fileName.split("/").pop()
        : fileName;

      // Download file menggunakan FileApi
      const blob = await FileApi.downloadFile(filename);

      // Buat URL object dari blob
      const url = window.URL.createObjectURL(blob);

      // Buat link untuk download
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Cleanup
      window.URL.revokeObjectURL(url);

      toast.success("File berhasil didownload");
    } catch (error) {
      toast.error("Gagal mendownload file");
    }
  };

  useEffect(() => {
    if (!jsonFlow) return;
    const init = {};
    flatInputs
      .filter((i) => i.tipe === "table")
      .forEach((i) => {
        const keysLength = Array.isArray(i.table?.keys)
          ? i.table.keys.length
          : 0;
        init[i._id] = [{ values: Array(keysLength).fill("") }];
      });
    setTableData(init);
  }, [jsonFlow]);

  useEffect(() => {
    if (currentEditingInputID && inputRefs.current[currentEditingInputID]) {
      inputRefs.current[currentEditingInputID].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentEditingInputID]);

  //isDisabled untuk membedakan request dan status
  const renderInput = (input, isDisabled, isRequirementInput, statusIndex) => {
    const baseProps = {
      disabled: isOnlyPreview || (isDisabled && !forEditing),
    };

    switch (input.tipe) {
      // TEXT
      case "text":
        const rawValue = isRequirementInput
          ? (statuses[statusIndex]?.requirementsData || {})[input._id] || ""
          : requestData[input._id] || "";

        // Coba parse jadi number, lalu format, tapi hanya untuk tampilan
        const displayValue = (() => {
          const numericValue = Number(rawValue.toString().replace(/\./g, ""));
          if (!isNaN(numericValue) && rawValue !== "") {
            return numericValue.toLocaleString("id-ID"); // contoh: 1000 => 1.000
          }
          return rawValue;
        })();

        return (
          <div
            ref={(el) => (inputRefs.current[input._id] = el)}
            id={input._id}
            className="space-y-1"
          >
            {renderHelpText(input)}
            <input
              type="text"
              {...baseProps}
              placeholder={input.help}
              className={`p-4 rounded-md  w-full ${
                baseProps.disabled
                  ? "bg-white font-bold text-black"
                  : "input input-bordered"
              }`}
              value={displayValue}
              onChange={(e) => {
                // Hapus titik agar data yang disimpan tetap bersih
                const cleanedValue = e.target.value.replace(/\./g, "");

                if (isRequirementInput) {
                  setRequirement(currentStatusIndex, input._id, cleanedValue);
                } else {
                  setRequestData(input._id, cleanedValue);
                }
              }}
            />
          </div>
        );

      // TEXTAREA
      case "textArea":
        return (
          <div
            ref={(el) => (inputRefs.current[input._id] = el)}
            id={input._id}
            className="space-y-1"
          >
            {renderHelpText(input)}
            <textarea
              {...baseProps}
              placeholder={input.help}
              className={`p-4 rounded-md   w-full ${
                baseProps.disabled
                  ? "bg-white font-bold text-black"
                  : "textarea-primary textarea"
              }`}
              value={
                isRequirementInput
                  ? (statuses[statusIndex]?.requirementsData || {})[
                      input._id
                    ] || ""
                  : requestData[input._id] || ""
              }
              onChange={(e) =>
                isRequirementInput
                  ? setRequirement(
                      currentStatusIndex,
                      input._id,
                      e.target.value
                    )
                  : setRequestData(input._id, e.target.value)
              }
            />
          </div>
        );

      // HELPER
      case "helper":
        return (
          <div
            ref={(el) => (inputRefs.current[input._id] = el)}
            id={input._id}
            className="bg-white p-6 rounded-lg border border-gray-200 my-4"
          >
            {input.title && (
              <h2 className="text-black font-medium text-lg mb-3">
                {input.title}
              </h2>
            )}
            <div
              className="text-black whitespace-pre-wrap font-sans leading-normal"
              style={{ wordBreak: "break-word" }}
            >
              {input.help}
            </div>
          </div>
        );
      case "number": //✅
        return (
          <NumberInput
            key={input._id}
            input={input}
            isOnlyPreview={isOnlyPreview}
            inputRefs={inputRefs}
            baseProps={baseProps}
            statusIndex={statusIndex}
            isRequirementInput={isRequirementInput}
          />
        );

      case "date":
        return (
          <div
            ref={(el) => (inputRefs.current[input._id] = el)}
            id={input._id}
            className="space-y-1"
          >
            {renderHelpText(input)}
            <input
              type="date"
              {...baseProps}
              className={`p-4 rounded-md  w-full ${
                baseProps.disabled
                  ? "bg-white font-bold text-black"
                  : "input input-bordered"
              }`}
              style={
                baseProps.disabled
                  ? {
                      backgroundColor: "#f3f4f6", // gray-100
                      color: "#374151", // gray-700
                      opacity: 1,
                      cursor: "default",
                    }
                  : {}
              }
              value={
                isRequirementInput
                  ? (statuses[statusIndex]?.requirementsData || {})[
                      input._id
                    ] || ""
                  : requestData[input._id] || ""
              }
              onChange={(e) =>
                isRequirementInput
                  ? setRequirement(
                      currentStatusIndex,
                      input._id,
                      e.target.value
                    )
                  : setRequestData(input._id, e.target.value)
              }
            />
          </div>
        );
      case "pdf":
      case "image":
        const isDisabled = baseProps?.disabled;

        return (
          <div
            ref={(el) => (inputRefs.current[input._id] = el)}
            id={input._id}
            className="bg-base-100 p-5 rounded-xl border border-base-300 shadow-md"
          >
            <p className="text-sm text-base-content/70 mb-4">{input.help}</p>

            {isDisabled ? (
              <>
                {input.tipe === "image" &&
                  (requestData[input._id] ||
                    (statuses[statusIndex]?.requirementsData || {})[
                      input._id
                    ]) && (
                    <img
                      src={
                        requestData[input._id] ||
                        (statuses[statusIndex]?.requirementsData || {})[
                          input._id
                        ] ||
                        ""
                      }
                      alt="Preview"
                      className="object-contain rounded-lg mx-auto p-2 max-h-60 border border-base-300"
                    />
                  )}

                {input.tipe === "pdf" &&
                  (requestData[input._id] ||
                    (statuses[statusIndex]?.requirementsData || {})[
                      input._id
                    ]) && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-base-200 to-base-100 rounded-lg border border-base-300 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-error/20 to-error/10 rounded-lg">
                          <FileText className="w-5 h-5 text-error" />
                        </div>
                        <div>
                          <div className="font-semibold text-base-content truncate max-w-xs">
                            {requestData[input._id] ||
                              (statuses[statusIndex]?.requirementsData || {})[
                                input._id
                              ] ||
                              ""}
                          </div>
                          <div className="text-xs text-base-content/60 flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            PDF Document
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {/* Download */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadPDF(
                              requestData[input._id] ||
                                (statuses[statusIndex]?.requirementsData || {})[
                                  input._id
                                ]
                            )
                          }
                          className="btn btn-sm btn-ghost text-success hover:bg-success/10"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                {!(
                  requestData[input._id] ||
                  (statuses[statusIndex]?.requirementsData || {})[input._id]
                ) && (
                  <p className="text-sm text-base-content/50 italic">
                    Belum ada file.
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Tombol aksi */}
                <div className="flex gap-3">
                  <label className="btn btn-primary btn-sm cursor-pointer text-white rounded-md">
                    <span className="i-ph-upload-simple-duotone mr-2"></span>
                    Upload File
                    <input
                      type="file"
                      accept={input.tipe === "image" ? "image/*" : ".pdf"}
                      {...baseProps}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file && isRequirementInput) {
                          if (isForRequest) {
                            setRequestData(input._id, null);
                          } else {
                            setRequirement(currentStatusIndex, input._id, null);
                          }
                          return;
                        }

                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("tipe", input.tipe);

                        try {
                          const res = await FileApi.uploadImage(formData);
                          const fileUrl = res.url;

                          if (isRequirementInput) {
                            if (isForRequest) {
                              setRequirement(
                                currentStatusIndex,
                                input._id,
                                fileUrl
                              );
                            } else {
                              setRequirement(
                                currentStatusIndex,
                                input._id,
                                fileUrl
                              );
                            }
                          } else {
                            if (isForRequest) {
                              setRequestData(input._id, fileUrl);
                            } else {
                              setRequirement(
                                currentStatusIndex,
                                input._id,
                                null
                              );
                            }
                          }
                        } catch (err) {
                          toast.error("Gagal upload file.");
                          console.error(err);
                        }
                      }}
                    />
                  </label>

                  {input.tipe === "image" && (
                    <label className="btn btn-secondary btn-sm cursor-pointer">
                      <span className="i-ph-camera-duotone mr-2"></span>
                      Ambil Foto
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        {...baseProps}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) {
                            setRequestData(input._id, null);
                            return;
                          }

                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("tipe", input.tipe);

                          try {
                            const res = await FileApi.uploadImage(formData);
                            const fileUrl = res.url;

                            if (isRequirementInput) {
                              setRequirement(
                                currentStatusIndex,
                                input._id,
                                fileUrl
                              );
                            } else {
                              setRequestData(input._id, fileUrl);
                            }
                          } catch (err) {
                            toast.error("Gagal upload file.");
                            console.error(err);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                {/* Preview */}
                {input.tipe === "image" && requestData[input._id] && (
                  <img
                    src={requestData[input._id]}
                    alt="Preview"
                    className="object-contain rounded-lg mx-auto p-2 max-h-60 border border-base-300"
                  />
                )}

                {input.tipe === "pdf" &&
                  requestData[input._id] &&
                  typeof requestData[input._id] === "string" && (
                    <div className="flex items-center gap-2 text-sm text-base-content/80 bg-base-200 p-2 rounded-md">
                      <span className="i-ph-file-pdf-duotone text-error"></span>
                      <span>
                        File dipilih: <strong>{requestData[input._id]}</strong>
                      </span>
                    </div>
                  )}
              </div>
            )}
          </div>
        );

      case "signature":
        return (
          <SignatureInput
            key={input._id}
            input={input}
            isOnlyPreview={isOnlyPreview}
            inputRefs={inputRefs}
            baseProps={baseProps}
            isRequirementInput={isRequirementInput}
          />
        );

      case "select":
        return (
          <div
            ref={(el) => (inputRefs.current[input._id] = el)}
            id={input._id}
            className="space-y-1"
          >
            {renderHelpText(input)}
            <SelectInput
              input={input}
              baseProps={baseProps}
              isRequirementInput={isRequirementInput}
              statusIndex={statusIndex}
            />
          </div>
        );

      case "multipleCheckbox":
        return (
          <div
            ref={(el) => (inputRefs.current[input._id] = el)}
            id={input._id}
            className="space-y-2"
          >
            {renderHelpText(input)}
            <MultipleCheckboxInput
              input={input}
              baseProps={baseProps}
              isRequirementInput={isRequirementInput}
              statusIndex={statusIndex}
            />
          </div>
        );

      case "table":
        return (
          <TableInput
            key={input._id}
            input={input}
            inputRefs={inputRefs}
            initialRows={tableData[input._id] || []}
            baseProps={baseProps}
            isRequirementInput={isRequirementInput}
            statusIndex={statusIndex}
          />
        );

      default:
        return (
          <div className="alert alert-warning">
            <span>Tipe input tidak dikenali: Terjadi kesalahan</span>
          </div>
        );
    }
  };

  if (!jsonFlow)
    return <div className="loading loading-spinner loading-lg"></div>;

  if (!jsonFlow) return <span></span>;

  const HeaderEditor = () => {
    return (
      <div className="flex justify-between items-center bg-white  rounded-lg shadow-sm ">
        <div className="flex gap-2  ">
          <button
            className={`btn ${isJsonMode ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setIsJsonMode(true)}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Tampil JSON
          </button>
          <button
            className={`btn ${!isJsonMode ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setIsJsonMode(false)}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Tampil Form
          </button>
        </div>
        {jsonFlow?.globalIndex && (
          <div className="flex gap-2 items-center">
            <span className="font-bold">Flow Global Index:</span>
            <div className="badge badge-accent">{jsonFlow?.globalIndex}</div>
          </div>
        )}
      </div>
    );
  };

  if (isJsonMode) {
    return (
      <div className="space-y-6 ">
        {!isForApproval && !isForRequest && <HeaderEditor />}
        <div className="bg-white p-6 rounded-lg shadow-sm pb-20">
          <pre className="bg-gray-50 p-4 text-sm overflow-auto rounded-lg border border-gray-200 max-h-[80vh]">
            {JSON.stringify(jsonFlow, null, 2)}
          </pre>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-6 w-full max-md:pb-20">
        {!isForApproval && !isForRequest && <HeaderEditor />}
        <div className="space-y-6 flex flex-col overflow-y-auto max-h-[90vh] pr-2  pb-20">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-800">
              {jsonFlow?.title}
            </h1>
            <p className="text-gray-600 mt-2">{jsonFlow?.desc}</p>
          </div>
          <div className="bg-white  p-6 rounded-lg shadow-sm">
            {(isForRequest || isForApproval) && (
              <input
                type="text"
                placeholder="Masukkan identifikasi request. misal judul request"
                className="input input-bordered w-full"
                disabled={isForApproval}
                style={
                  isForApproval
                    ? {
                        backgroundColor: "#f3f4f6", // gray-100
                        color: "#374151", // gray-700
                        opacity: 1,
                        cursor: "default",
                      }
                    : {}
                }
                value={instanceTitle}
                onChange={(e) => setInstanceTitle(e.target.value)}
              />
            )}

            <div className="divider"> Form Request</div>
            <div className="space-y-5">
              {jsonFlow?.request?.map((input) => (
                <div
                  key={input._id}
                  className={`p-4 rounded-lg transition-all  ${
                    currentEditingInputID === input._id
                      ? "bg-yellow-50 border-l-4 border-yellow-500"
                      : "bg-gray-50"
                  } ${input.tipe == "helper" && "bg-transparent"}`}
                >
                  <label className="block mb-2 font-medium text-gray-700">
                    {input?.tipe != "helper" && input?.title}
                  </label>
                  {renderInput(input, isForApproval)}
                </div>
              ))}
            </div>
          </div>
          {/* Status */}
          {!isForRequest && (
            <>
              <div className="divider">Responses Flow</div>
              {jsonFlow?.status?.map((stat, i) => (
                <div
                  key={stat.title}
                  className={`bg-white p-6 shadow-lg rounded-md border flex-1 `}
                >
                  <h4 className="font-semibold text-lg mb-4 text-gray-800">
                    {stat.title}
                  </h4>
                  <div className="space-y-5">
                    {stat?.requirements?.map((input) => {
                      const verdict = statuses[i]?.verdict;
                      const borderColor =
                        verdict === "approved"
                          ? "border-l-4 border-green-500"
                          : verdict === "rejected"
                          ? "border-l-4 border-red-500"
                          : currentStatusIndex == i &&
                            "border-l-4 border-yellow-500";

                      return (
                        <div
                          key={input._id}
                          className={`p-4 rounded-lg transition-all  ${
                            currentEditingInputID === input._id
                              ? "bg-yellow-50 border-l-4 border-yellow-500"
                              : "bg-gray-50"
                          } ${
                            input?.tipe == "helper" && "bg-transparent"
                          } ${borderColor}`}
                        >
                          <div className="flex  items-center justify-between mb-2">
                            <label className="block font-medium text-gray-700">
                              {input?.tipe != "helper" && input?.title}
                            </label>
                            {input.isNullable && (
                              <span className="text-xs text-gray-400 italic">
                                (Opsional)
                              </span>
                            )}
                          </div>
                          {renderInput(
                            input,
                            currentStatusIndex !== i,
                            true,
                            i
                          )}
                          {/* tammpilin Logika yang telah dibuat */}
                          {jsonFlow?.logics && jsonFlow.logics.length > 0 && (
                            <div className="space-y-3 my-3 rounded-lg">
                              {jsonFlow.logics
                                .filter(
                                  (logic) =>
                                    String(logic.requirementId) ===
                                    String(input._id)
                                )
                                .map((logic, logicIndex) => (
                                  <div
                                    key={logicIndex}
                                    className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg  bg-gray-50 dark:bg-gray-700 space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="badge badge-primary text-white rounded-lg">
                                          {logic.logicType === "jumpTo" &&
                                            "Jump to"}
                                          {logic.logicType === "completedIf" &&
                                            "Completed if"}
                                          {logic.logicType === "rejectedIf" &&
                                            "Rejected if"}
                                          {logic.logicType ===
                                            "preventNextIf" &&
                                            "Prevent next if"}
                                        </span>
                                        {logic.logicType === "jumpTo" &&
                                          logic.jumpToStatusUuid && (
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                              →{" "}
                                              {jsonFlow.status?.find(
                                                (s) =>
                                                  s.uuid ===
                                                  logic.jumpToStatusUuid
                                              )?.title || "Unknown Status"}
                                            </span>
                                          )}
                                      </div>
                                    </div>

                                    <div className="text-sm space-y-1">
                                      <div>
                                        <span className="font-medium">
                                          Requirement:
                                        </span>{" "}
                                        {input.title || "Unknown"}
                                      </div>
                                      <div>
                                        <span className="font-medium">
                                          Kondisi:
                                        </span>{" "}
                                        {logic.operator}{" "}
                                        <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">
                                          {logic.value}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className={`
    flex flex-col md:flex-row md:items-center justify-between
    mt-4 p-4 rounded-xl shadow-md border
    transition-all duration-300 ease-in-out
    ${
      statuses[i]?.verdict === "approved"
        ? "bg-green-50 border-green-200 text-green-800"
        : statuses[i]?.verdict === "rejected"
        ? "bg-red-50 border-red-200 text-red-800"
        : "bg-white border-gray-200 text-gray-800"
    }
  `}
                  >
                    {/* Verdict & Status Indicator - Selalu tampil */}
                    <div className="flex items-center gap-3 font-extrabold text-xl mb-3 md:mb-0 md:w-1/3">
                      {/* Mengganti teks "Status: " dengan ikon yang lebih visual */}
                      {statuses[i]?.verdict === "approved" && (
                        <CheckCircle className="w-7 h-7 text-green-600 flex-shrink-0" />
                      )}
                      {statuses[i]?.verdict === "rejected" && (
                        <XCircle className="w-7 h-7 text-red-600 flex-shrink-0" />
                      )}
                      {/* Jika status bukan approved/rejected, anggap itu pending atau lainnya */}
                      {statuses[i]?.verdict !== "approved" &&
                        statuses[i]?.verdict !== "rejected" && (
                          <Clock className="w-7 h-7 text-blue-600 flex-shrink-0" /> // Ikon untuk pending
                        )}
                      <span className="capitalize">
                        Status: {statuses[i]?.verdict || "Pending"}
                      </span>
                    </div>

                    {/* PENDING belum disii  */}
                    {statuses[i]?.verdict === "pending" && (
                      <div className="flex items-start gap-2 text-sm">
                        <MessageSquareText className="w-5 h-5 mt-0.5 text-yellow-600 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-yellow-700">
                            Menunggu Jawaban:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {statuses[i]?.authorized?.length > 0 ? (
                              statuses[i].authorized.map((auth, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium"
                                >
                                  {auth.displayName || auth.username}
                                </span>
                              ))
                            ) : (
                              <span className="text-yellow-800">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {statuses[i]?.verdict !== "pending" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full md:w-2/3 md:ml-auto md:border-l md:border-current md:pl-6 pt-4 md:pt-0">
                        {/* Alasan Ditolak (hanya untuk rejected) */}
                        {statuses[i]?.verdict === "rejected" && (
                          <div className="flex items-start gap-2 text-sm">
                            <MessageSquareText className="w-5 h-5 mt-0.5 text-red-600 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-red-700">
                                Alasan Ditolak:
                              </span>
                              <p className="font-normal whitespace-pre-wrap text-red-800">
                                {statuses[i]?.rejectedReason ||
                                  "Tidak ada alasan spesifik."}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Info Completed By */}
                        {/* Menampilkan jika status sudah completed (approved/rejected) */}
                        {statuses[i]?.completedBy?.username && (
                          <div className="flex items-start gap-2 text-sm">
                            <User2 className="w-5 h-5 mt-0.5 text-gray-600 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-700">
                                {statuses[i]?.verdict === "approved"
                                  ? "Disetujui oleh"
                                  : "Ditolak oleh"}
                                :
                              </span>
                              <p className="font-normal text-gray-800">
                                {statuses[i]?.completedBy?.displayName ||
                                  statuses[i]?.completedBy?.username ||
                                  "-"}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Info Completed At */}
                        {/* Menampilkan jika status sudah completed (approved/rejected) */}
                        {statuses[i]?.completedAt && (
                          <div className="flex items-start gap-2 text-sm">
                            <Clock className="w-5 h-5 mt-0.5 text-gray-600 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-700">
                                Waktu:
                              </span>
                              <p className="font-normal text-gray-800">
                                {new Date(
                                  statuses[i]?.completedAt
                                ).toLocaleString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }) || "-"}
                              </p>
                            </div>
                          </div>
                        )}

                        {statuses[i]?.verdict !== "pending" &&
                          !statuses[i]?.rejectedReason &&
                          !statuses[i]?.completedBy?.username &&
                          !statuses[i]?.completedAt && (
                            <div className="col-span-full text-center text-gray-500 text-sm italic py-2">
                              Informasi detail tidak tersedia untuk status ini.
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {/* PDF Preview Modal
        {selectedPDF && (
          <PdfPreviewModal
            selectedPDF={selectedPDF}
            setSelectedPDF={setSelectedPDF}
            handleDownloadPDF={handleDownloadPDF}
          />
        )} */}
      </div>
    );
  }
}
