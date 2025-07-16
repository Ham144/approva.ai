import React from "react";
import { Package, History, Crown, CheckCircle } from "lucide-react";
import { APP_DESC } from "@/api/constant";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "@/store";
import { useQuery } from "@tanstack/react-query";
import flowInstanceApi from "@/api/flowInstanceApi";

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  const quickActions = [
    {
      title: "New Request",
      description: "Meminta request dengan kategory flow yang telah dibuat",
      icon: <Package className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-600",
      path: "/request",
    },
    {
      title: "Lihat Semua Request in-progress",
      description: "Lihat semua yang telah complete disini",
      icon: <History className="w-6 h-6" />,
      color: "bg-green-100 text-green-600",
      path: "/process?overallStatus=in-progress",
    },
  ];

  const { data: myTasksQuery, isLoading } = useQuery({
    queryKey: ["myTasks"],
    queryFn: flowInstanceApi.getMyTasks,
  });

  return (
    <div className={`min-h-screen bg-gray-50 px-4 py-28 `}>
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center ">
          <h1 className="text-2xl font-bold text-gray-800">
            Flexible Flow
            <span className="p-2 badge translate-y-[-8px]">BETA</span>
          </h1>
          <p className="text-sm text-gray-600">{APP_DESC}</p>
        </div>

        {/* My Tasks Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Tugas Untuk Anda</h2>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <span className="loading loading-ring loading-lg"></span>
            </div>
          ) : !myTasksQuery?.data?.length ? (
            <div className="alert alert-success badge-outline">
              <CheckCircle className="w-4 h-4" />
              <span>Tidak ada tugas yang menunggu. Kerja bagus!</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Judul Permintaan</th>
                      <th>Status Saat Ini</th>
                      <th>Direquest oleh</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myTasksQuery.data.map((task, index) => (
                      <tr
                        key={task._id}
                        onClick={() =>
                          navigate(`/status/fulfillment/${task._id}`)
                        }
                        className="cursor-pointer hover:bg-slate-100"
                      >
                        <td>{index + 1}</td>
                        <td>{task.instanceTitle}</td>
                        <td>
                          <span className="badge badge-warning">
                            {task.currentStatusTitle}
                          </span>
                        </td>
                        <td>{task.requestedByUsername}</td>
                        <td>
                          {new Date(task.createdAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* pengelola menu : */}
            <button
              onClick={() => navigate("/management/flow")}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full bg-blue-100 text-blue-600`}>
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Organization Owner Page</h3>
                  <p className="text-sm text-gray-600">{userInfo?.username}</p>
                </div>
              </div>
            </button>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${action.color}`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Home);
