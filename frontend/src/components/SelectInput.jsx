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
  return (
    <>
      {tipe === "external" &&
        (requestData?.[input._id] ? (
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg  shadow-sm border border-gray-200">
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
        ) : (
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
        ))}

      {tipe === "internal" && (
        <select
          {...baseProps}
          className={`px-3 rounded-md  w-full ${
            baseProps.disabled
              ? "bg-white font-bold text-black"
              : "input input-bordered"
          }`}
          style={disabledStyle}
          value={
            isRequirementInput
              ? statuses[statusIndex]?.requirementsData?.[input._id] ?? ""
              : requestData?.[input._id] ?? ""
          }
          onChange={(e) => {
            if (isRequirementInput) {
              setRequirement(currentStatusIndex, input._id, e.target.value);
            } else {
              setRequestData(input._id, e.target.value);
            }
          }}
        >
          <option value="">-- Cari Opsi --</option>
          {options.map((k) => (
            <option key={k._id} value={k.key}>
              {k.value}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
