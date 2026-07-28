import {  useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginApp, loginLdap } from "@/api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useUserInfo } from "@/store";
import { APP_DESC, APP_NAME } from "@/api/constant";
import OrgApi from "@/api/orgApi";
// import TurnstileCaptcha from "@/components/TurnstileCaptcha";

export default function Login({ className, ...props }) {
  const [username, setUsername] = useState(``);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState();
  const [search, setSearch] = useState("*");
  const [authMethod, setAuthMethod] = useState("ldap");
  const [captchaToken, setCaptchaToken] = useState("");

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

  const { mutateAsync: handleLoginLdap, isPending } = useMutation({
    mutationFn: async () => {
      const res = await loginLdap({
        username,
        password,
        selectedOrg,
        captchaToken,
      });
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
      setTimeout(() => {
        navigate("/"); //emang sengaja ada 2 navigate karena sering gagal
      }, 1000);
    },
    onError: (err) => {
      if (err.response.status === 403) {
        toast.error(
          err?.response?.data?.message ||
            "Login gagal. Periksa username dan password Anda."
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        return;
      }
      toast.error(
        err?.response?.data?.message ||
          "Login gagal. Periksa username dan password Anda."
      );
    },
  });

  const { mutateAsync: handleLoginApp, isPending: loadingAppLogin } =
    useMutation({
      mutationFn: async () => {
        const res = await loginApp({
          username,
          password,
          selectedOrg,
          captchaToken,
        });
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
        setTimeout(() => {
          navigate("/"); //emang sengaja ada 2 navigate karena sering gagal
        }, 1000);
      },
      onError: (err) => {
        if (err.response.status === 403) {
          toast.error(
            err?.response?.data?.message ||
              "Login gagal. Periksa username dan password Anda."
          );
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          return;
        }
        toast.error(
          err?.response?.data?.message ||
            "Login gagal. Periksa username dan password Anda."
        );
      },
    });

  function loginGate() {
    if (!captchaToken) {
      toast.error("Harap selesaikan CAPTCHA terlebih dahulu.");
      return;
    }
    if (authMethod === "app") {
      handleLoginApp();
    } else {
      handleLoginLdap();
    }
  }

  return (
  <div className="flex min-h-screen items-center justify-center p-4 overflow-y-auto bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative max-md:py-20">
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
    </div>

    <div className="w-full max-w-5xl relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 backdrop-blur-sm bg-white/10 rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        
        {/* Left Section - Brand & Motivation */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-800 p-10 flex flex-col justify-between min-h-[500px] relative overflow-hidden">
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full filter blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white leading-tight">{APP_NAME}</h1>
                <p className="text-cyan-200 text-sm font-medium tracking-wide">{APP_DESC}</p>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-light">Flow approval dalam 3 klik</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-light">Routing logic cerdas & otomatis</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-light">Integrasi LDAP & Active Directory</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8">
            <p className="text-white/60 text-xs tracking-wider uppercase font-semibold">
              Powered by Enterprise Workflow Engine v3.0
            </p>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map((i) => (
                <div key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full"></div>
              ))}
              <div className="w-12 h-1.5 bg-cyan-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 p-10 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
          <div className="max-w-sm mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Selamat Datang Kembali
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Masuk untuk mengelola approval workflow
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); loginGate(); }} className="space-y-6">
              {/* Auth Method Toggle - Redesign with Icons */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    if (import.meta.env.VITE_DEMO) {
                      setAuthMethod("app");
                      setUsername("admin");
                      setPassword("Supertenant144");
                      setSearch("*");
                    } else {
                      setAuthMethod("app");
                    }
                  }}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300
                    ${authMethod === "app"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md transform scale-95"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  App
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod("ldap")}
                  className={`
                    flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300
                    ${authMethod === "ldap"
                      ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md transform scale-95"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  LDAP
                </button>
              </div>

              {/* Input Fields with Floating Labels */}
              <div className="space-y-5">
                <div className="relative group">
                  <input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder=" "
                    required
                    className="w-full px-4 pt-5 pb-2 border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-300 peer"
                    disabled={isPending || isVerifying}
                  />
                  <label
                    htmlFor="username"
                    className="absolute left-4 top-3 text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:text-gray-400"
                  >
                    Username atau Email
                  </label>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div className="relative group">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    placeholder=" "
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 pt-5 pb-2 border-0 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white placeholder-transparent focus:outline-none focus:border-blue-500 transition-all duration-300 peer"
                    disabled={isPending || isVerifying || loadingAppLogin}
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-4 top-3 text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500 peer-placeholder-shown:text-gray-400"
                  >
                    Password
                  </label>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button with Animated Gradient */}
              <button
                type="submit"
                className={`
                  w-full py-3.5 rounded-xl font-bold text-white text-base
                  bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500
                  hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600
                  shadow-lg hover:shadow-blue-500/30
                  transform transition-all duration-300 hover:scale-[1.02] active:scale-95
                  flex items-center justify-center gap-3
                  ${(isPending || isVerifying || loadingAppLogin) ? "opacity-70 cursor-not-allowed hover:scale-100" : ""}
                `}
                disabled={isPending || isVerifying || loadingAppLogin}
              >
                {isPending || isVerifying || loadingAppLogin ? (
                  <>
                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                    <span>{isVerifying ? "Memverifikasi..." : "Memproses..."}</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>

              {/* Demo Credentials & Helper */}
              {import.meta.env.VITE_DEMO && (
                <div className="text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    🔑 Demo: admin / Supertenant144
                  </p>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                &copy; {new Date().getFullYear()} {APP_NAME}. Enterprise Approval System.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    
  </div>
);
}
