import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useEditor, useResponseCollector } from "@/store";
import { useQuery } from "@tanstack/react-query";

export default function SelectInputForLogicMatching({
  input,
  logicTemp,
  setLogicTemp,
}) {
  const idToFetch = input.sourceData || input;
  const { data } = useQuery({
    queryKey: ["sourceData", idToFetch],
    queryFn: () => FlexSourceDataApi.getSourceDataByIdPost(idToFetch),
    enabled: !!idToFetch,
  });

  const { flow } = useEditor();

  const options = data?.data?.keys || [];
  const tipe = data?.data?.tipe;

  return (
    <>
      {tipe === "internal" ? (
        <select
          className="select select-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={
            logicTemp?.value || flow?.responseData?.[logicTemp?.index]?.value
          }
          onChange={(e) => {
            const value = e.target.value;
            setLogicTemp((prev) => ({
              ...prev,
              value,
            }));
          }}
        >
          <option value="">-- Pilih jawaban yang diharapkan --</option>
          {options.map((k) => (
            <option key={k._id} value={k.key}>
              {k.value}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={
            logicTemp?.value || flow?.responseData?.[logicTemp?.index]?.value
          }
          placeholder="key:value (tanpa spasi antar titik dua)"
          onChange={(e) => {
            const value = e.target.value;
            setLogicTemp((prev) => ({
              ...prev,
              value,
            }));
          }}
        />
      )}
    </>
  );
}
