import FlexSourceDataApi from "@/api/flexSourceDataApi";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Search,
  Edit,
  Trash2,
  X,
  Save,
  PlusCircle,
  Database,
} from "lucide-react"; // Impor ikon yang dibutuhkan
import ModalCreateSourceData from "@/components/ModalCreateSourceData";
import toast from "react-hot-toast";

export default function SourceDataOption() {
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editViews, setEditViews] = useState("standard");
  const [editTipe, setEditTipe] = useState("internal");
  const [editKeys, setEditKeys] = useState([]);
  const [editEndpoint, setEditEndpoint] = useState("");
  const [editApiKey, setEditApiKey] = useState("");
  const [editPenamaanSearchKey, setEditPenamaanSearchKey] =
    useState("searchKey");
  const [editPointer, setEditPointer] = useState("");
  const [editKeyMappingKey, setEditKeyMappingKey] = useState("");
  const [editKeyMappingValue, setEditKeyMappingValue] = useState("");

  const queryClient = useQueryClient();

  const {
    data: sourceDataList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sourceData", search],
    queryFn: async () => await FlexSourceDataApi.getAllSourceData(search),
  });

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus data ini?")) {
      await FlexSourceDataApi.deleteSourceData(id);
      queryClient.invalidateQueries(["sourceData"]);
    }
  };

  const openEdit = async (opt) => {
    const loadingToast = toast.loading("Memuat detail data...");
    try {
      const detail = await FlexSourceDataApi.getSourceDataById(opt._id);
      const data = detail?.data || opt;
      setEditData(data);
      setEditTitle(data.title || "");
      setEditDesc(data.desc || "");
      setEditViews(data.views || "standard");
      setEditTipe(data.tipe || "internal");
      setEditKeys(data.keys || []);
      setEditEndpoint(data.endpoint || "");
      setEditApiKey(data.apiKey || "");
      setEditPenamaanSearchKey(data.penamaanSearchKey || "searchKey");
      setEditPointer(data.pointer || "");
      setEditKeyMappingKey(data.keyMapping?.key || "");
      setEditKeyMappingValue(data.keyMapping?.value || "");
      toast.dismiss(loadingToast);
    } catch (err) {
      console.log(err);
      toast.error("Gagal memuat detail data");
      toast.dismiss(loadingToast);
    }
  };

  const addEditKey = () => {
    setEditKeys((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleEditKeyChange = (index, field, val) => {
    setEditKeys((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const deleteEditKey = (index) => {
    setEditKeys((prev) => prev.filter((_, idx) => idx !== index));
  };

  const { mutate: mutateEdit, isLoading: isLoadingEdit } = useMutation({
    mutationFn: (updatedData) =>
      FlexSourceDataApi.editSourceData(updatedData._id, updatedData),
    onSuccess: (res) => {
      setEditData(null);
      queryClient.invalidateQueries(["sourceData"]); // fix typo dari "sourcedata-list"
      toast.success(res?.message || "Berhasil diperbarui");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal memperbarui data");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    if (!editData) return;

    if (!editTitle.trim()) {
      toast.error("Judul tidak boleh kosong");
      return;
    }
    if (!editDesc.trim()) {
      toast.error("Deskripsi tidak boleh kosong");
      return;
    }

    const payload = {
      _id: editData._id,
      title: editTitle,
      desc: editDesc,
      views: editViews,
      tipe: editTipe,
    };

    if (editTipe === "internal") {
      if (editKeys.length < 2) {
        toast.error("Minimal 2 pilihan data diperlukan");
        return;
      }
      for (const k of editKeys) {
        if (!k.key.trim() || !k.value.trim()) {
          toast.error("Semua key dan label pilihan data harus diisi");
          return;
        }
      }
      payload.keys = editKeys;
    } else {
      if (!editEndpoint.trim()) {
        toast.error("Endpoint URL diperlukan");
        return;
      }
      if (!editPenamaanSearchKey.trim()) {
        toast.error("Penamaan Search Key diperlukan");
        return;
      }
      if (!editKeyMappingKey.trim() || !editKeyMappingValue.trim()) {
        toast.error("Key Mapping dan Value Mapping diperlukan");
        return;
      }
      payload.endpoint = editEndpoint;
      payload.apiKey = editApiKey;
      payload.penamaanSearchKey = editPenamaanSearchKey;
      payload.pointer = editPointer;
      payload.keyMapping = {
        key: editKeyMappingKey,
        value: editKeyMappingValue,
      };
    }

    mutateEdit(payload);
  };

  const openCreateNew = () => {
    document.getElementById("modalsourcedata").showModal();
  };

  return (
    <PengelolaSideBarMenu>
      <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header Halaman */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-600" />
            Manajemen Opsi Sumber Data
          </h1>
          <button
            onClick={openCreateNew}
            className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 rounded-lg shadow-md transition-all duration-200"
          >
            <PlusCircle className="w-5 h-5" />
            Tambah Baru
          </button>
        </div>

        {/* Search Input dan Kontainer Tabel */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Cari berdasarkan judul..."
              className="input input-bordered w-full pr-10 text-gray-900 dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 rounded-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <span className="loading loading-spinner loading-lg text-indigo-500"></span>
            </div>
          ) : isError ? (
            <div className="alert alert-error bg-red-100 border-red-400 text-red-700 rounded-lg p-4 mb-4">
              <span>Terjadi kesalahan saat memuat data.</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="table w-full text-left">
                <thead>
                  <tr className="bg-indigo-600 dark:bg-indigo-800 text-white text-sm font-semibold uppercase tracking-wider">
                    <th className="p-4 sm:p-5 whitespace-nowrap">Judul</th>
                    <th className="p-4 sm:p-5">Deskripsi</th>
                    <th className="p-4 sm:p-5 whitespace-nowrap">
                      Dibuat Oleh
                    </th>
                    <th className="p-4 sm:p-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {!sourceDataList?.length ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center p-8 text-gray-500 dark:text-gray-400 text-lg"
                      >
                        <p className="mb-2">
                          Tidak ada data Sumber Opsi ditemukan.
                        </p>
                        <p>Klik "Tambah Baru" untuk memulai!</p>
                      </td>
                    </tr>
                  ) : (
                    sourceDataList.map((opt, index) => (
                      <tr
                        key={opt._id}
                        className={`${
                          index % 2 === 0
                            ? "bg-white dark:bg-gray-800"
                            : "bg-gray-50 dark:bg-gray-700"
                        } hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700`}
                      >
                        <td className="p-4 sm:p-5 text-gray-900 dark:text-gray-100 font-medium">
                          {opt.title}
                        </td>
                        <td className="p-4 sm:p-5 text-gray-700 dark:text-gray-300">
                          {opt.desc || "-"}
                        </td>
                        <td className="p-4 sm:p-5 text-gray-700 dark:text-gray-300">
                          {opt.createdBy?.username || "-"}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap flex gap-2">
                          <button
                            type="button"
                            className="btn btn-warning btn-sm bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center gap-1"
                            onClick={() => openEdit(opt)}
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-error btn-sm bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                            onClick={() => handleDelete(opt._id)}
                          >
                            <Trash2 className="w-4 h-4" /> Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Edit Data (asumsi Anda memiliki state dan fungsi untuk ini) */}
      {editData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4 ">
          <form
            onSubmit={handleEdit}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-xl animate-fade-in max-h-[85vh] overflow-auto relative"
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-gray-800 pb-2 z-10 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Edit Data Sumber
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                onClick={() => setEditData(null)}
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 pb-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Judul
                </label>
                <input
                  id="edit-title"
                  className="input input-bordered w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="edit-desc"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Deskripsi
                </label>
                <input
                  id="edit-desc"
                  className="input input-bordered w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="edit-tipe"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Tipe Opsi
                  </label>
                  <select
                    id="edit-tipe"
                    className="select select-bordered w-full px-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={editTipe}
                    onChange={(e) => setEditTipe(e.target.value)}
                  >
                    <option value="internal">Internal (Statis)</option>
                    <option value="external">External (API)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="edit-views"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                  >
                    Display Mode (Tampilan)
                  </label>
                  <select
                    id="edit-views"
                    className="select select-bordered w-full px-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={editViews}
                    onChange={(e) => setEditViews(e.target.value)}
                  >
                    <option value="standard">Standard (Dropdown biasa)</option>
                    <option value="big">Big (Kotak besar dengan emoji)</option>
                    <option value="small">Small (Badge kecil mendatar)</option>
                  </select>
                </div>
              </div>

              {/* Tipe: INTERNAL */}
              {editTipe === "internal" && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Daftar Pilihan Opsi
                    </label>
                    <button
                      type="button"
                      className="btn btn-xs btn-outline btn-primary flex items-center gap-1"
                      onClick={addEditKey}
                    >
                      + Tambah Baris
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {editKeys.map((k, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="input input-sm input-bordered flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Key (mesin)"
                          value={k.key}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.includes(" ")) {
                              toast.error("Key tidak boleh mengandung spasi");
                              return;
                            }
                            handleEditKeyChange(i, "key", val);
                          }}
                          required
                        />
                        <input
                          type="text"
                          className="input input-sm input-bordered flex-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Label/Value"
                          value={k.value}
                          onChange={(e) =>
                            handleEditKeyChange(i, "value", e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-xs btn-error text-white hover:scale-105 transition-transform"
                          onClick={() => deleteEditKey(i)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {editKeys.length === 0 && (
                      <p className="text-sm italic text-gray-400 text-center py-2">
                        Belum ada opsi. Silakan klik tambah baris.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tipe: EXTERNAL */}
              {editTipe === "external" && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 space-y-3">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Konfigurasi API Eksternal
                  </label>

                  <div>
                    <label
                      htmlFor="edit-endpoint"
                      className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                    >
                      Endpoint URL
                    </label>
                    <input
                      id="edit-endpoint"
                      type="url"
                      className="input input-bordered input-sm w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="https://api.example.com/data"
                      value={editEndpoint}
                      onChange={(e) => setEditEndpoint(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="edit-apikey"
                      className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                    >
                      API Key Header (x-api-key)
                    </label>
                    <input
                      id="edit-apikey"
                      type="text"
                      className="input input-bordered input-sm w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Masukkan API Key jika ada"
                      value={editApiKey}
                      onChange={(e) => setEditApiKey(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="edit-searchkey"
                        className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                      >
                        Penamaan Search Key
                      </label>
                      <input
                        id="edit-searchkey"
                        type="text"
                        className="input input-bordered input-sm w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="e.g. searchKey"
                        value={editPenamaanSearchKey}
                        onChange={(e) =>
                          setEditPenamaanSearchKey(e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-pointer"
                        className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                      >
                        Response Pointer (Optional)
                      </label>
                      <input
                        id="edit-pointer"
                        type="text"
                        className="input input-bordered input-sm w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="e.g. data.items"
                        value={editPointer}
                        onChange={(e) => setEditPointer(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="edit-mapping-key"
                        className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                      >
                        Key Mapping (Field Key)
                      </label>
                      <input
                        id="edit-mapping-key"
                        type="text"
                        className="input input-bordered input-sm w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="e.g. id"
                        value={editKeyMappingKey}
                        onChange={(e) => setEditKeyMappingKey(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="edit-mapping-value"
                        className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"
                      >
                        Value Mapping (Field Label)
                      </label>
                      <input
                        id="edit-mapping-value"
                        type="text"
                        className="input input-bordered input-sm w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="e.g. name"
                        value={editKeyMappingValue}
                        onChange={(e) => setEditKeyMappingValue(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
              <button
                type="button"
                className="btn btn-ghost dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                onClick={() => setEditData(null)}
              >
                Batal
              </button>
              <button
                disabled={isLoadingEdit}
                type="submit"
                className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 px-6 py-2 rounded-lg shadow-md transition-all duration-200"
              >
                <Save className="w-4 h-4" /> Simpan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ModalCreateSourceData untuk tambah data baru */}
      <ModalCreateSourceData />
    </PengelolaSideBarMenu>
  );
}
