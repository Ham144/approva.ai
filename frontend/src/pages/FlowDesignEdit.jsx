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
import { NavigasiCepat } from "@/components/NavigasiCepat";
import SetupExternalOption from "@/components/setupExternalOption";

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
      <div className=" mx-auto p-4 md:p-6 lg:p-8 space-y-6">
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
            <NavigasiCepat flow={flow} key={"navigation"} />
            <FlowEditing key={"editing"} />
          </div>

          <div className="max-md:hidden">
            <PreviewFlow jsonFlow={flow} forEditing={true} />
          </div>
        </div>
      </div>
      <SetupExternalOption key={"setupExternalOption"} />
    </PengelolaSideBarMenu>
  );
}
