import flowInstanceApi from "@/api/flowInstanceApi";
import { useUserInfo } from "@/store";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Cell } from "jspdf-autotable";

// Daftar bulan dalam setahun
export const months = [
  { value: 0, label: "Januari" },
  { value: 1, label: "Februari" },
  { value: 2, label: "Maret" },
  { value: 3, label: "April" },
  { value: 4, label: "Mei" },
  { value: 5, label: "Juni" },
  { value: 6, label: "Juli" },
  { value: 7, label: "Agustus" },
  { value: 8, label: "September" },
  { value: 9, label: "Oktober" },
  { value: 10, label: "November" },
  { value: 11, label: "Desember" },
];

const MyStats = () => {
  const { userInfo } = useUserInfo();
;
const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Format date range untuk display
  const getDateRangeText = () => {
    const monthName = months.find((m) => m.value === selectedMonth)?.label;
    return `${monthName} ${selectedYear}`;
  };

  // Get my stats dengan filter bulan
  const { data: myStats, isLoading } = useQuery({
    queryKey: ["myStats", selectedMonth, selectedYear, userInfo],
    queryFn: async () => {
      // Buat date range untuk bulan yang dipilih
      const startDate = new Date(selectedYear, selectedMonth, 1);
      const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Hari terakhir bulan

      const filter = {
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      };

      return flowInstanceApi.getMyStats(filter);
    },
    enabled: !!userInfo,
  });

  // Handle month change
  const handleMonthSelect = (monthValue) => {
    setSelectedMonth(monthValue);
    setIsDropdownOpen(false);
  };

  // Handle previous month
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  // Handle next month
  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px] bg-gray-100 rounded"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-100 rounded"></div>
              <div className="h-20 bg-gray-100 rounded"></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-gray-100 rounded"></div>
                <div className="h-20 bg-gray-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!myStats) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <p className="text-center text-gray-500">Tidak ada data statistik</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Pie Chart Section */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {/* Header with Title and Month Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800">
              Statistik Tugas - {myStats.name || "User"}
            </h2>
            {myStats.tanggalAktifitasTerakhir && (
              <p className="text-sm text-gray-500">
                Terakhir aktif: {myStats.tanggalAktifitasTerakhir}{" "}
                {myStats.jamAktifitasTerakhir || ""}
              </p>
            )}
          </div>

          {/* Month Filter */}
          <div className="flex items-center gap-2">
            {/* Previous Month Button */}
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {/* Month Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 text-sm min-w-[160px] justify-between"
              >
                <span>📅</span>
                <span className="font-medium">{getDateRangeText()}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 p-2 z-50">
                  <div className="grid grid-cols-2 gap-1">
                    {months.map((month) => (
                      <button
                        key={month.value}
                        onClick={() => handleMonthSelect(month.value)}
                        className={`px-2 py-1.5 text-xs rounded hover:bg-blue-50 transition-colors ${
                          selectedMonth === month.value
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {month.label}
                      </button>
                    ))}
                  </div>

                  {/* Year selector */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <input
                      type="number"
                      value={selectedYear}
                      onChange={(e) =>
                        setSelectedYear(parseInt(e.target.value) || currentYear)
                      }
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                      min="2020"
                      max={currentYear + 5}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Next Month Button */}
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Bulan berikutnya"
              disabled={
                selectedYear === currentYear && selectedMonth === currentMonth
              }
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Request",
                      value: Number(myStats["QTY request"]) || 0,
                    },
                    {
                      name: "Approved & Reject",
                      value: Number(myStats["QTY approved&reject"]) || 0,
                    },
                    {
                      name: "Pending",
                      value: Number(myStats["Pending Di Saya"]) || 0,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                  }
                  labelLine={false}
                >
                  <Cell key="request" fill="#3B82F6" /> {/* Blue */}
                  <Cell key="approved" fill="#10B981" /> {/* Green */}
                  <Cell key="pending" fill="#F59E0B" /> {/* Orange */}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} tugas`, "Jumlah"]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Cards */}
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">Total QTY</span>
                <span className="text-2xl font-bold text-blue-700">
                  {Number(myStats["QTY AlL"]) || 0}
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-1">Semua tugas</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <span className="text-orange-700 font-medium">Pending</span>
                <span className="text-2xl font-bold text-orange-700">
                  {Number(myStats["Pending Di Saya"]) || 0}
                </span>
              </div>
              <p className="text-sm text-orange-600 mt-1">Tugas menunggu</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-sm text-gray-600">Request</span>
                <p className="text-xl font-semibold text-gray-800">
                  {Number(myStats["QTY request"]) || 0}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <span className="text-sm text-gray-600">Approved/Reject</span>
                <p className="text-xl font-semibold text-gray-800">
                  {Number(myStats["QTY approved&reject"]) || 0}
                </p>
              </div>
            </div>

            {/* Month Info */}
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Periode: {getDateRangeText()}</span>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Data diperbarui:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyStats;
