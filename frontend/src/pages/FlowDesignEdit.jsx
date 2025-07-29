import { useParams } from "react-router-dom";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import PreviewFlow from "@/components/PreviewFlow";
import { useEditor } from "@/store";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import flowApi from "@/api/flowApi";
import {
  Trash,
  StepBack,
  Globe,
  ListStart,
  FileCode,
  CircleCheckBig,
  CircleCheck,
} from "lucide-react";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import FlowEditing from "@/components/FlowEditing";

export default function FlowDesignEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { flow, setFlow } = useEditor();
  const queryClient = useQueryClient();
  const [tabNavigation, setTabNavigation] = useState();

  useQuery({
    queryKey: ["flow", id],
    queryFn: async () => {
      const res = await flowApi.getFlowById(id);
      setFlow(res?.data);
      return res;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutate: handleUpdateFlow } = useMutation({
    mutationFn: async () => await flowApi.updateFlowAndDesc(id, flow),
    onSuccess: () => {
      toast.success("Flow berhasil di Update");
      queryClient.invalidateQueries({ queryKey: ["flows"] });
      navigate("/management/flow");
    },
    onError: (err) => {
      toast.error(err?.message || "Gagal menyimpan flow");
    },
  });

  const handleManualSave = () => {
    if (!flow?.title || !flow?.desc) {
      toast("Judul dan deskripsi wajib diisi!");
      return;
    }
    localStorage.setItem("temporaryFlow", JSON.stringify(flow));
  };

  useEffect(() => {
    const keyListener = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleManualSave();
      }
    };
    window.addEventListener("keydown", keyListener);
    return () => window.removeEventListener("keydown", keyListener);
  }, [flow]);

  return (
    <PengelolaSideBarMenu>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex gap-4">
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-center">
              <h2 className="text-2xl font-bold text-primary">Editing Flow</h2>
              <p>simpan sementara dengan Ctrl + S</p>
              <div className="flex flex-wrap gap-3">
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate("/management/flow")}
                >
                  <StepBack className="w-5 h-5" /> Kembali
                </button>
                <button
                  className="btn btn-error text-white rounded-md"
                  onClick={() => {
                    localStorage.removeItem("temporaryFlow");
                    setFlow({ title: "", desc: "", flow: [] });
                  }}
                >
                  <Trash className="w-5 h-5" /> Format Ulang Semua
                </button>
                <button
                  className="btn btn-success rounded-md text-white"
                  onClick={() => {
                    handleUpdateFlow();
                  }}
                >
                  <Globe className="w-5 h-5" />
                  Finish Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex">
            {/* Vertical Tabs Navigation */}
            <div className="w-36 flex-shrink-0 ">
              <div className="sticky top-4 space-y-1">
                {/* Header */}
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                  Navigasi Cepat
                </div>

                {/* Properti Flow */}
                <button
                  className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    tabNavigation === "properti"
                      ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  onClick={() => {
                    setTabNavigation("properti");
                    const section = document.getElementById("properti");
                    section?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <FileCode className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Properti Flow</span>
                </button>

                {/* Request Tabs */}
                {flow?.request.map((input, i) => (
                  <button
                    key={`request-${input?._id}`}
                    className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                      tabNavigation === input?._id
                        ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                    onClick={() => {
                      setTabNavigation(input?._id);
                      const section = document.getElementById(input?._id);
                      section?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <ListStart className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Request {i + 1}</span>
                  </button>
                ))}

                {/* Status & Requirements Tabs */}
                {flow?.status.map((stat, i) => (
                  <React.Fragment key={`status-${stat?._id}`}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                        tabNavigation === stat?._id
                          ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => {
                        setTabNavigation(stat?._id);
                        const section = document.getElementById(stat?._id);
                        section?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      <CircleCheckBig className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Approval {i + 1}</span>
                    </button>

                    {/* Requirements */}
                    {stat?.requirements?.map((require, j) => (
                      <button
                        key={`requirement-${require?._id}`}
                        className={`w-2/3 text-left  px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ml-5 ${
                          tabNavigation === require?._id
                            ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                        onClick={() => {
                          setTabNavigation(require?._id);
                          const section = document.getElementById(require?._id);
                          section?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                      >
                        <CircleCheck className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">Req {j + 1}</span>
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <FlowEditing key={"editing"} />
          </div>

          <div className="max-md:hidden">
            <PreviewFlow jsonFlow={flow} />
          </div>
        </div>
      </div>
    </PengelolaSideBarMenu>
  );
}
