import FlexSourceDataApi from "@/api/flexSourceDataApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const initialTempSourceData = {
  title: "",
  desc: "",
  keys: [],
};

export default function ModalCreateSourceData() {
  const [tempSourceData, setTempSourceData] = useState(initialTempSourceData);
  const queryClient = useQueryClient();

  const { mutate: handleUploadSourceData } = useMutation({
    mutationKey: ["sourcedata"],
    mutationFn: async () => {
      if (!tempSourceData.title.trim()) {
        throw new Error("Title tidak boleh kosong");
      }

      if (
        !Array.isArray(tempSourceData.keys) ||
        tempSourceData.keys.length === 0
      ) {
        throw new Error("Minimal 1 key diperlukan");
      }

      for (const k of tempSourceData.keys) {
        if (!k.key?.trim() || !k.value?.trim()) {
          throw new Error("Key dan label harus diisi semua");
        }
      }

      const res = await FlexSourceDataApi.createSourceData(tempSourceData);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.response?.data?.message || "Succeed");
      document.getElementById("modalsourcedata")?.close();
      setTempSourceData(initialTempSourceData);
      queryClient.invalidateQueries({ queryKey: ["sourcedata-list"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error.message || "Upload failed"
      );
    },
  });

  return (
    <dialog id="modalsourcedata" className="modal modal-bottom sm:modal-middle">
      <Toaster />
      <div className="modal-box bg-white shadow-xl rounded-lg p-6 w-full">
        <button
          onClick={() => {
            setTempSourceData(initialTempSourceData);
            document.getElementById("modalsourcedata")?.close();
          }}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="font-bold text-xl text-gray-800 mb-4">
          New Source Data
        </h3>

        <input
          type="text"
          className="input input-bordered w-full mb-3"
          placeholder="Title Data Source"
          value={tempSourceData.title}
          onChange={(e) =>
            setTempSourceData((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <input
          type="text"
          className="input input-bordered w-full mb-4"
          placeholder="Description"
          value={tempSourceData.desc}
          onChange={(e) =>
            setTempSourceData((prev) => ({ ...prev, desc: e.target.value }))
          }
        />

        <div className="space-y-3">
          {tempSourceData.keys.map((k, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-center">
              <input
                className="input input-sm input-bordered"
                placeholder="Key (untuk mesin)"
                value={k.key}
                onChange={(e) => {
                  const updated = [...tempSourceData.keys];
                  updated[i].key = e.target.value.trim();
                  setTempSourceData((prev) => ({ ...prev, keys: updated }));
                }}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                    toast.error("Key tidak boleh mengandung spasi");
                  }
                }}
              />

              <input
                className="input input-sm input-bordered"
                placeholder="Label (untuk manusia)"
                value={k.value}
                onChange={(e) => {
                  const updated = [...tempSourceData.keys];
                  updated[i].value = e.target.value;
                  setTempSourceData((prev) => ({ ...prev, keys: updated }));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const isCurrentValid = k.key.trim() && k.value.trim();
                    if (!isCurrentValid) {
                      toast.error(
                        "Isi key dan value sebelum tambah baris baru"
                      );
                      return;
                    }
                    setTempSourceData((prev) => ({
                      ...prev,
                      keys: [
                        ...prev.keys,
                        { key: "", value: "", title: "", isArray: false },
                      ],
                    }));
                  }
                }}
              />

              <button
                type="button"
                className="btn btn-xs btn-error"
                onClick={() => {
                  const updated = tempSourceData.keys.filter(
                    (_, idx) => idx !== i
                  );
                  setTempSourceData((prev) => ({ ...prev, keys: updated }));
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          className="btn btn-sm btn-outline mt-4"
          type="button"
          onClick={() => {
            setTempSourceData((prev) => ({
              ...prev,
              keys: [
                ...prev.keys,
                { key: "", value: "", title: "", isArray: false },
              ],
            }));
          }}
        >
          + Add Key
        </button>

        <div className="modal-action mt-6">
          <button
            type="button"
            className="btn btn-primary px-6 py-2 text-white"
            onClick={() => handleUploadSourceData()}
          >
            Upload
          </button>
        </div>
      </div>
    </dialog>
  );
}
