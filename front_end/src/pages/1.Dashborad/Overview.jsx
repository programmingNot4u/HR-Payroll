import { useState } from 'react'
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
  Filler,
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
  Filler,
)

// Sample data for comprehensive overview
const overviewData = {
  // Employee Statistics
  employeeStats: {
    total: 1170,
    present: 1122,
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
    Staff: 320
  },
  
  // Department breakdown
  departmentBreakdown: {
    'Cutting': 180,
    'Sewing': 450,
    'Finishing': 220,
    'Quality Control': 120,
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
  
  // Payroll data with monthly breakdowns
  payrollData: {
    totalSalary: 48230000,
    basicSalary: 38584000,
    allowances: 9656000,
    overtime: 235500,
    extraOvertime: 97600,
    bonuses: 387500,
    penalties: 125000,
    monthlyBreakdown: {
      'January': {
        basicSalary: 38584000,
        allowances: 9656000,
        overtime: 235500,
        extraOvertime: 97600,
        bonuses: 387500,
        penalties: 125000,
        totalSalary: 52000000
      },
      'February': {
        basicSalary: 39000000,
        allowances: 9800000,
        overtime: 240000,
        extraOvertime: 100000,
        bonuses: 400000,
        penalties: 130000,
        totalSalary: 53000000
      },
      'March': {
        basicSalary: 39500000,
        allowances: 9900000,
        overtime: 250000,
        extraOvertime: 105000,
        bonuses: 420000,
        penalties: 140000,
        totalSalary: 54000000
      },
      'April': {
        basicSalary: 40000000,
        allowances: 10000000,
        overtime: 260000,
        extraOvertime: 110000,
        bonuses: 450000,
        penalties: 150000,
        totalSalary: 55000000
      },
      'May': {
        basicSalary: 40500000,
        allowances: 10100000,
        overtime: 270000,
        extraOvertime: 115000,
        bonuses: 480000,
        penalties: 160000,
        totalSalary: 56000000
      },
      'June': {
        basicSalary: 41000000,
        allowances: 10200000,
        overtime: 280000,
        extraOvertime: 120000,
        bonuses: 500000,
        penalties: 170000,
        totalSalary: 57000000
      },
      'July': {
        basicSalary: 41500000,
        allowances: 10300000,
        overtime: 290000,
        extraOvertime: 125000,
        bonuses: 520000,
        penalties: 180000,
        totalSalary: 58000000
      },
      'August': {
        basicSalary: 42000000,
        allowances: 10400000,
        overtime: 300000,
        extraOvertime: 130000,
        bonuses: 540000,
        penalties: 190000,
        totalSalary: 59000000
      },
      'September': {
        basicSalary: 42500000,
        allowances: 10500000,
        overtime: 310000,
        extraOvertime: 135000,
        bonuses: 560000,
        penalties: 200000,
        totalSalary: 60000000
      },
      'October': {
        basicSalary: 43000000,
        allowances: 10600000,
        overtime: 320000,
        extraOvertime: 140000,
        bonuses: 580000,
        penalties: 210000,
        totalSalary: 61000000
      },
      'November': {
        basicSalary: 43500000,
        allowances: 10700000,
        overtime: 330000,
        extraOvertime: 145000,
        bonuses: 600000,
        penalties: 220000,
        totalSalary: 62000000
      },
      'December': {
        basicSalary: 44000000,
        allowances: 10800000,
        overtime: 340000,
        extraOvertime: 150000,
        bonuses: 620000,
        penalties: 230000,
        totalSalary: 63000000
      }
    }
  },
  
  // Monthly trends
  monthlyTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    headcount: [1105, 1130, 1145, 1160, 1165, 1170, 1175, 1170, 1180, 1185, 1190, 1195],
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
      'Quality Control': 4.4
    }
  },
  
  // Asset data
  assetData: {
    totalAssets: 1250,
    assigned: 1000,
    available: 150,
    maintenance: 50,
    damaged: 30,
    lost: 15,
    retired: 5
  },
  
  // Leave data
  leaveData: {
    casual: 45,
    sick: 12,
    maternity: 5,
    earned: 25,
    withoutPay: 8
  },
  
  // Daily attendance by level and department
  dailyAttendanceData: {
    byLevel: {
      'Worker': { present: 750, absent: 45, onLeave: 25, late: 15 },
      'Staff': { present: 280, absent: 15, onLeave: 8, late: 5 }
    },
    byDepartment: {
      'Cutting': { present: 165, absent: 10, onLeave: 5, late: 3 },
      'Sewing': { present: 420, absent: 20, onLeave: 10, late: 8 },
      'Finishing': { present: 200, absent: 12, onLeave: 8, late: 4 },
      'Quality Control': { present: 110, absent: 6, onLeave: 4, late: 2 },
      'HR & Admin': { present: 55, absent: 3, onLeave: 2, late: 1 },
      'Finance': { present: 35, absent: 2, onLeave: 1, late: 1 },
      'IT': { present: 28, absent: 1, onLeave: 1, late: 0 },
      'Maintenance': { present: 65, absent: 3, onLeave: 2, late: 1 }
    }
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


export default function Overview() {
  const [payrollFilter, setPayrollFilter] = useState({
    month: 'January',
    year: '2024'
  })

  // Get today's date in DD/MM/YYYY format
  const getTodayDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
  }

  const [overtimeFilter, setOvertimeFilter] = useState({
    date: getTodayDate(),
    month: '',
    year: ''
  })

  // Available years for payroll filter
  const availableYears = ['2023', '2024', '2025']
  const availableMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Get current payroll data based on filter
  const getCurrentPayrollData = () => {
    const monthData = overviewData.payrollData.monthlyBreakdown[payrollFilter.month]
    return monthData || overviewData.payrollData
  }





  const StatCard = ({ title, value, subtitle }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
    </div>
  )

  const MetricCard = ({ title, value }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-semibold text-gray-900">{value}</p>
        </div>
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
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <StatCard
          title="Active Employees"
          value={formatNumber(overviewData.employeeStats.total)}
          subtitle="Active workforce"
        />
        <StatCard
          title="Present Today"
          value={formatNumber(overviewData.employeeStats.present)}
          subtitle={`${overviewData.attendanceData.attendanceRate}% attendance rate`}
        />
        <StatCard
          title="On Leave"
          value={formatNumber(overviewData.employeeStats.onLeave)}
          subtitle="Employees on leave today"
        />
        <StatCard
          title="Absent"
          value={formatNumber(overviewData.employeeStats.absent)}
          subtitle="Employees absent today"
        />
        <StatCard
          title="Monthly Payroll"
          value={formatCurrency(overviewData.payrollData.totalSalary)}
          subtitle="Total salary disbursement"
        />
        <StatCard
          title="Overtime Hours"
          value={formatNumber(overviewData.overtimeData.totalHours)}
          subtitle={`৳${formatNumber(overviewData.overtimeData.totalPayment)} total payment`}
        />
      </div>

      {/* Employee Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Employee Distribution</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Interactive</span>
            </div>
          </div>
          <Doughnut
            data={{
              labels: ['Worker', 'Staff'],
              datasets: [{
                data: [
                  overviewData.levelBreakdown.Worker,
                  overviewData.levelBreakdown.Staff
                ],
                backgroundColor: [
                  'rgba(251, 146, 60, 0.8)',
                  'rgba(249, 115, 22, 0.8)'
                ],
                borderColor: [
                  'rgba(251, 146, 60, 1)',
                  'rgba(249, 115, 22, 1)'
                ],
                borderWidth: 3,
                hoverBackgroundColor: [
                  'rgba(251, 146, 60, 0.9)',
                  'rgba(249, 115, 22, 0.9)'
                ],
                hoverBorderWidth: 4,
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { 
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                      size: 14,
                      weight: 'bold'
                    }
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(59, 130, 246, 0.8)',
                  borderWidth: 2,
                  cornerRadius: 8,
                  callbacks: {
                    label: (context) => {
                      const total = context.dataset.data.reduce((a, b) => a + b, 0)
                      const percentage = ((context.parsed / total) * 100).toFixed(1)
                      return `${context.label}: ${context.parsed} employees (${percentage}%)`
                    }
                  }
                }
              },
              animation: {
                animateRotate: true,
                animateScale: true,
                duration: 2000,
                easing: 'easeInOutQuart'
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }}
          />
        </div>

        <div className="bg-gradient-to-br from-white to-green-50 rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Department Headcount</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Interactive</span>
            </div>
          </div>
          <Bar
            data={{
              labels: Object.keys(overviewData.departmentBreakdown),
              datasets: [{
                label: 'Employees',
                data: Object.values(overviewData.departmentBreakdown),
                backgroundColor: [
                  'rgba(251, 146, 60, 0.8)',
                  'rgba(249, 115, 22, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(234, 88, 12, 0.8)',
                  'rgba(194, 65, 12, 0.8)',
                  'rgba(154, 52, 18, 0.8)',
                  'rgba(120, 53, 15, 0.8)',
                  'rgba(90, 44, 12, 0.8)'
                ],
                borderColor: [
                  'rgba(251, 146, 60, 1)',
                  'rgba(249, 115, 22, 1)',
                  'rgba(245, 158, 11, 1)',
                  'rgba(234, 88, 12, 1)',
                  'rgba(194, 65, 12, 1)',
                  'rgba(154, 52, 18, 1)',
                  'rgba(120, 53, 15, 1)',
                  'rgba(90, 44, 12, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: [
                  'rgba(251, 146, 60, 0.9)',
                  'rgba(249, 115, 22, 0.9)',
                  'rgba(245, 158, 11, 0.9)',
                  'rgba(234, 88, 12, 0.9)',
                  'rgba(194, 65, 12, 0.9)',
                  'rgba(154, 52, 18, 0.9)',
                  'rgba(120, 53, 15, 0.9)',
                  'rgba(90, 44, 12, 0.9)'
                ],
                hoverBorderWidth: 3,
              }]
            }}
            options={{
              responsive: true,
              plugins: { 
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(16, 185, 129, 0.8)',
                  borderWidth: 2,
                  cornerRadius: 8,
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.y} employees`
                  }
                }
              },
              scales: {
                x: { 
                  grid: { display: false },
                  ticks: {
                    font: {
                      size: 11,
                      weight: 'bold'
                    }
                  }
                },
                y: { 
                  grid: { 
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false
                  },
                  beginAtZero: true,
                  ticks: {
                    stepSize: 50
                  }
                }
              },
              animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }}
          />
        </div>

        <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance by Department</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Interactive</span>
            </div>
          </div>
          <Radar
            data={{
              labels: Object.keys(overviewData.performanceData.byDepartment),
              datasets: [{
                label: 'Performance Rating',
                data: Object.values(overviewData.performanceData.byDepartment),
                backgroundColor: 'rgba(251, 146, 60, 0.3)',
                borderColor: 'rgba(251, 146, 60, 1)',
                borderWidth: 3,
                pointBackgroundColor: 'rgba(251, 146, 60, 1)',
                pointBorderColor: 'rgba(255, 255, 255, 1)',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(251, 146, 60, 1)',
                pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                pointHoverBorderWidth: 4,
                hoverBackgroundColor: 'rgba(251, 146, 60, 0.4)',
                hoverBorderColor: 'rgba(251, 146, 60, 1)',
                hoverBorderWidth: 4,
              }]
            }}
            options={{
              responsive: true,
              plugins: { 
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(139, 92, 246, 0.8)',
                  borderWidth: 2,
                  cornerRadius: 8,
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.r} rating`
                  }
                }
              },
              scales: {
                r: {
                  beginAtZero: true,
                  max: 5,
                  grid: { 
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1
                  },
                  angleLines: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1
                  },
                  ticks: { 
                    stepSize: 1,
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  },
                  pointLabels: {
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  }
                }
              },
              animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }}
          />
        </div>
      </div>

      {/* Attendance & Overtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Headcount Trend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Interactive</span>
            </div>
          </div>
          <Line
            data={{
              labels: overviewData.monthlyTrends.labels,
              datasets: [{
                label: 'Total Employees',
                data: overviewData.monthlyTrends.headcount,
                borderColor: 'rgba(251, 146, 60, 1)',
                backgroundColor: 'rgba(251, 146, 60, 0.2)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(251, 146, 60, 1)',
                pointBorderColor: 'rgba(255, 255, 255, 1)',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: 'rgba(251, 146, 60, 1)',
                pointHoverBorderColor: 'rgba(255, 255, 255, 1)',
                pointHoverBorderWidth: 4,
                hoverBackgroundColor: 'rgba(251, 146, 60, 0.3)',
                hoverBorderColor: 'rgba(251, 146, 60, 1)',
                hoverBorderWidth: 4,
              }]
            }}
            options={{
              responsive: true,
              plugins: { 
                legend: { display: false },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(249, 115, 22, 0.8)',
                  borderWidth: 2,
                  cornerRadius: 8,
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.y} employees`
                  }
                }
              },
              scales: {
                x: { 
                  grid: { display: false },
                  ticks: {
                    font: {
                      size: 11,
                      weight: 'bold'
                    }
                  }
                },
                y: { 
                  grid: { 
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false
                  },
                  beginAtZero: false,
                  min: 1100,
                  ticks: {
                    stepSize: 20
                  }
                }
              },
              animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }}
          />
      </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Attendance by Department</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Live Data</span>
            </div>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider group cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <span>Department</span>
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider group cursor-pointer hover:bg-green-100 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Present</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider group cursor-pointer hover:bg-red-100 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Absent</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider group cursor-pointer hover:bg-yellow-100 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span>On Leave</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider group cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <span>Total</span>
                      <svg className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(overviewData.dailyAttendanceData.byDepartment).map(([department, data]) => {
                  const total = data.present + data.absent + data.onLeave + data.late;
                  const attendanceRate = Math.round((data.present / total) * 100);
                  return (
                    <tr key={department} className="group hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 cursor-pointer transform hover:scale-105">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-gray-600 transition-colors"></div>
                          <span>{department}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold group-hover:text-green-700 transition-colors group-hover:scale-110 transform">
                        <div className="flex items-center space-x-2">
                          <span>{data.present}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${attendanceRate}%`}}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold group-hover:text-red-700 transition-colors group-hover:scale-110 transform">
                        {data.absent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold group-hover:text-yellow-700 transition-colors group-hover:scale-110 transform">
                        {data.onLeave}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 group-hover:text-gray-700 transition-colors group-hover:scale-110 transform">
                        <div className="flex items-center space-x-2">
                          <span>{total}</span>
                          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            ({attendanceRate}%)
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 font-bold hover:from-gray-100 hover:to-gray-200 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-pulse"></div>
                      <span>Total (Active)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold hover:text-green-700 transition-colors">
                    {Object.values(overviewData.dailyAttendanceData.byDepartment).reduce((sum, dept) => sum + dept.present, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-bold hover:text-red-700 transition-colors">
                    {Object.values(overviewData.dailyAttendanceData.byDepartment).reduce((sum, dept) => sum + dept.absent, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-bold hover:text-yellow-700 transition-colors">
                    {Object.values(overviewData.dailyAttendanceData.byDepartment).reduce((sum, dept) => sum + dept.onLeave, 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 hover:text-gray-700 transition-colors">
                    {Object.values(overviewData.dailyAttendanceData.byDepartment).reduce((sum, dept) => sum + dept.present + dept.absent + dept.onLeave + dept.late, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>



      {/* Payroll & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Payroll Breakdown</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-black">Live Data</span>
            </div>
            </div>
          
          {/* Interactive Filter Controls */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 mb-6 border border-orange-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-black flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Payroll Filters</span>
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-black mb-3 group-hover:text-orange-700 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <span>📅</span>
                    <span>Month</span>
            </div>
                </label>
                <div className="relative">
                  <select
                    value={payrollFilter.month}
                    onChange={(e) => setPayrollFilter(prev => ({ ...prev, month: e.target.value }))}
                    className="w-full px-4 py-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white hover:bg-orange-50 hover:border-orange-300 cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    {availableMonths.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
            </div>
            </div>

              <div className="group">
                <label className="block text-sm font-semibold text-black mb-3 group-hover:text-orange-700 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <span>🗓️</span>
                    <span>Year</span>
                  </div>
                </label>
                <div className="relative">
                  <select
                    value={payrollFilter.year}
                    onChange={(e) => setPayrollFilter(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-4 py-4 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 bg-white hover:bg-orange-50 hover:border-orange-300 cursor-pointer transform hover:scale-105 shadow-sm hover:shadow-md"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
            </div>
            </div>
          </div>
          
            {/* Filter Status Indicator */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Showing data for {payrollFilter.month} {payrollFilter.year}</span>
                </div>
              <button
                onClick={() => setPayrollFilter({ month: 'January', year: '2024' })}
                className="text-xs text-orange-600 hover:text-orange-800 font-medium hover:underline transition-colors duration-200"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(() => {
              const currentData = getCurrentPayrollData()
              const payrollItems = [
                { key: 'basicSalary', label: 'Basic Salary', color: 'blue' },
                { key: 'allowances', label: 'Allowances', color: 'green' },
                { key: 'overtime', label: 'Overtime', color: 'purple' },
                { key: 'extraOvertime', label: 'Extra Overtime', color: 'indigo' },
                { key: 'bonuses', label: 'Bonuses', color: 'emerald' },
                { key: 'penalties', label: 'Penalties', color: 'red' }
              ]

              return payrollItems.map((item, index) => (
                <div
                  key={item.key}
                  className={`group flex justify-between items-center p-4 rounded-lg hover:bg-gradient-to-r hover:from-${item.color}-50 hover:to-${item.color}-100 transition-all duration-300 cursor-pointer border-l-4 border-${item.color}-200 hover:border-${item.color}-400 transform hover:scale-105`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 bg-${item.color}-500 rounded-full group-hover:animate-pulse`}></div>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{item.label}</span>
        </div>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold text-lg text-${item.color}-600 group-hover:text-${item.color}-700 transition-colors group-hover:scale-110 transform`}>
                      {item.key === 'penalties' ? '-' : ''}{formatCurrency(currentData[item.key])}
                    </span>
                    <div className="w-1 h-6 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-colors"></div>
      </div>
                </div>
              ))
            })()}
            
            <hr className="border-gray-300 my-4" />
            
            <div className="group flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer border-l-4 border-green-400 hover:border-green-500 transform hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-900 font-bold text-lg group-hover:text-green-800 transition-colors">Total Payroll</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-2xl text-green-600 group-hover:text-green-700 transition-colors group-hover:scale-110 transform">
                  {formatCurrency(getCurrentPayrollData().totalSalary)}
                </span>
                <div className="w-2 h-8 bg-green-200 rounded-full group-hover:bg-green-300 transition-colors"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">Asset Management</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-black">Live Status</span>
            </div>
            </div>
          <div className="space-y-3">
            <div className="group flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-gray-200 hover:border-gray-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-black font-medium">Total Assets</span>
            </div>
              <span className="font-bold text-lg text-black group-hover:text-gray-700 transition-colors">{formatNumber(overviewData.assetData.totalAssets)}</span>
            </div>
            
            <div className="group flex justify-between items-center p-3 rounded-lg hover:bg-green-50 transition-all duration-200 cursor-pointer border-l-4 border-green-200 hover:border-green-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-black font-medium">Assigned</span>
              </div>
              <span className="font-bold text-lg text-black group-hover:text-green-700 transition-colors">{formatNumber(overviewData.assetData.assigned)}</span>
          </div>
          
            <div className="group flex justify-between items-center p-3 rounded-lg hover:bg-blue-50 transition-all duration-200 cursor-pointer border-l-4 border-blue-200 hover:border-blue-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-black font-medium">Available</span>
                </div>
              <span className="font-bold text-lg text-black group-hover:text-blue-700 transition-colors">{formatNumber(overviewData.assetData.available)}</span>
            </div>
            
            <div className="group flex justify-between items-center p-3 rounded-lg hover:bg-yellow-50 transition-all duration-200 cursor-pointer border-l-4 border-yellow-200 hover:border-yellow-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-black font-medium">Maintenance</span>
          </div>
              <span className="font-bold text-lg text-black group-hover:text-yellow-700 transition-colors">{formatNumber(overviewData.assetData.maintenance)}</span>
        </div>
            
            <div className="group flex justify-between items-center p-3 rounded-lg hover:bg-red-50 transition-all duration-200 cursor-pointer border-l-4 border-red-200 hover:border-red-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-black font-medium">Damaged</span>
              </div>
              <span className="font-bold text-lg text-black group-hover:text-red-700 transition-colors">{formatNumber(overviewData.assetData.damaged)}</span>
      </div>

            <div className="group flex justify-between items-center p-3 rounded-lg hover:bg-red-100 transition-all duration-200 cursor-pointer border-l-4 border-red-300 hover:border-red-500">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-700 rounded-full animate-pulse"></div>
                <span className="text-black font-medium">Lost</span>
              </div>
              <span className="font-bold text-lg text-black group-hover:text-red-800 transition-colors">{formatNumber(overviewData.assetData.lost)}</span>
            </div>
            
            <div className="group flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 border-gray-200 hover:border-gray-400">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-black font-medium">Retired</span>
              </div>
              <span className="font-bold text-lg text-black group-hover:text-gray-700 transition-colors">{formatNumber(overviewData.assetData.retired)}</span>
            </div>
          </div>
        </div>
      </div>


      {/* Leave Distribution & Overtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leave Distribution</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">Interactive</span>
            </div>
          </div>
          <Bar
            data={{
              labels: Object.keys(overviewData.leaveData),
              datasets: [{
                label: 'Number of Employees',
                data: Object.values(overviewData.leaveData),
                backgroundColor: [
                  'rgba(251, 146, 60, 0.8)',
                  'rgba(249, 115, 22, 0.8)',
                  'rgba(245, 158, 11, 0.8)',
                  'rgba(234, 88, 12, 0.8)',
                  'rgba(194, 65, 12, 0.8)'
                ],
                borderColor: [
                  'rgba(251, 146, 60, 1)',
                  'rgba(249, 115, 22, 1)',
                  'rgba(245, 158, 11, 1)',
                  'rgba(234, 88, 12, 1)',
                  'rgba(194, 65, 12, 1)'
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
                hoverBackgroundColor: [
                  'rgba(251, 146, 60, 0.9)',
                  'rgba(249, 115, 22, 0.9)',
                  'rgba(245, 158, 11, 0.9)',
                  'rgba(234, 88, 12, 0.9)',
                  'rgba(194, 65, 12, 0.9)'
                ],
                hoverBorderWidth: 3,
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { 
                  display: false
                },
                tooltip: {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: 'rgba(99, 102, 241, 0.8)',
                  borderWidth: 2,
                  cornerRadius: 8,
                  callbacks: {
                    label: (context) => `${context.label}: ${context.parsed.y} employees`
                  }
                }
              },
              scales: {
                x: { 
                  grid: { display: false },
                  ticks: {
                    font: {
                      size: 12,
                      weight: 'bold'
                    }
                  }
                },
                y: { 
                  grid: { 
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false
                  },
                  beginAtZero: true,
                  ticks: {
                    stepSize: 5
                  }
                }
              },
              animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
              },
              interaction: {
                intersect: false,
                mode: 'index'
              }
            }}
          />
        </div>

        {/* OverTime & ExtraOverTime TimeSheet */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-black">OverTime & ExtraOverTime TimeSheet</h3>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-black">Live Data</span>
              </div>
            </div>
            
          {/* Filter Options */}
          <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Date
                </label>
                <input
                  type="text"
                  value={overtimeFilter.date}
                  onChange={(e) => setOvertimeFilter({...overtimeFilter, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="DD/MM/YYYY"
                />
              </div>
              
              {/* Month Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Month
                </label>
                <select 
                  value={overtimeFilter.month}
                  onChange={(e) => setOvertimeFilter({...overtimeFilter, month: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">All Months</option>
                  <option value="01">January</option>
                  <option value="02">February</option>
                  <option value="03">March</option>
                  <option value="04">April</option>
                  <option value="05">May</option>
                  <option value="06">June</option>
                  <option value="07">July</option>
                  <option value="08">August</option>
                  <option value="09">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
              
              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Year
                </label>
                <select 
                  value={overtimeFilter.year}
                  onChange={(e) => setOvertimeFilter({...overtimeFilter, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="">All Years</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
            </div>
          </div>
        </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Overtime Hour
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Extra OverTime Hour
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Overtime Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                    ExtraOverTime Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-black uppercase tracking-wider">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(overviewData.overtimeData.byDepartment).map((department, index) => {
                  const regularHours = overviewData.overtimeData.byDepartment[department]
                  const extraHours = overviewData.extraOvertimeData.byDepartment[department]
                  
                  // Calculate amounts (assuming 300 BDT per hour for regular, 400 BDT per hour for extra)
                  const regularAmount = regularHours * 300
                  const extraAmount = extraHours * 400
                  const totalAmount = regularAmount + extraAmount
                  
                  return (
                    <tr key={department} className="hover:bg-gray-50 transition-colors duration-200 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-blue-400' :
                            index === 2 ? 'bg-blue-300' :
                            'bg-blue-200'
                          }`}></div>
                          <span className="text-sm font-medium text-black group-hover:text-blue-700 transition-colors">
                            {department}
                          </span>
      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-black font-semibold">
                          {regularHours} hrs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-black font-semibold">
                          {extraHours} hrs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-black font-semibold">
                          ৳{formatNumber(regularAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-black font-semibold">
                          ৳{formatNumber(extraAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-black">
                          ৳{formatNumber(totalAmount)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                
                {/* Total Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                      <span className="text-sm text-black">Total</span>
        </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-black">
                      {Object.values(overviewData.overtimeData.byDepartment).reduce((sum, hours) => sum + hours, 0)} hrs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-black">
                      {Object.values(overviewData.extraOvertimeData.byDepartment).reduce((sum, hours) => sum + hours, 0)} hrs
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-black">
                      ৳{formatNumber(Object.values(overviewData.overtimeData.byDepartment).reduce((sum, hours) => sum + hours, 0) * 300)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-black">
                      ৳{formatNumber(Object.values(overviewData.extraOvertimeData.byDepartment).reduce((sum, hours) => sum + hours, 0) * 400)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-black">
                      ৳{formatNumber(
                        (Object.values(overviewData.overtimeData.byDepartment).reduce((sum, hours) => sum + hours, 0) * 300) +
                        (Object.values(overviewData.extraOvertimeData.byDepartment).reduce((sum, hours) => sum + hours, 0) * 400)
                      )}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
      </div>
        </div>
      </div>

    </div>
  )
}


