// Service to manage organizational data (departments, designations, etc.)
// This service provides centralized access to organizational data across the application

class OrganizationalDataService {
  constructor() {
    // Initialize with default data - in a real app, this would come from an API
    this.departments = [
      { id: 1, name: 'Cutting Department', description: '', head: '', isActive: true },
      { id: 2, name: 'Printing Department', description: '', head: '', isActive: true },
      { id: 3, name: 'Embroidery Department', description: '', head: '', isActive: true },
      { id: 4, name: 'Sewing Department', description: '', head: '', isActive: true },
      { id: 5, name: 'Washing Department', description: '', head: '', isActive: true },
      { id: 6, name: 'Finishing Department', description: '', head: '', isActive: true },
      { id: 7, name: 'Quality Control (QC) Department', description: '', head: '', isActive: true }
    ]

    this.designations = [
      { id: 1, name: 'Software Engineer', description: 'Develops and maintains software applications', level: 'Mid', isActive: true },
      { id: 2, name: 'Senior Software Engineer', description: 'Leads development projects and mentors junior developers', level: 'Senior', isActive: true },
      { id: 3, name: 'Product Manager', description: 'Manages product development and strategy', level: 'Senior', isActive: true },
      { id: 4, name: 'HR Manager', description: 'Manages human resources operations', level: 'Senior', isActive: true },
      { id: 5, name: 'HR Executive', description: 'Handles HR operations and employee relations', level: 'Mid', isActive: true },
      { id: 6, name: 'Marketing Manager', description: 'Manages marketing campaigns and strategies', level: 'Senior', isActive: true },
      { id: 7, name: 'Marketing Executive', description: 'Executes marketing activities and campaigns', level: 'Mid', isActive: true },
      { id: 8, name: 'Finance Manager', description: 'Manages financial planning and accounting', level: 'Senior', isActive: true },
      { id: 9, name: 'Accountant', description: 'Handles accounting and financial records', level: 'Mid', isActive: true },
      { id: 10, name: 'Operations Manager', description: 'Manages daily operations and production', level: 'Senior', isActive: true },
      { id: 11, name: 'Quality Inspector', description: 'Inspects and ensures quality standards', level: 'Mid', isActive: true },
      { id: 12, name: 'Production Manager', description: 'Manages production processes and teams', level: 'Senior', isActive: true }
    ]

    this.processExpertise = [
      { id: 1, operation: 'Rob Joint', machine: 'Overlock', isActive: true },
      { id: 2, operation: 'Rob Joint', machine: 'Flatlock', isActive: true },
      { id: 3, operation: 'Neck Joint', machine: 'Overlock', isActive: true },
      { id: 4, operation: 'Neck Joint', machine: 'Flatlock', isActive: true },
      { id: 5, operation: 'Collar Joint', machine: 'Overlock', isActive: true },
      { id: 6, operation: 'Collar Joint', machine: 'Flatlock', isActive: true }
    ]

    this.operations = [
      { id: 1, name: 'Rob Joint', isActive: true },
      { id: 2, name: 'Neck Joint', isActive: true },
      { id: 3, name: 'Collar Joint', isActive: true }
    ]

    this.machines = [
      { id: 1, name: 'Overlock', isActive: true },
      { id: 2, name: 'Flatlock', isActive: true }
    ]

    this.skillMetrics = [
      { id: 1, name: 'Technical Skills', description: 'Programming languages, frameworks, tools', category: 'Technical', isActive: true },
      { id: 2, name: 'Communication', description: 'Verbal and written communication abilities', category: 'Soft Skills', isActive: true },
      { id: 3, name: 'Leadership', description: 'Team management and leadership capabilities', category: 'Management', isActive: true },
      { id: 4, name: 'Problem Solving', description: 'Analytical thinking and problem resolution', category: 'Cognitive', isActive: true }
    ]

    this.staffSalaryGrades = [
      { id: 1, name: 'Staff Grade-1', basicSalary: 25000, houseRent: 12500, medicalAllowance: 2000, conveyance: 1500, mobileBill: 1000, grossSalary: 42000, isActive: true },
      { id: 2, name: 'Staff Grade-2', basicSalary: 35000, houseRent: 17500, medicalAllowance: 2500, conveyance: 2000, mobileBill: 1500, grossSalary: 58500, isActive: true },
      { id: 3, name: 'Staff Grade-3', basicSalary: 45000, houseRent: 22500, medicalAllowance: 3000, conveyance: 2500, mobileBill: 2000, grossSalary: 75000, isActive: true }
    ]

    // Listen for storage events to sync data across tabs
    window.addEventListener('storage', this.handleStorageChange.bind(this))
  }

  // Get all active departments
  getDepartments() {
    return this.departments.filter(dept => dept.isActive)
  }

  // Get all active designations
  getDesignations() {
    return this.designations.filter(designation => designation.isActive)
  }

  // Get department names for dropdowns
  getDepartmentNames() {
    const names = this.getDepartments().map(dept => dept.name)
    // Remove duplicates and return unique names
    return [...new Set(names)]
  }

  // Get designation names for dropdowns
  getDesignationNames() {
    const names = this.getDesignations().map(designation => designation.name)
    // Remove duplicates and return unique names
    return [...new Set(names)]
  }

  // Get all active process expertise
  getProcessExpertise() {
    return this.processExpertise.filter(expertise => expertise.isActive)
  }

  // Get all active operations
  getOperations() {
    return this.operations.filter(operation => operation.isActive)
  }

  // Get all active machines
  getMachines() {
    return this.machines.filter(machine => machine.isActive)
  }

  // Get all active skill metrics
  getSkillMetrics() {
    return this.skillMetrics.filter(skill => skill.isActive)
  }

  // Get all active staff salary grades
  getStaffSalaryGrades() {
    return this.staffSalaryGrades.filter(grade => grade.isActive)
  }

  // Get process expertise operations for dropdowns
  getProcessExpertiseOperations() {
    const operations = this.getProcessExpertise().map(expertise => expertise.operation)
    // Remove duplicates and return unique operations
    return [...new Set(operations)]
  }

  // Get process expertise machines for dropdowns
  getProcessExpertiseMachines() {
    const machines = this.getProcessExpertise().map(expertise => expertise.machine)
    // Remove duplicates and return unique machines
    return [...new Set(machines)]
  }

  // Get unique operations from process expertise
  getUniqueProcessExpertiseOperations() {
    const operations = [...new Set(this.getProcessExpertise().map(expertise => expertise.operation))]
    return operations.map((operation, index) => ({
      id: `op_${index + 1}`,
      operation: operation,
      isActive: true
    }))
  }

  // Get machines for a specific operation
  getMachinesForOperation(operation) {
    return this.getProcessExpertise()
      .filter(expertise => expertise.operation === operation)
      .map(expertise => expertise.machine)
  }

  // Get all unique machines from process expertise
  getUniqueProcessExpertiseMachines() {
    const machines = [...new Set(this.getProcessExpertise().map(expertise => expertise.machine))]
    return machines.map((machine, index) => ({
      id: `mach_${index + 1}`,
      machine: machine,
      isActive: true
    }))
  }

  // Get all salary grades (worker and staff combined)
  getAllSalaryGrades() {
    const workerGrades = [
      { id: 1, name: 'Worker Grade-1', basicSalary: 8390, houseRent: 4195, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 15035, isActive: true, type: 'Worker' },
      { id: 2, name: 'Worker Grade-2', basicSalary: 7882, houseRent: 3941, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 14273, isActive: true, type: 'Worker' },
      { id: 3, name: 'Worker Grade-3', basicSalary: 7400, houseRent: 3700, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 13550, isActive: true, type: 'Worker' },
      { id: 4, name: 'Worker Grade-4', basicSalary: 6700, houseRent: 3350, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 12500, isActive: true, type: 'Worker' }
    ]
    
    const staffGrades = [
      { id: 5, name: 'Staff Grade-1', basicSalary: 25000, houseRent: 12500, medicalAllowance: 2000, conveyance: 1500, mobileBill: 1000, grossSalary: 42000, isActive: true, type: 'Staff' },
      { id: 6, name: 'Staff Grade-2', basicSalary: 35000, houseRent: 17500, medicalAllowance: 2500, conveyance: 2000, mobileBill: 1500, grossSalary: 58500, isActive: true, type: 'Staff' },
      { id: 7, name: 'Staff Grade-3', basicSalary: 45000, houseRent: 22500, medicalAllowance: 3000, conveyance: 2500, mobileBill: 2000, grossSalary: 75000, isActive: true, type: 'Staff' }
    ]
    
    return [...workerGrades, ...staffGrades]
  }

  // Get salary grade by name
  getSalaryGradeByName(gradeName) {
    return this.getAllSalaryGrades().find(grade => grade.name === gradeName)
  }

  // Add new department
  addDepartment(departmentData) {
    const newId = Math.max(...this.departments.map(d => d.id), 0) + 1
    const newDepartment = {
      id: newId,
      ...departmentData,
      isActive: true
    }
    this.departments.push(newDepartment)
    this.saveToStorage()
    return newDepartment
  }

  // Add new designation
  addDesignation(designationData) {
    const newId = Math.max(...this.designations.map(d => d.id), 0) + 1
    const newDesignation = {
      id: newId,
      ...designationData,
      isActive: true
    }
    this.designations.push(newDesignation)
    this.saveToStorage()
    return newDesignation
  }

  // Update department
  updateDepartment(id, departmentData) {
    const index = this.departments.findIndex(d => d.id === id)
    if (index !== -1) {
      this.departments[index] = { ...this.departments[index], ...departmentData }
      this.saveToStorage()
      return this.departments[index]
    }
    return null
  }

  // Update designation
  updateDesignation(id, designationData) {
    const index = this.designations.findIndex(d => d.id === id)
    if (index !== -1) {
      this.designations[index] = { ...this.designations[index], ...designationData }
      this.saveToStorage()
      return this.designations[index]
    }
    return null
  }

  // Delete department (soft delete)
  deleteDepartment(id) {
    const index = this.departments.findIndex(d => d.id === id)
    if (index !== -1) {
      this.departments[index].isActive = false
      this.saveToStorage()
      return true
    }
    return false
  }

  // Delete designation (soft delete)
  deleteDesignation(id) {
    const index = this.designations.findIndex(d => d.id === id)
    if (index !== -1) {
      this.designations[index].isActive = false
      this.saveToStorage()
      return true
    }
    return false
  }

  // Add new operation
  addOperation(operationData) {
    const newId = Math.max(...this.operations.map(o => o.id), 0) + 1
    const newOperation = {
      id: newId,
      ...operationData,
      isActive: true
    }
    this.operations.push(newOperation)
    this.saveToStorage()
    return newOperation
  }

  // Delete operation (soft delete)
  deleteOperation(id) {
    const index = this.operations.findIndex(o => o.id === id)
    if (index !== -1) {
      this.operations[index].isActive = false
      this.saveToStorage()
      return true
    }
    return false
  }

  // Add new machine
  addMachine(machineData) {
    const newId = Math.max(...this.machines.map(m => m.id), 0) + 1
    const newMachine = {
      id: newId,
      ...machineData,
      isActive: true
    }
    this.machines.push(newMachine)
    this.saveToStorage()
    return newMachine
  }

  // Delete machine (soft delete)
  deleteMachine(id) {
    const index = this.machines.findIndex(m => m.id === id)
    if (index !== -1) {
      this.machines[index].isActive = false
      this.saveToStorage()
      return true
    }
    return false
  }

  // Add new skill metric
  addSkillMetric(skillData) {
    const newId = Math.max(...this.skillMetrics.map(s => s.id), 0) + 1
    const newSkill = {
      id: newId,
      ...skillData,
      isActive: true
    }
    this.skillMetrics.push(newSkill)
    this.saveToStorage()
    return newSkill
  }

  // Delete skill metric (soft delete)
  deleteSkillMetric(id) {
    const index = this.skillMetrics.findIndex(s => s.id === id)
    if (index !== -1) {
      this.skillMetrics[index].isActive = false
      this.saveToStorage()
      return true
    }
    return false
  }

  // Add new staff salary grade
  addStaffSalaryGrade(gradeData) {
    const newId = Math.max(...this.staffSalaryGrades.map(g => g.id), 0) + 1
    const newGrade = {
      id: newId,
      ...gradeData,
      isActive: true
    }
    this.staffSalaryGrades.push(newGrade)
    this.saveToStorage()
    return newGrade
  }

  // Delete staff salary grade (soft delete)
  deleteStaffSalaryGrade(id) {
    const index = this.staffSalaryGrades.findIndex(g => g.id === id)
    if (index !== -1) {
      this.staffSalaryGrades[index].isActive = false
      this.saveToStorage()
      return true
    }
    return false
  }

  // Add new process expertise
  addProcessExpertise(expertiseData) {
    const newId = Math.max(...this.processExpertise.map(e => e.id), 0) + 1
    const newExpertise = {
      id: newId,
      ...expertiseData,
      isActive: true
    }
    this.processExpertise.push(newExpertise)
    this.saveToStorage()
    return newExpertise
  }

  // Update process expertise
  updateProcessExpertise(id, expertiseData) {
    const index = this.processExpertise.findIndex(e => e.id === id)
    if (index !== -1) {
      this.processExpertise[index] = { ...this.processExpertise[index], ...expertiseData }
      this.saveToStorage()
      return this.processExpertise[index]
    }
    return null
  }

  // Delete process expertise (soft delete)
  deleteProcessExpertise(id) {
    const index = this.processExpertise.findIndex(e => e.id === id)
    if (index !== -1) {
      this.processExpertise[index].isActive = false
      this.saveToStorage()
      return true
    }
    return false
  }

  // Save data to localStorage
  saveToStorage() {
    localStorage.setItem('organizationalData', JSON.stringify({
      departments: this.departments,
      designations: this.designations,
      processExpertise: this.processExpertise,
      operations: this.operations,
      machines: this.machines,
      skillMetrics: this.skillMetrics,
      staffSalaryGrades: this.staffSalaryGrades
    }))
    
    // Emit custom event to notify components of data changes
    window.dispatchEvent(new CustomEvent('organizationalDataChanged'))
  }

  // Load data from localStorage
  loadFromStorage() {
    const saved = localStorage.getItem('organizationalData')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        this.departments = data.departments || this.departments
        this.designations = data.designations || this.designations
        this.processExpertise = data.processExpertise || this.processExpertise
        this.operations = data.operations || this.operations
        this.machines = data.machines || this.machines
        this.skillMetrics = data.skillMetrics || this.skillMetrics
        this.staffSalaryGrades = data.staffSalaryGrades || this.staffSalaryGrades
      } catch (error) {
        console.error('Error loading organizational data:', error)
      }
    }
  }

  // Handle storage changes from other tabs
  handleStorageChange(event) {
    if (event.key === 'organizationalData') {
      this.loadFromStorage()
    }
  }

  // Clean up duplicate data
  cleanupDuplicates() {
    // Remove duplicate designations by name
    const uniqueDesignations = []
    const seenNames = new Set()
    
    this.designations.forEach(designation => {
      if (!seenNames.has(designation.name)) {
        seenNames.add(designation.name)
        uniqueDesignations.push(designation)
      }
    })
    this.designations = uniqueDesignations

    // Remove duplicate departments by name
    const uniqueDepartments = []
    const seenDeptNames = new Set()
    
    this.departments.forEach(department => {
      if (!seenDeptNames.has(department.name)) {
        seenDeptNames.add(department.name)
        uniqueDepartments.push(department)
      }
    })
    this.departments = uniqueDepartments

    // Remove duplicate process expertise by operation + machine combination
    const uniqueProcessExpertise = []
    const seenExpertise = new Set()
    
    this.processExpertise.forEach(expertise => {
      const key = `${expertise.operation}-${expertise.machine}`
      if (!seenExpertise.has(key)) {
        seenExpertise.add(key)
        uniqueProcessExpertise.push(expertise)
      }
    })
    this.processExpertise = uniqueProcessExpertise

    // Save cleaned data
    this.saveToStorage()
  }

  // Initialize the service
  init() {
    this.loadFromStorage()
    this.cleanupDuplicates()
  }
}

// Create and export a singleton instance
const organizationalDataService = new OrganizationalDataService()
organizationalDataService.init()

export default organizationalDataService
