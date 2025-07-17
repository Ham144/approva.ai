import {
  ArrowDownFromLine,
  ArrowUpFromLine,
  MessageSquareText,
} from "lucide-react";
import ModalShowTips from "./ModalShowTips";
import React, { useState } from "react";
import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useQuery } from "@tanstack/react-query";
import {
  Trash2,
  HelpCircle,
  Table,
  CheckSquare,
  List,
  Type,
  Hash,
  CalendarDays,
  Image,
  FileText,
  FileBadge,
  Signature,
  Plus,
  X,
  ListPlus,
  AlertCircle,
  Eye,
} from "lucide-react"; // Impor ikon dari Lucide React
import ModalCreateSourceData from "./ModalCreateSourceData";

const getInputTypeIcon = (type) => {
  switch (type) {
    case "pdf":
      return <FileBadge size={18} />;
    case "image":
      return <Image size={18} />;
    case "text":
      return <Type size={18} />;
    case "table":
      return <Table size={18} />;
    case "date":
      return <CalendarDays size={18} />;
    case "signature":
      return <Signature size={18} />;
    case "number":
      return <Hash size={18} />;
    case "select":
      return <List size={18} />;
    case "multipleCheckbox":
      return <CheckSquare size={18} />;
    default:
      return <FileText size={18} />;
  }
};

function InputItem({ input, index, onChange, deleteInput, handleMoveRequest }) {
  const hasNew = !!input?.sourceDataNew;
  const [searchSourceDataTitle, setSearchSourceDataTitle] = useState("");

  const { data: sourceDataList } = useQuery({
    queryKey: ["sourcedata-list", searchSourceDataTitle],
    queryFn: async () => {
      const res = await FlexSourceDataApi.getAllSourceData(
        searchSourceDataTitle
      );
      return res;
    },
    enabled: input.tipe === "select" || input.tipe === "multipleCheckbox",
  });

  const { data: sourceDataPreview, error: sourceDataPreviewErr } = useQuery({
    queryKey: ["sourcedata-preview", input?.sourceData],
    queryFn: () => FlexSourceDataApi.getSourceDataByIdPost(input?.sourceData),
    enabled: !!input.sourceData,
  });

  return (
    <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl w-full space-y-4 shadow-lg bg-white dark:bg-gray-800 transition-all duration-300">
      {/* Tombol Hapus Input */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const confirm = window.confirm(
              "Apakah Anda yakin ingin menghapus input ini? Tindakan ini tidak dapat dibatalkan."
            );
            if (confirm) {
              deleteInput();
            }
          }}
          className="btn btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg p-2 transition-all duration-200"
          aria-label="Hapus Input"
        >
          <Trash2 size={20} />
        </button>
        <div className="flex gap-x-2">
          <button
            className="btn"
            onClick={() => handleMoveRequest(index, "DOWN")}
          >
            <ArrowDownFromLine className="w-5 h-5" />
          </button>
          <button
            className="btn"
            onClick={() => handleMoveRequest(index, "UP")}
          >
            <ArrowUpFromLine className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Baris Input: Nama Variabel & Boleh Kosong? */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full gap-3">
        <div className="form-control flex-1 w-full">
          <label className="label" htmlFor={`input-title-${index}`}>
            <span className="label-text text-gray-700 dark:text-gray-300 font-medium">
              Nama Variabel / Key
            </span>
          </label>
          <input
            id={`input-title-${index}`}
            placeholder="misal: namaProduk, jumlahPembelian"
            value={input?.title || ""}
            onChange={(e) => onChange({ ...input, title: e.target.value })}
            className="input input-bordered w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
        </div>

        <label className="label cursor-pointer flex-col text-center w-full sm:w-auto mt-2 sm:mt-0">
          <span className="label-text text-gray-700 dark:text-gray-300 text-sm mb-1">
            Boleh kosong?
          </span>
          <input
            type="checkbox"
            checked={input?.isNullable || false}
            onChange={(e) =>
              onChange({ ...input, isNullable: e.target.checked })
            }
            className="checkbox checkbox-primary bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500"
            aria-label="Izinkan nilai kosong"
          />
        </label>
      </div>

      {/* Input Help/Penjelasan */}
      <div className="form-control w-full">
        <label className="label" htmlFor={`input-help-${index}`}>
          <span className="label-text text-gray-700 dark:text-gray-300 font-medium">
            Bantuan (Tooltip)
          </span>
        </label>
        <textarea
          id={`input-help-${index}`}
          placeholder="Jelaskan apa yang harus diisi di sini, misal: Masukkan nama lengkap sesuai KTP."
          value={input?.help || ""}
          onChange={(e) => onChange({ ...input, help: e.target.value })}
          className="textarea textarea-bordered w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-h-[60px] resize-y"
          rows="2"
        />
      </div>

      {/* Pemilihan Tipe Input & Tombol Bantuan */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
        <div className="form-control flex-1 w-full">
          <label className="label" htmlFor={`input-type-${index}`}>
            <span className="label-text text-gray-700 dark:text-gray-300 font-medium">
              Tipe Input
            </span>
          </label>
          <div className="relative flex items-center w-full">
            <span className="absolute left-3 text-gray-500 dark:text-gray-400">
              {getInputTypeIcon(input?.tipe)}
            </span>
            <select
              id={`input-type-${index}`}
              value={input?.tipe || "text"} // Default ke 'text' jika belum ada
              onChange={(e) => {
                const newTipe = e.target.value;
                if (input.tipe === "multipleCheckbox" && newTipe === "select") {
                  onChange({
                    ...input,
                    tipe: newTipe,
                    table: null,
                  });
                } else {
                  onChange({
                    ...input,
                    tipe: newTipe,
                    sourceData: null,
                    sourceDataNew: null,
                    table: null,
                  });
                }
              }}
              className="select select-bordered w-full pl-10 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              {[
                "text",
                "number",
                "date",
                "signature",
                "image",
                "pdf",
                "table",
                "select",
                "multipleCheckbox",
              ].map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() +
                    t.slice(1).replace(/([A-Z])/g, " $1")}
                </option> // Memperbaiki format tampilan opsi
              ))}
            </select>
          </div>
        </div>
        <div
          className="tooltip tooltip-bottom sm:tooltip-right"
          data-tip="Klik untuk melihat penjelasan tipe input"
        >
          <button
            onClick={() => document.getElementById("modalShowTips").showModal()}
            className="btn btn-ghost btn-circle text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 mt-8 sm:mt-0"
            aria-label="Lihat penjelasan tipe input"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>

      {/* Bagian Konfigurasi Tipe 'table' */}
      {input?.tipe === "table" && (
        <div className="border border-dashed border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
            <Table size={20} /> Konfigurasi Kolom Tabel
          </h4>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table w-full">
              <thead>
                <tr>
                  {input?.table?.keys &&
                    input.table.keys.map((key, idx) => (
                      <th
                        key={idx}
                        className="p-2 border-b border-gray-300 dark:border-gray-600"
                      >
                        <div className="flex flex-col gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Nama Kolom"
                            className="input input-bordered w-full input-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={key || ""}
                            onChange={(e) => {
                              const newKeys = [...input.table.keys];
                              newKeys[idx] = e.target.value;
                              onChange({
                                ...input,
                                table: {
                                  ...input.table,
                                  keys: newKeys,
                                },
                              });
                            }}
                          />
                          <div className="relative w-full">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              {getInputTypeIcon(
                                input.table.keysType?.[idx] || "text"
                              )}
                            </span>
                            <select
                              className="select select-bordered w-full select-sm pl-8 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              value={input.table.keysType?.[idx] || "text"}
                              onChange={(e) => {
                                const newKeysType = input.table.keysType
                                  ? [...input.table.keysType]
                                  : Array(input.table.keys.length).fill("text");
                                newKeysType[idx] = e.target.value;
                                onChange({
                                  ...input,
                                  table: {
                                    ...input.table,
                                    keysType: newKeysType,
                                  },
                                });
                              }}
                            >
                              {["text", "number", "date", "image"].map(
                                (typeOpt) => (
                                  <option key={typeOpt} value={typeOpt}>
                                    {typeOpt.charAt(0).toUpperCase() +
                                      typeOpt.slice(1)}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                          <button
                            onClick={() => {
                              const newKeys = [...input.table.keys];
                              const newKeysType = input.table.keysType
                                ? [...input.table.keysType]
                                : [];
                              newKeys.splice(idx, 1);
                              newKeysType.splice(idx, 1);
                              onChange({
                                ...input,
                                table: {
                                  ...input.table,
                                  keys: newKeys,
                                  keysType: newKeysType,
                                },
                              });
                            }}
                            className="btn btn-error btn-xs w-full text-white hover:bg-red-600 flex items-center justify-center gap-1"
                          >
                            <X size={14} /> Hapus
                          </button>
                        </div>
                      </th>
                    ))}
                  <th className="p-2 border-b border-gray-300 dark:border-gray-600 align-top">
                    <button
                      onClick={() => {
                        onChange({
                          ...input,
                          table: {
                            ...input.table,
                            keys: [...(input?.table?.keys || []), ""],
                            keysType: [
                              ...(input?.table?.keysType || []),
                              "text",
                            ],
                          },
                        });
                      }}
                      className="btn btn-sm btn-outline text-blue-500 border-blue-500 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 transition-colors duration-200 flex items-center justify-center gap-1"
                    >
                      <Plus size={16} /> Kolom Baru
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Anda bisa menambahkan baris contoh atau petunjuk di sini jika perlu */}
                <tr>
                  <td
                    colSpan={(input?.table?.keys?.length || 0) + 1}
                    className="text-center italic text-gray-500 dark:text-gray-400 p-4"
                  >
                    Isi nama kolom dan tipe data yang diharapkan untuk tabel.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bagian Konfigurasi Tipe 'select' atau 'multipleCheckbox' */}
      {(input?.tipe === "select" || input?.tipe === "multipleCheckbox") && (
        <div className="border border-dashed border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2">
            {getInputTypeIcon(input.tipe)} Konfigurasi Pilihan Data
          </h4>
          <label className="label-text font-semibold text-gray-700 dark:text-gray-300">
            Pilih Opsi Data yang sudah ada atau buat yang baru:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            {!hasNew && (
              <div className="form-control flex-1 w-full">
                <div className="relative flex items-center w-full">
                  <span className="absolute left-3 text-gray-500 dark:text-gray-400">
                    <ListPlus size={18} />
                  </span>
                  <select
                    value={input.sourceData || ""}
                    onChange={(e) =>
                      onChange({ ...input, sourceData: e.target.value })
                    }
                    className="select select-bordered w-full pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option disabled value="">
                      Pilih daftar opsi dari koleksi...
                    </option>
                    {sourceDataList?.map((sd) => (
                      <option key={sd._id} value={sd._id}>
                        {sd.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                document.getElementById("modalsourcedata")?.showModal(); // Pastikan modalShowTips ada dan cara memanggilnya benar
              }}
              className="btn btn-outline btn-sm sm:btn-md text-purple-500 border-purple-500 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200 flex items-center gap-1 mt-2 sm:mt-0"
            >
              <Plus size={16} /> Buat Baru
            </button>
          </div>

          {input.sourceData && (
            <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm space-y-3">
              <div className="font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Eye size={20} /> Pratinjau Opsi Terpilih
              </div>
              <div className="italic text-gray-600 dark:text-gray-400 text-sm">
                {sourceDataPreview?.data?.desc || "Tidak ada deskripsi."}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sourceDataPreview?.data?.keys?.length > 0 ? (
                  sourceDataPreview.data.keys.map((item, idx) => (
                    <div
                      key={item._id || idx} // Gunakan idx sebagai fallback key
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 py-2 shadow-xs transition-transform transform hover:scale-105"
                    >
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {item.key}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.value}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center italic text-gray-500 dark:text-gray-400">
                    Tidak ada opsi ditemukan.
                  </p>
                )}
              </div>
            </div>
          )}

          {hasNew && (
            <div className="p-4 border border-dashed border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20 space-y-3">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                <Eye size={20} /> Pratinjau Opsi Baru
              </h4>

              {sourceDataPreviewErr ? (
                <div
                  role="alert"
                  className="alert alert-error bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200"
                >
                  <AlertCircle
                    size={24}
                    className="stroke-red-600 dark:stroke-red-300 shrink-0"
                  />
                  <span>Error: {JSON.stringify(sourceDataPreviewErr)}</span>
                </div>
              ) : (
                <>
                  <div className="text-sm space-y-2 text-gray-800 dark:text-gray-200">
                    <div>
                      <span className="font-bold flex items-center gap-1">
                        <FileText size={16} /> Judul:{" "}
                        {input.sourceDataNew?.title || "-"}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <span className="font-semibold flex items-center gap-1">
                        <MessageSquareText size={16} /> Deskripsi:
                      </span>
                      <p className="ml-6">
                        {input.sourceDataNew?.desc || "Tidak ada deskripsi."}
                      </p>
                    </div>
                    <div className="mt-2">
                      <span className="font-bold flex items-center gap-1">
                        <ListPlus size={16} /> Pilihan:
                      </span>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-6">
                        {input.sourceDataNew?.keys?.length > 0 ? (
                          input.sourceDataNew.keys.map((k, i) => (
                            <li key={i}>{k.value}</li>
                          ))
                        ) : (
                          <li>Tidak ada pilihan.</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {/* Jika ModalShowTips adalah komponen terpisah yang di-render di luar */}
      {ModalShowTips && <ModalShowTips />}
      <ModalCreateSourceData key={"modalSourceData"} />
    </div>
  );
}

const InputItemMemo = React.memo(InputItem);
InputItemMemo.displayName = "InputItem";

export default React.memo(InputItemMemo);
