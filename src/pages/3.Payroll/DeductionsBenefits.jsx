import { useState, useMemo, useEffect } from 'react'
import employeeService from '../../services/employeeService'
import organizationalDataService from '../../services/organizationalDataService'

// Dynamic data will be loaded from employee service and localStorage

const levelsOfWork = ['All', 'Worker', 'Staff']

export default function BonusesPenalties() {
  const [activeTab, setActiveTab] = useState('timeline')
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [departments, setDepartments] = useState(['All'])
  const [designations, setDesignations] = useState(['All'])
  const [filters, setFilters] = useState({
    department: 'All',
    levelOfWork: 'All',
    status: 'All',
    salaryMonth: 'All',
    year: 'All',
    voucherNumber: ''
  })
  
  const [penalties, setPenalties] = useState([])
  const [showPenaltyModal, setShowPenaltyModal] = useState(false)
  const [editingPenalty, setEditingPenalty] = useState(null)
  const [penaltyFormData, setPenaltyFormData] = useState({
    employeeId: '',
    employeeName: '',
    designation: '',
    department: '',
    levelOfWork: '',
    penaltyAmount: '',
    reason: '',
    date: new Date().toISOString().split('T')[0],
    salaryMonth: '',
    year: '',
    penaltyVNumber: '',
    status: 'Deactivated',
    deductedFromSalary: true
  })

  // Save penalties to localStorage
  const savePenalties = (penaltiesData) => {
    try {
      localStorage.setItem('hr_penalties_data', JSON.stringify(penaltiesData))
    } catch (error) {
      console.error('Error saving penalties to localStorage:', error)
    }
  }

  // Load employee data, organizational data, and penalties
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Load employees from employee service
        const employeeData = await employeeService.getAllEmployees()
        setEmployees(employeeData)
        
        // Load organizational data
        const deptData = organizationalDataService.getDepartments()
        const desigData = organizationalDataService.getDesignations()
        
        setDepartments(['All', ...deptData.map(dept => dept.name)])
        setDesignations(['All', ...desigData.map(desig => desig.name)])
        
        // Load penalties from localStorage
        const savedPenalties = localStorage.getItem('hr_penalties_data')
        if (savedPenalties) {
          try {
            const penaltiesData = JSON.parse(savedPenalties)
            setPenalties(penaltiesData)
          } catch (error) {
            console.error('Error parsing penalties data:', error)
            setPenalties([])
          }
        }
        
        console.log('Loaded employees for bonuses:', employeeData.length)
        console.log('Loaded penalties:', savedPenalties ? JSON.parse(savedPenalties).length : 0)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Filter employees based on selected filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      return matchesDepartment && matchesLevelOfWork
    })
  }, [employees, filters])

  // Filter penalties based on selected filters
  const filteredPenalties = useMemo(() => {
    return penalties.filter(penalty => {
      const employee = employees.find(emp => emp.id === penalty.employeeId)
      if (!employee) return false
      
      const matchesDepartment = filters.department === 'All' || employee.department === filters.department
      const matchesLevelOfWork = filters.levelOfWork === 'All' || employee.levelOfWork === filters.levelOfWork
      const matchesStatus = filters.status === 'All' || penalty.status === filters.status
      const matchesSalaryMonth = filters.salaryMonth === 'All' || penalty.salaryMonth === filters.salaryMonth
      const matchesYear = filters.year === 'All' || penalty.year === filters.year
      const matchesVoucherNumber = !filters.voucherNumber || 
        (penalty.penaltyVNumber && penalty.penaltyVNumber.toLowerCase().includes(filters.voucherNumber.toLowerCase()))
      return matchesDepartment && matchesLevelOfWork && matchesStatus && matchesSalaryMonth && matchesYear && matchesVoucherNumber
    })
  }, [penalties, filters, employees])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({
      department: 'All',
      levelOfWork: 'All',
      status: 'All',
      salaryMonth: 'All',
      year: 'All',
      voucherNumber: ''
    })
  }

  const handleAddPenalty = () => {
    setEditingPenalty(null)
    setPenaltyFormData({
      employeeId: '',
      employeeName: '',
      designation: '',
      department: '',
      levelOfWork: '',
      penaltyAmount: '',
      penaltyVNumber: '',
      reason: '',
      date: new Date().toISOString().split('T')[0],
      salaryMonth: '',
      year: '',
      status: 'Activated',
      deductedFromSalary: true
    })
    setShowPenaltyModal(true)
  }

  const handleEditPenalty = (penalty) => {
    setEditingPenalty(penalty)
    setPenaltyFormData({
      employeeId: penalty.employeeId,
      employeeName: penalty.employeeName,
      designation: penalty.designation,
      department: penalty.department,
      levelOfWork: penalty.levelOfWork,
      penaltyAmount: penalty.penaltyAmount,
      penaltyVNumber: penalty.penaltyVNumber,
      reason: penalty.reason,
      date: penalty.date,
      salaryMonth: penalty.salaryMonth,
      year: penalty.year,
      status: penalty.status,
      deductedFromSalary: penalty.deductedFromSalary
    })
    setShowPenaltyModal(true)
  }

  const handlePenaltySubmit = () => {
    if (!penaltyFormData.employeeId || !penaltyFormData.employeeName || !penaltyFormData.designation || 
        !penaltyFormData.department || !penaltyFormData.levelOfWork || !penaltyFormData.penaltyAmount || 
        !penaltyFormData.reason || !penaltyFormData.salaryMonth || !penaltyFormData.year) {
      alert('Please fill in all required fields')
      return
    }

    const newPenalty = {
      id: editingPenalty ? editingPenalty.id : `PEN${String(penalties.length + 1).padStart(3, '0')}`,
      employeeId: penaltyFormData.employeeId,
      employeeName: penaltyFormData.employeeName,
      designation: penaltyFormData.designation,
      department: penaltyFormData.department,
      levelOfWork: penaltyFormData.levelOfWork,
      penaltyAmount: parseFloat(penaltyFormData.penaltyAmount),
      penaltyVNumber: penaltyFormData.penaltyVNumber,
      reason: penaltyFormData.reason,
      date: penaltyFormData.date,
      salaryMonth: penaltyFormData.salaryMonth,
      year: penaltyFormData.year,
      status: penaltyFormData.status,
      deductedFromSalary: penaltyFormData.deductedFromSalary
    }

    if (editingPenalty) {
      const updatedPenalties = penalties.map(p => p.id === editingPenalty.id ? newPenalty : p)
      setPenalties(updatedPenalties)
      savePenalties(updatedPenalties)
      alert('Penalty updated successfully')
    } else {
      const updatedPenalties = [...penalties, newPenalty]
      setPenalties(updatedPenalties)
      savePenalties(updatedPenalties)
      alert('Penalty added successfully')
    }

    setShowPenaltyModal(false)
  }

  const handleTogglePenaltyStatus = (penaltyId, currentStatus) => {
    console.log('Toggling penalty status for:', penaltyId, 'from', currentStatus, 'to', currentStatus === 'Active' ? 'Inactive' : 'Active')
    alert(`Penalty status ${currentStatus === 'Active' ? 'deactivated' : 'activated'} successfully`)
  }

  const handleDeletePenalty = (penaltyId) => {
    if (confirm('Are you sure you want to delete this penalty?')) {
      console.log('Deleting penalty:', penaltyId)
      alert('Penalty deleted successfully')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activated': return 'bg-green-100 text-green-800'
      case 'Deactivated': return 'bg-gray-100 text-gray-800'
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Not Paid': return 'bg-red-100 text-red-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Worker': return 'bg-blue-100 text-blue-800'
      case 'Staff': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate job age in years and months
  const calculateJobAge = (joiningDate) => {
    if (!joiningDate) return '0 months'
    
    // Handle dd/mm/yyyy format
    let joinDate
    if (joiningDate.includes('/')) {
      // Convert dd/mm/yyyy to yyyy-mm-dd for proper parsing
      const [day, month, year] = joiningDate.split('/')
      joinDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
    } else {
      // Handle yyyy-mm-dd format
      joinDate = new Date(joiningDate)
    }
    
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate - joinDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`
    } else {
      return `${months} month${months > 1 ? 's' : ''}`
    }
  }

  // Check if employee is eligible for festival bonus (1 year or more tenure)
  const isEligibleForFestivalBonus = (joiningDate) => {
    if (!joiningDate) return false
    
    // Handle dd/mm/yyyy format
    let joinDate
    if (joiningDate.includes('/')) {
      // Convert dd/mm/yyyy to yyyy-mm-dd for proper parsing
      const [day, month, year] = joiningDate.split('/')
      joinDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`)
    } else {
      // Handle yyyy-mm-dd format
      joinDate = new Date(joiningDate)
    }
    
    const currentDate = new Date()
    const diffTime = Math.abs(currentDate - joinDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const years = Math.floor(diffDays / 365)
    return years >= 1
  }

  // Calculate totals based on active tab and filters
  const totalFestivalBonuses = filteredEmployees.reduce((sum, emp) => {
    // Calculate festival bonus based on job tenure (1 year = 5000 BDT)
    const festivalBonus = isEligibleForFestivalBonus(emp.joiningDate || emp.dateOfJoining) ? 5000 : 0
    return sum + festivalBonus
  }, 0)
  
  const totalAttendanceBonuses = filteredEmployees.reduce((sum, emp) => {
    // Calculate attendance bonus for workers (775 BDT per month)
    const attendanceBonus = emp.levelOfWork === 'Worker' ? 775 : 0
    return sum + attendanceBonus
  }, 0)
  
  const totalPenalties = filteredPenalties.reduce((sum, penalty) => sum + penalty.penaltyAmount, 0)
  const totalEmployees = filteredEmployees.length
  const eligibleForFestivalBonus = filteredEmployees.filter(emp => isEligibleForFestivalBonus(emp.joiningDate || emp.dateOfJoining)).length
  const eligibleForAttendanceBonus = filteredEmployees.filter(emp => emp.levelOfWork === 'Worker').length
  const activatedPenalties = filteredPenalties.filter(penalty => penalty.status === 'Activated').length
  const deactivatedPenalties = filteredPenalties.filter(penalty => penalty.status === 'Deactivated').length
  const activatedPenaltyAmount = filteredPenalties
    .filter(penalty => penalty.status === 'Activated')
    .reduce((sum, penalty) => sum + penalty.penaltyAmount, 0)
  const deactivatedPenaltyAmount = filteredPenalties
    .filter(penalty => penalty.status === 'Deactivated')
    .reduce((sum, penalty) => sum + penalty.penaltyAmount, 0)

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2 text-gray-600">Loading employee data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-table {
            width: 100% !important;
            font-size: 12px !important;
          }
          .print-table th,
          .print-table td {
            padding: 8px 4px !important;
            border: 1px solid #000 !important;
          }
          .print-table th {
            background-color: #f3f4f6 !important;
            font-weight: bold !important;
          }
          .print-filter-info {
            margin-bottom: 20px !important;
            padding: 10px !important;
            background-color: #f9fafb !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 6px !important;
          }
        }
      `}</style>
      <div>
        <h1 className="text-2xl font-semibold">Overtime || Bonuses || Penalties</h1>
        <p className="text-sm text-gray-500">Manage employee attendance bonuses and penalties</p>
      </div>

      {/* Tabs */}
      <div className="no-print">
        <nav className="flex space-x-2 w-full">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex-1 py-4 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'timeline'
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-orange-300 hover:to-orange-400 hover:text-white hover:shadow-md hover:transform hover:scale-105'
            }`}
          >
            Performance Tab
          </button>
          <button
            onClick={() => setActiveTab('overtime')}
            className={`flex-1 py-4 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'overtime'
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-orange-300 hover:to-orange-400 hover:text-white hover:shadow-md hover:transform hover:scale-105'
            }`}
          >
            OverTime ({filteredEmployees.filter(emp => emp.levelOfWork === 'Worker').length})
          </button>
          <button
            onClick={() => setActiveTab('bonuses')}
            className={`flex-1 py-4 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'bonuses'
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-orange-300 hover:to-orange-400 hover:text-white hover:shadow-md hover:transform hover:scale-105'
            }`}
          >
            Bonuses ({filteredEmployees.length})
          </button>
          <button
            onClick={() => setActiveTab('penalties')}
            className={`flex-1 py-4 px-6 font-medium text-sm rounded-lg transition-all duration-200 ${
              activeTab === 'penalties'
                ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-100 text-gray-600 hover:bg-gradient-to-r hover:from-orange-300 hover:to-orange-400 hover:text-white hover:shadow-md hover:transform hover:scale-105'
            }`}
          >
            Penalties ({filteredPenalties.length})
          </button>
        </nav>
      </div>

      {/* Statistics Cards */}
      <div className={`grid grid-cols-1 gap-6 no-print ${
        activeTab === 'penalties' ? 'md:grid-cols-5' : 'md:grid-cols-3'
      }`}>
        {activeTab === 'timeline' && (
          <>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Total Festival Bonuses</div>
              <div className="mt-1 text-2xl font-semibold text-green-600">৳{totalFestivalBonuses.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{eligibleForFestivalBonus} eligible employees</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Total Attendance Bonuses</div>
              <div className="mt-1 text-2xl font-semibold text-blue-600">৳{totalAttendanceBonuses.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{eligibleForAttendanceBonus} worker employees</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Total Penalties</div>
              <div className="mt-1 text-2xl font-semibold text-red-600">৳{totalPenalties.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{filteredPenalties.length} total penalties</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'bonuses' && (
          <>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Total Festival Bonuses</div>
              <div className="mt-1 text-2xl font-semibold text-green-600">৳{totalFestivalBonuses.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{eligibleForFestivalBonus} eligible employees</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Total Attendance Bonuses</div>
              <div className="mt-1 text-2xl font-semibold text-blue-600">৳{totalAttendanceBonuses.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{eligibleForAttendanceBonus} worker employees</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Total Bonuses</div>
              <div className="mt-1 text-2xl font-semibold text-green-600">৳{(totalFestivalBonuses + totalAttendanceBonuses).toLocaleString()}</div>
              <div className="text-xs text-gray-500">Festival + Attendance</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'penalties' && (
          <>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Activated</div>
              <div className="mt-1 text-2xl font-semibold text-green-600">{activatedPenalties}</div>
              <div className="text-xs text-gray-500">penalties activated</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.status !== 'All' && ` • Status: ${filters.status}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
                {filters.voucherNumber && ` • Voucher: ${filters.voucherNumber}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Deactivated</div>
              <div className="mt-1 text-2xl font-semibold text-gray-600">{deactivatedPenalties}</div>
              <div className="text-xs text-gray-500">penalties deactivated</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.status !== 'All' && ` • Status: ${filters.status}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
                {filters.voucherNumber && ` • Voucher: ${filters.voucherNumber}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Activated Penalty Amount</div>
              <div className="mt-1 text-2xl font-semibold text-green-600">৳{activatedPenaltyAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{activatedPenalties} activated penalties</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.status !== 'All' && ` • Status: ${filters.status}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
                {filters.voucherNumber && ` • Voucher: ${filters.voucherNumber}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Deactivated Penalty Amount</div>
              <div className="mt-1 text-2xl font-semibold text-gray-600">৳{deactivatedPenaltyAmount.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{deactivatedPenalties} deactivated penalties</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.status !== 'All' && ` • Status: ${filters.status}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
                {filters.voucherNumber && ` • Voucher: ${filters.voucherNumber}`}
              </div>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <div className="text-sm text-gray-500">Total Penalty Amount</div>
              <div className="mt-1 text-2xl font-semibold text-red-600">৳{totalPenalties.toLocaleString()}</div>
              <div className="text-xs text-gray-500">{filteredPenalties.length} total penalties</div>
              <div className="text-xs text-gray-400 mt-1">
                {filters.department !== 'All' && `Dept: ${filters.department}`} 
                {filters.levelOfWork !== 'All' && ` • Level: ${filters.levelOfWork}`}
                {filters.status !== 'All' && ` • Status: ${filters.status}`}
                {filters.salaryMonth !== 'All' && ` • Month: ${filters.salaryMonth}`}
                {filters.year !== 'All' && ` • Year: ${filters.year}`}
                {filters.voucherNumber && ` • Voucher: ${filters.voucherNumber}`}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 w-full">
        <div className="flex flex-nowrap gap-4 items-end w-full">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Level of Work</label>
            <select
              value={filters.levelOfWork}
              onChange={(e) => handleFilterChange('levelOfWork', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {levelsOfWork.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          {(activeTab === 'timeline' || activeTab === 'bonuses' || activeTab === 'overtime') && (
            <>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Month</label>
                <select
                  value={filters.salaryMonth}
                  onChange={(e) => handleFilterChange('salaryMonth', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
            </>
          )}
          {activeTab === 'penalties' && (
            <>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="Activated">Activated</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Month</label>
                <select
                  value={filters.salaryMonth}
                  onChange={(e) => handleFilterChange('salaryMonth', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Number</label>
                <input
                  type="text"
                  value={filters.voucherNumber}
                  onChange={(e) => handleFilterChange('voucherNumber', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search by voucher number..."
                />
              </div>
            </>
          )}
          <div className="flex items-end gap-2 flex-shrink-0">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap"
            >
              Clear Filters
            </button>
            <button 
              onClick={() => {
                let tableElement, tableTitle, tableDescription, resultCount, resultType
                
                if (activeTab === 'timeline') {
                  tableElement = document.querySelector('.bonuses-table')
                  tableTitle = 'Performance Table'
                  tableDescription = 'Employee performance overview including bonuses, penalties, and job tenure'
                  resultCount = filteredEmployees.length
                  resultType = 'employees'
                } else if (activeTab === 'overtime') {
                  tableElement = document.querySelector('.overtime-table')
                  tableTitle = 'Worker Overtime'
                  tableDescription = 'Overtime hours and rates for worker employees'
                  resultCount = filteredEmployees.filter(emp => emp.levelOfWork === 'Worker').length
                  resultType = 'workers'
                } else if (activeTab === 'bonuses') {
                  tableElement = document.querySelector('.bonuses-table')
                  tableTitle = 'Employee Bonuses'
                  tableDescription = 'Employee bonus overview including attendance and festival bonuses'
                  resultCount = filteredEmployees.length
                  resultType = 'employees'
                } else if (activeTab === 'penalties') {
                  tableElement = document.querySelector('.penalties-table')
                  tableTitle = 'Employee Penalties'
                  tableDescription = 'Penalties for damage to company property or products, deducted from monthly salary'
                  resultCount = filteredPenalties.length
                  resultType = 'penalties'
                }
                
                if (!tableElement) {
                  alert('Table not found for printing')
                  return
                }
                
                const printWindow = window.open('', '_blank')
                
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>${tableTitle} - Print</title>
                      <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .print-table { width: 100%; border-collapse: collapse; font-size: 12px; }
                        .print-table th, .print-table td { padding: 8px 4px; border: 1px solid #000; text-align: left; }
                        .print-table th { background-color: #f3f4f6; font-weight: bold; }
                        h2 { margin: 0 0 10px 0; }
                        p { margin: 0 0 20px 0; color: #666; }
                      </style>
                    </head>
                    <body>
                      <h2>${tableTitle}</h2>
                      <p>${tableDescription}</p>
                      ${tableElement.outerHTML}
                    </body>
                  </html>
                `)
                printWindow.document.close()
                printWindow.print()
              }}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Results
            </button>
            {activeTab === 'penalties' && (
              <button
                onClick={handleAddPenalty}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center gap-2 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Penalty
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Timeline Tab Content */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Performance Table</h2>
            <p className="text-sm text-gray-500">
              Employee performance overview including bonuses, penalties, and job tenure
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 print-table bonuses-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Bonus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Festival Bonus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penalties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(employee.levelOfWork)}`}>
                        {employee.levelOfWork}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.levelOfWork === 'Worker' ? (
                        <span className="text-sm font-medium text-green-600">
                          ৳{775}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not Eligible</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEligibleForFestivalBonus(employee.joiningDate || employee.dateOfJoining) ? (
                        <span className="text-sm font-medium text-green-600">
                          ৳{5000}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not Eligible</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      ৳{penalties
                        .filter(penalty => penalty.employeeId === employee.id)
                        .reduce((sum, penalty) => sum + penalty.penaltyAmount, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bonuses Tab Content */}
      {activeTab === 'bonuses' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Employee Bonuses</h2>
            <p className="text-sm text-gray-500">
              Employee bonus overview including attendance and festival bonuses
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 print-table bonuses-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Tenure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance Bonus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Festival Bonus
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.designation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(employee.levelOfWork)}`}>
                        {employee.levelOfWork}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {calculateJobAge(employee.joiningDate || employee.dateOfJoining)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {filters.salaryMonth !== 'All' ? filters.salaryMonth : 'Current Month'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {filters.year !== 'All' ? filters.year : new Date().getFullYear()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {employee.levelOfWork === 'Worker' ? (
                        <span className="text-sm font-medium text-green-600">
                          ৳{775}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not Eligible</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEligibleForFestivalBonus(employee.joiningDate || employee.dateOfJoining) ? (
                        <span className="text-sm font-medium text-green-600">
                          ৳{5000}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">Not Eligible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OverTime Tab Content */}
      {activeTab === 'overtime' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Worker Overtime</h2>
            <p className="text-sm text-gray-500">
              Overtime hours and rates for worker employees
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 print-table overtime-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Extra Overtime Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Overtime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate of Work
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Overtime Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees
                  .filter(employee => employee.levelOfWork === 'Worker')
                  .map((employee) => {
                    // Sample overtime data - in real app this would come from database
                    const overtimeHours = Math.floor(Math.random() * 20) + 5 // 5-24 hours
                    const extraOvertimeHours = Math.floor(Math.random() * 10) + 1 // 1-10 hours
                    
                    // Get basic salary from employee data (use basicSalary from salaryComponents, fallback to grossSalary)
                    const basicSalary = employee.salaryComponents?.basicSalary?.amount || employee.grossSalary || employee.salary || 25000
                    
                    // Calculate rate of work: (Basic Salary) x 2 / 208
                    const rateOfWork = Math.round((basicSalary * 2) / 208)
                    
                    // Calculate total overtime amount (both regular and extra overtime use same rate)
                    const totalAmount = (overtimeHours + extraOvertimeHours) * rateOfWork
                    
                    return (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.designation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ৳{basicSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {overtimeHours} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {extraOvertimeHours} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          {overtimeHours + extraOvertimeHours} hrs
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          ৳{rateOfWork}/hr
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ৳{totalAmount.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Penalties Tab Content */}
      {activeTab === 'penalties' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Employee Penalties</h2>
            <p className="text-sm text-gray-500">
              Penalties for damage to company property or products, deducted from monthly salary
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 penalties-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level of Work
                  </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penalty Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Penalty V.Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adjusted from Salary Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPenalties.map((penalty) => {
                  const employee = employees.find(emp => emp.id === penalty.employeeId)
                  return (
                    <tr key={penalty.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {penalty.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee ? employee.name : penalty.employeeName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee ? employee.designation : penalty.designation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {employee ? employee.department : penalty.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(employee ? employee.levelOfWork : penalty.levelOfWork)}`}>
                          {employee ? employee.levelOfWork : penalty.levelOfWork}
                        </span>
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                          ৳{penalty.penaltyAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {penalty.penaltyVNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs overflow-hidden">
                          <div className="truncate" title={penalty.reason}>{penalty.reason}</div>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(() => {
                          const date = new Date(penalty.date)
                          const day = String(date.getDate()).padStart(2, '0')
                          const month = String(date.getMonth() + 1).padStart(2, '0')
                          const year = date.getFullYear()
                          return `${day}/${month}/${year}`
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {penalty.salaryMonth} {penalty.year}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span 
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(penalty.status)} ${
                              penalty.status === 'Activated' ? 'cursor-pointer hover:opacity-80' : ''
                            }`}
                            onClick={() => {
                              if (penalty.status === 'Activated') {
                                setActiveTab('timeline')
                              }
                            }}
                            title={penalty.status === 'Activated' ? 'Click to view in Performance Table' : ''}
                          >
                            {penalty.status}
                          </span>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPenalty(penalty)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePenalty(penalty.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Penalty Modal */}
      {showPenaltyModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPenalty ? 'Edit' : 'Add New'} Penalty
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={penaltyFormData.employeeId}
                    onChange={(e) => {
                      const employeeId = e.target.value
                      setPenaltyFormData(prev => ({ ...prev, employeeId }))
                      
                      // Auto-fill other fields when employee ID is entered
                      if (employeeId) {
                        const employee = employees.find(emp => emp.id === employeeId)
                        if (employee) {
                          setPenaltyFormData(prev => ({
                            ...prev,
                            employeeId,
                            employeeName: employee.name,
                            designation: employee.designation,
                            department: employee.department,
                            levelOfWork: employee.levelOfWork
                          }))
                        }
                      } else {
                        // Clear fields if employee ID is empty
                        setPenaltyFormData(prev => ({
                          ...prev,
                          employeeId: '',
                          employeeName: '',
                          designation: '',
                          department: '',
                          levelOfWork: ''
                        }))
                      }
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., EMP001"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter Employee ID to auto-fill other fields (EMP001, EMP002, EMP003, EMP004, EMP005)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Name * 
                    {penaltyFormData.employeeId && (
                      <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={penaltyFormData.employeeName}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Will be auto-filled when Employee ID is entered"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation * 
                    {penaltyFormData.employeeId && (
                      <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={penaltyFormData.designation}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                    placeholder="Will be auto-filled when Employee ID is entered"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department * 
                    {penaltyFormData.employeeId && (
                      <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
                    )}
                  </label>
                  <select
                    value={penaltyFormData.department}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                  >
                    <option value="">Will be auto-filled when Employee ID is entered</option>
                    {departments.filter(d => d !== 'All').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level of Work * 
                    {penaltyFormData.employeeId && (
                      <span className="text-xs text-green-600 ml-1">(Auto-filled)</span>
                    )}
                  </label>
                  <select
                    value={penaltyFormData.levelOfWork}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed"
                  >
                    <option value="">Will be auto-filled when Employee ID is entered</option>
                    {levelsOfWork.filter(l => l !== 'All').map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount *</label>
                  <input
                    type="number"
                    value={penaltyFormData.penaltyAmount}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, penaltyAmount: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter penalty amount"
                  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penalty V.Number</label>
                    <input
                      type="text"
                      value={penaltyFormData.penaltyVNumber}
                      onChange={(e) => setPenaltyFormData(prev => ({ ...prev, penaltyVNumber: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Enter penalty voucher number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <textarea
                    value={penaltyFormData.reason}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows="5"
                    placeholder="Describe the reason for penalty..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={penaltyFormData.date}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adjusted from Salary Month *</label>
                  <select
                    value={penaltyFormData.salaryMonth}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, salaryMonth: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select
                    value={penaltyFormData.year}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={penaltyFormData.status}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="Activated">Activated</option>
                    <option value="Deactivated">Deactivated</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="deductedFromSalary"
                    checked={penaltyFormData.deductedFromSalary}
                    onChange={(e) => setPenaltyFormData(prev => ({ ...prev, deductedFromSalary: e.target.checked }))}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="deductedFromSalary" className="ml-2 block text-sm text-gray-900">
                    Deduct from monthly salary
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPenaltyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePenaltySubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  {editingPenalty ? 'Update' : 'Add'} Penalty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
