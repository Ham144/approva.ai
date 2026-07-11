import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useResponseCollector } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export default function SelectInput({
  input,
  baseProps,
  isRequirementInput,
  statusIndex,
}) {
  const idToFetch = input.sourceData || input;

  const [searchKey, setSearchKey] = useState("");
  const [debouncedSearchKey, setDebouncedSearchKey] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["sourceData", idToFetch, debouncedSearchKey],
    queryFn: () =>
      FlexSourceDataApi.getSourceDataByIdPost(idToFetch, debouncedSearchKey),
    enabled: !!idToFetch,
  });

  const {
    setRequestData,
    currentStatusIndex,
    setRequirement,
    requestData,
    statuses,
  } = useResponseCollector();

  const tipe = data?.data?.tipe;
  const options = data?.data?.keys ?? [];
  const views = data?.data?.views || "standard"; // "big" | "standard" | "small"
  const isDisabled = baseProps?.disabled || isLoading;
  const [isSearchingExternal, setIsSearchingExternal] = useState(false);

  const disabledStyle = isDisabled
    ? {
        backgroundColor: "#f3f4f6", // Tailwind gray-100
        color: "#374151", // Tailwind gray-700
        opacity: 1,
        cursor: "default",
      }
    : {};

  // Current selected value
  const currentValue = isRequirementInput
    ? statuses[statusIndex]?.requirementsData?.[input._id] ?? ""
    : requestData?.[input._id] ?? "";

  const handleSelect = (value) => {
    if (isDisabled) return;
    if (isRequirementInput) {
      setRequirement(currentStatusIndex, input._id, value);
    } else {
      setRequestData(input._id, value);
    }
  };

  // Debounce search key to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKey(searchKey);
      setIsSearchingExternal(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setIsSearchingExternal(true);
    };
  }, [searchKey]);

  // ─── RENDER: External type ───
  if (tipe === "external") {
    if (requestData?.[input._id]) {
      return (
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-700 truncate">
            {requestData[input._id]}
          </p>
          <button
            {...baseProps}
            onClick={() => setRequestData(input._id, null)}
            className="btn rounded-md btn-error btn-sm text-white hover:scale-105 transition-transform duration-200"
          >
            ✕ Hapus
          </button>
        </div>
      );
    }
    return (
      <>
        <input
          {...baseProps}
          type="text"
          placeholder="Cari Opsi"
          onChange={(e) => setSearchKey(e.target.value)}
          value={searchKey}
          className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
        />

        {isSearchingExternal ? (
          <div className="flex justify-center items-center mt-2">
            <span className="loading items-center justify-center flex loading-ring loading-lg"></span>
          </div>
        ) : options?.length > 0 ? (
          options.map((k, idx) => (
            <div
              key={idx}
              onClick={() =>
                !baseProps.disabled &&
                setRequestData(input._id, `${k.key}:${k.value}`)
              }
              className={`bg-gray-200 rounded-md p-2 hover:bg-orange-200 cursor-pointer ${
                requestData?.[input._id] === `${k.key}:${k.value}`
                  ? "bg-orange-200"
                  : ""
              } ${
                baseProps.disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <p>
                {k.key} : {k.value}
              </p>
            </div>
          ))
        ) : (
          <p className="text-red-500 mt-2">Data tidak ditemukan</p>
        )}
        <div className="p-2 ring-offset-emerald-50 rounded-lg badge-accent">
          tipe opsi external akan menyimpan data dengan format key:value
          berbeda dengan tipe opsi internal yang hanya menyimpan key karena
          bisa mendapatkan pasangannya kapanpun sedangkan dengan tipe opsi
          external ia ketergantungan external api
        </div>
      </>
    );
  }

  // ─── RENDER: Internal type with VIEWS ───
  if (tipe === "internal") {
    // ═══ VIEW: BIG — Large emoji/icon card grid ═══
    if (views === "big") {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {options.map((k) => {
            const isSelected = currentValue === k.key;
            return (
              <button
                key={k._id}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelect(k.key)}
                className={`
                  relative flex flex-col items-center justify-center
                  p-6 rounded-2xl border-2 transition-all duration-300
                  min-h-[140px] text-center
                  ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg shadow-blue-200 dark:shadow-blue-900/40 scale-[1.03]"
                      : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 hover:shadow-md hover:scale-[1.02]"
                  }
                  ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {/* Big emoji/value display */}
                <span className="text-5xl mb-3 leading-none select-none">
                  {k.key}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    isSelected
                      ? "text-blue-700 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {k.value}
                </span>
                {/* Selected indicator */}
                {isSelected && (
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

    // ═══ VIEW: SMALL — Compact horizontal chips/badges ═══
    if (views === "small") {
      return (
        <div className="flex flex-wrap gap-2">
          {options.map((k) => {
            const isSelected = currentValue === k.key;
            return (
              <button
                key={k._id}
                type="button"
                disabled={isDisabled}
                onClick={() => handleSelect(k.key)}
                className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                  text-xs font-medium transition-all duration-200
                  border
                  ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-500 shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                  }
                  ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {isSelected && (
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
                <span>{k.value}</span>
              </button>
            );
          })}
        </div>
      );
    }

    // ═══ VIEW: STANDARD — Classic dropdown (default) ═══
    return (
      <select
        {...baseProps}
        className={`px-3 rounded-md  w-full ${
          baseProps.disabled
            ? "bg-white font-bold text-black"
            : "input input-bordered"
        }`}
        style={disabledStyle}
        value={currentValue}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="">-- Cari Opsi --</option>
        {options.map((k) => (
          <option key={k._id} value={k.key}>
            {k.value}
          </option>
        ))}
      </select>
    );
  }

  // Fallback for unknown tipe
  return null;
}
