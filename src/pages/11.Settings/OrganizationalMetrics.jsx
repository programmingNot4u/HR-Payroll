import { useState, useEffect } from 'react'
import organizationalDataService from '../../services/organizationalDataService'

const OrganizationalMetrics = () => {
  const [activeTab, setActiveTab] = useState('designations')
  const [designations, setDesignations] = useState([])
  const [departments, setDepartments] = useState([])
  const [salaryGrades, setSalaryGrades] = useState([
    { id: 1, name: 'Worker Grade-1', basicSalary: 8390, houseRent: 4195, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 15035, isActive: true },
    { id: 2, name: 'Worker Grade-2', basicSalary: 7882, houseRent: 3941, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 14273, isActive: true },
    { id: 3, name: 'Worker Grade-3', basicSalary: 7400, houseRent: 3700, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 13550, isActive: true },
    { id: 4, name: 'Worker Grade-4', basicSalary: 6700, houseRent: 3350, medicalAllowance: 750, conveyance: 450, foodAllowance: 1250, grossSalary: 12500, isActive: true }
  ])

  const [staffSalaryGrades, setStaffSalaryGrades] = useState([])
  
  const [skillMetrics, setSkillMetrics] = useState([])

  const [processExpertise, setProcessExpertise] = useState([])
  const [operations, setOperations] = useState([])
  const [machines, setMachines] = useState([])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [salaryGradeType, setSalaryGradeType] = useState('worker') // 'worker' or 'staff'
  const [addType, setAddType] = useState('processExpertise') // 'processExpertise', 'operation', 'machine'

  // Load data from service on component mount
  useEffect(() => {
    const loadData = () => {
      setDesignations(organizationalDataService.getDesignations())
      setDepartments(organizationalDataService.getDepartments())
      setProcessExpertise(organizationalDataService.getProcessExpertise())
      setSkillMetrics(organizationalDataService.getSkillMetrics())
      setStaffSalaryGrades(organizationalDataService.getStaffSalaryGrades())
      
      // Load operations and machines from service
      setOperations(organizationalDataService.getOperations())
      setMachines(organizationalDataService.getMachines())
    }
    
    loadData()
    
    // Listen for storage changes to update data
    const handleStorageChange = () => {
      loadData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const tabs = [
    { id: 'designations', name: 'Designations' },
    { id: 'departments', name: 'Departments' },
    { id: 'salaryGrades', name: 'Salary Grade Management' },
    { id: 'skillMetrics', name: 'Skill Metrics' },
    { id: 'processExpertise', name: 'Process Expertise' }
  ]

  const getCurrentData = () => {
    switch (activeTab) {
      case 'designations': return designations
      case 'departments': return departments
      case 'salaryGrades': return [...salaryGrades, ...staffSalaryGrades]
      case 'skillMetrics': return skillMetrics
      case 'processExpertise': return processExpertise
      default: return []
    }
  }


  const handleAdd = (type = 'processExpertise') => {
    setEditingItem(null)
    setFormData({})
    setSalaryGradeType('worker')
    setAddType(type)
    setShowAddModal(true)
  }


  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'designations') {
        organizationalDataService.deleteDesignation(id)
      } else if (activeTab === 'departments') {
        organizationalDataService.deleteDepartment(id)
      } else if (activeTab === 'salaryGrades') {
        // Check if it's a staff or worker grade
        const isStaffGrade = staffSalaryGrades.find(item => item.id === id)
        if (isStaffGrade) {
          organizationalDataService.deleteStaffSalaryGrade(id)
        } else {
          setSalaryGrades(prev => prev.filter(item => item.id !== id))
        }
      } else if (activeTab === 'skillMetrics') {
        organizationalDataService.deleteSkillMetric(id)
      } else if (activeTab === 'processExpertise') {
        organizationalDataService.deleteProcessExpertise(id)
      }
      
      // Refresh data from service
      setDesignations(organizationalDataService.getDesignations())
      setDepartments(organizationalDataService.getDepartments())
      setProcessExpertise(organizationalDataService.getProcessExpertise())
      setSkillMetrics(organizationalDataService.getSkillMetrics())
      setStaffSalaryGrades(organizationalDataService.getStaffSalaryGrades())
    }
  }

  const handleSave = () => {
    if (editingItem) {
      // Update existing item
      if (activeTab === 'designations') {
        organizationalDataService.updateDesignation(editingItem.id, formData)
      } else if (activeTab === 'departments') {
        organizationalDataService.updateDepartment(editingItem.id, formData)
      } else if (activeTab === 'salaryGrades') {
        // Check if it's a staff or worker grade
        const isStaffGrade = staffSalaryGrades.find(item => item.id === editingItem.id)
        if (isStaffGrade) {
          setStaffSalaryGrades(prev => prev.map(item => 
            item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
          ))
        } else {
          setSalaryGrades(prev => prev.map(item => 
            item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
          ))
        }
      } else if (activeTab === 'processExpertise') {
        if (addType === 'operation') {
          setOperations(prev => prev.map(item => 
            item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
          ))
        } else if (addType === 'machine') {
          setMachines(prev => prev.map(item => 
            item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
          ))
        } else {
          organizationalDataService.updateProcessExpertise(editingItem.id, formData)
        }
      }
    } else {
      // Add new item
      if (activeTab === 'designations') {
        organizationalDataService.addDesignation(formData)
      } else if (activeTab === 'departments') {
        organizationalDataService.addDepartment(formData)
      } else if (activeTab === 'salaryGrades') {
        if (salaryGradeType === 'staff') {
          organizationalDataService.addStaffSalaryGrade(formData)
        } else {
          const newId = Math.max(...salaryGrades.map(item => item.id), 0) + 1
          setSalaryGrades(prev => [...prev, { ...formData, id: newId, isActive: true }])
        }
      } else if (activeTab === 'skillMetrics') {
        organizationalDataService.addSkillMetric(formData)
      } else if (activeTab === 'processExpertise') {
        if (addType === 'operation') {
          organizationalDataService.addOperation(formData)
        } else if (addType === 'machine') {
          organizationalDataService.addMachine(formData)
        } else {
          organizationalDataService.addProcessExpertise(formData)
        }
      }
    }
    
    // Refresh data from service
    setDesignations(organizationalDataService.getDesignations())
    setDepartments(organizationalDataService.getDepartments())
    setProcessExpertise(organizationalDataService.getProcessExpertise())
    setSkillMetrics(organizationalDataService.getSkillMetrics())
    setStaffSalaryGrades(organizationalDataService.getStaffSalaryGrades())
    setOperations(organizationalDataService.getOperations())
    setMachines(organizationalDataService.getMachines())
    
    setShowAddModal(false)
    setEditingItem(null)
    setFormData({})
    setSalaryGradeType('worker')
    setAddType('processExpertise')
  }

  // Auto-calculate gross salary for salary grades
  useEffect(() => {
    if (activeTab === 'salaryGrades' && formData.basicSalary && formData.houseRent && formData.medicalAllowance && formData.conveyance) {
      let grossSalary = 0
      if (salaryGradeType === 'staff' && formData.mobileBill) {
        grossSalary = (formData.basicSalary || 0) + (formData.houseRent || 0) + (formData.medicalAllowance || 0) + (formData.conveyance || 0) + (formData.mobileBill || 0)
      } else if (salaryGradeType === 'worker' && formData.foodAllowance) {
        grossSalary = (formData.basicSalary || 0) + (formData.houseRent || 0) + (formData.medicalAllowance || 0) + (formData.conveyance || 0) + (formData.foodAllowance || 0)
      }
      if (grossSalary > 0) {
        setFormData(prev => ({ ...prev, grossSalary }))
      }
    }
  }, [formData.basicSalary, formData.houseRent, formData.medicalAllowance, formData.conveyance, formData.foodAllowance, formData.mobileBill, activeTab, salaryGradeType])


  const renderFormFields = () => {
    // Handle process expertise add types
    if (activeTab === 'processExpertise') {
      switch (addType) {
        case 'operation':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operation Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Rob Joint"
              />
            </div>
          )
        case 'machine':
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Machine Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="e.g., Overlock"
              />
            </div>
          )
        case 'processExpertise':
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Operation</label>
                <select
                  value={formData.operation || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, operation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Operation</option>
                  {operations.map(op => (
                    <option key={op.id} value={op.name}>{op.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Machine</label>
                <select
                  value={formData.machine || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, machine: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Machine</option>
                  {machines.map(machine => (
                    <option key={machine.id} value={machine.name}>{machine.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )
        default:
          return null
      }
    }
    
    switch (activeTab) {
      case 'designations':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Software Engineer"
            />
          </div>
        )
      
      case 'departments':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Cutting Department"
            />
          </div>
        )
      
      case 'salaryGrades':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Type</label>
              <select
                value={salaryGradeType}
                onChange={(e) => {
                  setSalaryGradeType(e.target.value)
                  setFormData(prev => ({ ...prev, foodAllowance: undefined, mobileBill: undefined }))
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="worker">Worker</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={salaryGradeType === 'worker' ? 'e.g., Worker Grade-1' : 'e.g., Staff Grade-1'}
              />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                {salaryGradeType === 'worker' ? 'Worker' : 'Staff'} Salary Components
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Basic Salary (Tk)</label>
                  <input
                    type="number"
                    value={formData.basicSalary || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, basicSalary: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={salaryGradeType === 'worker' ? '8390' : '25000'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">House Rent (Tk)</label>
                  <input
                    type="number"
                    value={formData.houseRent || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, houseRent: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={salaryGradeType === 'worker' ? '4195' : '12500'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Medical Allowance (Tk)</label>
                  <input
                    type="number"
                    value={formData.medicalAllowance || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, medicalAllowance: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={salaryGradeType === 'worker' ? '750' : '2000'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Conveyance (Tk)</label>
                  <input
                    type="number"
                    value={formData.conveyance || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, conveyance: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={salaryGradeType === 'worker' ? '450' : '1500'}
                  />
                </div>
                {salaryGradeType === 'worker' ? (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Food Allowance (Tk)</label>
                    <input
                      type="number"
                      value={formData.foodAllowance || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, foodAllowance: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1250"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Mobile Bill (Tk)</label>
                    <input
                      type="number"
                      value={formData.mobileBill || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobileBill: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1000"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Gross Salary (Tk)</label>
                  <input
                    type="number"
                    value={formData.grossSalary || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, grossSalary: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                    placeholder={salaryGradeType === 'worker' ? '15035' : '42000'}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'skillMetrics':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Technical Skills"
            />
          </div>
        )
      
      
      default:
        return null
    }
  }

  const renderTable = () => {
    const data = getCurrentData()
    
    if (activeTab === 'salaryGrades') {
      const workerGrades = salaryGrades
      const staffGrades = staffSalaryGrades
      
      
      return (
        <div className="space-y-8">
          {/* Worker Grades Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Worker Salary Grades</h3>
                  <p className="text-sm text-gray-500">{workerGrades.length} grades available</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSalaryGradeType('worker')
                  handleAdd()
                }}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
              >
                <span>+</span>
                Add Worker Grade
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House Rent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conveyance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Allowance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {workerGrades.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.basicSalary?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.houseRent?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.medicalAllowance?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.conveyance?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.foodAllowance?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.grossSalary?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Staff Grades Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-100">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Staff Salary Grades</h3>
                  <p className="text-sm text-gray-500">{staffGrades.length} grades available</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSalaryGradeType('staff')
                  handleAdd()
                }}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
              >
                <span>+</span>
                Add Staff Grade
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Basic Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House Rent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conveyance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Bill</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffGrades.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.basicSalary?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.houseRent?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.medicalAllowance?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.conveyance?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.mobileBill?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{item.grossSalary?.toLocaleString()} Tk</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }
    
    // Process Expertise layout
    if (activeTab === 'processExpertise') {
      return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium">Process Expertise Management</h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleAdd('operation')}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
              >
                <span>+</span>
                Add Operation
              </button>
              <button
                onClick={() => handleAdd('machine')}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
              >
                <span>+</span>
                Add Machine
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Operations Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgb(255,250,245)' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgb(200,100,50)' }}>
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'rgb(200,100,50)' }}>Operations</h2>
                    <p className="text-sm text-gray-600">Available operations in the system</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgb(255,250,245)', color: 'rgb(200,100,50)' }}>
                    {operations.length} operations
                  </span>
                </div>
                
                <div className="space-y-3">
                  {operations.map((operation) => {
                    return (
                      <div key={operation.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{operation.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this operation?')) {
                                  organizationalDataService.deleteOperation(operation.id)
                                  setOperations(organizationalDataService.getOperations())
                                }
                              }}
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Machines Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgb(255,250,245)' }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgb(200,100,50)' }}>
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: 'rgb(200,100,50)' }}>Machines</h2>
                    <p className="text-sm text-gray-600">Available machines in the system</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgb(255,250,245)', color: 'rgb(200,100,50)' }}>
                    {machines.length} machines
                  </span>
                </div>
                
                <div className="space-y-3">
                  {machines.map((machine) => {
                    return (
                      <div key={machine.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{machine.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this machine?')) {
                                  organizationalDataService.deleteMachine(machine.id)
                                  setMachines(organizationalDataService.getMachines())
                                }
                              }}
                              className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
              )
      }
      
      // Departments layout
      if (activeTab === 'departments') {
        return (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium">Departments</h3>
              <button
                onClick={handleAdd}
                className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
              >
                <span>+</span>
                Add Department
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {data.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <div className="text-center mb-4">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      }
      
      // Default layout for other tabs
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {tabs.find(tab => tab.id === activeTab)?.name} Management
          </h3>
          <button
            onClick={handleAdd}
            className="text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
            style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
          >
            <span>+</span>
            Add {tabs.find(tab => tab.id === activeTab)?.name.slice(0, -1)}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-6">
          {data.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:scale-105">
              <div className="text-center mb-4">
                <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizational Metrics</h1>
          <p className="text-sm text-gray-500">Manage designations, departments, work levels, and skill metrics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={activeTab === tab.id ? { 
                borderBottomColor: 'rgb(255,200,150)', 
                color: 'rgb(200,100,50)' 
              } : {}}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderTable()}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit' : 'Add'} {
                  activeTab === 'processExpertise' 
                    ? addType === 'operation' ? 'Operation' 
                    : addType === 'machine' ? 'Machine' 
                    : 'Process Expertise'
                    : tabs.find(tab => tab.id === activeTab)?.name.slice(0, -1)
                }
              </h3>
              <div className="space-y-4">
                {renderFormFields()}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                  style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                  onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                  onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizationalMetrics

