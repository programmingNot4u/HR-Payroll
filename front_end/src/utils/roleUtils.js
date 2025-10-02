// Role-based access control utilities
import authService from "../services/authService";

export const ROLES = {
  SUPER_ADMIN: "super_admin",
  HR_MANAGER: "hr_manager",
  HR_STAFF: "hr_staff",
  DEPARTMENT_HEAD: "department_head",
  EMPLOYEE: "employee",
};

export const PERMISSIONS = {
  VIEW_ALL_EMPLOYEES: "view_all_employees",
  EDIT_EMPLOYEES: "edit_employees",
  DELETE_EMPLOYEES: "delete_employees",
  VIEW_ORGANIZATIONAL_DATA: "view_organizational_data",
  EDIT_ORGANIZATIONAL_DATA: "edit_organizational_data",
  VIEW_PAYROLL: "view_payroll",
  EDIT_PAYROLL: "edit_payroll",
  VIEW_ATTENDANCE: "view_attendance",
  EDIT_ATTENDANCE: "edit_attendance",
  VIEW_RECRUITMENT: "view_recruitment",
  EDIT_RECRUITMENT: "edit_recruitment",
  VIEW_PERFORMANCE: "view_performance",
  EDIT_PERFORMANCE: "edit_performance",
  VIEW_ASSETS: "view_assets",
  EDIT_ASSETS: "edit_assets",
  VIEW_SETTINGS: "view_settings",
  EDIT_SETTINGS: "edit_settings",
};

// Role-based permissions mapping
const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // Super Admin has all permissions
  [ROLES.HR_MANAGER]: [
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.EDIT_EMPLOYEES,
    PERMISSIONS.VIEW_ORGANIZATIONAL_DATA,
    PERMISSIONS.EDIT_ORGANIZATIONAL_DATA,
    PERMISSIONS.VIEW_PAYROLL,
    PERMISSIONS.EDIT_PAYROLL,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.EDIT_ATTENDANCE,
    PERMISSIONS.VIEW_RECRUITMENT,
    PERMISSIONS.EDIT_RECRUITMENT,
    PERMISSIONS.VIEW_PERFORMANCE,
    PERMISSIONS.EDIT_PERFORMANCE,
    PERMISSIONS.VIEW_ASSETS,
    PERMISSIONS.EDIT_ASSETS,
    PERMISSIONS.VIEW_SETTINGS,
    PERMISSIONS.EDIT_SETTINGS,
  ],
  [ROLES.HR_STAFF]: [
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.EDIT_EMPLOYEES,
    PERMISSIONS.VIEW_ORGANIZATIONAL_DATA,
    PERMISSIONS.EDIT_ORGANIZATIONAL_DATA,
    PERMISSIONS.VIEW_PAYROLL,
    PERMISSIONS.EDIT_PAYROLL,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.EDIT_ATTENDANCE,
    PERMISSIONS.VIEW_RECRUITMENT,
    PERMISSIONS.EDIT_RECRUITMENT,
    PERMISSIONS.VIEW_PERFORMANCE,
    PERMISSIONS.EDIT_PERFORMANCE,
    PERMISSIONS.VIEW_ASSETS,
    PERMISSIONS.EDIT_ASSETS,
  ],
  [ROLES.DEPARTMENT_HEAD]: [
    PERMISSIONS.VIEW_ALL_EMPLOYEES,
    PERMISSIONS.VIEW_ORGANIZATIONAL_DATA,
    PERMISSIONS.VIEW_PAYROLL,
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.EDIT_ATTENDANCE,
    PERMISSIONS.VIEW_PERFORMANCE,
    PERMISSIONS.EDIT_PERFORMANCE,
    PERMISSIONS.VIEW_ASSETS,
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.VIEW_ALL_EMPLOYEES, // Can view employee details (including their own)
  ],
};

// Check if current user has a specific permission
export const hasPermission = (permission) => {
  const userRole = authService.getUserRole();
  if (!userRole) return false;

  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

// Check if current user has any of the specified permissions
export const hasAnyPermission = (permissions) => {
  return permissions.some((permission) => hasPermission(permission));
};

// Check if current user has all of the specified permissions
export const hasAllPermissions = (permissions) => {
  return permissions.every((permission) => hasPermission(permission));
};

// Get accessible pages based on user role
export const getAccessiblePages = () => {
  const userRole = authService.getUserRole();

  if (!userRole) return [];

  const allPages = {
    // Super Admin pages
    "Employee Dashboard": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Add Employee": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    "Employee Details": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Salary Payslips": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Advance From Accounts": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
    ],
    "Deductions & Benefits": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
    ],
    "Daily Attendance": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    Holidays: [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    "Leave Policies": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    "Leave Request": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    Timesheet: [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    Candidates: [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    "Job Openings": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    KPI: [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Asset Inventory": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    Maintenance: [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Asset Return": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Asset Tracker": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Assign Asset": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    Overview: [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    Reports: [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "Access Control": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER],
    "Audit Log": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER],
    "Company Info": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    "Legal Documents": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    "Notices & Announcements": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
    ],
    "Notification Settings": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
    ],
    "Organizational Metrics": [
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
    ],
    Permissions: [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER],
    Policies: [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER, ROLES.HR_STAFF],
    "User Roles": [ROLES.SUPER_ADMIN, ROLES.HR_MANAGER],

    // Employee pages
    "Employee Portal": [
      ROLES.EMPLOYEE,
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "My Profile": [
      ROLES.EMPLOYEE,
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "My Payslips": [
      ROLES.EMPLOYEE,
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
    "My Attendance": [
      ROLES.EMPLOYEE,
      ROLES.SUPER_ADMIN,
      ROLES.HR_MANAGER,
      ROLES.HR_STAFF,
      ROLES.DEPARTMENT_HEAD,
    ],
  };

  return Object.keys(allPages).filter((page) =>
    allPages[page].includes(userRole)
  );
};

// Check if a specific page is accessible to current user
export const canAccessPage = (pageName) => {
  const accessiblePages = getAccessiblePages();
  return accessiblePages.includes(pageName);
};

// Check if user is admin or HR
export const isAdminOrHR = () => {
  const role = authService.getUserRole();
  return ["super_admin", "hr_manager", "hr_staff"].includes(role);
};

// Check if user is manager or above
export const isManagerOrAbove = () => {
  const role = authService.getUserRole();
  return ["super_admin", "hr_manager", "hr_staff", "department_head"].includes(
    role
  );
};

// Check if user is employee
export const isEmployee = () => {
  const role = authService.getUserRole();
  return role === "employee";
};

export default {
  ROLES,
  PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isAdminOrHR,
  isManagerOrAbove,
  isEmployee,
  getAccessiblePages,
  canAccessPage,
};
