import { useEditor, useResponseCollector } from "../store";
import React, { useState, useEffect, useRef } from "react";
import SignatureInput from "./SignatureInput";
import NumberInput from "./NumberInput";
import TableInput from "./TableInput";
import SelectInput from "./SelectInput";
import MultipleCheckboxInput from "./MultipleCheckboxInput";
import { MessageSquareText, User2 } from "lucide-react";

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

  const flatInputs = jsonFlow
    ? [
        ...(jsonFlow?.request || []),
        ...(jsonFlow?.status || []).flatMap((s) => s.requirements),
      ]
    : [];

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
      disabled: isOnlyPreview || isDisabled,
    };

    switch (input.tipe) {
      case "text":
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
              className="input input-bordered w-full"
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
              className="input input-bordered w-full"
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
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-3">{input.help}</p>

            {isDisabled ? (
              // Tampilkan file yang sudah diisi dalam mode preview
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
                      className="object-contain rounded-md mx-auto p-2 max-h-60"
                    />
                  )}
                {input.tipe === "pdf" &&
                  (requestData[input._id] ||
                    (statuses[statusIndex]?.requirementsData || {})[
                      input._id
                    ]) && (
                    <p className="text-sm text-gray-600">
                      File dipilih:{" "}
                      <strong>
                        {requestData[input._id] ||
                          (statuses[statusIndex]?.requirementsData || {})[
                            input._id
                          ] ||
                          ""}
                      </strong>
                    </p>
                  )}

                {!(
                  requestData[input._id] ||
                  (statuses[statusIndex]?.requirementsData || {})[input._id]
                ) && (
                  <p className="text-sm text-gray-400 italic">
                    Belum ada file.
                  </p>
                )}
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept={input.tipe === "image" ? "image/*" : ".pdf"}
                  {...baseProps}
                  className="file-input file-input-bordered w-full file-input-primary"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (!file) {
                      setRequestData(input._id, null);
                      return;
                    }

                    if (isRequirementInput) {
                      if (input.tipe === "image") {
                        const fileUrl = URL.createObjectURL(file);
                        setRequirement(currentStatusIndex, input._id, fileUrl);
                      } else {
                        setRequirement(
                          currentStatusIndex,
                          input._id,
                          file.name
                        );
                      }
                    } else {
                      if (input.tipe === "image") {
                        const fileUrl = URL.createObjectURL(file);
                        setRequestData(input._id, fileUrl);
                      } else {
                        setRequestData(input._id, file.name);
                      }
                    }
                  }}
                />

                {/* Preview untuk tipe image */}
                {input.tipe === "image" && requestData[input._id] && (
                  <img
                    src={requestData[input._id]}
                    alt="Preview"
                    className="object-contain rounded-md mx-auto p-2 max-h-60 mt-4"
                  />
                )}

                {/* Info file untuk tipe pdf */}
                {input.tipe === "pdf" &&
                  requestData[input._id] &&
                  typeof requestData[input._id] === "string" && (
                    <p className="text-sm text-gray-600 mt-2">
                      File dipilih: <strong>{requestData[input._id]}</strong>
                    </p>
                  )}
              </>
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
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
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
      </div>
    );
  };

  if (isJsonMode) {
    return (
      <div className="space-y-6">
        <HeaderEditor />
        <div className="bg-white p-6 rounded-lg shadow-sm pb-20">
          <pre className="bg-gray-50 p-4 text-sm overflow-auto rounded-lg border border-gray-200 max-h-[80vh]">
            {JSON.stringify(jsonFlow, null, 2)}
          </pre>
        </div>
      </div>
    );
  } else {
    return (
      <div className="space-y-6 w-full ">
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
                  }`}
                >
                  <label className="block mb-2 font-medium text-gray-700">
                    {input.title}
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
                    {stat.requirements.map((input) => {
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
                          className={`p-4 rounded-lg transition-all bg-gray-50 ${
                            currentEditingInputID === input._id
                              ? "bg-yellow-50"
                              : ""
                          } ${borderColor}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <label className="block font-medium text-gray-700">
                              {input.title}
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
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`flex justify-between items-center mt-5 px-3 py-2 rounded-lg ${
                      statuses[i]?.verdict === "approved"
                        ? "bg-green-50"
                        : statuses[i]?.verdict === "rejected"
                        ? "bg-red-50"
                        : ""
                    }`}
                  >
                    {/* Verdict Row */}
                    <div className="flex items-center gap-2 font-bold text-lg md:col-span-2 rounded-lg">
                      <span>Status: {statuses[i]?.verdict}</span>
                    </div>

                    {/* Alasan Ditolak (hanya untuk rejected) */}
                    {statuses[i]?.verdict === "rejected" && (
                      <div className="flex items-start gap-2 col-span-2 md:col-span-1 border-t md:border-t-0 md:border-r border-current pt-3 md:pt-0 md:pr-4">
                        <MessageSquareText className="w-4 h-4 mt-1 flex-shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-semibold">Alasan Ditolak:</span>
                          <p className="font-normal whitespace-pre-wrap">
                            {statuses[i]?.rejectedReason || "Tidak ada alasan."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Info Completed */}
                    {statuses[i]?.verdict !== "pending" && (
                      <div
                        className={`flex items-start gap-2 ${
                          statuses[i]?.verdict === "rejected"
                            ? "col-span-2 md:col-span-1 pt-3 md:pt-0 md:pl-4"
                            : "col-span-2"
                        }`}
                      >
                        <User2 className="w-4 h-4 mt-1 flex-shrink-0" />
                        <div className="flex flex-col">
                          <p className="font-normal">
                            {statuses[i]?.verdict === "approved"
                              ? "Disetujui oleh"
                              : "Ditolak oleh"}
                            : {statuses[i]?.completedBy?.username || "-"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}
