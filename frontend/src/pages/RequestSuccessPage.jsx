import React from "react";
import { CheckCircle2, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "@/store";

export default function RequestSuccessPage() {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 px-4">
      {/* Premium Glassmorphic Card */}
      <div className="max-w-md w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 text-center space-y-6 transform hover:scale-[1.01] transition-all duration-300">
        
        {/* Animated Checkmark Circle */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full scale-110 animate-ping opacity-75"></div>
            <div className="relative bg-gradient-to-tr from-emerald-400 to-emerald-500 text-white rounded-full p-4 shadow-lg">
              <CheckCircle2 className="w-16 h-16" />
            </div>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Terima Kasih!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Formulir permintaan Anda telah berhasil dikirimkan. Tim kami akan segera meninjau dan memproses permintaan Anda.
          </p>
        </div>

        {/* Informative Note */}
        <div className="bg-gray-50/50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-left">
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Catatan:</p>
          Anda mengisi formulir ini sebagai tamu (Stranger Mode). Notifikasi perkembangan status request akan dikirim ke sistem/penanggung jawab alur proses yang dituju.
        </div>

        {/* Navigation Button */}
        <div className="pt-2">
          {userInfo ? (
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Kembali ke Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Login ke Akun Anda
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
