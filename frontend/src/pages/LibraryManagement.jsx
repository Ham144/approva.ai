import { Search, Copy, Users, Lock, Unlock } from "lucide-react";
import flowApi from "@/api/flowApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import toast from "react-hot-toast";

export default function LibraryManagement() {
  const [search, setSearch] = useState("");
  const [filteredFlow, setFilteredFlow] = useState([]);

  const { data: flowData, isLoading } = useQuery({
    queryKey: ["flow", "template"],
    queryFn: () => flowApi.getAllFlowForLibrary(),
  });

  const queryClient = useQueryClient();
  const { mutateAsync: cloneFlow, isPending: cloning } = useMutation({
    mutationKey: ["flow"],
    mutationFn: async (id) => await flowApi.cloneFromOtherOrg(id),
    onSuccess: () => {
      toast.success("Flow berhasil di clone ke organisasi anda");
      queryClient.invalidateQueries(["flow", "template"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal Cloning Flow");
    },
  });

  useEffect(() => {
    if (flowData?.data) {
      const filtered = flowData.data.filter(
        (flow) =>
          flow.title.toLowerCase().includes(search.toLowerCase()) ||
          flow.desc.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredFlow(filtered);
    }
  }, [search, flowData]);

  const getAccessBadge = (flow) => {
    if (flow.mode === "private") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Lock className="w-3 h-3 mr-1" />
          Private
        </span>
      );
    } else if (flow.mode === "department") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Users className="w-3 h-3 mr-1" />
          Department
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Unlock className="w-3 h-3 mr-1" />
        Public
      </span>
    );
  };

  if (isLoading)
    return <div className="text-center py-8">Loading flow templates...</div>;

  return (
    <PengelolaSideBarMenu>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Flow Template Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan dan gunakan template flow terbaik dari seluruh organisasi
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400 h-5 w-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-gray-50 shadow-xs text-gray-700 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            placeholder="Cari flow..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Flow Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFlow.length > 0 ? (
            filteredFlow.map((flow) => (
              <div
                key={flow._id}
                className="group relative bg-white h-[500px]  rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {flow.title}
                    </h3>
                    {getAccessBadge(flow)}
                  </div>

                  <p className="text-gray-600 text-base mb-6 line-clamp-3">
                    {flow.desc}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <span className="text-gray-400">Created by</span>
                    <span className="font-medium ml-2 text-gray-700">
                      {flow.designedBy.map((user) => user.username).join(", ")}
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-gray-700 mb-3">
                      Approval Steps
                    </div>
                    <div className="space-y-3">
                      {flow.status.map((step, index) => (
                        <div key={step._id} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">
                              {index + 1}. {step.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {step.requirements.length} requirements
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 absolute bottom-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      cloneFlow(flow._id);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-xs hover:shadow-sm"
                  >
                    {cloning ? (
                      <span className="loading loading-ring loading-lg"></span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    Clone Template
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <div className="text-gray-400 text-lg">
                No matching flows found
              </div>
              <button
                onClick={() => setSearch("")}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </PengelolaSideBarMenu>
  );
}
