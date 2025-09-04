import { renderHelpText } from "./PreviewFlow";
import { useResponseCollector } from "@/store";

const NumberInput = ({
  input,
  isOnlyPreview,
  inputRefs,
  baseProps,
  statusIndex,
  isRequirementInput,
}) => {
  const {
    setRequestData,
    setRequirement,
    requestData,
    statuses,
    currentStatusIndex,
  } = useResponseCollector();

  return (
    <div
      ref={(el) => (inputRefs.current[input._id] = el)}
      id={input._id}
      className="w-full" // Mengatur lebar penuh
    >
      {/* Render teks bantuan */}
      {renderHelpText(input)}

      <div className="flex items-stretch gap-0 mt-1 shadow-sm rounded-md overflow-hidden">
        {/* Tombol Kurang (-) */}
        <button
          {...baseProps}
          className="btn btn-square btn-outline border-r-0 rounded-r-none text-xl font-bold hover:bg-gray-100 transition-colors duration-200"
          onClick={() => {
            const rawValue = isRequirementInput
              ? statuses[statusIndex]?.requirementsData?.[input._id] || "0"
              : requestData?.[input._id] || "0";
            const numericValue = Number(rawValue.toString().replace(/\./g, ""));
            const newValue = numericValue - 1;

            isRequirementInput
              ? setRequirement(currentStatusIndex, input._id, newValue)
              : setRequestData(input._id, newValue);
          }}
        >
          -
        </button>

        {/* Input Nilai */}
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          {...baseProps}
          value={(() => {
            const rawValue = isRequirementInput
              ? statuses[statusIndex]?.requirementsData?.[input._id] || ""
              : requestData?.[input._id] || "";
            const numericValue = Number(rawValue.toString().replace(/\./g, ""));
            if (!isNaN(numericValue) && rawValue !== "") {
              return numericValue.toLocaleString("id-ID");
            }
            return rawValue;
          })()}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/\./g, "");
            isRequirementInput
              ? setRequirement(currentStatusIndex, input._id, cleaned)
              : setRequestData(input._id, cleaned);
          }}
          className={`p-4 rounded-md text-center  w-full ${
            baseProps.disabled
              ? "bg-white font-bold text-black"
              : "input input-bordered"
          }`}
          style={
            isOnlyPreview
              ? {
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  opacity: 1,
                  cursor: "default",
                }
              : {}
          }
        />

        {/* Tombol Tambah (+) */}
        <button
          {...baseProps}
          className="btn btn-square btn-outline border-l-0 rounded-l-none text-xl font-bold hover:bg-gray-100 transition-colors duration-200"
          onClick={() => {
            const rawValue = isRequirementInput
              ? statuses[statusIndex]?.requirementsData?.[input._id] || "0"
              : requestData?.[input._id] || "0";
            const numericValue = Number(rawValue.toString().replace(/\./g, ""));
            const newValue = numericValue + 1;

            isRequirementInput
              ? setRequirement(currentStatusIndex, input._id, newValue)
              : setRequestData(input._id, newValue);
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
