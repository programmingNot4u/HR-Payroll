

import { useState, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Overview from './pages/1.Dashborad/Overview'
import Reports from './pages/1.Dashborad/Reports'
import EmployeeDashboard from './pages/2.Employees/EmployeeDashboard'
import AddEmployee from './pages/2.Employees/AddEmployee'
import EmployeeDetails from './pages/2.Employees/EmployeeDetails'
import EmployeePortal from './pages/2.Employees/EmployeePortal'

import SalaryPayslips from './pages/3.Payroll/SalaryPayslips'
import Payslip from './pages/3.Payroll/Payslip'
import DeductionsBenefits from './pages/3.Payroll/DeductionsBenefits'
import DailyAttendance from './pages/4.Attendance/DailyAttendance'
import Timesheet from './pages/4.Attendance/Timesheet'
import LeaveRequest from './pages/4.Attendance/LeaveRequest'
import Holidays from './pages/4.Attendance/Holidays'
import LeavePolicies from './pages/4.Attendance/LeavePolicies'
import JobOpenings from './pages/5.Recruitment/JobOpenings'
import Candidates from './pages/5.Recruitment/Candidates'
import InterviewSchedule from './pages/5.Recruitment/InterviewSchedule'
import Onboarding from './pages/5.Recruitment/Onboarding'
import Appraisals from './pages/5.Recruitment/Appraisals'
import GoalsKPIs from './pages/6.Performance/GoalsKPIs'
import Feedback from './pages/6.Performance/Feedback'
import Promotions from './pages/6.Performance/Promotions'
import AssetInventory from './pages/7.Assets/AssetInventory'
import AssignAsset from './pages/7.Assets/AssignAsset'
import AssetReturn from './pages/7.Assets/AssetReturn'
import AssetMaintenance from './pages/7.Assets/AssetMaintenance'
import CompanyInfo from './pages/10.CompanyPolicies/CompanyInfo'
import Events from './pages/10.CompanyPolicies/Events'
import NoticesAnnouncements from './pages/10.CompanyPolicies/NoticesAnnouncements'
import PayrollPolicies from './pages/10.CompanyPolicies/PayrollPolicies'
import Policies from './pages/10.CompanyPolicies/Policies'
import TrainingSessions from './pages/10.CompanyPolicies/TrainingSessions'
import AuditLog from './pages/9.AuditLog/AuditLog'
import NotificationSettings from './pages/11.Settings/NotificationSettings'
import Templates from './pages/11.Settings/Templates'

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
      case 'Employee Portal':
        return <EmployeePortal />

      case 'Salary & Payslips':
        return <SalaryPayslips />
      case 'Bonuses & Penalties':
        return <DeductionsBenefits />
      case 'Daily Attendance':
        return <DailyAttendance />
      case 'Timesheets':
        return <Timesheet />
      case 'Leave Requests':
        return <LeaveRequest />
      case 'Holidays':
        return <Holidays />
      case 'Leave Policies':
        return <LeavePolicies />
      case 'Job Openings':
        return <JobOpenings />
      case 'Candidates':
        return <Candidates />
      case 'Interview Schedule':
        return <InterviewSchedule />
      case 'Onboarding':
        return <Onboarding />
      case 'Appraisals':
        return <Appraisals />
      case 'Goals & KPIs':
        return <GoalsKPIs />
      case 'Feedback':
        return <Feedback />
      case 'Promotions':
        return <Promotions />
      case 'Asset Inventory':
        return <AssetInventory />
      case 'Assign Asset':
        return <AssignAsset />
      case 'Asset Return':
        return <AssetReturn />
      case 'Maintenance':
        return <AssetMaintenance />
      case 'Notices & Announcements':
        return <NoticesAnnouncements />
      case 'Events':
        return <Events />
      case 'Training Sessions':
        return <TrainingSessions />
      case 'Company Info':
        return <CompanyInfo />
      case 'Payroll Policies':
        return <PayrollPolicies />
      case 'Policies':
        return <Policies />
      case 'Audit Log':
        return <AuditLog />

      case 'Notification Settings':
        return <NotificationSettings />
      case 'Templates':
        return <Templates />
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
