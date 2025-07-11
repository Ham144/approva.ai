import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import configApi from "@/api/configApi";

export default function Config() {
  const {
    data: configData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["config"],
    queryFn: async () => await configApi.getConfig(),
    // Tambahkan refetchOnWindowFocus: false jika Anda tidak ingin refetch otomatis
    refetchOnWindowFocus: false,
  });

  const [AD_HOST, setAD_HOST] = useState("");
  const [AD_PORT, setAD_PORT] = useState("");

  useEffect(() => {
    // Jalankan kode ini hanya jika configData sudah ada
    if (configData?.data) {
      setAD_HOST(configData?.data.AD_HOST || ""); // Tambahkan fallback string kosong
      setAD_PORT(configData?.data.AD_PORT || ""); // Tambahkan fallback string kosong
    }
  }, [configData]); // <--- Dependency array HARUS berisi configData

  if (isLoading) {
    return (
      <PengelolaSideBarMenu>
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </PengelolaSideBarMenu>
    );
  }

  if (error) {
    return (
      <PengelolaSideBarMenu>
        <div className="alert alert-error">
          <span>Error: {error?.message || "Gagal memuat config"}</span>
        </div>
      </PengelolaSideBarMenu>
    );
  }

  return (
    <PengelolaSideBarMenu>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Konfigurasi Active Directory
        </h2>
        <div className="mb-4">
          <label
            htmlFor="ad-host"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            AD Host:
          </label>
          <input
            id="ad-host"
            type="text"
            value={AD_HOST}
            onChange={(e) => setAD_HOST(e.target.value)}
            name="AD_HOST"
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="e.g., ldap.yourdomain.com"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="ad-port"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            AD Port:
          </label>
          <input
            id="ad-port"
            type="text"
            value={AD_PORT}
            onChange={(e) => setAD_PORT(e.target.value)}
            name="AD_PORT" // Seharusnya AD_PORT, bukan AD_HOST lagi
            className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            placeholder="e.g., 389 or 636"
          />
        </div>
        {/* Anda mungkin ingin menambahkan tombol Save di sini untuk memperbarui config */}
        {/* <button className="btn btn-primary w-full">Save Config</button> */}
      </div>
    </PengelolaSideBarMenu>
  );
}
