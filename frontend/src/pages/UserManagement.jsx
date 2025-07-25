import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllAccount,
  updateUser,
  createAppUser,
  deleteAppUser,
  takeOverUser,
} from "@/api/authApi";
import { toast } from "react-hot-toast";
import { Pencil, Plus, TrashIcon } from "lucide-react";
import DepartmentApi from "@/api/DepartmentApi";
import axiosInstance from "@/api/axiosInstance";

// Penjelasan Akun
// ----------------------------------------
// - supertenant: Hanya satu akun utama sistem. Bisa berpindah antar organisasi (tenant),
//   membuat tenant baru, tidak terikat dengan LDAP. Digunakan oleh developer/admin utama.
// - owner: Admin organisasi/tenant. Bisa berasal dari login LDAP (automatis) atau dibuat manual (authMethod 'app').
// - member: Pengguna biasa. Bisa dari LDAP (otomatis join) atau dibuat manual (authMethod 'app').
//
// authMethod === 'app'  => username, email, password bisa diubah.
// authMethod === 'ldap' => hanya bisa ubah role (owner/member), tidak bisa ubah username/password.

export default function UserManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    username: "",
    email: "",
    password: "",
    role: "member",
    isDisabled: false,
    authMethod: "app",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getAllAccount,
  });

  const { mutate: handleUpdateUser, isPending: isUpdating } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User berhasil diperbarui");
      handleCloseDialog();
      setCurrentUser(null);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui user");
    },
  });
  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: async () => deleteAppUser(currentUser._id),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User berhasil dihapus");
      document.getElementById("confirm-delete")?.close();
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.message || "Gagal memperbarui user");
    },
  });

  const { mutate: handleCreateAppUser, isPending: isCreating } = useMutation({
    mutationFn: createAppUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User berhasil diperbarui");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui user");
    },
  });

  const { mutateAsync: handleInitilize, isPending: initializing } = useMutation(
    {
      mutationKey: ["takeOverUser"],
      mutationFn: async () => {
        const res = await axiosInstance.post("/api/bulk/initialize/all");
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        toast.success("User berhasil diperbarui");
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Gagal memperbarui user");
      },
    }
  );

  const { data: departments } = useQuery({
    queryKey: ["department"],
    queryFn: DepartmentApi.getAllDepartment,
  });

  const handleCloseDialog = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setOldUser(null);
    setFormData({
      _id: "",
      username: "",
      email: "",
      password: "",
      role: "member",
      isDisabled: false,
      authMethod: "app",
      department: "",
    });
    setErrors({});
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setFormData({
      _id: user._id,
      username: user.username,
      email: user.email || "",
      password: "",
      role: user.role,
      isDisabled: user.isDisabled,
      authMethod: user.authMethod,
    });
    setIsOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username diperlukan";
    }

    if (!isEditMode || (isEditMode && formData.password)) {
      if (!formData.password && !isEditMode && formData.authMethod === "app") {
        newErrors.password = "Password diperlukan";
      } else if (formData.password) {
        const password = formData.password;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const isLongEnough = password.length >= 3;

        if (!isLongEnough) {
          newErrors.password = "Password harus lebih dari 3 karakter";
        } else if (!hasUpperCase) {
          newErrors.password = "Password harus memiliki huruf besar";
        } else if (!hasNumber) {
          newErrors.password = "Password harus memiliki angka";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [oldUser, setOldUser] = useState(null);

  const { mutateAsync: handleTakeOver } = useMutation({
    mutationKey: ["users"],
    mutationFn: async () =>
      takeOverUser({
        oldUser: oldUser,
        newUser: currentUser._id,
      }),
    onSuccess: (res) => {
      toast.success(res?.response?.data.message || "berhasil");
      queryClient.invalidateQueries(["users"]);
      setIsEditMode(false);
      setIsOpen(false);
      setOldUser(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "gagal");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    const updateData = { ...formData };
    if (validateForm()) {
      if (isEditMode) {
        if (oldUser != null) {
          const confirm = window.confirm(
            "Anda yakin ?, proses bisa dikembalikan dan user takeover akan diambil alih menjadi user anda "
          );
          if (confirm) {
            handleTakeOver();
          }
          return;
        }
        if (currentUser?.authMethod === "ldap") {
          if (!updateData.password) delete updateData.password;
          handleUpdateUser(updateData);
        } else {
          if (!updateData.password) delete updateData.password;
          handleUpdateUser(updateData);
        }
      } else {
        if (!updateData.password) delete updateData.password;
        handleCreateAppUser(updateData);
      }
    }
  };

  useEffect(() => {
    if (!users?.data) return;

    const filteredFrontend = users.data.filter((user) => {
      if (
        user.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm?.toLowerCase())
      ) {
        return true;
      }
    });

    setFilteredUsers(filteredFrontend);
  }, [users?.data, searchTerm]);

  function handleOpenDialog() {
    setIsOpen(true);
    setIsEditMode(false);
    setFormData({
      _id: "",
      username: "",
      email: "",
      password: "",
      role: "member",
      isDisabled: false,
      authMethod: "app",
    });
    setErrors({});
  }

  return (
    <PengelolaSideBarMenu>
      <div className="flex flex-col gap-4 p-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            User Management
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleOpenDialog}
              className="btn btn-primary rounded-md text-white flex items-center"
            >
              <Plus className="h-5 w-5 mr-1" />
              <span>Tambah User (non LDAP)</span>
            </button>
            <button
              disabled={initializing}
              onClick={() => {
                const confirm = window.confirm(
                  "Proses ini mungkin memakan waktu lama untuk menginisiasi semua user dari AD ?"
                );
                if (confirm) {
                  handleInitilize();
                }
              }}
              className={`${
                initializing && "loading"
              } btn bg-green-500 rounded-md text-white flex items-center`}
            >
              <Plus className="h-5 w-5 mr-1" />
              <span>inisialisasi masal LDAP</span>
            </button>
          </div>
        </div>

        <p className="p-2 font-bold  bg-warning rounded-md ">
          Untuk AuthMethod == "ldap" : Field field ini akan berubah menyesuikan,
          jika diganti di Active Directory : "display Name", "email",
          "physicalDeliveryOfficeName",
        </p>
        {/* Add/Edit User Dialog */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Edit User" : "Tambah User non LDAP (app)"}
                </h2>
                <button
                  onClick={handleCloseDialog}
                  className="btn btn-ghost btn-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Auth Method Selection */}
                {!isEditMode && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Metode Autentikasi</span>
                    </label>
                    <select
                      value={formData.authMethod}
                      disabled
                      className="select select-bordered w-full"
                    >
                      <option value="app">Manual (App)</option>
                    </select>
                    <label className="label">
                      <span className="label-text-alt">
                        User akan dibuat manual dalam sistem
                      </span>
                    </label>
                  </div>
                )}

                {/* Username Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    autoComplete="off"
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className={`input input-bordered w-full ${
                      errors.username ? "input-error" : ""
                    }`}
                    placeholder="Masukkan username"
                    disabled={isEditMode && formData.authMethod === "ldap"}
                  />
                  {errors.username && (
                    <span className="text-error text-sm mt-1">
                      {errors.username}
                    </span>
                  )}
                </div>

                {/* Password Field (only for app auth) */}
                {(!isEditMode || formData.authMethod === "app") && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Password</span>
                    </label>
                    <input
                      type="password"
                      value={formData?.password || ""}
                      autoComplete="off"
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`input input-bordered w-full ${
                        errors.password ? "input-error" : ""
                      }`}
                      placeholder={
                        isEditMode
                          ? "Masukkan Password baru, atau biarkan kosong"
                          : "Masukkan Password"
                      }
                      disabled={isEditMode && formData.authMethod === "ldap"}
                    />
                    {errors.password && (
                      <span className="text-error text-sm mt-1">
                        {errors.password}
                      </span>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={formData?.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`input input-bordered w-full ${
                      errors.email ? "input-error" : ""
                    }`}
                    placeholder="Masukkan Email"
                  />
                  {errors.email && (
                    <span className="text-error text-sm mt-1">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Department  */}
                {!isEditMode && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Department</span>
                    </label>
                    <select
                      value={formData.department}
                      className="select select-bordered w-full"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setFormData({
                          ...formData,
                          department: e.target.value,
                        });
                      }}
                    >
                      <option value="">Pilih department user </option>
                      {departments?.data?.map((dep) => (
                        <option value={dep._id}>{dep.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Role Selection */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="select select-bordered w-full"
                    disabled={
                      formData.authMethod === "ldap" &&
                      formData.role === "supertenant"
                    }
                  >
                    <option value="member">Member</option>
                    <option value="owner">Owner</option>
                    <option disabled value="supertenant">
                      supertenant
                    </option>
                    {currentUser?.role === "supertenant" && (
                      <option value="supertenant">Supertenant</option>
                    )}
                  </select>
                  <label className="label">
                    <span className="label-text-alt">
                      {formData?.role === "supertenant"
                        ? "Akses penuh ke semua tenant"
                        : formData?.role === "owner"
                        ? "Admin untuk tenant saat ini"
                        : "User biasa dengan akses terbatas"}
                    </span>
                  </label>
                </div>

                {/* Advanced Options - Collapsible */}
                <div className="collapse collapse-arrow bg-base-200 mt-4">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title font-medium">
                    Advanced Options
                  </div>
                  <div className="collapse-content">
                    <div className="form-control w-full mt-4">
                      <label className="label">
                        <span className="label-text">
                          TARGET (Account Takeover)
                        </span>
                      </label>
                      <select
                        onChange={(e) => {
                          setOldUser(e.target.value);
                        }}
                        className="select select-bordered w-full"
                      >
                        <option disabled selected>
                          Pilih user yang akan diambil alih riwayatnya
                        </option>
                        {users.data.map((user) => (
                          <option key={user._id} value={user._id}>
                            {user.username} ({user.email})
                          </option>
                        ))}
                      </select>
                      <label className="label">
                        <span className="label-text-alt text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm block mt-2">
                          <strong className="font-bold">Peringatan:</strong>{" "}
                          akses dan data yang tereferensi dengan akun user
                          pengambil alihan akun ini akan menyebabkan segala yang
                          ditargetkan beralih sepenuhnya ke user ini.
                          <br />
                          <strong className="font-bold">
                            Peringatan:
                          </strong>{" "}
                          Setelah ini berhasil maka user yang di target akan
                          hilang
                          <br />
                          <span className="text-red-600 font-semibold">
                            Risiko:
                          </span>{" "}
                          Data yang telah dikerjakan oleh user lama akan
                          sepenuhnya dianggap sebagai milik user ini dan tidak
                          dapat dibedakan lagi dalam riwayat.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseDialog}
                    className="btn btn-ghost"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : isEditMode ? (
                      oldUser != null ? (
                        "Take Over"
                      ) : (
                        "Simpan perubahan"
                      )
                    ) : (
                      "Buat User"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Table Section */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-full md:w-auto ">
              <input
                type="text"
                placeholder="Cari user..."
                className="input input-bordered w-full rounded-lg md:w-64 font-bold "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total: {filteredUsers.length} users
            </div>
          </div>

          <div className="overflow-x-auto ">
            {initializing ? (
              <div className="flex justify-center items-center min-h-[500px]">
                <span className="loading loading-ring loading-lg"></span>
              </div>
            ) : (
              <table className="table w-full">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 rounded-tl-lg">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Display Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200">
                      Auth Method
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-200 rounded-tr-lg">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center">
                        <div className="flex justify-center items-center gap-2 text-gray-500 dark:text-gray-400">
                          <span className="loading loading-spinner loading-md"></span>
                          Loading users...
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {user.username}
                            {user?.role === "supertenant" && (
                              <span className="badge badge-warning badge-xs">
                                SUPER
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {user.displayName || "-"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                          {user.email || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`badge capitalize ${
                              user?.role === "supertenant"
                                ? "badge-warning"
                                : user?.role === "owner"
                                ? "badge-primary text-white"
                                : "badge-ghost"
                            }`}
                          >
                            {user?.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`badge text-xs font-semibold px-2 py-1 rounded-full ${
                              user.authMethod === "ldap"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {user.authMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setCurrentUser(user);
                                handleEdit(user);
                                setIsEditMode(true);
                              }}
                              className="btn btn-ghost btn-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 tooltip"
                              data-tip="Edit User"
                              disabled={
                                user?.role === "supertenant" &&
                                currentUser?.role !== "supertenant"
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  user?.role === "supertenant" ||
                                  (user.authMethod === "ldap" &&
                                    user?.role === "owner")
                                ) {
                                  toast.error(
                                    "Menghapus user authMethod= 'LDAP' tidak berdampak apa-apa, disable user di LDAP"
                                  );
                                } else {
                                  setCurrentUser(user);
                                  document
                                    .getElementById("confirm-delete")
                                    .showModal();
                                }
                              }}
                              className="btn btn-ghost btn-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 tooltip"
                              data-tip="Delete User"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada user yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <dialog id="confirm-delete" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Konfirmasi!</h3>
            <p className="py-4">Apakah anda yakin menghapus user ini?</p>
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn">Batal</button>
                <button
                  className="btn btn-error"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(currentUser);
                  }}
                >
                  Ya, Hapus
                </button>
              </form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </PengelolaSideBarMenu>
  );
}
