import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"; // Asumsi Anda pakai TanStack Query
import {
  User,
  Settings,
  LogOut,
  KeyRound,
  Info,
  Group,
  Hotel,
  EyeClosed,
  LockIcon,
  EyeIcon,
} from "lucide-react"; // Impor ikon Lucide React yang lebih relevan
import { ErrorIcon, toast, Toaster } from "react-hot-toast"; // Asumsi Anda pakai react-hot-toast
import { useUserInfo } from "@/store";
import { logout, resetPassword } from "@/api/authApi";
import OrgApi from "@/api/orgApi";
import { IconLockPassword } from "@tabler/icons-react";

const ManagementButton = () => {
  const managementMenus = [
    {
      title: "Source Data Options",
      description:
        "mangement untuk tiap source data select/options ytang telah dibuat",
      url: "/management/sourceData/options",
    },
    {
      title: "User Management",
      description: "Melihat list dari user aplikasi ini",
      url: "/management/user",
    },
    {
      title: "Management Flow Template",
      description:
        "Management untuk melihat/ mengedit flow design yang telah dibuat",
      url: "/management/flow",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="flex gap-y-2  flex-col justify-center">
      {managementMenus.map((menu) => (
        <div className="card  border rounded-lg">
          <div className="card-body">
            <h2 className="card-title">{menu.title}</h2>
            <p>{menu.description}</p>
            <div className="card-actions justify-end">
              <button
                onClick={() => navigate(menu.url)}
                className="btn btn-primary text-white rounded-md"
              >
                Kunjungi
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, clearUserInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const { data: myOrg } = useQuery({
    queryKey: ["org"],
    queryFn: async () => {
      const res = await OrgApi.getMyOrg(userInfo?.org);
      return res?.data;
    },
    enabled: !!userInfo?.org,
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [activeTab, setActiveTab] = useState("profile");

  const { mutate: handleLogout } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUserInfo();
      queryClient.clear();
      navigate("/login");
      toast.success("Berhasil logout.");
    },
    onError: (error) => {
      console.log(error);
      const errorMessage = error?.response?.data?.message || "Gagal logout.";
      toast.error(errorMessage);
    },
  });

  const { mutateAsync: handlePasswordReset, isPending: isReseting } =
    useMutation({
      mutationKey: ["auth"],
      mutationFn: async () => {
        if (validateForm(newPassword)) {
          const res = await resetPassword({
            oldPassword,
            newPassword,
          });
          return res?.data;
        }
      },

      onSuccess: () => {
        toast.success("Password berhasil diperbarui");
        window.location.reload();
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.message || "Gagal reset.";
        toast.error(errorMessage);
      },
    });

  const validateForm = (newPassword) => {
    setPasswordError("");
    if (!newPassword) {
      setPasswordError("newPassword diperlukan.");
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const isLongEnough = newPassword.length >= 6;

    if (!isLongEnough) {
      setPasswordError("Password harus lebih dari 6 karakter.");
    }
    if (!hasUpperCase) {
      setPasswordError("Password harus memiliki huruf besar.");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("Password harus memiliki angka.");
    }
    return true;
  };

  useEffect(() => {
    setPasswordError("");
    if (newPassword?.length) {
      validateForm(newPassword);
    }
  }, [newPassword]);

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col  dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header with Tab Navigation */}
      <div className="sticky top-0 z-20  dark:bg-gray-800 shadow-md py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium
                transition-all duration-200 ease-in-out flex-1 sm:flex-initial
                ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
              title={tab.label}
              aria-label={`Switch to ${tab.label} tab`}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
          {/* Logout Button */}
          <button
            onClick={() => {
              if (window.confirm("Apakah Anda yakin ingin logout?")) {
                handleLogout();
              }
            }}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm sm:text-base font-medium
              bg-red-500 hover:bg-red-600 text-white shadow-lg
              transition-colors duration-200 ease-in-out flex-1 sm:flex-initial
            "
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
        <div className=" bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {activeTab === "profile" && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-200 border-b pb-4 mb-4">
                Informasi Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username Card */}
                <div className=" dark:bg-gray-700 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-6 h-6 text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Username
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
                    {userInfo?.displayName || userInfo?.username || "N/A"}
                  </p>
                </div>
                <div className=" dark:bg-gray-700 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Group className="w-6 h-6 text-blue-500" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Organisasi
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 break-words">
                    {myOrg?.organizationName || "N/A"}
                  </p>
                </div>

                {/* Role Card */}
                <div className=" dark:bg-gray-700 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <KeyRound className="w-6 h-6 text-purple-500" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Role
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                    {userInfo?.role || "N/A"}
                  </p>
                </div>
                {/* department Card */}
                <div className=" dark:bg-gray-700 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Hotel className="w-6 h-6 text-balance-500" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Department
                    </h4>
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                    {userInfo?.department?.name || "N/A"}
                  </p>
                </div>
                <div
                  className={`${
                    userInfo.authMethod != "app" && "hidden"
                  }  dark:bg-gray-700 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconLockPassword className="w-6 h-6 text-balance-500" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Reset Password
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setNewPassword("");
                      document
                        .getElementById("reset-password-modal")
                        .showModal();
                    }}
                    className="btn rounded-md bg-red-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-200 border-b pb-4 mb-4">
                Pengaturan Lainnya
              </h2>
              {userInfo?.role !== "owner" ? (
                <ManagementButton />
              ) : (
                <div className=" dark:bg-gray-700 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Info className="w-6 h-6 text-gray-500" />
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Pengaturan
                    </h4>
                  </div>
                  <p className="text-base text-gray-900 dark:text-gray-100">
                    Belum ada fitur pengaturan khusus tersedia untuk peran Anda.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <dialog id="reset-password-modal" className="modal ">
        <Toaster />
        <div className="modal-box max-w-md p-8 space-y-6 rounded-lg shadow-xl">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full">
                <LockIcon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="font-bold text-2xl text-gray-800">Reset Password</h3>
            <p className="text-sm text-gray-500">
              Masukkan password lama dan buat password baru yang kuat
            </p>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Password Lama
                </span>
              </label>
              <input
                type="password"
                placeholder="Masukkan password lama"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            {/* New Password */}
            <div className="form-control">
              <div className="flex justify-between items-center">
                <label className="label">
                  <span className="label-text font-medium text-gray-700">
                    Password Baru
                  </span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered w-full pr-10 focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!isPasswordVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={
                    isPasswordVisible
                      ? "Sembunyikan password"
                      : "Tampilkan password"
                  }
                >
                  {isPasswordVisible ? (
                    <EyeIcon className="w-5 h-5" />
                  ) : (
                    <EyeClosed className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <ErrorIcon className="w-3 h-3 mr-1" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">
                  Konfirmasi Password Baru
                </span>
              </label>
              <input
                type="password"
                placeholder="Ketik ulang password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="new-password"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs text-red-500 flex items-center">
                  <ErrorIcon className="w-3 h-3 mr-1" />
                  Password tidak cocok
                </p>
              )}
            </div>
          </div>

          <div className="modal-action flex justify-between pt-4">
            <form method="dialog">
              <button className="btn btn-ghost hover:bg-gray-100 rounded-lg">
                Batalkan
              </button>
            </form>
            <button
              onClick={handlePasswordReset}
              disabled={
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
              className="btn text-white btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReseting && (
                <span className="loading loading-ring loading-lg"></span>
              )}{" "}
              Simpan Password Baru
            </button>
          </div>
        </div>

        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Profile;
