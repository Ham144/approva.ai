import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import SelectInput from "./SelectInput";
import SelectInputForLogicMatching from "./SelectInputForLogicMatching";
import { BrainCircuit } from "lucide-react";
import { DatePicker, TimePicker } from "antd";

export default function LogicModal({
  flow,
  currentRequirementId,
  currentStatus, // Status yang sedang aktif (dikirim langsung dari parent)
  handleAddlogicModal,
  modalId = "logicModal",
  openSignal, // number atau string yang berubah setiap kali tombol ditekan
  input,
}) {
  // Validasi ringan
  if (!currentRequirementId || !currentStatus) return null;
  const currentStatusIndex = flow.status.findIndex(
    (status) => status._id === currentStatus._id,
  );

  const [logicTemp, setLogicTemp] = useState({
    requirementId: currentRequirementId, // Otomatis terisi dengan requirement yang sedang dikonfigurasi
    logicType: "",
    operator: "",
    value: "",
    jumpToStatusUuid: "",
  });

  // Reset setiap openSignal berubah (tombol ditekan)
  React.useEffect(() => {
    setLogicTemp({
      requirementId: currentRequirementId,
      logicType: "",
      operator: "",
      value: "",
      jumpToStatusUuid: "",
    });
  }, [openSignal, currentRequirementId]);

  const handleSave = () => {
    // Validasi
    if (
      !logicTemp.logicType ||
      !logicTemp.operator ||
      !logicTemp.value?.toString().trim()
    ) {
      return toast.error("Periksa lebih lanjut apakah ada value yang kurang");
    }

    // Validasi khusus untuk jumpTo
    if (logicTemp.logicType === "jumpTo" && !logicTemp.jumpToStatusUuid) {
      return toast.error("Untuk logika Jump to, pilih status tujuan");
    }

    // Simpan logic
    handleAddlogicModal({
      requirementId: logicTemp.requirementId,
      logicType: logicTemp.logicType,
      operator: logicTemp.operator,
      value: logicTemp.value,
      jumpToStatusUuid: logicTemp.jumpToStatusUuid,
    });

    // Reset ke default & close modal
    setLogicTemp({
      requirementId: currentRequirementId, // Tetap gunakan requirement yang sedang dikonfigurasi
      logicType: "",
      operator: "",
      value: "",
      jumpToStatusUuid: "",
    });
    document.getElementById(modalId)?.close();
  };

  useEffect(() => {
    if (input?.tipe === "select" || input?.tipe === "multipleCheckbox") {
      setLogicTemp((prev) => ({
        ...prev,
        operator: "is equal to (String/Number/Date/Boolean)",
      }));
    }
  }, [input?.tipe, openSignal]);

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Tambah Logika</h3>

        <div className="p-2 rounded-lg bg-indigo-400 text-white">
          Logika ini akan menentukan alur approval berdasarkan kondisi
          requirement yang dipilih.
        </div>

        <div className="space-y-4 mt-4">
          {/* Requirement yang sedang dikonfigurasi */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">
                Requirement yang Dikonfigurasi
              </span>
            </label>
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {currentStatus?.title || "Unknown Status"} -{" "}
                {currentStatus?.requirements?.find(
                  (req) => (req._id || req.id) === currentRequirementId,
                )?.title || "Unknown Requirement"}
              </span>
            </div>
          </div>

          {/* Tipe Logika */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Tipe Logika</span>
            </label>
            <select
              value={logicTemp.logicType || ""}
              onChange={(e) =>
                setLogicTemp((prev) => ({
                  ...prev,
                  logicType: e.target.value,
                }))
              }
              className="select select-bordered w-full"
            >
              <option value="">Pilih Tipe Logika</option>
              <option value="jumpTo">Jump to</option>
              <option value="completedIf">Completed if</option>
              <option value="rejectedIf">Rejected if</option>
              <option value="preventNextIf">Prevent next if</option>
            </select>
          </div>

          {/* Jump to - hanya tampil jika logicType adalah jumpTo */}
          {logicTemp.logicType === "jumpTo" && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Jump ke Status</span>
              </label>
              <select
                value={logicTemp?.jumpToStatusUuid || ""}
                onChange={(e) =>
                  setLogicTemp((prev) => ({
                    ...prev,
                    jumpToStatusUuid: e.target.value,
                  }))
                }
                className="select select-bordered w-full"
              >
                <option value="">Pilih status tujuan</option>
                {flow.status
                  ?.filter((s) => s.uuid !== currentStatus?.uuid)
                  ?.map((status) => (
                    <option key={status.uuid} value={status.uuid}>
                      {status.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Operator */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Operator</span>
            </label>
            <select
              value={logicTemp.operator || ""}
              onChange={(e) =>
                setLogicTemp((prev) => ({
                  ...prev,
                  operator: e.target.value,
                }))
              }
              className="select select-bordered w-full"
            >
              <option value="">Pilih Operator</option>
              <option value="is equal to (String/Number/Date/Boolean)">
                is equal to (String/Number/Date/Boolean)
              </option>
              <option value="is not equal to (String/Number/Date)">
                is not equal to (String/Number/Date)
              </option>
              {["multipleCheckbox", "select"].includes(input?.tipe) && (
                <option value="one of these (multipleCheckbox/select)">
                  one of these (multipleCheckbox/select)
                </option>
              )}
              <option value="contains (String)">contains (String)</option>
              <option value="does not contain (String)">
                does not contain (String)
              </option>
              <option value="starts with (String)">starts with (String)</option>
              <option value="ends with (String)">ends with (String)</option>
              <option value="is greater than (Number)">
                is greater than (Number)
              </option>
              <option value="is less than (Number)">
                is less than (Number)
              </option>
              <option value="is greater than or equal to (Number)">
                is greater than or equal to (Number)
              </option>
              <option value="is less than or equal to (Number)">
                is less than or equal to (Number)
              </option>
              <option value="is Exist">
                is Exist: Sekedar di isi (rekomendasi cocok: Image, File,
                Signature, PDF)
              </option>
              <option value="is Not Exist">
                is Not Exist: Benar benar kosong (rekomendasi cocok: Text,
                Number, Text Area)
              </option>
              <option value="is before (Date & Time)">
                is before (Date & Time)
              </option>
              <option value="is after (Date & Time)">
                is after (Date & Time)
              </option>
              <option value="is on or before (Date & Time)">
                is on or before (Date & Time)
              </option>
              <option value="is on or after (Date & Time)">
                is on or after (Date & Time)
              </option>
            </select>
          </div>

          {/* Nilai Pembanding */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Nilai Pembanding</span>
            </label>
            {["text", "number", "textArea", "checkbox", "table"].includes(
              input.tipe,
            ) && (
              <input
                type="text"
                placeholder="Nilai pembanding terhadap referensi kondisi"
                className="input input-bordered w-full"
                value={logicTemp.value || ""}
                onChange={(e) =>
                  setLogicTemp((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
              />
            )}

            {["select", "multipleCheckbox"].includes(input.tipe) && (
              <div id={input._id} className="space-y-2">
                {logicTemp.operator === "one of these (multipleCheckbox/select)" ? (
                  (() => {
                    const valuesArray = logicTemp.value ? logicTemp.value.split(',') : [''];
                    return (
                      <div className="space-y-2">
                        {valuesArray.map((val, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <div className="flex-1">
                              <SelectInputForLogicMatching
                                input={input}
                                logicTemp={{ value: val }}
                                setLogicTemp={(action) => {
                                  const simulatedPrev = { value: val };
                                  const simulatedNext = typeof action === 'function' ? action(simulatedPrev) : action;
                                  const newArray = [...valuesArray];
                                  newArray[idx] = simulatedNext.value;
                                  setLogicTemp(prev => ({ ...prev, value: newArray.join(',') }));
                                }}
                              />
                            </div>
                            {valuesArray.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-error btn-square"
                                onClick={() => {
                                  const newArray = valuesArray.filter((_, i) => i !== idx);
                                  setLogicTemp(prev => ({ ...prev, value: newArray.join(',') }));
                                }}
                              >
                                X
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline btn-primary mt-2"
                          onClick={() => {
                            const newArray = [...valuesArray, ''];
                            setLogicTemp(prev => ({ ...prev, value: newArray.join(',') }));
                          }}
                        >
                          + Tambah Nilai
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <SelectInputForLogicMatching
                    input={input}
                    logicTemp={logicTemp}
                    setLogicTemp={setLogicTemp}
                  />
                )}
              </div>
            )}

            {["date"].includes(input.tipe) && (
              <input
                type="date"
                placeholder="Pilih tanggal"
                className="input w-full "
                value={logicTemp.value || ""}
                onChange={(e) =>
                  setLogicTemp((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
              />
            )}
            {["image", "pdf", "signature", "helper"].includes(input.tipe) && (
              <div className="badge">Tidak dapat diisi</div>
            )}
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="modal-action">
          <form method="dialog" className="gap-x-2 flex">
            <button
              className="btn"
              type="button"
              onClick={() => document.getElementById(modalId)?.close()}
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn text-white rounded-lg bg-indigo-700 hover:bg-indigo-300"
            >
              Simpan <BrainCircuit />
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
