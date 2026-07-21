import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useQuery } from "@tanstack/react-query";

export default function SelectInputInsideTable({
  input,
  baseProps,
  value,
  onChange,
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["sourceData", input],
    queryFn: () => FlexSourceDataApi.getSourceDataByIdPost(input),
    enabled: !!input,
  });

  const options = data?.data?.keys || [];

  const isDisabled = baseProps?.disabled || isLoading;
  const disabledStyle = isDisabled
    ? {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        opacity: 1,
        cursor: "default",
      }
    : {};

  return (
    <select
      {...baseProps}
      className={`px-3 rounded-md  w-full ${
        baseProps.disabled
          ? "bg-white font-bold text-black"
          : "input input-bordered"
      }`}
      style={disabledStyle}
      value={value ?? ""}
      onChange={(e) => {
        onChange(e.target.value);
      }}
    >
      <option value="">{isLoading ? "-- Memuat opsi... --" : "-- Pilih Opsi --"}</option>
      {options.map((k) => (
        <option key={k._id} value={k.key}>
          {k.value}
        </option>
      ))}
    </select>
  );
}
