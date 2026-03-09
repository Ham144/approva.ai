import { useQuery } from "@tanstack/react-query";
import React, {  useState, useEffect, useCallback } from "react";
import { months } from "@/components/My-Stats";
import flowInstanceApi from "@/api/flowInstanceApi";
import { useUserInfo } from "@/store";
import DepartmentApi from "@/api/DepartmentApi";
import OrgApi from "@/api/orgApi";
import PengelolaSideBarMenu from "@/components/PengelolasSideBarMenu";


const DepartmentStatistics = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const { userInfo } = useUserInfo();

  // State untuk filter (untuk supertenant)
  const [selectedOrgId, setSelectedOrgId] = useState(userInfo?.org || "");
  const [selectedDeptId, setSelectedDeptId] = useState(userInfo?.department?._id || "");

  // Query untuk departments dan organizations (hanya untuk supertenant)
  const isSupertenant = userInfo?.role === "supertenant";
  

  const getDateRange = useCallback(() => {
    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(selectedYear, selectedMonth + 1, 0);
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  }, [selectedYear, selectedMonth]);

  // Queries for supertenant
  const { data: organizations } = useQuery({
    queryKey: ['organizations'],
    queryFn: OrgApi.getAllOrg,
    enabled: isSupertenant
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: DepartmentApi.getAllDepartment,
    enabled: isSupertenant
  });

  // Main query for department stats
  const { data: departmentStats, isLoading } = useQuery({
    queryKey: ["departmentStats", selectedYear, selectedMonth, selectedOrgId, selectedDeptId],
    queryFn: async () => {
      const { startDate, endDate } = getDateRange();
      
      const params = {
        orgId: selectedOrgId,
        startDate,
        endDate,
      };
      
      // Only add departmentId if not "all"
      if (selectedDeptId && selectedDeptId !== "all") {
        params.departmendId = selectedDeptId;
      }
      
      const response = await flowInstanceApi.getDepartmentStats(params);
      console.log('Response:', response);
      return response;
    },
    enabled: !!selectedOrgId && (!isSupertenant || !!selectedDeptId)
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

  
  useEffect(() => {
    if (userInfo) {
      setSelectedOrgId(userInfo.org);
      if (!isSupertenant && userInfo.department?._id) {
        setSelectedDeptId(userInfo.department._id);
      }
    }
  }, [userInfo, isSupertenant]);

  // Loading state
  if (isLoading) {
    return (
      <PengelolaSideBarMenu>
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
      </PengelolaSideBarMenu>
    );
  }

  // No data state
  if (!departmentStats) {
    return (
      <PengelolaSideBarMenu>
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <p className="text-center text-gray-500">Tidak ada data statistik</p>
        </div>
      </PengelolaSideBarMenu>
    );
  }

  const stats = departmentStats;

  return (
    <PengelolaSideBarMenu>
      <div className="relative pb-20 min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        {/* Header dengan judul dan filter bulan */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
            Statistik Departemen
          </h1>

          {/* Dropdown bulan dan tahun */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="relative">
              {/* Dropdown bulan dan tahun */}
<div className="flex items-center space-x-2">
  <button
    onClick={handlePrevMonth}
    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </button>

  <div className="relative">
    <button
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center space-x-2 hover:bg-gray-50"
    >
      <span className="font-medium">
        {/* Perbaikan: ambil label dari object bulan */}
        {months.find(m => m.value === selectedMonth)?.label || months[selectedMonth]?.label} {selectedYear}
      </span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {isDropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
        <div className="p-2">
          {months.map((month) => (
            <button
              key={month.value}
              onClick={() => handleMonthSelect(month.value)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                selectedMonth === month.value
                  ? "bg-blue-50 text-blue-600"
                  : "hover:bg-gray-50"
              }`}
            >
              {month.label}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>

  <button
    onClick={handleNextMonth}
    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    {months.map((month, index) => (
                      <button
                        key={index}
                        onClick={() => handleMonthSelect(index)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          selectedMonth === index
                            ? "bg-blue-50 text-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter untuk supertenant: pilih organisasi dan departemen */}
        {isSupertenant && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organisasi
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Organisasi</option>
                {organizations?.data?.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.organizationName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departemen
              </label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Pilih Departemen</option>
                {departments?.data?.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Tampilkan data statistik */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">QTY Request</p>
              <p className="text-2xl font-bold text-blue-700">{stats["QTY request"] || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">QTY Approved & Reject</p>
              <p className="text-2xl font-bold text-green-700">{stats["QTY approved&reject"] || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Pending Di Saya</p>
              <p className="text-2xl font-bold text-yellow-700">{stats["Pending Di Saya"] || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">QTY All</p>
              <p className="text-2xl font-bold text-purple-700">{stats["QTY AlL"] || 0}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Nama:</span> {stats.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Aktivitas Terakhir:</span> {stats.tanggalAktifitasTerakhir} {stats.jamAktifitasTerakhir}
            </p>
          </div>
        </div>

        {/* Debug: tampilkan JSON jika perlu (opsional) */}
        {/* <code className="block mt-4 p-4 bg-gray-100 rounded text-xs">
          {JSON.stringify(stats, null, 2)}
        </code> */}
      </div>
    </PengelolaSideBarMenu>
  );
};

export default DepartmentStatistics;