import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from 'chart.js'
import { Line, Doughnut, Bar, Radar, PolarArea } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
)

// Sample data for comprehensive overview
const overviewData = {
  // Employee Statistics
  employeeStats: {
    total: 1245,
    present: 1197,
    absent: 48,
    onLeave: 35,
    newHires: 28,
    resigned: 8,
    terminated: 3,
    onProbation: 12
  },
  
  // Level-wise breakdown
  levelBreakdown: {
    Worker: 850,
    Staff: 320,
    Management: 75
  },
  
  // Department breakdown
  departmentBreakdown: {
    'Cutting': 180,
    'Sewing': 450,
    'Finishing': 220,
    'Quality Control': 120,
    'Management': 75,
    'HR & Admin': 60,
    'Finance': 40,
    'IT': 30,
    'Maintenance': 70
  },
  
  // Attendance data
  attendanceData: {
    present: 1197,
    absent: 48,
    late: 25,
    onLeave: 35,
    attendanceRate: 96.1
  },
  
  // Overtime data
  overtimeData: {
    totalHours: 785,
    totalPayment: 235500,
    byDepartment: {
      'Cutting': 156,
      'Sewing': 342,
      'Finishing': 198,
      'Quality Control': 89
    }
  },
  
  // Extra overtime data
  extraOvertimeData: {
    totalHours: 244,
    totalPayment: 97600,
    byDepartment: {
      'Cutting': 45,
      'Sewing': 98,
      'Finishing': 67,
      'Quality Control': 34
    }
  },
  
  // Payroll data
  payrollData: {
    totalSalary: 48230000,
    basicSalary: 38584000,
    allowances: 9656000,
    overtime: 235500,
    extraOvertime: 97600,
    bonuses: 387500,
    penalties: 125000
  },
  
  // Monthly trends
  monthlyTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    headcount: [1180, 1205, 1220, 1235, 1240, 1245, 1250, 1245, 1255, 1260, 1265, 1270],
    payroll: [420000, 415000, 430000, 440000, 450000, 455000, 470000, 482300, 475000, 480000, 485000, 490000],
    overtime: [720, 680, 750, 780, 800, 785, 790, 785, 800, 810, 820, 830]
  },
  
  // Performance metrics
  performanceData: {
    averageRating: 4.2,
    topPerformers: 45,
    needsImprovement: 12,
    byDepartment: {
      'Cutting': 4.1,
      'Sewing': 4.3,
      'Finishing': 4.0,
      'Quality Control': 4.4,
      'Management': 4.5
    }
  },
  
  // Asset data
  assetData: {
    totalAssets: 1250,
    assigned: 1180,
    unassigned: 70,
    underMaintenance: 25,
    byCategory: {
      'Machinery': 450,
      'Computers': 200,
      'Furniture': 300,
      'Vehicles': 50,
      'Tools': 250
    }
  },
  
  // Leave data
  leaveData: {
    casual: 45,
    sick: 12,
    maternity: 5,
    earned: 25,
    short: 18,
    withoutPay: 8
  }
}

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-BD', { 
    style: 'currency', 
    currency: 'BDT', 
    maximumFractionDigits: 0 
  }).format(amount)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num)
}

const getPercentage = (part, total) => {
  return total > 0 ? ((part / total) * 100).toFixed(1) : 0
}

// Chart configurations
const chartColors = {
  primary: '#f97316',
  secondary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#8b5cf6',
  light: '#f3f4f6'
}

export default function Overview() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedView, setSelectedView] = useState('overview')

  const StatCard = ({ title, value, change, icon, color, subtitle }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change > 0 ? '↗' : '↘'} {Math.abs(change)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">vs last month</span>
        </div>
      )}
    </div>
  )

  const MetricCard = ({ title, value, trend, color = 'blue' }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
        {trend && (
          <div className={`text-${color}-500 text-sm font-medium`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Comprehensive view of your organization's HR metrics and performance</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedView('overview')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'overview' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setSelectedView('analytics')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'analytics' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={formatNumber(overviewData.employeeStats.total)}
          change={2.1}
          icon="👥"
          color="blue"
          subtitle="Active workforce"
        />
        <StatCard
          title="Present Today"
          value={formatNumber(overviewData.employeeStats.present)}
          change={-0.8}
          icon="✅"
          color="green"
          subtitle={`${overviewData.attendanceData.attendanceRate}% attendance rate`}
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(overviewData.payrollData.totalSalary)}
          change={1.5}
          icon="💰"
          color="yellow"
          subtitle="Total salary disbursement"
        />
        <StatCard
          title="Overtime Hours"
          value={formatNumber(overviewData.overtimeData.totalHours)}
          change={3.2}
          icon="⏰"
          color="purple"
          subtitle={`৳${formatNumber(overviewData.overtimeData.totalPayment)} total payment`}
        />
      </div>

      {/* Employee Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Level Distribution</h3>
          <Doughnut
            data={{
              labels: ['Worker', 'Staff', 'Management'],
              datasets: [{
                data: [
                  overviewData.levelBreakdown.Worker,
                  overviewData.levelBreakdown.Staff,
                  overviewData.levelBreakdown.Management
                ],
                backgroundColor: [chartColors.primary, chartColors.secondary, chartColors.info],
                borderWidth: 0,
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0)
                      const percentage = ((context.parsed / total) * 100).toFixed(1)
                      return `${context.label}: ${context.parsed} (${percentage}%)`
                    }
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Headcount</h3>
          <Bar
            data={{
              labels: Object.keys(overviewData.departmentBreakdown),
              datasets: [{
                label: 'Employees',
                data: Object.values(overviewData.departmentBreakdown),
                backgroundColor: chartColors.primary,
                borderRadius: 6,
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: chartColors.light } }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Department</h3>
          <Radar
            data={{
              labels: Object.keys(overviewData.performanceData.byDepartment),
              datasets: [{
                label: 'Performance Rating',
                data: Object.values(overviewData.performanceData.byDepartment),
                backgroundColor: 'rgba(249, 115, 22, 0.2)',
                borderColor: chartColors.primary,
                borderWidth: 2,
                pointBackgroundColor: chartColors.primary,
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 5,
                  grid: { color: chartColors.light },
                  ticks: { stepSize: 1 }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Attendance & Overtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Headcount Trend</h3>
          <Line
            data={{
              labels: overviewData.monthlyTrends.labels,
              datasets: [{
                label: 'Total Employees',
                data: overviewData.monthlyTrends.headcount,
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: chartColors.light } }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overtime vs Extra Overtime</h3>
          <Bar
            data={{
              labels: Object.keys(overviewData.overtimeData.byDepartment),
              datasets: [
                {
                  label: 'Regular Overtime',
                  data: Object.values(overviewData.overtimeData.byDepartment),
                  backgroundColor: chartColors.primary,
                  borderRadius: 4,
                },
                {
                  label: 'Extra Overtime',
                  data: Object.values(overviewData.extraOvertimeData.byDepartment),
                  backgroundColor: chartColors.info,
                  borderRadius: 4,
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: chartColors.light } }
              }
            }}
          />
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Absent Today"
          value={overviewData.employeeStats.absent}
          trend={-15}
          color="red"
        />
        <MetricCard
          title="On Leave"
          value={overviewData.employeeStats.onLeave}
          trend={8}
          color="yellow"
        />
        <MetricCard
          title="New Hires"
          value={overviewData.employeeStats.newHires}
          trend={12}
          color="green"
        />
        <MetricCard
          title="Resigned"
          value={overviewData.employeeStats.resigned}
          trend={-25}
          color="red"
        />
      </div>

      {/* Payroll & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payroll Breakdown</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Basic Salary</span>
              <span className="font-semibold">{formatCurrency(overviewData.payrollData.basicSalary)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Allowances</span>
              <span className="font-semibold">{formatCurrency(overviewData.payrollData.allowances)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overtime</span>
              <span className="font-semibold text-blue-600">{formatCurrency(overviewData.payrollData.overtime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Extra Overtime</span>
              <span className="font-semibold text-purple-600">{formatCurrency(overviewData.payrollData.extraOvertime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bonuses</span>
              <span className="font-semibold text-green-600">{formatCurrency(overviewData.payrollData.bonuses)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Penalties</span>
              <span className="font-semibold text-red-600">-{formatCurrency(overviewData.payrollData.penalties)}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Payroll</span>
              <span className="text-green-600">{formatCurrency(overviewData.payrollData.totalSalary)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Management</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Assets</span>
              <span className="font-semibold">{formatNumber(overviewData.assetData.totalAssets)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Assigned</span>
              <span className="font-semibold text-green-600">{formatNumber(overviewData.assetData.assigned)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Unassigned</span>
              <span className="font-semibold text-yellow-600">{formatNumber(overviewData.assetData.unassigned)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Under Maintenance</span>
              <span className="font-semibold text-red-600">{formatNumber(overviewData.assetData.underMaintenance)}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Assets by Category</h4>
            <div className="space-y-2">
              {Object.entries(overviewData.assetData.byCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{category}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leave & Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Distribution</h3>
          <PolarArea
            data={{
              labels: Object.keys(overviewData.leaveData),
              datasets: [{
                data: Object.values(overviewData.leaveData),
                backgroundColor: [
                  'rgba(249, 115, 22, 0.8)',
                  'rgba(59, 130, 246, 0.8)',
                  'rgba(16, 185, 129, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(139, 92, 246, 0.8)',
                  'rgba(239, 68, 68, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#fff'
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed} employees`
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{overviewData.performanceData.averageRating}</div>
              <div className="text-sm text-gray-600 mt-1">Average Performance Rating</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${
                    i < Math.floor(overviewData.performanceData.averageRating) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`}>
                    ★
                  </span>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{overviewData.performanceData.topPerformers}</div>
                <div className="text-sm text-green-700">Top Performers</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{overviewData.performanceData.needsImprovement}</div>
                <div className="text-sm text-red-700">Need Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-blue-700">Generate Reports</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium text-green-700">Add Employee</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm font-medium text-purple-700">Process Payroll</div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium text-orange-700">Manage Leave</div>
          </button>
        </div>
      </div>
    </div>
  )
}


