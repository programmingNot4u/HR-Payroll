// front_end/src/App.jsx

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import EmployeeSidebar from "./components/EmployeeSidebar";
import Navbar from "./components/Navbar";
import { NotificationProvider } from "./contexts/NotificationContext";
import UnifiedLogin from "./pages/UnifiedLogin";
import authService from "./services/authService";
import { canAccessPage } from "./utils/roleUtils";

// Import all your existing page components
import Overview from "./pages/1.Dashborad/Overview";
import Reports from "./pages/1.Dashborad/Reports";
import AuditLog from "./pages/11.Settings/AuditLog";
import CompanyInfo from "./pages/11.Settings/CompanyInfo";
import LegalDocuments from "./pages/11.Settings/LegalDocuments";
import NoticesAnnouncements from "./pages/11.Settings/NoticesAnnouncements";
import NotificationSettings from "./pages/11.Settings/NotificationSettings";
import OrganizationalMetrics from "./pages/11.Settings/OrganizationalMetrics";
import Policies from "./pages/11.Settings/Policies";
import AddEmployee from "./pages/2.Employees/AddEmployee";
import EmployeeDashboard from "./pages/2.Employees/EmployeeDashboard";
import EmployeeDetails from "./pages/2.Employees/EmployeeDetails";
import EmployeePortal from "./pages/2.Employees/EmployeePortal";
import AdvanceFromAccounts from "./pages/3.Payroll/AdvanceFromAccounts";
import DeductionsBenefits from "./pages/3.Payroll/DeductionsBenefits";
import Payslip from "./pages/3.Payroll/Payslip";
import SalaryPayslips from "./pages/3.Payroll/SalaryPayslips";
import DailyAttendance from "./pages/4.Attendance/DailyAttendance";
import Holidays from "./pages/4.Attendance/Holidays";
import LeavePolicies from "./pages/4.Attendance/LeavePolicies";
import LeaveRequest from "./pages/4.Attendance/LeaveRequest";
import Timesheet from "./pages/4.Attendance/Timesheet";
import Candidates from "./pages/5.Recruitment/Candidates";
import JobOpenings from "./pages/5.Recruitment/JobOpenings";
import GoalsKPIs from "./pages/6.Performance/GoalsKPIs";
import AssetInventory from "./pages/7.Assets/AssetInventory";
import AssetMaintenance from "./pages/7.Assets/AssetMaintenance";
import AssetReturn from "./pages/7.Assets/AssetReturn";
import AssetTracker from "./pages/7.Assets/AssetTracker";
import AssignAsset from "./pages/7.Assets/AssignAsset";

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });

  const [userRole, setUserRole] = useState(() => {
    return authService.getUserRole();
  });

  const [loginType, setLoginType] = useState(() => {
    return localStorage.getItem("loginType") || "admin";
  });

  // Initialize selectedItem from localStorage or default based on role
  const [selectedItem, setSelectedItem] = useState(() => {
    const savedItem = localStorage.getItem("selectedPage");
    if (savedItem) return savedItem;

    // Set default based on role
    if (authService.isEmployee()) {
      return "Employee Portal";
    } else {
      return "Employee Dashboard";
    }
  });

  // Save selectedItem to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedPage", selectedItem);
  }, [selectedItem]);

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigateTo = (event) => {
      setSelectedItem(event.detail);
    };

    window.addEventListener("navigateTo", handleNavigateTo);
    return () => window.removeEventListener("navigateTo", handleNavigateTo);
  }, []);

  // Listen for authentication events
  useEffect(() => {
    const handleAdminLogin = () => {
      setIsAuthenticated(true);
      setUserRole(authService.getUserRole());
      setLoginType("admin");
      // Set default page for HR/Admin users
      setSelectedItem("Employee Dashboard");
    };

    const handleEmployeeLogin = () => {
      setIsAuthenticated(true);
      setUserRole(authService.getUserRole());
      setLoginType("employee");
      // Set default page for employees
      setSelectedItem("Employee Portal");
    };

    const handleLogout = () => {
      authService.logout();
      setIsAuthenticated(false);
      setUserRole(null);
      setLoginType("admin");
    };

    window.addEventListener("adminLogin", handleAdminLogin);
    window.addEventListener("employeeLogin", handleEmployeeLogin);
    window.addEventListener("adminLogout", handleLogout);
    window.addEventListener("employeeLogout", handleLogout);

    return () => {
      window.removeEventListener("adminLogin", handleAdminLogin);
      window.removeEventListener("employeeLogin", handleEmployeeLogin);
      window.removeEventListener("adminLogout", handleLogout);
      window.removeEventListener("employeeLogout", handleLogout);
    };
  }, []);

  // Logout function
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setLoginType("admin");
  };

  // Navigation function for notifications
  const handleNavigate = (page) => {
    setSelectedItem(page);
  };

  // Check for unread notifications (sample data - in real app this would come from API)
  const hasUnreadNotifications = true; // This would be calculated from actual notification data

  // Get the appropriate sidebar component based on user role
  const SidebarComponent = useMemo(() => {
    const userRole = authService.getUserRole();

    // If user is employee level, show EmployeeSidebar
    if (authService.isEmployee()) {
      return EmployeeSidebar;
    }

    // Otherwise show AdminSidebar (for HR/Manager level users)
    return AdminSidebar;
  }, []);

  // Content component based on selected item with role-based access control
  const Content = useMemo(() => {
    // Check if user has access to the selected page
    if (!canAccessPage(selectedItem)) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }

    switch (selectedItem) {
      case "Overview":
        return <Overview />;
      case "Reports":
        return <Reports />;
      case "Employee Dashboard":
        return <EmployeeDashboard />;
      case "Add Employee":
        return <AddEmployee />;
      case "Employee Details":
        return <EmployeeDetails />;
      case "Employee Portal":
        return <EmployeePortal />;
      case "My Profile":
        return <EmployeeDetails />;
      case "My Payslips":
        return <Payslip />;
      case "My Attendance":
        return <DailyAttendance />;
      case "Salary & Payslips":
        return <SalaryPayslips />;
      case "Overtime || Bonuses || Penalties":
        return <DeductionsBenefits />;
      case "Advance From Accounts":
        return <AdvanceFromAccounts />;
      case "Daily Attendance":
        return <DailyAttendance />;
      case "Timesheet":
        return <Timesheet />;
      case "Leave Management":
      case "Leave Request":
        return <LeaveRequest />;
      case "Holidays":
        return <Holidays />;
      case "Leave Policies":
        return <LeavePolicies />;
      case "Job Openings":
        return <JobOpenings />;
      case "Candidates":
        return <Candidates />;
      case "KPI":
        return <GoalsKPIs />;
      case "Asset Inventory":
        return <AssetInventory />;
      case "Assign Asset":
        return <AssignAsset />;
      case "Asset Return":
        return <AssetReturn />;
      case "Asset Tracker":
        return <AssetTracker />;
      case "Maintenance":
        return <AssetMaintenance />;
      case "Notices & Announcements":
        return <NoticesAnnouncements />;
      case "Company Info":
        return <CompanyInfo />;
      case "Legal Documents":
        return <LegalDocuments />;
      case "Policies":
      case "Company Policies":
        return <Policies />;
      case "Audit Log":
        return <AuditLog />;
      case "Notification Settings":
        return <NotificationSettings />;
      case "Organizational Metrics":
        return <OrganizationalMetrics />;
      case "Designations":
        return <OrganizationalMetrics />;
      case "Departments":
        return <OrganizationalMetrics />;
      case "Salary Grade Management":
        return <OrganizationalMetrics />;
      case "Skill Metrics":
        return <OrganizationalMetrics />;
      case "Process Expertise":
        return <OrganizationalMetrics />;
      default:
        return (
          <div>
            <h1 className="text-2xl font-semibold mb-4">{selectedItem}</h1>
            <p className="mt-1 text-gray-700">Content coming soon.</p>
          </div>
        );
    }
  }, [selectedItem]);

  // Show appropriate login page if not authenticated
  if (!isAuthenticated) {
    return (
      <NotificationProvider>
        <UnifiedLogin />
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar
          onLogout={handleLogout}
          onNavigate={handleNavigate}
          hasUnreadNotifications={hasUnreadNotifications}
          userRole={userRole}
          loginType={loginType}
        />
        <div className="flex flex-1 pt-14">
          <SidebarComponent
            selectedItem={selectedItem}
            onSelect={setSelectedItem}
            hasUnreadNotifications={hasUnreadNotifications}
          />
          <main className="flex-1 p-6 ml-72 overflow-y-auto">{Content}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default App;
