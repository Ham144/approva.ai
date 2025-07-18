import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DepartmentApi from "../api/DepartmentApi";
import { getAllAccount } from "../api/authApi";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";
import toast, { Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";
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
    },
    onError: (er) => {
      toast.error(
        er?.response?.data?.message +
          `: ${er?.response?.data?.usedMembers.map((u) => u.username)}` ||
          "Gagal register"
      );
    },
  });

  const editDepartmentMutation = useMutation({
    mutationFn: ({ id, data }) => DepartmentApi.edit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries("departments");
      modalRef.current.close();
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
      editDepartmentMutation.mutate({
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
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="table table-zebra w-full">
              {/* Table Head */}
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {departments?.data?.map((department) => (
                  <tr
                    key={department._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 text-gray-700 font-medium">
                      {department.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {department.members
                        .map((member) => member.username)
                        .join(", ")}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(department)}
                        className="btn btn-sm btn-outline btn-info mr-2 transform transition-transform duration-200 hover:scale-105"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(department._id)}
                        className="btn btn-sm btn-error transform transition-transform duration-200 hover:scale-105"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Optional: No data message */}
                {departments?.data?.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                      No departments found. Create one to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  className="btn btn-primary  transform transition-transform duration-200 hover:scale-105"
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
