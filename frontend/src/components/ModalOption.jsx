import { useResponseCollector } from "@/store";
import { List, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function ModalOption({ selectedFlow }) {
  const navigate = useNavigate();
  const { resetRequestData } = useResponseCollector();

  return (
    <dialog id="modalactionrequestlist" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-center text-wrap  text-lg mb-4">
          {selectedFlow?.title}
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              resetRequestData();
              navigate(`/request/create/${selectedFlow?._id}`);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded text-indigo-700 font-medium"
          >
            <PlusCircle size={18} />
            Mulai Request
          </button>
          <button
            onClick={() =>
              navigate(
                `/process?overallStatus=in-progress&flowTemplateCategory=${selectedFlow?._id}`
              )
            }
            className="w-full flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded text-gray-700 font-medium"
          >
            <List size={18} />
            Lihat Yang Belum Selesai
          </button>
        </div>

        <form method="dialog" className="modal-backdrop mt-4">
          <button className="w-full py-2 text-sm text-gray-500">Tutup</button>
        </form>
      </div>
    </dialog>
  );
}
