import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import "antd/dist/reset.css"; // import global once di app kamu
import { useMutation, useQuery } from "@tanstack/react-query";
import flowInstanceApi from "@/api/flowInstanceApi";
import toast from "react-hot-toast";
import flowApi from "@/api/flowApi";

const DownloadProcessPage = () => {
  const [month, setMonth] = useState(null); // dayjs object atau null
  const [simpleMode, setSimpleMode] = useState(true); //false

  const [selectedFlowTemplateId, setSelectedFlowTemplateId] = useState(null);

  const { data: flowDataList } = useQuery({
    queryKey: ["flows"],
    queryFn: async () => await flowApi.getFlowForDownload(),
    enabled: !!simpleMode,
  });

  const {
    mutateAsync: handleDownloadSimpleMode,
    isPending: isPendingDownload,
  } = useMutation({
    mutationKey: ["download"],
    mutationFn: async () =>
      await flowInstanceApi.downloadFlowInstanceByMonth(
        month.format("YYYY-MM"),
      ),
    onSuccess: (res) => {
      toast.success(res.response.data.message || "Berhasil mengunduh");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal mengunduh");
    },
  });

  const {
    mutateAsync: handleDownloadDetailMode,
    isPending: isPendingDownloadDetail,
  } = useMutation({
    mutationKey: ["download"],
    mutationFn: async () =>
      await flowInstanceApi.downloadFlowInstanceDetail({
        flowTemplateId: selectedFlowTemplateId,
        month: month.format("YYYY-MM"),
      }),
    onSuccess: (res) => {
      toast.success(res?.response?.data?.message || "Berhasil mengunduh");
      toast.success("Berhasil mengunduh");
    },
    onError: (res) => {
      console.log(res);
      if (res.status === 421) {
        toast.error("Tidak ada data dengan konfigurasi ini");
        return;
      }
      //tidak bisa diambil message nya karena returntype blob
      toast.error("Gagal mengunduh penyebab tidak diketahui");
    },
  });

  const {
    mutateAsync: handleDownloadDetailModeTableColumn,
    isPending: isPendingDownloadDetailModeTableColumn,
  } = useMutation({
    mutationKey: ["download"],
    mutationFn: async () =>
      await flowInstanceApi.downloadFlowInstanceDetailTableColum({
        flowTemplateId: selectedFlowTemplateId,
        month: month.format("YYYY-MM"),
      }),
    onSuccess: (res) => {
      toast.success(res?.response?.data?.message || "Berhasil mengunduh");
      toast.success("Berhasil mengunduh");
    },
    onError: (res) => {
      console.log(res);
      if (res.status === 421) {
        toast.error("Tidak ada data dengan konfigurasi ini");
        return;
      }
      //tidak bisa diambil message nya karena returntype blob
      toast.error("Gagal mengunduh penyebab tidak diketahui");
    },
  });

  const onChange = (value, dateString) => {
    // value = dayjs object (atau null), dateString = formatted string
    setMonth(value);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute w-96 h-96 bg-slate-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <div className="w-full max-w-2xl transform transition-all duration-300 hover:scale-[1.02]">
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl shadow-2xl border border-white/20">
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-slate-600 px-6 py-5">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download History
              </h2>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-6">
              {/* Alert Info */}
              {!simpleMode && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-300"></div>
                  <div className="relative flex items-start gap-3 p-4">
                    <div className="flex-shrink-0">
                      <div className="rounded-full bg-white/20 p-1">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white leading-relaxed">
                        Untuk mengunduh data keseluruhan, diperlukan keseragaman
                        header kolom, sehingga perlu memilih.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Filters Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Picker */}
                  <div className="relative group">
                    <DatePicker
                      picker="month"
                      onChange={onChange}
                      value={month}
                      allowClear
                      placeholder="Pilih Bulan"
                      className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    />
                  </div>

                  {/* Flow Select */}
                  <div className="relative group">
                    <select
                      className="w-full h-11 px-4 rounded-lg border-2 border-gray-200 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 transition-all duration-200 appearance-none bg-white/50 backdrop-blur-sm cursor-pointer"
                      value={selectedFlowTemplateId}
                      onChange={(e) =>
                        setSelectedFlowTemplateId(e.target.value)
                      }
                    >
                      <option value="" className="text-gray-500">
                        Pilih Flow Template
                      </option>
                      {flowDataList?.data?.map((flow) => (
                        <option
                          key={flow._id}
                          value={flow._id}
                          className="py-2"
                        >
                          {flow.title} - {flow.desc}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Month Indicator */}
                {month && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Periode:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      {month.format("MMMM YYYY")}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 flex flex-col justify-center">
                <button
                  onClick={handleDownloadSimpleMode}
                  disabled={isPendingDownload}
                  className={`${isPendingDownload ? "loading mx-auto btn btn-primary" : "w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </span>
                </button>

                <button
                  onClick={handleDownloadDetailMode}
                  disabled={!selectedFlowTemplateId || isPendingDownloadDetail}
                  className={`${isPendingDownloadDetail ? "loading mx-auto btn btn-primary" : "w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    Download Detail Mode
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      Merge Table
                    </span>
                  </span>
                </button>

                <button
                  onClick={handleDownloadDetailModeTableColumn}
                  disabled={
                    !selectedFlowTemplateId ||
                    isPendingDownloadDetailModeTableColumn
                  }
                  className={`${isPendingDownloadDetailModeTableColumn ? "loading mx-auto btn btn-primary" : "w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                    Download Detail Mode
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      Table to Columns
                    </span>
                  </span>
                </button>
              </div>

              {/* Helper Text */}
              <p className="text-xs text-center text-gray-400 mt-4">
                Pilih periode dan flow template untuk mulai mengunduh data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadProcessPage;
