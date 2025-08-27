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
    queryFn: async () => await flowApi.getAllFlowNameAndDescForRequest(),
    enabled: !!simpleMode,
  });

  const { mutateAsync: handleDownloadSimpleMode } = useMutation({
    mutationKey: ["download"],
    mutationFn: async () =>
      await flowInstanceApi.downloadFlowInstanceByMonth(
        month.format("YYYY-MM")
      ),
    onSuccess: (res) => {
      toast.success(res.response.data.message || "Berhasil mengunduh");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal mengunduh");
    },
  });

  const { mutateAsync: handleDownloadDetailMode } = useMutation({
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

  const onChange = (value, dateString) => {
    // value = dayjs object (atau null), dateString = formatted string
    setMonth(value);
  };

  return (
    <div className="relative pb-20 min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 mx-auto flex justify-center items-center flex-col ">
      <div className="flex flex-col w-96 gap-y-3 justify-center items-center border rounded-lg p-3  shadow-lg  ">
        <h2 className="text-2xl font-semibold mb-6">Download History </h2>
        <div className="grid grid-cols-2 gap-x-2 items-center">
          <button
            onClick={() => setSimpleMode(true)}
            className={`btn rounded-lg ${
              simpleMode ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            Simple mode
          </button>
          <button
            onClick={() => setSimpleMode(false)}
            className={`btn rounded-lg ${
              !simpleMode ? "bg-blue-500" : "bg-gray-200"
            }`}
          >
            Detail mode
          </button>
        </div>

        {!simpleMode && (
          <div
            role="alert"
            className="alert max-md:w-full alert-info w-96 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="text-white">
              Untuk mengunduh data keseluruhan, diperlukan keseragaman header
              kolom, sehingga perlu memilih .
            </span>
          </div>
        )}

        <div className="flex flex-col flex-wrap justify-center w-full  sm:flex-row sm:items-center gap-4">
          <DatePicker
            picker="month"
            onChange={onChange}
            value={month}
            allowClear
            placeholder="Pilih Bulan"
          />

          {!simpleMode && (
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedFlowTemplateId}
              onChange={(e) => setSelectedFlowTemplateId(e.target.value)}
            >
              <option value="" disabled>
                Pilih Flow
              </option>
              {flowDataList.data?.map((flow) => (
                <option key={flow._id} value={flow._id}>
                  {flow.title + "-" + flow.desc}
                </option>
              ))}
            </select>
          )}

          <Button
            className="w-full sm:w-auto"
            type="primary"
            onClick={() => {
              if (simpleMode) {
                handleDownloadSimpleMode();
              } else {
                handleDownloadDetailMode();
              }
            }}
          >
            Download
          </Button>
        </div>

        {month && (
          <p className="mt-4 text-sm text-gray-600">
            Dipilih:{" "}
            <span className="font-medium">{month.format("MMMM YYYY")}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DownloadProcessPage;
