import React, { useEffect } from "react"; // Tambahkan useEffect
import { useResponseCollector } from "@/store"; // Pastikan path benar
import ZoomableImage from "./ZoomableImage";

const TableInput = ({ input, inputRefs, baseProps }) => {
  const { requestData, setRequestData } = useResponseCollector();
  const keys = input?.table?.keys ?? [];
  const keysType = input?.table?.keysType ?? [];

  const tableRows = Array.isArray(requestData[input._id])
    ? requestData[input._id]
    : [];

  useEffect(() => {
    if (tableRows.length === 0) {
      const initialEmptyRow = { values: keys.map(() => "") };
      setRequestData(input._id, [initialEmptyRow]);
    }
  }, [input._id, keys.length]);

  const handleChange = (rowIdx, colIdx, value) => {
    const updatedRows = [...tableRows];
    if (!updatedRows[rowIdx]) return;
    updatedRows[rowIdx].values ??= keys.map(() => "");
    updatedRows[rowIdx].values[colIdx] = value;
    setRequestData(input._id, updatedRows);
  };

  const handleFileChange = (rowIdx, colIdx, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedRows = [...tableRows];
      if (!updatedRows[rowIdx]) return;
      updatedRows[rowIdx].values ??= keys.map(() => "");
      updatedRows[rowIdx].values[colIdx] = e.target.result;
      setRequestData(input._id, updatedRows);
    };
    reader.readAsDataURL(file);
  };

  const addRow = () => {
    const newRow = { values: keys.map(() => "") };
    setRequestData(input._id, [...tableRows, newRow]);
  };

  const removeRow = (rowIdx) => {
    setRequestData(
      input._id,
      tableRows.filter((_, i) => i !== rowIdx)
    );
  };

  return (
    <div
      ref={(el) => (inputRefs.current[input._id] = el)}
      id={input._id}
      className="space-y-2"
    >
      {input.help && <p className="text-sm text-gray-600 mb-1">{input.help}</p>}

      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              {keys.map((key, idx) => (
                <th
                  key={idx}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  {key}
                </th>
              ))}
              {!baseProps?.disabled && (
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Aksi
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableRows.map((row, rIdx) => {
              const values = Array.isArray(row.values)
                ? row.values
                : keys.map(() => "");

              return (
                <tr key={rIdx} className="hover:bg-gray-50">
                  {values.map((val, cIdx) => {
                    const colType = keysType[cIdx] || "text";

                    return (
                      <td key={cIdx} className="px-4 py-2 align-top">
                        {colType === "image" ? (
                          <div className="space-y-2">
                            {!baseProps?.disabled && (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    rIdx,
                                    cIdx,
                                    e.target.files[0]
                                  )
                                }
                                className="file-input file-input-sm file-input-bordered w-full"
                                {...baseProps}
                              />
                            )}

                            {val && (
                              <ZoomableImage
                                src={val}
                                className="max-h-24 mx-auto"
                              />
                            )}

                            {!val && baseProps?.disabled && (
                              <p className="text-sm text-gray-400 italic">
                                Tidak ada gambar
                              </p>
                            )}
                          </div>
                        ) : (
                          <input
                            disabled={baseProps?.disabled}
                            type={colType === "date" ? "date" : colType}
                            value={val}
                            onChange={(e) =>
                              handleChange(rIdx, cIdx, e.target.value)
                            }
                            className={`input input-sm input-bordered w-full ${
                              baseProps?.disabled
                                ? "bg-gray-100 text-gray-700 opacity-100 cursor-default"
                                : ""
                            }`}
                          />
                        )}
                      </td>
                    );
                  })}

                  {!baseProps?.disabled && (
                    <td className="px-4 py-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => removeRow(rIdx)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        ✕ Hapus
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!baseProps?.disabled && (
        <button
          className="btn btn-sm btn-outline mt-2 flex items-center gap-2"
          onClick={addRow}
        >
          ➕ Tambah Baris
        </button>
      )}
    </div>
  );
};

export default TableInput; // Jangan lupa export komponen Anda
