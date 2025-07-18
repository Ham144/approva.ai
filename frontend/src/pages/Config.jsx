import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import configApi from "@/api/configApi";
import toast from "react-hot-toast";

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

  // State for SMTP Config
  const [smtpConfig, setSmtpConfig] = useState(initialSmtp);
  const [testRecipient, setTestRecipient] = useState("");

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
    mutationFn: () => configApi.updateConfigAD({ AD_HOST, AD_PORT }),
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

  // Effect to populate form fields when data is loaded
  useEffect(() => {
    if (configData?.data) {
      setAD_HOST(configData.data.AD_HOST || "");
      setAD_PORT(configData.data.AD_PORT || "");
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
  ];
  return (
    <PengelolaSideBarMenu>
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4 mb-8 p-2 bg-white rounded-lg shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.title} // Penting untuk memberikan key pada setiap elemen dalam map
            onClick={() => setCurrentTab(tab.title)}
            className={`
              btn btn-lg normal-case font-semibold
              ${
                currentTab === tab.title
                  ? "btn-primary shadow-lg transform scale-105" // Gaya untuk tab aktif
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
    </PengelolaSideBarMenu>
  );
}
