import flowInstanceApi from "@/api/flowInstanceApi";
import { useUserInfo } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, PlusCircle, Trash, History, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function ProcessActionOption({ selectedInstance }) {
  const { userInfo } = useUserInfo();
  const navigate = useNavigate();

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

  const { mutate: handleRollbackToStart } = useMutation({
    mutationKey: ["flowInstance", "update"],
    mutationFn: async () =>
      await flowInstanceApi.rollback(selectedInstance?._id),
    onSuccess: (res) => {
      toast.success(res?.response?.data?.message || "berhasil mereset proses");
      document.getElementById("modalprocessaction")?.close();
      queryClient.invalidateQueries(["flowInstance", selectedInstance?._id]);
    },
    onError: (er) => {
      document.getElementById("modalprocessaction")?.close();
      toast.error(er?.response?.data?.message || "Gagal mereset proses");
    },
  });

  const isInProgress = selectedInstance?.overallStatus == "in-progress";
  const isMyTurn = selectedInstance?.flowTemplate?.status[
    selectedInstance?.currentStatusIndex
  ].authorized?.find((user) => user._id == userInfo._id);

  return (
    <dialog id="modalprocessaction" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4 rounded-md p-3 bg-gray-100 dark:bg-gray-800">
          Aksi untuk: {selectedInstance?.flowTemplate?.title}
        </h3>
        <p className="text-gray-400 p-3 rounded-md bg-gray-50 dark:bg-gray-700">
          {selectedInstance?.flowTemplate.desc}
        </p>
        <div className="space-y-3">
          <button
            disabled={!isInProgress || !isMyTurn}
            onClick={() =>
              navigate(`/status/fulfillment/${selectedInstance._id}`)
            }
            className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 disabled:bg-slate-200 rounded text-indigo-700 font-medium"
          >
            <PlusCircle size={18} />
            Penuhi
            {!isMyTurn && <span className="badge">Bukan giliran</span>}
            {!selectedInstance?.overallStatus == "completed" && (
              <span className="badge badge-success">completed</span>
            )}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigate(`/status/isOnlyPreview/${selectedInstance._id}`);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 bg-orange-300 hover:bg-indigo-200 disabled:bg-slate-200 rounded text-orange-700 font-medium"
          >
            <Eye size={18} />
            Melihat Saja
          </button>

          <button
            disabled={
              // selectedInstance?.overallStatus != "draft" ||
              selectedInstance?.requestedBy?._id != userInfo?._id &&
              selectedInstance?.currentStatusIndex != 0
            }
            onClick={() => navigate(`/request/edit/${selectedInstance?._id}`)}
            className="w-full flex items-center gap-2 px-4 py-2 bg-yellow-300 hover:bg-slate-200 disabled:bg-slate-200 rounded text-gray-700 font-medium"
          >
            <Pencil size={18} />
            Edit Request
          </button>

          <button
            disabled={
              selectedInstance?.requestedBy?._id != userInfo?._id ||
              selectedInstance?.currentStatusIndex ==
                selectedInstance?.flowTemplate?.status.length - 1
            }
            onClick={handleRollbackToStart}
            className="w-full flex items-center gap-2 px-4 py-2 bg-purple-600  disabled:bg-slate-200 rounded hover:bg-slate-300 font-medium text-white"
          >
            <History size={18} />
            Rollback (mulai dari awal status)
          </button>

          {/* <button
            disabled={
              selectedInstance?.requestedBy?._id &&
              selectedInstance?.requestedBy?._id !== userInfo?._id
            }
            onClick={() => document.getElementById("deleteconfirm").showModal()}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-300 hover:bg-slate-200 disabled:bg-slate-200 rounded text-gray-700 font-medium"
          >
            <Trash size={18} />
            Hapus
          </button> */}
        </div>

        <form method="dialog" className="modal-backdrop mt-4">
          <button className="w-full py-2 text-sm text-gray-500">Tutup</button>
        </form>
      </div>
      {/* dialog untuk konfirmasi hapus */}
      <dialog id="deleteconfirm" className="modal">
        <div className="modal-box bg-base-100 shadow-xl rounded-lg">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center mb-4">
            Apa kamu yakin menghapusnya, atau draft saja untuk tidak terlihat ?
          </h3>
          <div className="modal-action space-x-2">
            <button
              className="btn btn-primary text-white rounded-md"
              onClick={() => navigate(`/request/edit/${selectedInstance?._id}`)}
            >
              Ok Buat draft saja
            </button>
            <button
              className="btn text-white btn-error rounded-md"
              onClick={() => handleDeleteInstance(selectedInstance?._id)}
            >
              Hapus!
            </button>
          </div>
        </div>
      </dialog>
    </dialog>
  );
}
