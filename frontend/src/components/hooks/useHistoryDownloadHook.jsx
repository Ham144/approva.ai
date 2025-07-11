import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/api/constant";
import toast from "react-hot-toast";

const useHistoryDownloadHook = (filters) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownloadCSV = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      // Fetch data tanpa pagination
      const response = await axios.get(`${BASE_URL}/api/v1/return/download`, {
        params: {
          search: filters.search || "",
          category: filters.category || "all",
          location:
            filters.location === "all" ? "all" : filters.location?.trim(),
          specificCondition: filters.specificCondition || "all",
          specificDamageType: filters.specificDamageType || "all",
          sort: filters.sort || "desc",
        },
        withCredentials: true,
        responseType: "blob", // Penting untuk download file
      });

      // Buat nama file dengan timestamp
      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `service-history-${timestamp}.csv`;

      // Buat URL untuk download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Download berhasil");
    } catch (error) {
      console.error("Error downloading history:", error);
      setError(error?.response?.data?.message || "Gagal mengunduh data");
      toast.error(error?.response?.data?.message || "Gagal mengunduh data");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    handleDownloadCSV,
    isDownloading,
    error,
  };
};

export default useHistoryDownloadHook;
