import externalOptionApi from "@/api/externalOptionApi";
import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useResponseCollector } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function SelectInput({
  input,
  baseProps,
  isRequirementInput,
  statusIndex,
}) {
  const idToFetch = input.sourceData || input;
  const { data, isLoading } = useQuery({
    queryKey: ["sourceData", idToFetch],
    queryFn: () => FlexSourceDataApi.getSourceDataByIdPost(idToFetch),
    enabled: !!idToFetch,
  });

  //pencarian untuk opsi external 
  // const {mutateAsync: } = useMutation({
  //   mutationKey: ['sourceData', 'search'],
  //   mutationFn: () => externalOptionApi.requestExternalOption({
  //     url:  
  //   })
  // })

  const {
    setRequestData,
    currentStatusIndex,
    setRequirement,
    requestData,
    statuses,
  } = useResponseCollector();

  const tipe = data?.data?.tipe;
  const options = data.data.tipe != "external" ? data?.data?.keys : [];
  const isDisabled = baseProps?.disabled || isLoading;

  const disabledStyle = isDisabled
    ? {
        backgroundColor: "#f3f4f6", // Tailwind gray-100
        color: "#374151", // Tailwind gray-700
        opacity: 1,
        cursor: "default",
      }
    : {};
  console.log(isRequirementInput);
  console.log(statuses[statusIndex]?.requirementsData);

  return (
    <>
      {tipe == "external" && (
        <input
          type="text"
          placeholder="Cari Opsi"
          className="input input-bordered w-full max-w-xs"
          value={}
        />
      )}

      {tipe == "internal" && (
        <select
          disabled={isDisabled}
          className="select select-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
