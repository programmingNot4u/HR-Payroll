// Employee Service - Real data management
const STORAGE_KEY = 'hr_employees_data'

// Get employees from localStorage
const getStoredEmployees = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading employees from storage:', error)
    return []
  }
}

// Save employees to localStorage
const saveEmployees = (employees) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
  } catch (error) {
    console.error('Error saving employees to storage:', error)
  }
}

// Generate unique employee ID
const generateEmployeeId = () => {
  const employees = getStoredEmployees()
  const nextId = employees.length + 1
  return `EMP${String(nextId).padStart(3, '0')}`
}

// Employee Service - Real data management
const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    return getStoredEmployees()
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    const employees = getStoredEmployees()
    return employees.find(emp => emp.id === id) || null
  },

  // Search employees
  searchEmployees: async (query) => {
    const employees = getStoredEmployees()
    const searchTerm = query.toLowerCase()
    return employees.filter(emp => 
      emp.name?.toLowerCase().includes(searchTerm) ||
      emp.designation?.toLowerCase().includes(searchTerm) ||
      emp.department?.toLowerCase().includes(searchTerm) ||
      emp.id?.toLowerCase().includes(searchTerm)
    )
  },

  // Filter employees by department
  getEmployeesByDepartment: async (department) => {
    const employees = getStoredEmployees()
    if (department === 'All') return employees
    return employees.filter(emp => emp.department === department)
  },

  // Get departments
  getDepartments: async () => {
    const employees = getStoredEmployees()
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))]
    return departments.sort()
  },

  // Add new employee
  addEmployee: async (employeeData) => {
    const employees = getStoredEmployees()
    const newEmployee = {
      id: generateEmployeeId(),
      ...employeeData,
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0]
    }
    employees.push(newEmployee)
    saveEmployees(employees)
    return newEmployee
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    const employees = getStoredEmployees()
    const index = employees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      employees[index] = { ...employees[index], ...employeeData }
      saveEmployees(employees)
      return employees[index]
    }
    return null
  },

  // Delete employee
  deleteEmployee: async (id) => {
    const employees = getStoredEmployees()
    const index = employees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      const deletedEmployee = employees.splice(index, 1)[0]
      saveEmployees(employees)
      return deletedEmployee
    }
    return null
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    const employees = getStoredEmployees()
    const total = employees.length
    const active = employees.filter(emp => emp.status === 'Active').length
    const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))]
    
    return {
      total,
      active,
      departments: departments.length,
      averageSalary: total > 0 ? employees.reduce((sum, emp) => sum + (emp.grossSalary || 0), 0) / total : 0
    }
  },

  // Refresh sample data (for development/testing)
  refreshSampleData: () => {
    // This can be used to add sample data if needed
    console.log('Sample data refresh not implemented - using real data from AddEmployee form')
  }
}

export default employeeService
