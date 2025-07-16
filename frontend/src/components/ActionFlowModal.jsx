import flowApi from "@/api/flowApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { PencilLine, Trash2, ListTree, XCircle } from "lucide-react";

export default function ActionFlowModal({ selectedFlow }) {
  const navigate = useNavigate();

  function handleEdit() {
    navigate(`/management/flow/edit/${selectedFlow?._id}`);
  }

  const queryClient = useQueryClient();

  const { mutateAsync: handleDeleteMutation } = useMutation({
    mutationKey: ["flows", "flow", selectedFlow?._id],
    mutationFn: async () => flowApi.deleteFlow(selectedFlow?._id),
    onSuccess: () => {
      document.getElementById("action-flow")?.close();
      queryClient.invalidateQueries("flows");
    },
  });

  function handleDelete() {
    const confirmDelete = window.confirm(
      "Anda yakin ingin menghapus flow dan semua request yang terkait?"
    );
    if (confirmDelete) {
      handleDeleteMutation();
    }
  }

  return (
    <dialog id="action-flow" className="modal">
      <div className="modal-box p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl transition-all duration-300">
        {/* Modal Title */}
        <h3 className="font-bold text-center text-2xl mb-6 text-gray-800 dark:text-gray-100 flex items-center justify-center gap-3">
          <span className="text-blue-500">
            <PencilLine size={24} />
          </span>
          Pilih Aksi Untuk Alur Ini
        </h3>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          {/* Edit Flow Button */}
          <button
            className="btn btn-primary w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg flex-wrap"
            disabled={!selectedFlow?._id}
            onClick={handleEdit}
          >
            <PencilLine size={20} />
            Edit Flow
          </button>

          {/* Delete Flow Button */}
          <button
            className="btn btn-error w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            disabled={!selectedFlow?._id}
            onClick={handleDelete}
          >
            <Trash2 size={20} />
            Hapus Flow (Beserta Requestnya)
          </button>

          {/* View List Instance Button */}
          <button
            className="btn btn-accent w-full text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            disabled={!selectedFlow?._id}
            onClick={() =>
              navigate(`/process?flowTemplateCategory=${selectedFlow?._id}`)
            }
          >
            <ListTree size={20} />
            Lihat Daftar Penggunaan (Instance)
          </button>
        </div>

        {/* Modal Close Action */}
        <div className="modal-action mt-6 flex justify-end">
          <form method="dialog">
            <button className="btn btn-ghost text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2">
              <XCircle size={18} />
              Tutup
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
