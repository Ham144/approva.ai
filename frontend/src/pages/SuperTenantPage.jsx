import OrgApi from "@/api/orgApi";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import {
  Plus,
  Search,
  FolderSearch,
  Pencil,
  Trash2,
  LogIn,
} from "lucide-react"; // Menambah ikon relevan dari Lucide React
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { initialOrg } from "./RegisterPage";

export default function SuperTenantPage() {
  const queryClient = useQueryClient(); // Inisialisasi queryClient

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [newOrg, setNewOrg] = useState(initialOrg);
  const [searchUsername, setSearchUsername] = useState("");

  // --- React Query for Fetching Organizations ---
  const {
    data: orgsData,
    isPending: isLoadingOrgs,
    isError,
    error,
  } = useQuery({
    queryKey: ["orgs", searchTerm],
    queryFn: async () => await OrgApi.getAllOrgSuperTenant(searchTerm),
    staleTime: 5 * 60 * 1000, // Data dianggap segar selama 5 menit
    keepPreviousData: true, // Opsional: menjaga data sebelumnya saat searchTerm berubah untuk UX yang lebih mulus
  });

  const orgsList = orgsData?.data || []; // Amankan akses data

  // --- React Query for Disabling Organization ---
  const { mutate: disableOrgMutation, isPending: isDisabling } = useMutation({
    mutationFn: async (id) => await OrgApi.disableOrg(id),
    onSuccess: (res) => {
      toast.success(res?.message || "Organization disabled successfully!"); // Pastikan res.message atau sesuaikan
      queryClient.invalidateQueries(["orgs"]);
      closeOrgOptionModal();
    },
    onError: (err) => {
      console.error("Error disabling organization:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to disable organization. Please try again."
      );
    },
  });

  // --- React Query for Deleting Organization ---
  const { mutate: deleteOrgMutation, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => await OrgApi.deleteOrg(id),
    onSuccess: (res) => {
      toast.success(res?.message || "Organization deleted successfully!"); // Pastikan res.message atau sesuaikan
      queryClient.invalidateQueries(["orgs"]);
      closeOrgOptionModal();
    },
    onError: (err) => {
      console.error("Error deleting organization:", err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete organization. Please try again."
      );
    },
  });

  const { mutate: handleCreateOrg, isPending: isLoadingOrgCreating } =
    useMutation({
      mutationKey: ["orgs"],
      mutationFn: async () => OrgApi.createOrgApi(newOrg),
      onSuccess: (res) => {
        toast.success(
          res?.response?.data?.message || "Berhasil membuat organisasi baru"
        );
        queryClient.invalidateQueries(["orgs"]);
        closeNewOrgModal();
        document.getElementById("newOrg").close();
      },
      onError: (err) => {
        toast.error(
          err?.response?.data?.message || "Terjadi kesalahn saat submit"
        );
      },
    });

  // --- Modal Handlers (using native dialog methods) ---
  const openNewOrgModal = () => {
    // setNewOrgFormData(initialOrg); // Jika Anda mengelola form di state ini
    document.getElementById("newOrg").showModal();
  };

  const closeNewOrgModal = () => {
    document.getElementById("newOrg").close();
  };

  const openOrgOptionModal = (org) => {
    setSelectedOrg(org);
    document.getElementById("orgOption").showModal();
  };

  const closeOrgOptionModal = () => {
    setSelectedOrg(null); // Bersihkan selectedOrg saat modal ditutup
    document.getElementById("orgOption").close();
  };

  // --- Event Handlers for Actions ---
  const handleDisableOrgClick = () => {
    if (selectedOrg) {
      disableOrgMutation(selectedOrg._id);
    }
  };

  const handleDeleteOrgClick = () => {
    if (selectedOrg) {
      deleteOrgMutation(selectedOrg._id);
    }
  };

  // --- Conditional Loading State ---
  if (isLoadingOrgs) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="ml-2 text-lg text-gray-600">Loading organizations...</p>
      </div>
    );
  }

  // --- Error State for Query ---
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 p-4 text-center">
        <span className="text-red-500 text-5xl mb-4">⚠️</span>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Failed to load organizations!
        </h2>
        <p className="text-gray-600 mb-4">
          {error.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => queryClient.invalidateQueries(["orgs"])}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <PengelolaSideBarMenu>
      <div className="p-6 bg-base-100 min-h-screen">
        {/* --- Header & Search Bar --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Super Tenant Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all organizations in one place{" "}
              <div className="badge badge-ghost">
                Pergi ke config untuk mengedit properti masing masing
              </div>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="input input-bordered flex items-center gap-2 flex-grow max-w-md bg-white shadow-sm">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                className="grow placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>
            <button
              onClick={openNewOrgModal}
              className="btn btn-secondary hover:btn-primary rounded-lg transition-all duration-200 shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden md:inline">Add Organization</span>
            </button>
          </div>
        </div>

        {/* --- Organizations Table --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="table w-full">
            {/* Table Header */}
            <thead className="bg-gray-50">
              <tr className="text-gray-600">
                <th className="py-4 px-6 text-left font-medium">#</th>
                <th className="py-4 px-6 text-left font-medium">
                  Organization Name
                </th>
                <th className="py-4 px-6 text-center font-medium">Owners</th>
                <th className="py-4 px-6 text-center font-medium">Members</th>
                <th className="py-4 px-6 text-left font-medium">Created At</th>
                <th className="py-4 px-6 text-left font-medium">Created By</th>
                <th className="py-4 px-6 text-center font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orgsList.length > 0 ? (
                orgsList.map((org, index) => (
                  <tr
                    key={org._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-gray-500">{index + 1}</td>
                    <td className="py-4 px-6 font-medium text-blue-600">
                      {org.organizationName}
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {org.owners?.length || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-600">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-800 rounded-full text-xs">
                        {org.members?.length || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">
                      {org.createdAt
                        ? format(new Date(org.createdAt), "dd MMM yyyy, HH:mm")
                        : "-"}
                    </td>
                    <td className="py-4 px-6 text-gray-500">
                      {org.createdBy?.username || "-"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrgOptionModal(org);
                        }}
                        className="btn btn-ghost btn-xs text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        data-tip="Manage Organization"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FolderSearch className="h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-500 mb-1">
                        No organizations found
                      </h3>
                      <p className="text-sm text-gray-400 max-w-md">
                        Try adjusting your search query or create a new
                        organization
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Organization Options Modal --- */}
      <dialog id="orgOption" className="modal">
        <Toaster />
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-xl mb-2">Manage Organization</h3>
          <p className="text-gray-500 mb-6">{selectedOrg?.organizationName}</p>

          <div className="space-y-3">
            <button className="btn btn-outline w-full justify-start gap-2 hover:bg-gray-50">
              <LogIn className="h-4 w-4" />
              Login to this organization (Coming Soon)
            </button>
            <button
              onClick={handleDisableOrgClick}
              className="btn btn-outline btn-warning w-full justify-start gap-2"
              disabled={isDisabling}
            >
              <Trash2 className="h-4 w-4" />
              {isDisabling ? "Disabling..." : "Disable Organization"}
            </button>
            <button
              onClick={handleDeleteOrgClick}
              className="btn btn-outline btn-error w-full justify-start gap-2"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Organization"}
            </button>
          </div>

          <div className="modal-action mt-6">
            <form method="dialog">
              <button
                className="btn btn-ghost text-gray-500 hover:text-gray-700"
                onClick={closeOrgOptionModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* --- New Organization Modal --- */}
      <dialog id="newOrg" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog" className="absolute right-6 top-6">
            <button
              className="btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-gray-800"
              onClick={closeNewOrgModal}
            >
              ✕
            </button>
          </form>

          <h3 className="font-bold text-2xl text-gray-800 mb-2">
            Create New Organization
          </h3>
          <p className="text-gray-500 mb-6">
            Isi detail di bawah untuk membuat organisasi baru
          </p>

          <Toaster />
          <div className="space-y-5">
            <div className="alert alert-info bg-blue-50 text-blue-700 border-blue-100">
              <div>
                <span className="text-sm">
                  Aplikasi akan menyimpan field-field ini dari AD:
                  "physicalDeliveryOfficeName", "displayName", "mail"
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Organization Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Organization Name
                  </span>
                </label>
                <input
                  type="text"
                  value={newOrg.organizationName}
                  onChange={(e) =>
                    setNewOrg({
                      ...newOrg,
                      organizationName: e.target.value,
                    })
                  }
                  className="input input-bordered w-full focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g. Catur Sukses Internasional"
                  required
                />
              </div>

              {/* LDAP Host */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    LDAP Host (AD_HOST)
                  </span>
                </label>
                <input
                  type="text"
                  value={newOrg.AD_HOST}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, AD_HOST: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g. ldap.perusahaan.com"
                  required
                />
              </div>

              {/* LDAP Port */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    LDAP Port (AD_PORT)
                  </span>
                </label>
                <input
                  type="number"
                  value={newOrg.AD_PORT}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, AD_PORT: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g. 389"
                  required
                />
              </div>

              {/* LDAP Domain */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    LDAP Domain (AD_DOMAIN)
                  </span>
                </label>
                <input
                  type="text"
                  value={newOrg.AD_DOMAIN}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, AD_DOMAIN: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g. csi"
                  required
                />
              </div>

              {/* AD Base DN */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">
                    AD Base DN (AD_BASE_DN)
                  </span>
                </label>
                <input
                  type="text"
                  value={newOrg.AD_BASE_DN}
                  onChange={(e) =>
                    setNewOrg({ ...newOrg, AD_BASE_DN: e.target.value })
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g. DC=csi,DC=my,DC=id"
                  required
                />
              </div>
            </div>

            {/* Email Configuration Section */}
            <div className="pt-5 mt-5 border-t border-gray-100">
              <h4 className="font-semibold text-lg text-gray-800 mb-4">
                Email Configuration
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* SMTP Host */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      SMTP Host (EMAIL_HOST)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newOrg.EMAIL_HOST}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, EMAIL_HOST: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="e.g. smtp.mailgun.org"
                  />
                </div>

                {/* SMTP Port */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      SMTP Port (EMAIL_PORT)
                    </span>
                  </label>
                  <input
                    type="number"
                    value={newOrg.EMAIL_PORT}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, EMAIL_PORT: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="e.g. 587"
                  />
                </div>

                {/* SMTP Username */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      SMTP Username (EMAIL_USER)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={newOrg.EMAIL_USER}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, EMAIL_USER: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="e.g. admin@domain.com"
                  />
                </div>

                {/* SMTP Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      SMTP Password (EMAIL_PASS)
                    </span>
                  </label>
                  <input
                    type="password"
                    value={newOrg.EMAIL_PASS}
                    onChange={(e) =>
                      setNewOrg({ ...newOrg, EMAIL_PASS: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="••••••"
                  />
                </div>

                {/* Use TLS/SSL */}
                <div className="form-control md:col-span-2">
                  <label className="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={newOrg.EMAIL_SECURE}
                      onChange={(e) =>
                        setNewOrg({ ...newOrg, EMAIL_SECURE: e.target.checked })
                      }
                    />
                    <span className="label-text">
                      Use TLS/SSL (EMAIL_SECURE)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action mt-8">
            <button
              type="button"
              className="btn btn-ghost text-gray-500 hover:bg-gray-50"
              onClick={closeNewOrgModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${
                isLoadingOrgCreating ? "loading" : ""
              }`}
              onClick={handleCreateOrg}
              disabled={isLoadingOrgCreating}
            >
              {isLoadingOrgCreating ? "Creating..." : "Create Organization"}
            </button>
          </div>
        </div>
      </dialog>
    </PengelolaSideBarMenu>
  );
}
