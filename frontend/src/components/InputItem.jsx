import {
  ArrowDownFromLine,
  ArrowUpFromLine,
  Link,
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
import LogicModal from "./LogicModal";
import { useEditor } from "@/store";

function InputItem({
  input,
  index,
  onChange,
  deleteInput,
  handleMoveRequest,
  statusIndex, // Index dari status yang sedang aktif
  isForRequest = false,
}) {
  const hasNew = !!input?.sourceDataNew;
  const [searchSourceDataTitle, setSearchSourceDataTitle] = useState("");
  const [openSignal, setOpenSignal] = useState(0);
  const { flow, setFlow } = useEditor();

  // Gunakan status index yang diterima dari parent
  const currentStatus = flow?.status[statusIndex];
  const currentStatusId = currentStatus?._id || currentStatus?.id;

  // Gunakan ID dari requirement yang sedang dikonfigurasi
  const currentRequirementId = input?._id;

  // no console logs per user preference

  const { data: sourceDataList } = useQuery({
    queryKey: ["sourcedata-list", searchSourceDataTitle],
    queryFn: async () => {
      const res = await FlexSourceDataApi.getAllSourceData(
        searchSourceDataTitle
      );
      return res;
    },
    enabled:
      input.tipe === "select" ||
      input.tipe === "multipleCheckbox" ||
      input.tipe === "table",
  });

  const { data: sourceDataPreview, error: sourceDataPreviewErr } = useQuery({
    queryKey: ["sourcedata-preview", input?.sourceData],
    queryFn: () => FlexSourceDataApi.getSourceDataByIdPost(input?.sourceData),
    enabled: !!input.sourceData,
  });

  // Helper function to get icon based on input type
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
          <label className="label">
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
        <label className="label">
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
          <label className="label">
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
                "textArea",
                "helper",
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
        <div className="card bg-base-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600">
          <div className="card-body p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Table size={20} className="text-primary" />
              <h2 className="card-title text-lg font-semibold text-gray-800 dark:text-gray-200">
                Konfigurasi Kolom Tabel
              </h2>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    {input?.table?.keys?.map((key, idx) => (
                      <th key={idx} className="p-2 align-top">
                        <div className="flex flex-col gap-2 items-center min-w-[150px]">
                          {/* Column Name Input */}
                          <input
                            type="text"
                            placeholder="Nama Kolom"
                            className="input input-bordered w-full input-sm bg-white dark:bg-gray-800"
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
                          {/* Column Type Selector */}
                          <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              {getInputTypeIcon(
                                input.table.keysType?.[idx] || "text"
                              )}
                            </span>
                            <select
                              className="select select-bordered w-full select-sm pl-9"
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
                              {[
                                "text",
                                "number",
                                "date",
                                "image",
                                "select",
                              ].map((typeOpt) => (
                                <option key={typeOpt} value={typeOpt}>
                                  {typeOpt.charAt(0).toUpperCase() +
                                    typeOpt.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          {/* Delete Column Button */}
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
                            className="btn btn-error btn-xs w-full"
                          >
                            <X size={14} /> Hapus
                          </button>
                          {/* Special Configuration for Select Type */}
                          {input.table.keysType?.[idx] === "select" && (
                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                              <div className="flex items-center gap-2 mb-3">
                                {getInputTypeIcon(input.tipe)}
                                <h4 className="font-semibold">
                                  Konfigurasi Pilihan Data
                                </h4>
                              </div>

                              <label className="label">
                                <span className="label-text font-semibold">
                                  Pilih Opsi Data:
                                </span>
                              </label>

                              <div className="flex flex-col sm:flex-row gap-2 w-full">
                                {!hasNew && (
                                  <div className="form-control flex-1">
                                    <div className="relative">
                                      <ListPlus className="absolute left-3 top-1/2 -translate-y-1/2" />
                                      <select
                                        value={
                                          input.table.sourceDataList?.[idx] ||
                                          ""
                                        }
                                        onChange={(e) => {
                                          const newSourceDataList = [
                                            ...(input.table.sourceDataList ||
                                              []),
                                          ];
                                          newSourceDataList[idx] =
                                            e.target.value;

                                          onChange({
                                            ...input,
                                            table: {
                                              ...input.table,
                                              sourceDataList: newSourceDataList,
                                            },
                                          });
                                        }}
                                        className="select select-bordered w-full pl-10"
                                      >
                                        <option disabled value="">
                                          Pilih daftar opsi...
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
                                  onClick={() =>
                                    document
                                      .getElementById("modalsourcedata")
                                      ?.showModal()
                                  }
                                  className="btn btn-outline btn-sm sm:flex-1"
                                >
                                  <Plus size={16} /> Buat Baru
                                </button>
                              </div>

                              {/* Data Preview Section */}
                              {input.sourceData && (
                                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                  <div className="flex items-center gap-2 text-lg font-bold">
                                    <Eye size={20} /> Pratinjau Opsi
                                  </div>
                                  <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-1">
                                    {sourceDataPreview?.data?.desc ||
                                      "Tidak ada deskripsi."}
                                  </p>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
                                    {sourceDataPreview?.data?.keys?.length >
                                    0 ? (
                                      sourceDataPreview.data.keys.map(
                                        (item, idx) => (
                                          <div
                                            key={item._id || idx}
                                            className="bg-gray-50 dark:bg-gray-700 rounded p-2 border border-gray-200 dark:border-gray-600 hover:scale-[1.02] transition-transform"
                                          >
                                            <div className="font-semibold text-sm">
                                              {item.key}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                              {item.value}
                                            </div>
                                          </div>
                                        )
                                      )
                                    ) : (
                                      <p className="col-span-full text-center italic">
                                        Tidak ada opsi ditemukan.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* New Data Preview Section */}
                              {hasNew && (
                                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-dashed border-green-300 dark:border-green-700">
                                  <div className="flex items-center gap-2 font-semibold text-green-700 dark:text-green-300">
                                    <Eye size={20} /> Pratinjau Opsi Baru
                                  </div>

                                  {sourceDataPreviewErr ? (
                                    <div className="alert alert-error mt-2">
                                      <AlertCircle />
                                      <span>
                                        Error:{" "}
                                        {JSON.stringify(sourceDataPreviewErr)}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="mt-2 space-y-2 text-sm">
                                      <div className="flex items-center gap-1 font-bold">
                                        <FileText size={16} /> Judul:{" "}
                                        {input.sourceDataNew?.title || "-"}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1 font-semibold">
                                          <MessageSquareText size={16} />{" "}
                                          Deskripsi:
                                        </div>
                                        <p className="ml-6 text-gray-600 dark:text-gray-400">
                                          {input.sourceDataNew?.desc ||
                                            "Tidak ada deskripsi."}
                                        </p>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1 font-bold">
                                          <ListPlus size={16} /> Pilihan:
                                        </div>
                                        <ul className="ml-6 list-disc text-gray-700 dark:text-gray-300">
                                          {input.sourceDataNew?.keys?.length >
                                          0 ? (
                                            input.sourceDataNew.keys.map(
                                              (k, i) => (
                                                <li key={i}>{k.value}</li>
                                              )
                                            )
                                          ) : (
                                            <li>Tidak ada pilihan.</li>
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}

                    {/* Add Column Button */}
                    <th className="p-2 align-top">
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
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        <Plus size={16} />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={(input?.table?.keys?.length || 0) + 1}
                      className="text-center p-4"
                    >
                      <div className="text-gray-500 dark:text-gray-400 italic">
                        Isi nama kolom dan tipe data yang diharapkan untuk
                        tabel.
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
            <div className="flex flex-col gap-3 justify-start">
              <button
                onClick={() => {
                  document.getElementById("modalsourcedata")?.showModal(); // Pastikan modalShowTips ada dan cara memanggilnya benar
                }}
                className=" btn-outline btn sm:btn-md text-purple-500 border-purple-500 hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/20 transition-colors duration-200 flex items-center  rounded-lg gap-1 mt-2 sm:mt-0"
              >
                <Plus size={16} /> Buat Baru
              </button>{" "}
              <button
                onClick={() => {
                  document
                    .getElementById("modal-setup-external-option")
                    ?.showModal();
                }}
                className="btn rounded-lg btn-outline "
              >
                <Link size={16} /> Http Request
              </button>
            </div>
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

      {/* bagian fitur logika Jump to, dan completed if, rejected if, prevent next if  */}
      {!isForRequest && (
        <>
          <div className={`space-y-4`}>
            <button
              // disabled={flow?.logics?.some((e) => e.uuid === input.uuid)}
              disabled={flow?.logics?.some((logic) =>
                currentStatus.requirements.some(
                  (req) =>
                    req._id === logic.requirementId ||
                    req.uuid === logic.requirementId
                )
              )}
              className="btn w-full rounded-lg shadow-sm bg-primary hover:bg-primary-focus text-white"
              onClick={() => {
                const modalId = `logicModal-${currentStatusId}-${currentRequirementId}`;
                // trigger reset state via openSignal by forcing rerender key
                setOpenSignal((s) => s + 1);
                document.getElementById(modalId)?.showModal();
              }}
            >
              <Plus />
              {flow?.logics?.some((logic) =>
                currentStatus.requirements.some(
                  (req) =>
                    req._id === logic.requirementId ||
                    req.uuid === logic.requirementId
                )
              )
                ? "Hanya boleh satu logic perstatus"
                : "Tambah Logic Route"}
            </button>

            {/* tammpilin Logika yang telah dibuat */}
            {flow?.logics && flow.logics.length > 0 && (
              <div className="space-y-3 my-3 rounded-lg">
                {flow.logics
                  .filter(
                    (logic) => String(logic.requirementId) === String(input._id)
                  )
                  .map((logic, logicIndex) => (
                    <div
                      key={logicIndex}
                      className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg  bg-gray-50 dark:bg-gray-700 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="badge badge-primary text-white rounded-lg">
                            {logic.logicType === "jumpTo" && "Jump to"}
                            {logic.logicType === "completedIf" &&
                              "Completed if"}
                            {logic.logicType === "rejectedIf" && "Rejected if"}
                            {logic.logicType === "preventNextIf" &&
                              "Prevent next if"}
                          </span>
                          {logic.logicType === "jumpTo" &&
                            logic.jumpToStatusUuid && (
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                →{" "}
                                {flow.status?.find(
                                  (s) => s.uuid === logic.jumpToStatusUuid
                                )?.title || "Unknown Status"}
                              </span>
                            )}
                        </div>
                        <button
                          onClick={() => {
                            const newLogics = [...(flow?.logics || [])];
                            const logicIndex = newLogics.findIndex(
                              (e) => e.requirementId === input._id
                            );
                            newLogics.splice(logicIndex, 1);
                            setFlow({
                              ...flow,
                              logics: newLogics,
                            });
                          }}
                          className="btn btn-error btn-xs"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Requirement:</span>{" "}
                          {input.title || "Unknown"}
                        </div>
                        <div>
                          <span className="font-medium">Kondisi:</span>{" "}
                          {logic.operator}{" "}
                          <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">
                            {logic.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <LogicModal
            flow={flow}
            currentRequirementId={currentRequirementId}
            currentStatus={currentStatus}
            modalId={`logicModal-${currentStatusId}-${currentRequirementId}`}
            openSignal={openSignal}
            handleAddlogicModal={(logicData) => {
              const newLogics = [...(input.logics || []), logicData];
              setFlow((prev) => ({
                ...prev,
                logics: [...prev?.logics, logicData],
              }));
            }}
            input={input}
            key={`modalLogic-${currentStatusId}-${currentRequirementId}`}
          />
        </>
      )}

      {ModalShowTips && <ModalShowTips />}
      <ModalCreateSourceData key={"modalSourceData"} />
    </div>
  );
}

const InputItemMemo = React.memo(InputItem);
InputItemMemo.displayName = "InputItem";

export default React.memo(InputItemMemo);
