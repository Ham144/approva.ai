import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { PlusCircle, List, Pencil, Trash2 } from "lucide-react";
import flowApi from "@/api/flowApi";
import ModalOption from "@/components/ModalOption";

export default function RequestPage() {
  const [searchKey, setSearchKey] = useState("");
  const [selectedFlow, setSelectedFlow] = useState(null);
  const navigate = useNavigate();

  const { data: flowList } = useQuery({
    queryKey: ["flows", searchKey],
    queryFn: () => flowApi.getAllFlowNameAndDesc(searchKey),
  });

  const filteredFlows = useMemo(() => {
    const key = searchKey.toLowerCase();
    return flowList?.data?.filter(
      (flow) =>
        flow.title.toLowerCase().includes(key) ||
        flow.desc.toLowerCase().includes(key)
    );
  }, [searchKey, flowList]);

  const openModal = (flow) => {
    setSelectedFlow(flow);
    document.getElementById("modalactionrequestlist")?.showModal();
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📄 Flow List</h1>
      <input
        type="text"
        placeholder="Search flow by title or description..."
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="p-2 rounded-lg text-sm text-gray-500">
        Ini Adalah flow request yang tersedia bagi akun anda, beberapa flow
        mungkin tidak dapat diakses untuk akun anda
      </div>

      <div className="space-y-4">
        {filteredFlows?.length === 0 ? (
          <p className="text-gray-500 text-center">No results found.</p>
        ) : (
          filteredFlows?.map((flow) => (
            <div
              key={flow._id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openModal(flow)}
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {flow.title}
              </h2>
              <p className="text-gray-600">{flow.desc}</p>
              <p className="text-xs text-gray-400 mt-2">ID: {flow._id}</p>
              <p className="text-xs text-gray-400 mt-2">
                Designed By:{" "}
                {flow?.designedBy?.length === 0
                  ? "SYSTEM"
                  : flow?.designedBy?.map((user) => (
                      <span key={user._id}>{user.username}</span>
                    ))}
              </p>
            </div>
          ))
        )}
      </div>

      <ModalOption selectedFlow={selectedFlow} />
    </div>
  );
}
