import React from "react"; // Pastikan React diimport
import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useResponseCollector } from "@/store";
import { useQuery } from "@tanstack/react-query";

export default function MultipleCheckboxInput({
  input,
  baseProps,
  statusIndex,
  isRequirementInput,
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["sourceData", input.sourceData],
    queryFn: () => FlexSourceDataApi.getSourceDataByIdPost(input.sourceData),
    enabled: !!input.sourceData,
  });

  const { requestData, setRequestData, statuses, setRequirement } =
    useResponseCollector();
  const options = data?.data?.keys || [];

  let selectedValues = [];

  if (isRequirementInput) {
    const status = statuses?.[statusIndex];
    selectedValues = Array.isArray(status?.requirementsData?.[input._id])
      ? status.requirementsData[input._id]
      : [];
  } else {
    selectedValues = Array.isArray(requestData?.[input._id])
      ? requestData[input._id]
      : [];
  }

  const handleCheckboxChange = (e, optionValue) => {
    const isChecked = e.target.checked;
    let updatedValues;

    if (isChecked) {
      updatedValues = [...new Set([...selectedValues, optionValue])];
    } else {
      updatedValues = selectedValues.filter((val) => val !== optionValue);
    }

    if (isRequirementInput) {
      setRequirement(statusIndex, input._id, updatedValues);
    } else {
      setRequestData(input._id, updatedValues);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500 text-sm">Memuat opsi...</p>;
  }

  // ✅ Preview Mode - Teks cantik
  if (baseProps?.disabled) {
    const selectedLabels = options
      .filter((opt) => selectedValues.includes(opt.key))
      .map((opt) => opt.value)
      .join(", ");

    return (
      <div className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md border border-gray-300 text-sm">
        {selectedLabels || (
          <span className="italic text-gray-400">Tidak ada yang dipilih</span>
        )}
      </div>
    );
  }

  const views = data?.data?.views || "standard"; // "big" | "standard" | "small"
  const isDisabled = baseProps?.disabled || isLoading;

  // ✅ Editable Mode - Checkbox Form
  if (views === "big") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const isChecked = selectedValues.includes(opt.key);
          return (
            <button
              key={opt._id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleCheckboxChange({ target: { checked: !isChecked } }, opt.key)}
              className={`
                relative flex flex-col items-center justify-center
                p-6 rounded-2xl border-2 transition-all duration-300
                min-h-[140px] text-center
                ${
                  isChecked
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg shadow-blue-200 dark:shadow-blue-900/40 scale-[1.03]"
                    : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:shadow-md hover:scale-[1.02]"
                }
                ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {/* Big text is key */}
              <span className="text-5xl mb-3 leading-none select-none">
                {opt.key}
              </span>
              {/* Small text is label (value) */}
              <span
                className={`text-sm font-semibold ${
                  isChecked
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {opt.value}
              </span>
              {/* Selected indicator */}
              {isChecked && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (views === "small") {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isChecked = selectedValues.includes(opt.key);
          return (
            <button
              key={opt._id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleCheckboxChange({ target: { checked: !isChecked } }, opt.key)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                text-xs font-medium transition-all duration-200
                border
                ${
                  isChecked
                    ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                }
                ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {isChecked && (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              <span>{opt.value}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const isChecked = selectedValues.includes(opt.key);

        return (
          <label
            key={opt._id}
            className="inline-flex items-center bg-gray-100 px-3 py-2 rounded-md hover:bg-gray-200 transition-all text-sm"
          >
            <input
              {...baseProps}
              type="checkbox"
              className="checkbox checkbox-sm checkbox-primary mr-2"
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(e, opt.key)}
            />
            <span className="text-gray-800">{opt.value}</span>
          </label>
        );
      })}
    </div>
  );
}
