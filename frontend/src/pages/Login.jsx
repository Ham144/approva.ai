import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApp, loginLdap, checkUsername } from "@/api/authApi";
import { useNavigate } from "react-router";
import { useUserInfo } from "@/store";
import { APP_NAME } from "@/api/constant";
import {
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Check,
  Building2,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUserInfo } = useUserInfo();

  const { mutateAsync: handleCheckUsername, isPending: isChecking } =
    useMutation({
      mutationFn: async () => {
        const res = await checkUsername({ username });
        return res.data;
      },
      onSuccess: (data) => {
        if (data && data.length > 0) {
          setOrganizations(data);
          setSelectedOrg(data[0]);
          setErrorMsg("");
          setStep(2);
        } else {
          setErrorMsg("Username tidak terdaftar di sistem.");
        }
      },
      onError: (err) => {
        setErrorMsg(err.response?.data?.message || "Gagal memeriksa username.");
      },
    });

  const handleSuccessLogin = (res) => {
    setUserInfo(res?.data);
    queryClient.invalidateQueries(["userInfo"]);
    navigate("/home");
  };

  const handleErrorLogin = (err) => {
    setErrorMsg(
      err?.response?.data?.message ||
        "Autentikasi gagal. Periksa kredensial Anda.",
    );
    if (err.response?.status === 403) {
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const { mutateAsync: handleLoginLdap, isPending: isLoggingLdap } =
    useMutation({
      mutationFn: async () => {
        const res = await loginLdap({
          username,
          password,
          selectedOrg: selectedOrg?.orgId || selectedOrg?._id,
          captchaToken: "",
        });
        return res.data;
      },
      mutationKey: ["userInfo"],
      onSuccess: handleSuccessLogin,
      onError: handleErrorLogin,
    });

  const { mutateAsync: handleLoginApp, isPending: isLoggingApp } = useMutation({
    mutationFn: async () => {
      const res = await loginApp({
        username,
        password,
        selectedOrg: selectedOrg?.orgId || selectedOrg?._id,
        captchaToken: "",
      });
      return res.data;
    },
    mutationKey: ["userInfo"],
    onSuccess: handleSuccessLogin,
    onError: handleErrorLogin,
  });

  const loginGate = () => {
    setErrorMsg("");
    if (!password) {
      setErrorMsg("Password wajib diisi.");
      return;
    }

    if (selectedOrg?.authMethod === "app") {
      handleLoginApp();
    } else {
      handleLoginLdap();
    }
  };

  const isLoggingIn = isLoggingApp || isLoggingLdap;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950 font-sans text-zinc-100 antialiased">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Header Sederhana */}
        <div className="border-b border-zinc-800 pb-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold tracking-tight text-white uppercase font-mono">
              {APP_NAME}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
              STEP {step}/02
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            {step === 1
              ? "Identifikasi kredensial akun pengguna"
              : "Verifikasi kata sandi & otoritas"}
          </p>
        </div>

        {/* Notifikasi Error Ringan */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-lg text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Input Username */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckUsername();
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Username / ID Pengguna
              </label>
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                type="text"
                placeholder="nama.pengguna"
                required
                autoFocus
                disabled={isChecking}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isChecking || !username}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? (
                <span className="text-xs">Memeriksa...</span>
              ) : (
                <>
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Password & Organisasi */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginGate();
            }}
            className="space-y-4"
          >
            {/* Identity Bar */}
            <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
              <div className="min-w-0 pr-2">
                <span className="text-zinc-500 block text-[10px]">User:</span>
                <span className="font-medium text-zinc-200 truncate block">
                  {username}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setErrorMsg("");
                  setPassword("");
                }}
                className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs flex items-center gap-1 transition-colors shrink-0"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Ganti</span>
              </button>
            </div>

            {/* Pemilih Organisasi Multi-Tenant */}
            {organizations.length > 1 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-zinc-400">
                  Pilih Unit / Organisasi
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {organizations.map((org) => {
                    const isSelected =
                      (selectedOrg?.orgId || selectedOrg?._id) ===
                      (org.orgId || org._id);
                    return (
                      <div
                        key={org.orgId || org._id}
                        onClick={() => setSelectedOrg(org)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected
                            ? "border-zinc-400 bg-zinc-800 text-white font-medium"
                            : "border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Building2 className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                          <span className="truncate">{org.orgName}</span>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 shrink-0 text-zinc-200" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tipe Otorisasi */}
            {selectedOrg && (
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                  AUTH:{" "}
                  {selectedOrg.authMethod === "ldap"
                    ? "Active Directory / LDAP"
                    : "Local DB Encryption"}
                </span>
              </div>
            )}

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  disabled={isLoggingIn}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !password}
              className="w-full py-2.5 px-4 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <span className="text-xs">Mengotentikasi...</span>
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
  
        <div className="text-center pt-2">
          <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
            Secured On-Premise Gateway
          </span>
        </div>
      </div>
    </div>
  );
}
