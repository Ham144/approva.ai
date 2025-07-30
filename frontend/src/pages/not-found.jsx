import React from "react";
import { Search, Shield } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen shadow-lg shadow-slate-700/50 rounded-lg p-4 animate-pulse">
      <div className="text-9xl font-bold">403</div>
      <div className="text-3xl font-medium mt-4">
        Halaman Yang Kamu Akses Dilindungi
      </div>
      <div className="mt-10">
        <Shield className="w-16 animate-pulse" />
      </div>
    </div>
  );
};

export default NotFound;
