import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import FlowCreation from "@/components/FlowCreation";
import PreviewFlow from "@/components/PreviewFlow";
import { useEditor } from "@/store";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import flowApi from "@/api/flowApi";
import { Trash, StepBack, Globe, MessageCircleWarning } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { NavigasiCepat } from "@/components/NavigasiCepat";
import SetupExternalOption from "@/components/setupExternalOption";

export default function FlowDesignCreate() {
  const navigate = useNavigate();
  const { flow, setFlow } = useEditor();
  const queryClient = useQueryClient();

  const { mutate: submitFlow } = useMutation({
    mutationFn: () => flowApi.createFlowAndPoint(flow),
    onSuccess: () => {
      toast.success("Flow berhasil disimpan");
      queryClient.invalidateQueries({ queryKey: ["flows", "flowsAndPoint"] });
      navigate("/management/flow");
      localStorage.removeItem("temporaryFlow");
      setFlow({ title: "", desc: "", flow: [] });
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menyimpan flow");
    },
  });

  const handleManualSave = () => {
    localStorage.setItem("temporaryFlow", JSON.stringify(flow));
  };

  useEffect(() => {
    const intervalSave = setInterval(() => {
      const localStorageFlow = JSON.parse(
        localStorage.getItem("temporaryFlow")
      );
      if (JSON.stringify(localStorageFlow) !== JSON.stringify(flow)) {
        handleManualSave();
        console.log("beda");
      } else {
        console.log("nothing change");
      }
    }, 7000);

    return () => clearInterval(intervalSave);
  }, [flow]); // ✅ kosongkan dependency agar hanya jalan sekali saat mount

  return (
    <PengelolaSideBarMenu>
      <div className="  p-4 md:p-6 lg:p-8 space-y-6 ">
        <div className="flex justify-between flex-wrap items-center">
          <div className="flex-col gap-y-3">
            <h2 className="text-2xl font-bold text-primary">Buat Flow Baru</h2>
            <div>
              Anda bisa pergi kapan saja untuk lanjutkan design, flow telah
              disimpan otomatis
            </div>
            <div className="badge bg-blue-400 mt-3 text-white p-5">
              <MessageCircleWarning />
              <span className="p-2 rounded-lg">
                Fitur Logic Routing Belum Sempurna di create flow, gunakan fitur
                tersebut di saat mengedit. untuk menghindari hal tak terduga
              </span>
            </div>
          </div>
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
                submitFlow();
              }}
            >
              <Globe className="w-5 h-5" />
              Publish
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex gap-x-2">
            <NavigasiCepat flow={flow} key={"navigasi"} />
            <FlowCreation key={"creation"} />
          </div>
          <div className="max-md:hidden">
            <PreviewFlow jsonFlow={flow} />
          </div>
        </div>
      </div>
      <SetupExternalOption />
    </PengelolaSideBarMenu>
  );
}
