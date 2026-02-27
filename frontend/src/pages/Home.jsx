import React from "react";
import {
  Package,
  History,
  Crown,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { APP_DESC } from "@/api/constant";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "@/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import flowInstanceApi from "@/api/flowInstanceApi";
import OrgApi from "@/api/orgApi";
import { switchOrg } from "@/api/authApi";
import toast from "react-hot-toast";
import MyStats from "@/components/My-Stats";

const Home = () => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  const { data: orgList } = useQuery({
    queryKey: ["orgList"],
    queryFn: () => OrgApi.getAllOrg("*"),
    enabled: !!userInfo._id,
  });

  const { mutateAsync: handleSwitchOrg, isPending: switching } = useMutation({
    mutationKey: ["userInfo"],
    mutationFn: async (id) => switchOrg({ targetOrg: id }),
    onSuccess: async () => {
      window.location.reload();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Terjadi kesalahan");
    },
  });

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

  if (switching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-ring w-28 loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="relative pb-20 min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      {/* Background only */}
      <div className="max-w-7xl mx-auto max-w-screen overflow-hidden z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-medium text-gray-600">
              LIVE 2.0.0
            </span>
            <span className="text-xs font-medium text-gray-600">
              OPTIMIZED ✅
            </span>
          </div>
          <h1 className="text-3xl font-semibold bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 text-transparent mb-2">
            E-Form
            {
              orgList?.data?.find((org) => org._id === userInfo.org)
                ?.organizationName
            }
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{APP_DESC}</p>
        </div>
        <MyStats />

        {/* My Tasks Section - Enhanced Modern Table */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Tugas Untuk Anda
              </h2>
              <p className="text-sm text-gray-500">
                Daftar permintaan yang membutuhkan persetujuan Anda
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-800">
                  {myTasksQuery?.data?.length || 0} Pending
                </span>
              </div>

              <div className="relative group w-full md:w-72">
                <select
                  onChange={(e) => handleSwitchOrg(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl bg-white/95 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer font-medium text-gray-700 appearance-none"
                >
                  {orgList?.data?.map((org) => (
                    <option
                      selected={org._id === userInfo?.org}
                      key={org._id}
                      value={org._id}
                    >
                      {org?.organizationName}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none transition-transform duration-300 group-hover:translate-y-0.5">
                  <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="absolute left-4 -top-2.5 px-1.5 text-xs font-medium bg-white text-gray-500 transition-all duration-300 group-focus-within:text-blue-600">
                  Organization
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid place-items-center h-48 rounded-xl bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-500">Memuat data...</span>
              </div>
            </div>
          ) : !myTasksQuery?.data?.length ? (
            <div className="p-8 glass rounded-xl border  text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="font-medium text-gray-800 mb-1">All caught up!</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Tidak ada tugas yang menunggu persetujuan Anda saat ini
              </p>
            </div>
          ) : (
            <div className="glass rounded-xl shadow-sm border border-gray-200 overflow-hidden bg-white">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="col-span-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </div>
                <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permintaan
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requestor
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Global Index
                </div>
                <div className="col-span-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-100">
                {myTasksQuery.data.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => navigate(`/status/fulfillment/${task._id}`)}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-blue-50/30 transition-colors cursor-pointer group"
                  >
                    {/* Tanggal */}
                    <div className="col-span-1">
                      <p className="text-xs text-gray-500">
                        {new Date(task.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(task.createdAt).toLocaleString("id-ID", {
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    {/* Permintaan */}
                    <div className="col-span-3">
                      <p className="font-medium text-gray-900 group-hover:text-blue-600 truncate">
                        {task.instanceTitle || "Untitled Request"}
                      </p>
                      <p className="text-xs text-gray-500 truncate flex-wrap text-wrap">
                        {task.flowTemplate?.title}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 ">
                        {task.currentStatusTitle}
                      </span>
                    </div>

                    {/* Requestor */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700 truncate">
                        {task.requestedByUsername}
                      </p>
                    </div>

                    {/* Global Index */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700">
                        {task.globalIndex}
                      </p>
                    </div>

                    {/* Template */}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-700 truncate">
                        {task.flowTemplateTitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions - Startup Style */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Aksi Cepat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 ">
            <button
              onClick={() => navigate("/management/flow")}
              className=" p-5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all text-left group hover:shadow-md bg-white"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg  transition-colors`}>
                  <Crown className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Organization Owner
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {userInfo?.displayName
                      ? userInfo?.displayName
                      : userInfo?.username}
                  </p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                    Owner Only
                  </span>
                </div>
              </div>
            </button>

            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className=" p-5 rounded-xl border border-gray-200 hover:border-blue-300 transition-all text-left group hover:shadow-md bg-white"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${action.color
                      .replace("bg-", "bg-")
                      .replace(
                        "text-",
                        "text-",
                      )} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}
                  >
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
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
