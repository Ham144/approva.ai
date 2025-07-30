import { CircleCheck, CircleCheckBig, FileCode, ListStart } from "lucide-react";
import React, { useState } from "react";

export const NavigasiCepat = ({ flow }) => {
  const [tabNavigation, setTabNavigation] = useState();

  return (
    <div className="w-52 flex-shrink-0 ">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-3 py-1.5 rounded-md border border-gray-200">
        Navigasi Cepat
      </div>
      <div className="sticky top-4 space-y-1 max-h-80 overflow-y-auto">
        {/* Header */}

        {/* Properti Flow */}
        <button
          className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
            tabNavigation === "properti"
              ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          }`}
          onClick={() => {
            setTabNavigation("properti");
            const section = document.getElementById("properti");
            section?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          <FileCode className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Properti Flow</span>
        </button>

        {/* Request Tabs */}
        {flow?.request.map((input, i) => (
          <button
            key={`request-${input?._id}`}
            className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
              tabNavigation === input?._id
                ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => {
              setTabNavigation(input?._id);
              const section = document.getElementById(input?._id);
              section?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <ListStart className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{input?.title || "??"}</span>
          </button>
        ))}

        {/* Status & Requirements Tabs */}
        {flow?.status.map((stat, i) => (
          <React.Fragment key={`status-${stat?._id}`}>
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                tabNavigation === stat?._id
                  ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`}
              onClick={() => {
                setTabNavigation(stat?._id);
                const section = document.getElementById(stat?._id);
                section?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <CircleCheckBig className="w-4 h-4 flex-shrink-0" />
              <span className="truncate"> {stat?.title || "??"}</span>
            </button>

            {/* Requirements */}
            {stat?.requirements?.map((require, j) => (
              <button
                key={`requirement-${require?._id}`}
                className={`w-2/3 text-left  px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ml-5 ${
                  tabNavigation === require?._id
                    ? "bg-blue-50 text-blue-600 border-l-2 border-blue-500 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                }`}
                onClick={() => {
                  setTabNavigation(require?._id);
                  const section = document.getElementById(require?._id);
                  section?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              >
                <CircleCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{require?.title || "???"}</span>
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
