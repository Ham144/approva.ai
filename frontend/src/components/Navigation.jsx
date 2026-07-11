import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  HomeIcon,
  UserCheck,
  ShoppingCartIcon,
  ArrowDownUp,
} from "lucide-react";

import { useUserInfo } from "../store";

const SideDrawer = ({ children }) => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  const menuItem = [
    {
      name: "Home",
      icon: <HomeIcon className="w-6 h-6" />,
      path: "/",
    },
    {
      name: "New Request",
      icon: <ShoppingCartIcon className="w-6 h-6" />,
      path: "/request",
    },
    {
      name: "process",
      icon: <ArrowDownUp className="w-6 h-6" />,
      path: "/process",
    },
    {
      name: "Profile",
      icon: <UserCheck className="w-6 h-6" />,
      path: "/profile",
    },
  ];

  const location = useLocation();

  return (
    <div className="flex flex-col h-screen">
      <div className="relative flex flex-col h-screen w-full overflow-hidden">
        {/* Main background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50" />

        {/* Animated floating elements */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-medium animation-delay-2000" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-fast animation-delay-4000" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-slow animation-delay-6000" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f610_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Light reflection effect */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />

        {/* Main content container */}
        <div className="relative h-full w-full overflow-y-auto">{children}</div>
      </div>

      {/* Bottom Navigation Bar */}
      {userInfo && (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-white/50 backdrop-blur-sm shadow-lg z-50">
          <div className="flex justify-around items-center h-16 px-2">
            {menuItem.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                    isActive
                      ? "text-primary"
                      : "text-base-content/60 hover:text-primary"
                  }`}
                >
                  {item.icon}
                  <span className="text-xs mt-1 font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideDrawer;
