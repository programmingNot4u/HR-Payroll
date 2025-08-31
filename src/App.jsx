

import { useState, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Overview from './pages/Overview'
import Reports from './pages/Reports'
import EmployeeDashboard from './pages/EmployeeDashboard'
import AddEmployee from './pages/AddEmployee'
import EmployeeDetails from './pages/EmployeeDetails'
import LeaveRequest from './pages/LeaveRequest'
import SalaryPayslips from './pages/SalaryPayslips'
import DailyAttendance from './pages/DailyAttendance'
import Timesheet from './pages/Timesheet'
import CompanyInfo from './pages/settings/CompanyInfo'
import PayrollPolicies from './pages/settings/PayrollPolicies'
import LeavePolicies from './pages/settings/LeavePolicies'
import NotificationSettings from './pages/settings/NotificationSettings'
import AssetInventory from './pages/AssetInventory'
import AssignAsset from './pages/AssignAsset'
import AssetReturn from './pages/AssetReturn'
import AssetMaintenance from './pages/AssetMaintenance'
import AuditLog from './pages/AuditLog'
import UserRoles from './pages/UserRoles'
import Permissions from './pages/Permissions'
import AccessControl from './pages/AccessControl'
import Policies from './pages/Policies'
import Contracts from './pages/Contracts'
import EmployeeDocuments from './pages/EmployeeDocuments'
import Templates from './pages/Templates'
import NoticesAnnouncements from './pages/NoticesAnnouncements'
import Events from './pages/Events'
import Holidays from './pages/Holidays'
import TrainingSessions from './pages/TrainingSessions'
import GoalsKPIs from './pages/GoalsKPIs'
import Appraisals from './pages/Appraisals'
import Feedback from './pages/Feedback'
import Promotions from './pages/Promotions'
import JobOpenings from './pages/JobOpenings'
import Candidates from './pages/Candidates'
import InterviewSchedule from './pages/InterviewSchedule'
import Onboarding from './pages/Onboarding'
import BonusesPenalties from './pages/DeductionsBenefits'

function App() {
  const [selectedItem, setSelectedItem] = useState('Overview')

  // HR Admin Dashboard
  const Content = useMemo(() => {
    switch (selectedItem) {
      case 'Overview':
        return <Overview />
      case 'Reports':
        return <Reports />
      case 'Employee Dashboard':
        return <EmployeeDashboard />
                  case 'Employee Details':
              return <EmployeeDetails />
            case 'Add Employee':
              return <AddEmployee />
            case 'Leave Requests':
              return <LeaveRequest />
      case 'Salary & Payslips':
        return <SalaryPayslips />
      case 'Daily Attendance':
        return <DailyAttendance />
      case 'Timesheets':
        return <Timesheet />
      case 'Company Info':
        return <CompanyInfo />
      case 'Payroll Policies':
        return <PayrollPolicies />
      case 'Leave Policies':
        return <LeavePolicies />
      case 'Notification Settings':
        return <NotificationSettings />
      case 'Asset Inventory':
        return <AssetInventory />
      case 'Assign Asset':
        return <AssignAsset />
      case 'Asset Return':
        return <AssetReturn />
      case 'Maintenance':
        return <AssetMaintenance />
      case 'Audit Log':
        return <AuditLog />
      case 'User Roles':
        return <UserRoles />
      case 'Permissions':
        return <Permissions />
      case 'Access Control':
        return <AccessControl />
      case 'Policies':
        return <Policies />
      case 'Contracts':
        return <Contracts />
      case 'Employee Documents':
        return <EmployeeDocuments />
      case 'Templates':
        return <Templates />
      case 'Notices & Announcements':
        return <NoticesAnnouncements />
      case 'Events':
        return <Events />
      case 'Holidays':
        return <Holidays />
      case 'Training Sessions':
        return <TrainingSessions />
      case 'Goals & KPIs':
        return <GoalsKPIs />
      case 'Appraisals':
        return <Appraisals />
      case 'Feedback':
        return <Feedback />
      case 'Promotions':
        return <Promotions />
      case 'Job Openings':
        return <JobOpenings />
      case 'Candidates':
        return <Candidates />
      case 'Interview Schedule':
        return <InterviewSchedule />
      case 'Onboarding':
        return <Onboarding />
      case 'Bonuses & Penalties':
        return <BonusesPenalties />
      default:
        return (
          <div>
            <h1 className="text-2xl font-semibold mb-4">{selectedItem}</h1>
            <p className="mt-1 text-gray-700">Content coming soon.</p>
          </div>
        )
    }
  }, [selectedItem])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 pt-14">
        <Sidebar selectedItem={selectedItem} onSelect={setSelectedItem} />
        <main className="flex-1 p-6 ml-72 overflow-y-auto">
          {Content}
        </main>
      </div>
    </div>
  )
}

export default App
