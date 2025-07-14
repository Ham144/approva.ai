import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllAccount, updateUser } from "@/api/authApi";
import { toast } from "react-hot-toast";
import { Pencil, TrashIcon } from "lucide-react";

export default function UserManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    username: "",
    password: "",
    role: "driver",
    isDisabled: false,
  });
  const [errors, setErrors] = useState({});
  const queryClient = useQueryClient();

  const [selectedRoleCategory, setSelectedRoleCategory] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState([]);

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
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Gagal memperbarui user");
    },
  });

  const handleCloseDialog = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setFormData({
      _id: "",
      username: "",
      password: "",
      role: "driver",
      isDisabled: false,
    });
    setErrors({});
  };

  const handleEdit = (user) => {
    setIsEditMode(true);
    setFormData({
      _id: user._id,
      username: user.username,
      password: "", // Password kosong saat edit
      role: user.role,
      isDisabled: user.isDisabled,
    });
    setIsOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username) {
      newErrors.username = "Username diperlukan";
    }

    // Password validation hanya untuk create atau jika password diisi saat edit
    if (!isEditMode || (isEditMode && formData.password)) {
      if (!formData.password && !isEditMode) {
        newErrors.password = "Password diperlukan";
      } else if (formData.password) {
        const password = formData.password;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const isLongEnough = password.length >= 6;

        if (!isLongEnough) {
          newErrors.password = "Password harus lebih dari 6 karakter";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password;
      }
      handleUpdateUser(updateData);
    }
  };

  useEffect(() => {
    if (!users?.data) return;

    const filtered =
      selectedRoleCategory === "all"
        ? users?.data
        : users?.data?.filter(
            (user) =>
              user?.role?.toLowerCase() === selectedRoleCategory?.toLowerCase()
          );

    setFilteredUsers(filtered);
  }, [users?.data, selectedRoleCategory]);

  return (
    <PengelolaSideBarMenu>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>

        {/* Dialog */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {isEditMode && "Edit User"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control gap-y-3 gap-x-3">
                  <label className="label">
                    <span className="label-text">Username</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    className={`input input-bordered ${
                      errors.username ? "input-error" : ""
                    }`}
                    placeholder="Masukkan username"
                    disabled={isEditMode} // Username tidak bisa diubah saat edit
                  />
                  <input
                    type="email"
                    value={formData?.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`input input-bordered ${
                      errors.username ? "input-error" : ""
                    }`}
                    placeholder="Masukkan Email"
                  />

                  {errors.username && (
                    <span className="text-error text-sm mt-1">
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Role</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="select select-bordered"
                  >
                    <option value="user">User</option>
                    <option value="pengelola">Pengelola</option>
                  </select>
                </div>

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
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating
                      ? isEditMode
                        ? "Menyimpan..."
                        : "Membuat..."
                      : isEditMode
                      ? "Simpan"
                      : "Buat User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4">
          <table className="table w-full text-left table-auto">
            {/* Table Header */}
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider rounded-tl-lg">
                  No
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider rounded-tr-lg">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    <span className="loading loading-spinner loading-md text-blue-500 mr-2"></span>
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {index + 1}
                    </th>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                      {user.username}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200 capitalize">
                      {user.role}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge text-xs font-semibold px-2 py-1 rounded-full ${
                          user.isDisabled
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {user.isDisabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="btn btn-ghost btn-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 tooltip tooltip-top"
                          data-tip="Edit User"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="btn btn-ghost btn-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 tooltip tooltip-top"
                          data-tip="Delete User"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PengelolaSideBarMenu>
  );
}
