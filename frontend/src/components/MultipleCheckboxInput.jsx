import React from "react"; // Pastikan React diimport
import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useResponseCollector } from "@/store";
import { useQuery } from "@tanstack/react-query";

export default function MultipleCheckboxInput({ input, baseProps }) {
  const { data, isLoading } = useQuery({
    queryKey: ["sourceData", input.sourceData],
    queryFn: () => FlexSourceDataApi.getSourceDataByIdPost(input.sourceData),
    enabled: !!input.sourceData,
  });

  const { requestData, setRequestData } = useResponseCollector();
  const options = data?.data?.keys || [];

  const selectedValues = requestData[input._id] || [];

  const handleCheckboxChange = (e, optionValue) => {
    const isChecked = e.target.checked;
    let updatedValues;

    if (isChecked) {
      updatedValues = [...new Set([...selectedValues, optionValue])];
    } else {
      updatedValues = selectedValues.filter((val) => val !== optionValue);
    }

    setRequestData(input._id, updatedValues);
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

  // ✅ Editable Mode - Checkbox Form
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
