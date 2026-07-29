import React from "react";
import { useLocation, useNavigate } from "react-router";
import {
  HomeIcon,
  UserCheck,
  ShoppingCartIcon,
  ArrowDownUp,
} from "lucide-react";
import { useUserInfo } from "../store";
import { motion } from "motion/react";

const SideDrawer = ({ children }) => {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();

  const menuItem = [
    {
      name: "Home",
      icon: <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/",
      color: "cyan",
    },
    {
      name: "New Request",
      icon: <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/request",
      color: "emerald",
    },
    {
      name: "Process",
      icon: <ArrowDownUp className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/process",
      color: "blue",
    },
    {
      name: "Profile",
      icon: <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
      path: "/profile",
      color: "amber",
    },
  ];

  const location = useLocation();

  return (
    <div className="flex flex-col h-screen bg-[#07090e] text-white selection:bg-cyan-500/30">
      <div className="relative flex flex-col h-screen w-full overflow-hidden">
        {/* Global Dark Background - Kept subtle so it doesn't overpower pages that have their own animated background */}
        <div className="absolute inset-0 bg-[#07090e] -z-10" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf808_1px,transparent_1px)] bg-[size:30px_30px] -z-10" />

        {/* Main content container */}
        <div className="relative h-full w-full overflow-y-auto custom-scrollbar z-0">{children}</div>
      </div>

      {/* Bottom Navigation Bar */}
      {userInfo && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-slate-950/80 backdrop-blur-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50">
          <div className="flex justify-around items-center h-16 sm:h-20 px-2 max-w-7xl mx-auto relative">
            {/* Top Border Glow for the navbar */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {menuItem.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/");
              
              // Color mapping for active states
              const activeColorClass = 
                item.color === 'cyan' ? 'text-cyan-400' :
                item.color === 'emerald' ? 'text-emerald-400' :
                item.color === 'blue' ? 'text-blue-400' :
                'text-amber-400';
                
              const bgGlowClass = 
                item.color === 'cyan' ? 'bg-cyan-400' :
                item.color === 'emerald' ? 'bg-emerald-400' :
                item.color === 'blue' ? 'bg-blue-400' :
                'bg-amber-400';

              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className="relative flex flex-col items-center justify-center w-full h-full group py-2"
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className={`absolute top-0 w-8 h-1 ${bgGlowClass} rounded-b-full shadow-[0_2px_10px_currentColor]`}
                    />
                  )}
                  
                  <div className={`
                    transition-all duration-300 relative z-10 flex flex-col items-center
                    ${isActive ? activeColorClass + ' -translate-y-1' : 'text-slate-500 group-hover:text-slate-300'}
                  `}>
                    {isActive && (
                      <div className={`absolute inset-0 blur-md opacity-40 ${bgGlowClass} rounded-full`} />
                    )}
                    <span className="relative z-10 mb-1">
                      {item.icon}
                    </span>
                    <span className={`text-[10px] sm:text-xs font-bold tracking-wider transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                      {item.name}
                    </span>
                  </div>
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
