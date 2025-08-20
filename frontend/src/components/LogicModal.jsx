import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function LogicModal({
  flow,
  currentRequirementId,
  currentStatus, // Status yang sedang aktif (dikirim langsung dari parent)
  handleAddlogicModal,
}) {
  console.log("🚀 LogicModal Props:");
  console.log("  flow:", flow);
  console.log("  currentRequirementId:", currentRequirementId);
  console.log("  currentRequirementId type:", typeof currentRequirementId);
  console.log(
    "  currentRequirementId === null:",
    currentRequirementId === null
  );
  console.log(
    "  currentRequirementId === undefined:",
    currentRequirementId === undefined
  );

  // Debug: cek struktur data flow
  console.log("🔍 Flow structure:");
  console.log("  flow.status length:", flow.status?.length);
  console.log("  flow.status[0]:", flow.status?.[0]);
  console.log("  flow.status[0].requirements:", flow.status?.[0]?.requirements);

  // Debug: cek apakah currentRequirementId ada di requirements
  if (currentRequirementId && flow.status) {
    flow.status.forEach((status, index) => {
      const requirements = status.requirements || [];
      const hasRequirement = requirements.some(
        (req) => (req._id || req.id) === currentRequirementId
      );
      console.log(
        `🔍 Status ${index} "${status.title}" has requirement ${currentRequirementId}: ${hasRequirement}`
      );
    });
  }
  // Gunakan status yang dikirim langsung dari parent
  const currentStatusId = currentStatus?._id || currentStatus?.id;

  // Debugging untuk melihat data yang diterima
  console.log("Debug LogicModal:");
  console.log("currentRequirementId:", currentRequirementId);
  console.log("currentStatus:", currentStatus);
  console.log("currentStatusId:", currentStatusId);

  // Debug: cek apakah ada masalah dengan data flow
  console.log("🔍 Flow data structure:");
  console.log("  flow.status length:", flow.status?.length);
  console.log("  flow.status:", flow.status);

  // Debug: cek apakah currentRequirementId valid
  if (currentRequirementId) {
    const allRequirements =
      flow.status?.flatMap((s) => s.requirements || []) || [];
    const requirementExists = allRequirements.some(
      (req) => (req._id || req.id) === currentRequirementId
    );
    console.log("🔍 Requirement validation:");
    console.log(
      "  All requirements:",
      allRequirements.map((req) => ({
        id: req._id || req.id,
        title: req.title,
      }))
    );
    console.log("  Requirement exists:", requirementExists);
  }

  // Validasi data yang diterima
  if (!currentRequirementId) {
    console.error("❌ currentRequirementId is undefined or null");
  }

  if (!currentStatus) {
    console.error(
      "❌ currentStatus not found for requirement:",
      currentRequirementId
    );
    console.log(
      "Available statuses:",
      flow.status?.map((s) => ({
        id: s._id,
        title: s.title,
        requirements: s.requirements?.length || 0,
      }))
    );
  }

  const [logicTemp, setLogicTemp] = useState({
    requirementId: currentRequirementId, // Otomatis terisi dengan requirement yang sedang dikonfigurasi
    logicType: "",
    operator: "",
    value: "",
    jumpToStatusId: "",
  });

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
    if (logicTemp.logicType === "jumpTo" && !logicTemp.jumpToStatusId) {
      return toast.error("Untuk logika Jump to, pilih status tujuan");
    }

    // Simpan logic
    handleAddlogicModal({
      requirementId: logicTemp.requirementId,
      logicType: logicTemp.logicType,
      operator: logicTemp.operator,
      value: logicTemp.value,
      jumpToStatusId: logicTemp.jumpToStatusId,
    });

    // Reset ke default & close modal
    setLogicTemp({
      requirementId: currentRequirementId, // Tetap gunakan requirement yang sedang dikonfigurasi
      logicType: "",
      operator: "",
      value: "",
      jumpToStatusId: "",
    });
    document.getElementById("logicModal")?.close();
  };

  return (
    <dialog id="logicModal" className="modal">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">Tambah Logika</h3>

        <div className="p-2 rounded-lg bg-blue-400 text-white">
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
                  (req) => (req._id || req.id) === currentRequirementId
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
                value={logicTemp?.jumpToStatusId || ""}
                onChange={(e) =>
                  setLogicTemp((prev) => ({
                    ...prev,
                    jumpToStatusId: e.target.value,
                  }))
                }
                className="select select-bordered w-full"
              >
                <option value="">Pilih status tujuan</option>
                {flow.status
                  ?.filter((s) => (s._id || s.id) !== currentStatusId) // Exclude current status
                  ?.map((status) => (
                    <option
                      key={status._id || status.id}
                      value={status._id || status.id}
                    >
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
              <option value="is true (Boolean)">is true (Boolean)</option>
              <option value="is false (Boolean)">is false (Boolean)</option>
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
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="modal-action">
          <form method="dialog" className="gap-x-2 flex">
            <button
              className="btn"
              type="button"
              onClick={() => document.getElementById("logicModal")?.close()}
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn btn-primary"
            >
              Simpan
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
