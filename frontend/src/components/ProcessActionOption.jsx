import flowInstanceApi from "@/api/flowInstanceApi";
import { useUserInfo } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, PlusCircle, Trash2, History, Pencil, Undo } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import FlowStatusModal from "./StatusPreviewModal";

export default function ProcessActionOption({ selectedInstance }) {
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();
  const [targetStatusIndex, setTargetStatusIndex] = useState(null);

  const queryClient = useQueryClient();

  const { mutateAsync: handleDeleteInstance } = useMutation({
    mutationKey: ["flowInstance", "delete"],
    mutationFn: (id) => flowInstanceApi.delete(id),
    onSuccess: () => {
      toast.success("Flow instance berhasil dihapus");
      document.getElementById("modalprocessaction")?.close();
      document.getElementById("deleteconfirm")?.close();
      queryClient.invalidateQueries(["flowInstance"]);
    },
    onError: () => {
      toast.error("Flow instance gagal dihapus");
    },
  });

  const { mutate: handleRollbackToStart, isPending: rollingBack } = useMutation(
    {
      mutationKey: ["flowInstance", "update"],
      mutationFn: async () =>
        await flowInstanceApi.rollback(selectedInstance?._id),
      onSuccess: (res) => {
        toast.success(
          res?.response?.data?.message || "berhasil mereset proses"
        );
        document.getElementById("modalprocessaction")?.close();
        queryClient.invalidateQueries(["flowInstance", selectedInstance?._id]);
      },
      onError: (er) => {
        document.getElementById("modalprocessaction")?.close();
        toast.error(er?.response?.data?.message || "Gagal mereset proses");
      },
    }
  );

  const { mutate: handleUndo, isPending: pendingUndo } = useMutation({
    mutationKey: ["flowInstance", "update"],
    mutationFn: async (targetStatusIndex) =>
      await flowInstanceApi.undo_1_step(
        selectedInstance?._id,
        targetStatusIndex
      ),
    onSuccess: (res) => {
      toast.success(
        res?.response?.data?.message || "berhasil undo 1 langkah anda"
      );
      window.location.reload();
    },
    onError: (er) => {
      document.getElementById("statusmodal")?.close();
      toast.error(er?.response?.data?.message || "Gagal mereset proses");
    },
  });

  const isInProgress = selectedInstance?.overallStatus == "in-progress";
  const isMyTurn = selectedInstance?.flowTemplate?.status[
    selectedInstance?.currentStatusIndex
  ].authorized?.find((user) => user._id == userInfo._id);

  return (
    <dialog id="modalprocessaction" className="modal">
      <div className="modal-box max-w-md p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
          <h3 className="font-bold text-xl">
            Aksi untuk: {selectedInstance?.flowTemplate?.title}
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            {selectedInstance?.flowTemplate.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <button
            disabled={!isInProgress || !isMyTurn}
            onClick={() =>
              navigate(`/status/fulfillment/${selectedInstance._id}`)
            }
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
              !isInProgress || !isMyTurn
                ? "bg-gray-100 text-gray-400"
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
            }`}
          >
            <div className="flex items-center gap-3">
              <PlusCircle size={18} className="flex-shrink-0" />
              <span className="font-medium">Penuhi</span>
            </div>
            {!isMyTurn && (
              <span className="badge badge-sm bg-gray-200 text-gray-600">
                Bukan giliran
              </span>
            )}
            {selectedInstance?.overallStatus === "completed" && (
              <span className="badge badge-sm bg-green-100 text-green-700">
                Completed
              </span>
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/status/isOnlyPreview/${selectedInstance._id}`);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-all"
          >
            <Eye size={18} className="flex-shrink-0" />
            <span className="font-medium">Melihat Saja</span>
          </button>
          <button
            disabled={
              (selectedInstance?.requestedBy?._id != userInfo?._id &&
                selectedInstance?.currentStatusIndex != 0) ||
              selectedInstance?.currentStatusIndex == 0
            }
            onClick={() => navigate(`/request/edit/${selectedInstance?._id}`)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all bg-yellow-50 hover:bg-yellow-100 text-yellow-700 
                disabled:bg-gray-100 disabled:text-gray-400 disabled:text-gray-400"
            }`}
          >
            <Pencil size={18} className="flex-shrink-0" />
            <span className="font-medium">Edit Request</span>
          </button>
          <button
            disabled={
              selectedInstance?.requestedBy?._id != userInfo?._id ||
              selectedInstance?.overallStatus != "in-progress" ||
              rollingBack ||
              selectedInstance?.currentStatusIndex == 0
            }
            onClick={handleRollbackToStart}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all in-progress disabled:bg-gray-100 text-white disabled:text-gray-400
              bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          >
            <History size={18} className="flex-shrink-0" />
            <span className="font-medium">
              Rollback (mulai dari awal status)
            </span>
          </button>

          <button
            disabled={
              selectedInstance?.overallStatus != "in-progress" ||
              selectedInstance.currentStatusIndex == 0 ||
              pendingUndo ||
              (() => {
                const idx = selectedInstance?.currentStatusIndex ?? 0;
                let isAuthorized = false;

                if (
                  idx >= 0 &&
                  selectedInstance?.flowTemplate?.status?.[idx]?.authorized
                ) {
                  const auth =
                    selectedInstance?.flowTemplate?.status?.[idx]?.authorized;
                  isAuthorized = auth.some((item) => {
                    const itemId = item && item._id ? item._id : item;
                    // jika itemId adalah mongoose ObjectId, .equals aman; fallback ke String
                    return itemId && typeof itemId.equals === "function"
                      ? itemId.equals(userInfo._id)
                      : String(itemId) === String(userInfo._id);
                  });
                }

                return !isAuthorized;
              })()
            }
            onClick={() => document.getElementById("statusmodal")?.showModal()}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all disabled:bg-gray-100 disabled:text-gray-400 bg-indigo-600 hover:bg-indigo-400 text-white
            }`}
          >
            <Undo size={18} className="flex-shrink-0" />
            <span className="font-medium">
              Undo (Pilih status sebelumnya untuk kembali)
            </span>
          </button>
        </div>

        {/* Information Box */}
        <div className="bg-blue-50 p-3 mx-4 mb-4 rounded-lg border border-blue-100">
          <p className="text-blue-700 text-sm">
            Untuk rollback, lakukan edit dulu lalu rollback, karena saat
            rollback approval pertama akan mendapatkan notifikasi perubahan
            langsung
          </p>
          <p className="text-blue-700 text-sm">
            Untuk undo, bisa dilakukan oleh approval saat ini untuk kembalik ke
            approval yang salah untuk di revisi
          </p>
        </div>

        {/* Close Button */}
        <div className="px-4 pb-4">
          <form method="dialog">
            <button className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Tutup
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <dialog id="deleteconfirm" className="modal">
        <div className="modal-box max-w-md p-6">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </form>

          <div className="text-center">
            <Trash2 className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="font-bold text-lg mb-2">Konfirmasi Penghapusan</h3>
            <p className="text-gray-600 mb-6">
              Apa kamu yakin menghapusnya, atau draft saja untuk tidak terlihat?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              className="btn btn-outline hover:bg-gray-100 flex-1"
              onClick={() => navigate(`/request/edit/${selectedInstance?._id}`)}
            >
              Draft Saja
            </button>
            <button
              className="btn btn-error text-white hover:bg-red-600 flex-1"
              onClick={() => handleDeleteInstance(selectedInstance?._id)}
            >
              Hapus Permanen
            </button>
          </div>
        </div>
      </dialog>
      <FlowStatusModal
        selectedFlow={selectedInstance?.flowTemplate}
        onClose={() => document.getElementById("statusmodal")?.close()}
        key={"statusmodal"}
        mode={"undo"}
        onSelectIndex={(idx) => {
          const confirm = window.confirm(
            `Apakah kamu yakin untuk kembali ke status ${selectedInstance?.flowTemplate?.status?.[idx]?.title} ini?`
          );
          if (confirm) {
            handleUndo(idx);
          }
        }}
      />
    </dialog>
  );
}
