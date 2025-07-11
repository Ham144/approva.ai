import FlexSourceDataApi from "@/api/flexSourceDataApi";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

export default function SourceDataOption() {
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
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

  const openEdit = (opt) => {
    setEditData(opt);
    setEditTitle(opt.title);
    setEditDesc(opt.desc);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await FlexSourceDataApi.editSourceData(editData._id, {
      title: editTitle,
      desc: editDesc,
      keys: editData.keys || [],
    });
    setEditData(null);
    queryClient.invalidateQueries(["sourcedata-list"]);
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <form
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
            onSubmit={handleEditSubmit}
          >
            <div className="flex justify-between items-center mb-6">
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
            <div className="space-y-4">
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
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="btn btn-ghost dark:text-gray-300 dark:hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                onClick={() => setEditData(null)}
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
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
