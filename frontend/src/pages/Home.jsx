import React, { useState } from "react";
import {
  Package,
  History,
  AlertCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Crown,
  X,
  Store,
  CheckCircle,
  Ban,
  Warehouse,
  Flower,
} from "lucide-react";
import { APP_DESC, APP_NAME } from "@/api/constant";
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

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: flowInstanceOnDuty, isPending: isLoadingReady } = useQuery({
    queryKey: ["flowInstanceOnDuty", page, limit],
    queryFn: async () => {
      const res = await flowInstanceApi.getFlowInstanceOnDuty({ page, limit });
      console.log(res);
      return res;
    },
  });

  return (
    <div className={`min-h-screen bg-gray-50 px-4 py-28 `}>
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="mb-6 text-center ">
          <h1 className="text-2xl font-bold text-gray-800">
            {APP_NAME}
            <span className="p-2 badge translate-y-[-8px]">BETA</span>
          </h1>
          <p className="text-sm text-gray-600">{APP_DESC}</p>
        </div>

        {/* status READY untuk driver  */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Tertunda dibagian anda</h2>
          {!flowInstanceOnDuty?.data?.length ? (
            <div className="alert alert-success badge-outline">
              <CheckCircle className="w-4 h-4" />
              <span>Tampaknya Belum Ada</span>
            </div>
          ) : (
            <div className="space-y-4">
              {isLoadingReady ? (
                <div className="flex justify-center py-6">
                  <span className="loading loading-ring loading-lg"></span>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full bg-white rounded-lg shadow">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Judul Permintaan</th>
                          <th>Dibuat Pada</th>
                          <th>Di request oleh</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flowInstanceOnDuty?.data?.map((item, index) => (
                          <tr
                            key={item._id}
                            onClick={() =>
                              navigate(`/status/fulfillment/${item._id}`)
                            }
                            className="cursor-pointer hover:bg-slate-100"
                          >
                            <td>{(page - 1) * limit + index + 1}</td>
                            <td>{item.instanceTitle}</td>
                            <td>
                              {new Date(item.createdAt).toLocaleString(
                                "id-ID",
                                {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                }
                              )}
                            </td>
                            <td>{item.requestedByUsername}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {flowInstanceOnDuty?.pages > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      <button
                        className="btn btn-sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 flex items-center">
                        Page {page} of {flowInstanceOnDuty.pages}
                      </span>
                      <button
                        className="btn btn-sm"
                        disabled={page >= flowInstanceOnDuty.pages}
                        onClick={() =>
                          setPage((p) =>
                            Math.min(flowInstanceOnDuty.pages, p + 1)
                          )
                        }
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
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
                  <h3 className="font-medium">Pengelola Page</h3>
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
