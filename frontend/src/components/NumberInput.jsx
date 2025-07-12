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
      className="space-y-1 "
    >
      {renderHelpText(input)}
      <div className="flex items-center gap-2 justify-center">
        <button
          className="btn btn-circle btn-sm btn-outline"
          disabled={isOnlyPreview}
          // onClick={() => setRequestData(input._id, requestData[input._id] - 1)}
          onClick={() =>
            isRequirementInput
              ? setRequirement(
                  currentStatusIndex,
                  input._id,
                  statuses[statusIndex]?.requirementsData[input._id] - 1
                )
              : setRequestData(input._id, requestData[input._id] - 1)
          }
        >
          -
        </button>
        <input
          type="number"
          {...baseProps}
          value={
            isRequirementInput
              ? (statuses[statusIndex]?.requirementsData || {})[input._id] || ""
              : requestData[input._id] || ""
          }
          onChange={(e) =>
            isRequirementInput
              ? setRequirement(currentStatusIndex, input._id, e.target.value)
              : setRequestData(input._id, e.target.value)
          }
          className="input input-bordered w-24 text-center focus:ring-2 focus:ring-blue-500"
          style={
            isOnlyPreview
              ? {
                  backgroundColor: "#f3f4f6", // gray-100
                  color: "#374151", // gray-700
                  opacity: 1,
                  cursor: "default",
                }
              : {}
          }
        />

        <button
          className="btn btn-circle btn-sm btn-outline"
          disabled={isOnlyPreview}
          // onClick={() => setRequestData(input._id, requestData[input._id] + 1)}
          onClick={() =>
            isRequirementInput
              ? setRequirement(
                  currentStatusIndex,
                  input._id,
                  statuses[statusIndex]?.requirementsData[input._id] + 1
                )
              : setRequestData(input._id, requestData[input._id] - 1)
          }
        >
          +
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
