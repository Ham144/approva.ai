import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login } from "@/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useUserInfo } from "@/store";
import { APP_NAME } from "@/api/constant";
import { LogIn, Search } from "lucide-react";
import OrgApi from "@/api/orgApi";

export default function Login({ className, ...props }) {
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: searchResult } = useQuery({
    queryKey: ["orgs", search],
    queryFn: async () => {
      const res = await OrgApi.getAllOrg(search); // search dikirim
      return res.data; // ini adalah array langsung
    },
    enabled: !!search,
  });

  // Zustand
  const { setUserInfo } = useUserInfo();

  const { mutateAsync: handleLogin, isPending } = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();
      const res = await login({ username, password, selectedOrg });
      return res.data;
    },
    retryDelay: 1000,
    mutationKey: ["userInfo"],
    onSuccess: async (res) => {
      setUserInfo(res?.data);

      //Invalidate query untuk memperbarui data
      queryClient.invalidateQueries(["userInfo"]);

      toast.success("Login berhasil!");
      navigate("/");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          "Login gagal. Periksa username dan password Anda."
      );
    },
  });

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4"
      {...props}
    >
      <div className="w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Form Section */}
          <form onSubmit={handleLogin} className="p-8 md:p-12 space-y-6">
            <div className="flex flex-col items-center text-center mb-6">
              <h1 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">
                {APP_NAME}
              </h1>
              <p className="text-balance text-lg text-gray-700 dark:text-gray-300">
                Selamat datang! Silakan masuk untuk melanjutkan.
              </p>
              <p className="mt-3 px-4 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full font-medium">
                Gunakan Kredensial LDAP CSI Anda
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Username
                </label>
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  placeholder="Masukkan username Anda"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  disabled={isPending || isVerifying}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Masukkan password Anda"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  disabled={isPending || isVerifying}
                />
              </div>{" "}
              <>
                <label className="block text-sm text-gray-600 dark:text-gray-300 mt-2">
                  Cari Nama Organisasi
                </label>
                <div className="flex relative ">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input rounded-lg input-bordered w-full"
                    placeholder="Contoh: PT Inovasi Teknologi"
                  />
                  <div className="absolute right-2 top-[50%] translate-y-[-50%]">
                    <Search />
                  </div>
                </div>
                {/* Hasil Pencarian */}
                {searchResult?.length > 0 ? (
                  <ul className="border border-gray-300 dark:border-gray-700 rounded-lg mt-2 overflow-y-auto max-h-40 divide-y divide-gray-200 dark:divide-gray-700">
                    {searchResult.map((org) => (
                      <li
                        key={org._id}
                        onClick={() => {
                          setSelectedOrg(org);
                          setSearch(org.organizationName);
                        }}
                        className={`p-3 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-all ${
                          selectedOrg._id === org._id
                            ? "bg-blue-50 dark:bg-blue-800"
                            : ""
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {org.organizationName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {org._id}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  search && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Organisasi tidak ditemukan. Coba nama lain atau daftarkan
                      baru.
                    </p>
                  )
                )}
              </>
            </div>

            <button
              type="submit"
              className={`
                  w-full py-3 px-4 rounded-lg text-white font-bold text-lg
                  bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600
                  shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2
                  ${
                    isPending || isVerifying
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }
                `}
              disabled={isPending || isVerifying}
            >
              {isPending || isVerifying ? (
                <>
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                  {isVerifying ? "Memverifikasi..." : "Memproses..."}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Login
                </>
              )}
            </button>

            <div className="text-right">
              <a
                href="/register"
                className="text-sm text-blue-600 dark:text-blue-400 underline-offset-2 hover:underline transition-colors duration-200"
              >
                Registrasi (Validasi Akun baru)
              </a>
            </div>
          </form>

          {/* Image Section */}
          <div className="relative hidden md:flex items-center justify-center bg-blue-50 dark:bg-gray-900 p-6">
            {!(isPending || isVerifying) ? (
              <img
                src="/csi-logo.png" // Pastikan path ini benar
                alt="CSI Logo"
                className="max-w-[80%] max-h-[80%] object-contain" // Lebih responsif dan terpusat
              />
            ) : (
              <span className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
