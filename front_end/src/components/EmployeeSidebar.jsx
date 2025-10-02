// front_end/src/components/EmployeeSidebar.jsx

import React from "react";
import { canAccessPage } from "../utils/roleUtils";

const EmployeeSidebar = ({
  selectedItem,
  onSelect,
  hasUnreadNotifications,
}) => {
  const menuItems = [
    {
      category: "Personal",
      items: [
        { name: "Employee Portal", icon: "🏠", path: "Employee Portal" },
        { name: "My Profile", icon: "��", path: "My Profile" },
        { name: "My Payslips", icon: "💰", path: "My Payslips" },
        { name: "My Attendance", icon: "📅", path: "My Attendance" },
        { name: "Leave Request", icon: "🏖️", path: "Leave Request" },
      ],
    },
    {
      category: "Company",
      items: [
        {
          name: "Notices & Announcements",
          icon: "📢",
          path: "Notices & Announcements",
        },
        { name: "Company Policies", icon: "📜", path: "Company Policies" },
      ],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => canAccessPage(item.path)),
    }))
    .filter((section) => section.items.length > 0);

  // Check if currently impersonating
  const isImpersonating = localStorage.getItem("isImpersonating") === "true";

  return (
    <div className="fixed left-0 top-14 h-full w-72 bg-white border-r border-gray-200 shadow-lg z-40 overflow-y-auto">
      {/* Impersonation Notice and Return Button */}
      {isImpersonating && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-700">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">
                Impersonating Employee
              </span>
            </div>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to return to your HR account?"
                  )
                ) {
                  // Restore HR session
                  const hrUser = JSON.parse(
                    localStorage.getItem("hrUser") || "{}"
                  );
                  const hrToken = localStorage.getItem("hrToken");
                  const hrLoginType = localStorage.getItem("hrLoginType");

                  // Clear employee session
                  localStorage.removeItem("employeeToken");
                  localStorage.removeItem("employeeUser");
                  localStorage.removeItem("employeeRefreshToken");

                  // Restore HR session
                  if (hrUser && hrToken && hrLoginType) {
                    localStorage.setItem("adminUser", JSON.stringify(hrUser));
                    localStorage.setItem("adminToken", hrToken);
                    localStorage.setItem("loginType", hrLoginType);

                    // Clear impersonation flags
                    localStorage.removeItem("isImpersonating");
                    localStorage.removeItem("impersonatedEmployeeId");
                    localStorage.removeItem("hrUser");
                    localStorage.removeItem("hrToken");
                    localStorage.removeItem("hrLoginType");

                    // Dispatch admin login event
                    window.dispatchEvent(new CustomEvent("adminLogin"));

                    alert("Successfully returned to HR account");
                  } else {
                    alert("Error restoring HR session. Please login again.");
                    window.location.reload();
                  }
                }
              }}
              className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 transition-colors">
              Return to HR
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-8">
          {filteredMenuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.category}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => onSelect(item.path)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selectedItem === item.path
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}>
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                    {hasUnreadNotifications &&
                      item.name === "Notices & Announcements" && (
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
