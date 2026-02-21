import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import configApi from "@/api/configApi";
import toast from "react-hot-toast";
import { searchAccount } from "../api/authApi";
import { Search } from "lucide-react";

const initialSmtp = {
  EMAIL_USER: "",
  EMAIL_PASS: "",
  EMAIL_HOST: "",
  EMAIL_PORT: "",
  EMAIL_SECURE: false,
};

export default function Config() {
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState("LDAP");

  // State for AD Config
  const [AD_HOST, setAD_HOST] = useState("");
  const [AD_PORT, setAD_PORT] = useState("");
  const [AD_DOMAIN, setAD_DOMAIN] = useState("");
  const [AD_BASE_DN, setAD_BASE_DN] = useState("");

  // State for SMTP Config
  const [smtpConfig, setSmtpConfig] = useState(initialSmtp);
  const [testRecipient, setTestRecipient] = useState("");

  // State for app-setting
  const [userSearchKey, setUserSearchKey] = useState("");

  const { data: users } = useQuery({
    queryKey: ["app-setting", userSearchKey],
    queryFn: async () => await searchAccount(userSearchKey),
  });

  // Query for AD Config
  const {
    data: configData,
    isLoading: isLoadingAD,
    error,
  } = useQuery({
    queryKey: ["config"],
    queryFn: () => configApi.getConfigAD(),
    refetchOnWindowFocus: false,
  });

  // Query for SMTP Config, enabled only when the SMTP tab is active
  const { data: configSmtp, isLoading: isLoadingSmtp } = useQuery({
    queryKey: ["smtp"],
    queryFn: () => configApi.getConfigSMTP(),
    enabled: currentTab === "SMTP",
    refetchOnWindowFocus: false,
  });

  // Mutation for updating AD Config
  const { mutate: updateAdMutate, isLoading: isUpdatingAD } = useMutation({
    mutationFn: () =>
      configApi.updateConfigAD({ AD_HOST, AD_PORT, AD_BASE_DN, AD_DOMAIN }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config"] });
      toast.success("Konfigurasi AD berhasil diperbarui");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Gagal memperbarui konfigurasi AD"
      );
    },
  });

  // Mutation for updating SMTP Config
  const { mutate: updateSmtpMutate, isLoading: isUpdatingSmtp } = useMutation({
    mutationFn: () => configApi.updateConfigSMTP(smtpConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smtp"] });
      toast.success("Konfigurasi SMTP berhasil disimpan");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Gagal menyimpan konfigurasi SMTP"
      );
    },
  });

  // Mutation for testing SMTP Config
  const { mutate: testSmtpMutate, isLoading: isTestingSmtp } = useMutation({
    mutationFn: () =>
      configApi.testConfigSMTP({ ...smtpConfig, recipient: testRecipient }),
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Gagal mengirim email percobaan"
      );
    },
  });

  //app-setting area
  const [appSettingState, setAppsettingState] = useState({
    authorizedToDownloadUsers: [],
  });

  const { data: appSettingData, isLoading: isLoadingAppSetting } = useQuery({
    queryKey: ["app-setting"],
    queryFn: async () => {
      const data = await configApi.getAppSettings();
      setAppsettingState(data);
      return data;
    },
    retetchOnWindowFocus: false,
    retry: false,
  });

  const { mutateAsync: handleUpdateappSettings } = useMutation({
    mutationKey: ["app-setting"],
    mutationFn: async () =>
      await configApi.updateAppSetting({
        authorizedToDownloadUsers: appSettingState.authorizedToDownloadUsers,
      }),
    onSuccess: () => {
      toast.success("berhasil");
      queryClient.invalidateQueries({ queryKey: ["app-setting"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? "gagal");
    },
  });

  // Effect to populate form fields when data is loaded
  useEffect(() => {
    if (configData?.data) {
      setAD_HOST(configData.data.AD_HOST || "");
      setAD_PORT(configData.data.AD_PORT || "");
      setAD_DOMAIN(configData.data.AD_DOMAIN || "");
      setAD_BASE_DN(configData.data.AD_BASE_DN || "");
    }
  }, [configData]);

  useEffect(() => {
    if (configSmtp?.data) {
      setSmtpConfig({
        EMAIL_USER: configSmtp.data.EMAIL_USER || "",
        EMAIL_PASS: configSmtp.data.EMAIL_PASS || "",
        EMAIL_HOST: configSmtp.data.EMAIL_HOST || "",
        EMAIL_PORT: configSmtp.data.EMAIL_PORT || "",
        EMAIL_SECURE: configSmtp.data.EMAIL_SECURE || false,
      });
    }
  }, [configSmtp]);

  useEffect(() => {
    if (appSettingData) {
      setAppsettingState(appSettingData);
    }
  }, [appSettingData]);

  const handleSmtpChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSmtpConfig((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (error) {
    return (
      <PengelolaSideBarMenu>
        <div className="alert alert-error">
          <span>Error: {error?.message || "Gagal memuat config"}</span>
        </div>
      </PengelolaSideBarMenu>
    );
  }

  const tabs = [
    {
      title: "LDAP",
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Konfigurasi Active Directory
          </h2>
          {isLoadingAD && (
            <span className="loading loading-dots loading-lg"></span>
          )}
          {!isLoadingAD && (
            <>
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
                  name="AD_PORT"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="e.g., 389 or 636"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="ad-port"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  AD DOMAIN:
                </label>
                <input
                  id="ad-port"
                  type="text"
                  value={AD_DOMAIN}
                  onChange={(e) => e.target.value}
                  name="AD_DOMAIN"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="e.g., csi"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="ad-port"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  AD BASE DN:
                </label>
                <input
                  id="ad-port"
                  type="text"
                  value={AD_BASE_DN}
                  onChange={(e) => setAD_BASE_DN(e.target.value)}
                  name="AD_PORT"
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="e.g., DC=csi,DC=my,DC=id"
                />
              </div>
              <button
                disabled={isUpdatingAD}
                onClick={updateAdMutate}
                className={`btn btn-primary text-white font-bold rounded-md w-full ${
                  isUpdatingAD ? "loading" : ""
                }`}
              >
                Update
              </button>
            </>
          )}
        </div>
      ),
    },
    {
      title: "SMTP",
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Konfigurasi SMTP
          </h2>
          {isLoadingSmtp && (
            <span className="loading loading-dots loading-lg"></span>
          )}
          {!isLoadingSmtp && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="email-user"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email User:
                </label>
                <input
                  id="email-user"
                  type="text"
                  value={smtpConfig.EMAIL_USER}
                  onChange={handleSmtpChange}
                  name="EMAIL_USER"
                  className="input input-bordered w-full"
                  placeholder="contoh@domain.com"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email-pass"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Password:
                </label>
                <input
                  id="email-pass"
                  type="password"
                  value={smtpConfig.EMAIL_PASS}
                  onChange={handleSmtpChange}
                  name="EMAIL_PASS"
                  className="input input-bordered w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email-host"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Host:
                </label>
                <input
                  id="email-host"
                  type="text"
                  value={smtpConfig.EMAIL_HOST}
                  onChange={handleSmtpChange}
                  name="EMAIL_HOST"
                  className="input input-bordered w-full"
                  placeholder="smtp.office365.com"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email-port"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Port:
                </label>
                <input
                  id="email-port"
                  type="text"
                  value={smtpConfig.EMAIL_PORT}
                  onChange={handleSmtpChange}
                  name="EMAIL_PORT"
                  className="input input-bordered w-full"
                  placeholder="587"
                />
              </div>
              <div className="mb-6 form-control">
                <label className="cursor-pointer label">
                  <span className="label-text">Secure (TLS/SSL)</span>
                  <input
                    type="checkbox"
                    name="EMAIL_SECURE"
                    checked={smtpConfig.EMAIL_SECURE}
                    onChange={handleSmtpChange}
                    className="checkbox checkbox-primary"
                  />
                </label>
              </div>
              <div className="divider">Uji Coba Pengiriman</div>
              <div className="mb-4">
                <label
                  htmlFor="test-recipient"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kirim ke:
                </label>
                <div className="flex gap-2">
                  <input
                    id="test-recipient"
                    type="email"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="email.tujuan@domain.com"
                  />
                  <button
                    onClick={testSmtpMutate}
                    className={`btn btn-secondary ${
                      isTestingSmtp ? "loading" : ""
                    }`}
                    disabled={isTestingSmtp || isUpdatingSmtp || !testRecipient}
                  >
                    Test
                  </button>
                </div>
              </div>
              <button
                disabled={isUpdatingSmtp || isTestingSmtp}
                onClick={updateSmtpMutate}
                className={`btn btn-primary w-full mb-4 ${
                  isUpdatingSmtp ? "loading" : ""
                }`}
              >
                Simpan Konfigurasi
              </button>
            </>
          )}
        </div>
      ),
    },
    {
      title: "app-setting",
      content: (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">app-setting</h2>
          {isLoadingAppSetting && (
            <span className="loading loading-dots loading-lg"></span>
          )}
          {!isLoadingAppSetting && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="email-user"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Search new User to assign:
                </label>
                <div className="relative">
                  <input
                    id="user"
                    type="text"
                    value={userSearchKey}
                    onChange={(e) => setUserSearchKey(e.target.value)}
                    className="input input-bordered w-full"
                    placeholder="eg:ham"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 font-bold text-gray-400" />

                  {/* User recommendations dropdown */}
                  {userSearchKey && users?.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {users.map((user) => (
                        <button
                          key={user.id || user.username}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                          onClick={() => {
                            const isAlreadyAdded =
                              appSettingState.authorizedToDownloadUsers?.some(
                                (existingUser) =>
                                  existingUser.username === user.username
                              );

                            if (!isAlreadyAdded) {
                              setAppsettingState((prev) => ({
                                ...prev,
                                authorizedToDownloadUsers: [
                                  ...(prev.authorizedToDownloadUsers || []),
                                  user,
                                ],
                              }));
                            }

                            // Clear search
                            setUserSearchKey("");
                          }}
                        >
                          <div className="font-medium">{user.username}</div>
                          {user.displayName && (
                            <div className="text-sm text-gray-500">
                              {user.displayName}
                            </div>
                          )}
                          {user.email && (
                            <div className="text-xs text-gray-400">
                              {user.email}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Show message when no users found */}
                  {userSearchKey && users?.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-gray-500 text-center">
                      No users found
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Authorized Users:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {appSettingState?.authorizedToDownloadUsers?.length > 0 ? (
                    appSettingState.authorizedToDownloadUsers.map(
                      (user, index) => (
                        <div
                          key={user.id || user.username || index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div>
                            <div className="font-medium">
                              {user.displayName || user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.username &&
                                user.username !== user.displayName &&
                                `@${user.username}`}
                            </div>
                            {user.email && (
                              <div className="text-xs text-gray-400">
                                {user.email}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              // Remove user from authorizedToDownloadUsers
                              setAppsettingState((prev) => ({
                                ...prev,
                                authorizedToDownloadUsers:
                                  prev.authorizedToDownloadUsers.filter(
                                    (existingUser) =>
                                      existingUser.id !== user.id &&
                                      existingUser.username !== user.username
                                  ),
                              }));
                              setUserSearchKey("");
                            }}
                            className="btn btn-ghost btn-sm text-error hover:text-error"
                          >
                            ✕
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-center py-4 text-gray-500 border border-dashed rounded-lg">
                      No authorized users yet
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleUpdateappSettings}
                disabled={isLoadingAppSetting}
                className={`btn text-white btn-primary w-full ${
                  isLoadingAppSetting ? "loading" : ""
                }`}
              >
                Simpan
              </button>
            </>
          )}
        </div>
      ),
    },
  ];
  return (
    <PengelolaSideBarMenu>
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4 mb-8 p-2 bg-white rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.title} // Penting untuk memberikan key pada setiap elemen dalam map
            onClick={() => setCurrentTab(tab.title)}
            className={`
              btn  btn-lg normal-case font-semibold
              ${
                currentTab === tab.title
                  ? "btn-primary shadow-lg transform scale-105 text-white" // Gaya untuk tab aktif
                  : "btn-ghost text-gray-700 hover:bg-blue-100 hover:text-primary transition-all duration-300" // Gaya untuk tab tidak aktif
              }
            `}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {currentTab === "LDAP" && tabs[0].content}
      {currentTab === "SMTP" && tabs[1].content}
      {currentTab === "app-setting" && tabs[2].content}
    </PengelolaSideBarMenu>
  );
}
