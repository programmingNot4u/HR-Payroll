// Employee Service - Mock data and API functions
const mockEmployees = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    position: 'Senior Software Developer',
    department: 'IT',
    email: 'ahmed.khan@company.com',
    phone: '+880-1234-567890',
    joinDate: '2023-01-15',
    salary: 85000,
    status: 'Active',
    manager: 'Fatima Rahman',
    location: 'Dhaka Office',
    employeeType: 'Full-time',
    workHours: '9:00 AM - 6:00 PM'
  },
  {
    id: 'EMP002',
    name: 'Fatima Rahman',
    position: 'HR Manager',
    department: 'Human Resources',
    email: 'fatima.rahman@company.com',
    phone: '+880-1234-567891',
    joinDate: '2022-08-20',
    salary: 75000,
    status: 'Active',
    manager: 'CEO',
    location: 'Dhaka Office',
    employeeType: 'Full-time',
    workHours: '9:00 AM - 6:00 PM'
  },
  {
    id: 'EMP003',
    name: 'Mohammed Ali',
    position: 'Production Supervisor',
    department: 'Production',
    email: 'mohammed.ali@company.com',
    phone: '+880-1234-567892',
    joinDate: '2023-03-10',
    salary: 45000,
    status: 'Active',
    manager: 'Production Manager',
    location: 'Chittagong Factory',
    employeeType: 'Full-time',
    workHours: '8:00 AM - 5:00 PM'
  },
  {
    id: 'EMP004',
    name: 'Aisha Begum',
    position: 'Accountant',
    department: 'Finance',
    email: 'aisha.begum@company.com',
    phone: '+880-1234-567893',
    joinDate: '2023-06-01',
    salary: 55000,
    status: 'Active',
    manager: 'Finance Manager',
    location: 'Dhaka Office',
    employeeType: 'Full-time',
    workHours: '9:00 AM - 6:00 PM'
  },
  {
    id: 'EMP005',
    name: 'Rashid Ahmed',
    position: 'Security Officer',
    department: 'Security',
    email: 'rashid.ahmed@company.com',
    phone: '+880-1234-567894',
    joinDate: '2022-12-15',
    salary: 35000,
    status: 'Active',
    manager: 'Security Manager',
    location: 'Dhaka Office',
    employeeType: 'Full-time',
    workHours: '24/7 Shift'
  }
]

// Mock API functions
const employeeService = {
  // Get all employees
  getAllEmployees: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockEmployees
  },

  // Get employee by ID
  getEmployeeById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockEmployees.find(emp => emp.id === id) || null
  },

  // Search employees
  searchEmployees: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const searchTerm = query.toLowerCase()
    return mockEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.position.toLowerCase().includes(searchTerm) ||
      emp.department.toLowerCase().includes(searchTerm) ||
      emp.id.toLowerCase().includes(searchTerm)
    )
  },

  // Filter employees by department
  getEmployeesByDepartment: async (department) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    if (department === 'All') return mockEmployees
    return mockEmployees.filter(emp => emp.department === department)
  },

  // Get departments
  getDepartments: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const departments = [...new Set(mockEmployees.map(emp => emp.department))]
    return departments.sort()
  },

  // Add new employee
  addEmployee: async (employeeData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newEmployee = {
      id: `EMP${String(mockEmployees.length + 1).padStart(3, '0')}`,
      ...employeeData,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    }
    mockEmployees.push(newEmployee)
    return newEmployee
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockEmployees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      mockEmployees[index] = { ...mockEmployees[index], ...employeeData }
      return mockEmployees[index]
    }
    return null
  },

  // Delete employee
  deleteEmployee: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockEmployees.findIndex(emp => emp.id === id)
    if (index !== -1) {
      return mockEmployees.splice(index, 1)[0]
    }
    return null
  },

  // Get employee statistics
  getEmployeeStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const total = mockEmployees.length
    const active = mockEmployees.filter(emp => emp.status === 'Active').length
    const departments = [...new Set(mockEmployees.map(emp => emp.department))]
    
    return {
      total,
      active,
      departments: departments.length,
      averageSalary: mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / total
    }
  }
}

export default employeeService
