import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import "antd/dist/reset.css"; // import global once di app kamu
import dayjs from "dayjs";
import { useMutation } from "@tanstack/react-query";
import flowInstanceApi from "@/api/flowInstanceApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const DownloadProcessPage = () => {
  const [month, setMonth] = useState(null); // dayjs object atau null
  const navigate = useNavigate();

  const { mutateAsync: handleDownload } = useMutation({
    mutationKey: ["download"],
    mutationFn: async () =>
      await flowInstanceApi.downloadFlowInstanceByMonth(
        month.format("YYYY-MM")
      ),
    onSuccess: () => {
      toast.success("Berhasil mengunduh");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Gagal mengunduh");
    },
  });

  const onChange = (value, dateString) => {
    // value = dayjs object (atau null), dateString = formatted string
    setMonth(value);
  };

  return (
    <div className="relative pb-20 min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8 mx-auto flex justify-center items-center flex-col ">
      <div className="flex flex-col justify-center items-center border rounded-lg p-3  shadow-lg  ">
        <h2 className="text-2xl font-semibold mb-6">
          Download Process History{" "}
          <div className="badge bg-blue-500 text-white">BETA</div>
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <DatePicker
            picker="month"
            onChange={onChange}
            value={month}
            allowClear
            placeholder="Pilih Bulan"
          />

          <Button type="primary" onClick={handleDownload}>
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
