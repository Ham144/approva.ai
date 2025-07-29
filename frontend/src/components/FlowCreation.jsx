import { getAllAccount } from "@/api/authApi";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ModalCreateSourceData from "./ModalCreateSourceData";
import InputItem from "./InputItem";
import { AlignLeft, Heading, Info, Trash, Lock } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useEditor } from "../store";
import DepartmentApi from "@/api/DepartmentApi";

export default function FlowCreation() {
  const { setCurrentEditingInputID, flow, setFlow } = useEditor();

  const { data: userList } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await getAllAccount();
      return res;
    },
  });

  const handleAddStatus = () => {
    const newStatus = {
      title: "",
      desc: "",
      authorized: [],
      requirements: [],
      isPrivateAuthorized: false,
      privateAuthorizedUser: [],
    };
    setFlow((prev) => ({ ...prev, status: [...prev?.status, newStatus] }));
  };

  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: DepartmentApi.getAllDepartment,
  });

  const handleStatusChange = (index, field, value) => {
    const newStatusList = [...flow.status];
    newStatusList[index][field] = value;
    setFlow({ ...flow, status: newStatusList });
  };

  const handleAddRequirement = (statusIndex) => {
    const newRequirement = {
      _id: uuidv4(),
      title: "",
      help: "",
      tipe: "text",
      sourceData: null,
      isNullable: false,
    };
    const newStatusList = [...flow.status];
    newStatusList[statusIndex]?.requirements.push(newRequirement);
    setFlow({ ...flow, status: newStatusList });
  };

  const handleAddAuthorizedUser = (statusIndex, userId) => {
    setFlow((prev) => {
      const updatedStatus = prev.status?.map((stat, i) => {
        if (i !== statusIndex) return stat;

        // Tambahkan userId ke array authorized jika belum ada
        const updatedAuthorized = stat.authorized.includes(userId)
          ? stat.authorized
          : [...stat.authorized, userId];

        return {
          ...stat,
          authorized: updatedAuthorized,
          authorizedSearch: "",
        };
      });

      return { ...prev, status: updatedStatus };
    });
  };

  const handleRemoveAuthorizedUser = (statusIndex, userId) => {
    const newStatusList = [...flow.status];
    newStatusList[statusIndex].authorized = newStatusList[
      statusIndex
    ].authorized.filter((id) => id !== userId);
    setFlow({ ...flow, status: newStatusList });
  };

  function updateInputRequest(index, newInput) {
    if (newInput.tipe == "helper") {
      newInput.isNullable = true;
    }
    setFlow((prevFlow) => {
      const updatedRequests = [...prevFlow.request];
      updatedRequests[index] = newInput;
      return {
        ...prevFlow,
        request: updatedRequests,
      };
    });
  }

  function addNewInputRequest() {
    setFlow((prevFlow) => ({
      ...prevFlow,
      request: [
        ...prevFlow?.request,
        {
          _id: uuidv4(),
          title: "",
          tipe: "text",
          sourceData: null,
          isNullable: false,
        },
      ],
    }));
  }

  const updateRequirement = (statusIndex, reqIndex, newReq) => {
    if (newReq.tipe == "helper") {
      newReq.isNullable = true;
    }
    setFlow((prev) => {
      const updatedStatuses = [...prev.status];
      const updatedReqs = [...updatedStatuses[statusIndex]?.requirements];
      updatedReqs[reqIndex] = newReq;
      updatedStatuses[statusIndex] = {
        ...updatedStatuses[statusIndex],
        requirements: updatedReqs,
      };
      return { ...prev, status: updatedStatuses };
    });
  };

  console.log(flow);

  useEffect(() => {
    function init() {
      setFlow();
      const temporaryFlow = JSON.parse(localStorage.getItem("temporaryFlow"));
      if (temporaryFlow && typeof temporaryFlow === "object") {
        setFlow(temporaryFlow);
      }
    }
    init();
  }, []);

  return (
    <div className="space-y-6 flex flex-col overflow-y-auto h-[95vh]  pr-2 overflow-x-hidden">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-5 transition-all duration-300">
        {/* Bagian Header / Divider yang Dipercantik */}
        <div className="flex items-center justify-center gap-3 text-lg font-semibold text-gray-700 dark:text-gray-300 relative">
          <span className="absolute left-0 right-0 h-px bg-gray-200 dark:bg-gray-700 z-0"></span>
          <span className="bg-white dark:bg-gray-800 px-4 z-10 flex items-center gap-2">
            <Info size={20} className="text-blue-500" /> Properti Alur
          </span>
        </div>

        <div className="space-y-4">
          {/* Input Judul Alur */}
          <div className="form-control w-full">
            <label htmlFor="flow-title" className="label">
              <span className="label-text text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                <Heading size={18} /> Judul Alur
              </span>
            </label>
            <input
              id="flow-title"
              className="input input-bordered w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="misal: Alur Persetujuan Dokumen, Proses Onboarding Karyawan Baru"
              value={flow?.title || ""}
              onChange={(e) => setFlow({ ...flow, title: e.target.value })}
            />
          </div>

          {/* Textarea Deskripsi Alur */}
          <div className="form-control w-full">
            <label htmlFor="flow-description" className="label">
              <span className="label-text text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                <AlignLeft size={18} /> Deskripsi Alur
              </span>
            </label>
            <textarea
              id="flow-description"
              className="textarea textarea-bordered w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 min-h-[90px] resize-y"
              placeholder="Jelaskan tujuan alur ini secara singkat, misal: Alur ini digunakan untuk persetujuan dokumen-dokumen penting sebelum diarsipkan."
              value={flow?.desc || ""}
              onChange={(e) => setFlow({ ...flow, desc: e.target.value })}
              rows="3" // Default rows for better initial height
            />
          </div>

          {/* Checkbox spesial department/division Request */}
          <div className="form-control w-full">
            <label className="label cursor-pointer justify-between pr-0">
              <div
                className="tooltip tooltip-right flex items-center gap-2 text-gray-700 dark:text-gray-300"
                data-tip="Jika Mode ini diaktifkan, maka hanya user yg terdaftar di divisi itu yang bisa memulai request."
              >
                <span className="label-text font-medium flex items-center gap-2">
                  <Lock size={18} /> Mode isAllowanceModeRequest
                </span>
                <button
                  className="btn btn-xs btn-ghost btn-circle text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 ml-1"
                  aria-label="Informasi Alur Privat"
                >
                  ?
                </button>
              </div>

              <input
                type="checkbox"
                checked={flow?.isAllowanceModeRequest || false}
                className="checkbox checkbox-primary bg-gray-200 dark:bg-gray-600 border-gray-400 dark:border-gray-500"
                onChange={(e) =>
                  setFlow({ ...flow, isAllowanceModeRequest: e.target.checked })
                }
              />
            </label>
          </div>

          {flow.isAllowanceModeRequest && (
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-gray-700 font-medium">
                  Select Department
                </span>
              </label>
              <div className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-gray-50">
                {departments?.data?.map((dep) => (
                  <label
                    key={dep._id}
                    className="label cursor-pointer p-2 rounded-md hover:bg-blue-50 transition-colors duration-150"
                  >
                    <span className="label-text text-gray-800">{dep.name}</span>
                    <input
                      type="checkbox"
                      checked={flow.allowedDepartmentToRequest?.includes(
                        dep._id.toString()
                      )}
                      onChange={() => {
                        setFlow((prevFlow) => {
                          const current = Array.isArray(
                            prevFlow?.allowedDepartmentToRequest
                          )
                            ? prevFlow?.allowedDepartmentToRequest
                            : [];

                          const depId = dep._id.toString();
                          const next = current.includes(depId)
                            ? current.filter((id) => id !== depId)
                            : [...current, depId];

                          return {
                            ...prevFlow,
                            allowedDepartmentToRequest: next,
                          };
                        });
                      }}
                      className="checkbox checkbox-primary"
                    />
                  </label>
                ))}
                {/* Optional: No users message */}
                {departments?.data?.length === 0 && (
                  <span className="text-center text-gray-500 py-2">
                    No departments available to add.
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="divider">Flow Request</div>
      {/* REQUEST */}
      <div className="flex flex-col gap-3 ">
        {flow.request?.map((input, requestIdx) => (
          <div onClick={() => setCurrentEditingInputID(input._id)}>
            <InputItem
              key={input._id}
              index={requestIdx}
              input={input}
              onChange={(newInput) => {
                updateInputRequest(requestIdx, newInput);
              }}
              setSourceData={() => {}}
              deleteInput={() => {
                setFlow((prevFlow) => {
                  if (!prevFlow.request) return prevFlow;
                  const updatedRequests = [...prevFlow.request];
                  updatedRequests.splice(requestIdx, 1);
                  return {
                    ...prevFlow,
                    request: updatedRequests,
                  };
                });
              }}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addNewInputRequest}
        className="btn rounded-lg btn-sm mx-auto w-full  my-3"
      >
        + Tambah Input
      </button>
      <div className="divider">Flow Status</div>
      <div className="flex flex-col gap-2 p-6 bg-gradient-to-r from-blue-300 to to-blue-500 rounded-lg">
        {flow.status?.map((stat, i) => (
          <div
            key={stat?._id || i}
            className="border  p-4 mb-4 glass rounded-lg"
          >
            <div className="flex justify-between">
              <h2 className="font-bold">{stat.title || `Status #${i + 1}`}</h2>
              <button
                onClick={() => {
                  const isConfirm = window.confirm(
                    "Are You Sure To Delete This Process?"
                  );
                  if (isConfirm) {
                    setFlow((prev) => {
                      const updatedStatuses = [...prev.status];
                      updatedStatuses.splice(i, 1);
                      return { ...prev, status: updatedStatuses };
                    });
                  }
                }}
                className="btn hover:bg-red-400 rounded-lg"
              >
                <Trash size={30} />
              </button>
            </div>
            <input
              className="border p-2 w-full mt-2 rounded-lg"
              placeholder="Nama status"
              value={stat.title}
              onChange={(e) => handleStatusChange(i, "title", e.target.value)}
            />
            <textarea
              className="border p-2 w-full mt-2 rounded"
              placeholder="Penjelasan status"
              value={stat.desc}
              onChange={(e) => handleStatusChange(i, "desc", e.target.value)}
            />

            {/* Authorized User */}
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Siapa yang mengerjakan proses ini?"
                className="border rounded p-2 w-full mb-2"
                value={stat.authorizedSearch || ""}
                onChange={(e) =>
                  handleStatusChange(i, "authorizedSearch", e.target.value)
                }
              />
              {stat.authorizedSearch && (
                <div className="absolute z-50 bg-white shadow rounded w-full max-h-60 overflow-y-auto">
                  {userList?.data
                    ?.filter(
                      (user) =>
                        user.username
                          ?.toLowerCase()
                          .includes(stat.authorizedSearch.toLowerCase()) &&
                        !stat.authorized.includes(user._id)
                    )
                    .slice(0, 5)
                    ?.map((user) => (
                      <div
                        key={user._id}
                        className="cursor-pointer p-2 hover:bg-gray-200 rounded"
                        onClick={() => handleAddAuthorizedUser(i, user._id)}
                      >
                        <span className="font-medium">{user.username}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({user._id})
                        </span>
                      </div>
                    ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {stat.authorized?.map((userId) => {
                  const user = userList?.data?.find((u) => u._id === userId);
                  return (
                    <div
                      key={userId}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1"
                    >
                      <span>
                        {user?.displayName || user?.username || "Unknown"}
                      </span>
                      <button
                        onClick={() => handleRemoveAuthorizedUser(i, userId)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requirement input */}
            <div className="space-y-4 mt-4 overflow-x-hidden">
              {stat?.requirements?.map((inputReq, inputIdx) => (
                <div
                  key={inputIdx}
                  onClick={() => setCurrentEditingInputID(inputReq._id)}
                  className="bg-gray-100 p-4 rounded-xl shadow-sm border"
                >
                  {/* InputItemRequirement tunggal */}
                  <InputItem
                    index={inputIdx}
                    input={inputReq}
                    onChange={(newInput) =>
                      updateRequirement(i, inputIdx, newInput)
                    }
                    deleteInput={() => {
                      setFlow((prevFlow) => {
                        const updatedStatus = [...prevFlow.status];
                        const updatedRequirements = [
                          ...updatedStatus[i].requirements,
                        ];

                        updatedRequirements.splice(inputIdx, 1);
                        updatedStatus[i] = {
                          ...updatedStatus[i],
                          requirements: updatedRequirements,
                        };

                        return {
                          ...prevFlow,
                          status: updatedStatus,
                        };
                      });
                    }}
                  />
                </div>
              ))}
            </div>

            <button
              className="mt-4 bg-green-500 text-white px-3 py-1 rounded"
              onClick={() => handleAddRequirement(i)}
            >
              + Add Requirement
            </button>
          </div>
        ))}

        <button
          className="hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddStatus}
        >
          + Add Status
        </button>
      </div>
      <ModalCreateSourceData />
    </div>
  );
}
