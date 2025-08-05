import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DepartmentApi from "../api/DepartmentApi";
import { getAllAccount } from "../api/authApi";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import toast, { Toaster } from "react-hot-toast";
import { FolderSearch, Pencil, Plus, Trash2 } from "lucide-react";

const DepartmentManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const modalRef = React.useRef(null);

  const { data: departments, isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: DepartmentApi.getAllDepartment,
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getAllAccount,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: DepartmentApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries("departments");
      modalRef.current.close();
      window.location.reload();
    },
    onError: (er) => {
      toast.error(
        er?.response?.data?.message +
          `: ${er?.response?.data?.usedMembers.map((u) => u.username)}` ||
          "Gagal register"
      );
    },
  });

  const { mutateAsync: editDepartmentMutation } = useMutation({
    mutationFn: async ({ id, data }) => await DepartmentApi.edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries("departments");
      modalRef.current.close();
      window.location.reload();
    },
    onError: (er) => {
      toast.error(
        er?.response?.data?.message +
          `: ${er?.response?.data?.usedMembers.map((u) => u.username)}` ||
          "Gagal register"
      );
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: DepartmentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries("departments");
    },
  });

  const handleCreate = () => {
    setSelectedDepartment(null);
    setName("");
    setMembers([]);
    modalRef.current.showModal();
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setName(department.name);
    setMembers(department.members.map((m) => m._id));
    modalRef.current.showModal();
  };

  const handleDelete = (id) => {
    deleteDepartmentMutation.mutate(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const departmentData = { name, members };
    if (selectedDepartment) {
      editDepartmentMutation({
        id: selectedDepartment._id,
        data: departmentData,
      });
    } else {
      createDepartmentMutation.mutate(departmentData);
    }
  };

  const handleCheckboxChange = (userId) => {
    setMembers((prevMembers) =>
      prevMembers.includes(userId)
        ? prevMembers.filter((id) => id !== userId)
        : [...prevMembers, userId]
    );
  };

  if (isLoadingDepartments || isLoadingUsers) {
    return (
      <div className="flex w-full justify-center items-center min-h-screen">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <PengelolaSideBarMenu>
      <div className="container mx-auto p-4 md:p-8 lg:p-12">
        {/* Department Management Card */}
        <div className="card bg-base-100 shadow-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6 flex-wrap">
            <h1 className="text-3xl font-extrabold text-gray-800">
              Department Management
            </h1>
            <button
              onClick={handleCreate}
              className="btn btn-primary text-white rounded-lg btn-md md:btn-lg transform transition-transform duration-200 hover:scale-105 shadow-lg"
            >
              <Plus />
              Create New Department
            </button>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Head */}
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Members
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments?.data?.map((department) => (
                    <tr
                      key={department._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {department.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {department.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {department.members.slice(0, 3).map((member, idx) => (
                            <span
                              key={member._id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {member.username}
                            </span>
                          ))}
                          {department.members.length > 3 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{department.members.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(department)}
                            className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                          >
                            <Pencil className="h-4 w-4 mr-1.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(department._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                          >
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Empty State */}
                  {departments?.data?.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FolderSearch className="h-12 w-12 text-gray-400 mb-3" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            No departments found
                          </h3>
                          <p className="text-sm text-gray-500">
                            Create your first department to get started
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Create/Edit Department */}
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
          <Toaster /> {/* Assuming Toaster is for notifications */}
          <div className="modal-box p-6 sm:p-8 bg-white rounded-lg shadow-2xl">
            <h3 className="font-bold text-2xl text-gray-800 mb-4 ">
              {selectedDepartment ? "Edit Department" : "Create New Department"}
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Department Name Input */}
              <div className="form-control mb-4">
                <label className="label" htmlFor="name">
                  <span className="label-text text-gray-700 font-medium">
                    Department Name
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Marketing, Engineering"
                  required
                />
              </div>

              {/* Members Checkboxes */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    Select Members
                  </span>
                </label>
                <div className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-gray-50">
                  {users?.data?.map((user) => (
                    <label
                      key={user._id}
                      className="label cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors duration-150"
                    >
                      <span className="label-text text-gray-800">
                        {user.username}
                      </span>
                      <input
                        type="checkbox"
                        checked={members.includes(user._id)}
                        onChange={() => handleCheckboxChange(user._id)}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  ))}
                  {/* Optional: No users message */}
                  {users?.data?.length === 0 && (
                    <span className="text-center text-gray-500 py-2">
                      No users available to add.
                    </span>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="modal-action mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="btn btn-ghost btn-outline transform transition-transform duration-200 hover:scale-105"
                  onClick={() => modalRef.current.close()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary  transform transition-transform duration-200 hover:scale-105 text-white rounded-md"
                >
                  {selectedDepartment ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    </PengelolaSideBarMenu>
  );
};

export default DepartmentManagement;
