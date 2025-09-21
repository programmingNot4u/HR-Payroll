import React, { useState, useEffect } from 'react'
import organizationalDataService from '../../services/organizationalDataService'
import employeeService from '../../services/employeeService'

export default function GoalsKPIs() {
  const [filters, setFilters] = useState({
    employeeId: '',
    designation: '',
    department: '',
    levelOfWork: '',
    year: ''
  })

  const [designations, setDesignations] = useState([])
  const [departments, setDepartments] = useState([])
  const [employees, setEmployees] = useState([])
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [skillMetrics, setSkillMetrics] = useState([])

  useEffect(() => {
    // Load designations and departments from organizational data service
    setDesignations(organizationalDataService.getDesignations())
    setDepartments(organizationalDataService.getDepartments())
    setSkillMetrics(organizationalDataService.getSkillMetrics())
    
    // Load active employees from employee service
    loadActiveEmployees()
    
    // Debug: Check what's in localStorage
    console.log('Current localStorage kpiEmployeeRatings:', localStorage.getItem('kpiEmployeeRatings'))
  }, [])

  // Load active employees from employee service
  const loadActiveEmployees = async () => {
    try {
      const allEmployees = await employeeService.getAllEmployees()
      console.log('KPI - Loaded employees:', allEmployees)
      
      // Filter for active staff employees only
      const activeStaffEmployees = allEmployees.filter(emp => 
        emp.status === 'Active' && emp.levelOfWork === 'Staff'
      )
      
      console.log('KPI - Active staff employees:', activeStaffEmployees)
      
      // Load saved ratings from localStorage
      const savedRatings = localStorage.getItem('kpiEmployeeRatings')
      let savedRatingsData = {}
      
      if (savedRatings) {
        try {
          const savedData = JSON.parse(savedRatings)
          console.log('KPI - Loaded saved ratings:', savedData)
          
          // Handle both old format (array) and new format (object)
          if (Array.isArray(savedData)) {
            // Old format: array of employees with skillRatings
            savedData.forEach(emp => {
              if (emp.skillRatings) {
                savedRatingsData[emp.id] = emp.skillRatings
              }
            })
          } else {
            // New format: object with employee ID as key
            savedRatingsData = savedData
          }
        } catch (error) {
          console.error('Error parsing saved ratings:', error)
        }
      }
      
      // Merge employee data with saved ratings
      const employeesWithRatings = activeStaffEmployees.map(emp => ({
        ...emp,
        skillRatings: savedRatingsData[emp.id] || emp.skillRatings || {}
      }))
      
      console.log('KPI - Final employees with ratings:', employeesWithRatings)
      setEmployees(employeesWithRatings)
    } catch (error) {
      console.error('Error loading employees:', error)
      // Set empty array if service fails
      setEmployees([])
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      employeeId: '',
      designation: '',
      department: '',
      levelOfWork: '',
      year: ''
    })
  }

  // Debug function to clear localStorage
  const clearStoredRatings = () => {
    localStorage.removeItem('kpiEmployeeRatings')
    console.log('Cleared stored ratings from localStorage')
    // Reset employees to fresh data without ratings
    setEmployees(prev => prev.map(emp => ({
      ...emp,
      skillRatings: {}
    })))
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const currentDate = new Date().toLocaleDateString('en-GB')
    
    let printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Employee KPI List - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #ea580c; margin-bottom: 10px; }
            .header p { color: #666; margin: 5px 0; }
            .filters { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .filters h3 { margin: 0 0 10px 0; color: #374151; }
            .filter-item { display: inline-block; margin-right: 20px; margin-bottom: 5px; }
            .filter-label { font-weight: bold; color: #6b7280; }
            .filter-value { color: #ea580c; }
            .employee-card { 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
              padding: 20px; 
              margin-bottom: 20px; 
              background: white;
            }
            .employee-header { 
              border-bottom: 2px solid #ea580c; 
              padding-bottom: 10px; 
              margin-bottom: 15px; 
            }
            .employee-name { font-size: 18px; font-weight: bold; color: #111827; margin: 0; }
            .employee-details { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 10px; 
              margin-bottom: 15px; 
            }
            .detail-item { margin-bottom: 5px; }
            .detail-label { font-weight: bold; color: #6b7280; }
            .detail-value { color: #374151; }
            .skills-section { margin-top: 15px; }
            .skills-title { 
              font-weight: bold; 
              color: #ea580c; 
              margin-bottom: 10px; 
              padding: 8px; 
              background: #fed7aa; 
              border-radius: 4px; 
            }
            .skills-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 15px; 
            }
            .skill-category { margin-bottom: 15px; }
            .skill-list { margin-left: 15px; }
            .skill-item { 
              display: flex; 
              justify-content: space-between; 
              margin-bottom: 5px; 
              padding: 3px 0; 
            }
            .skill-name { color: #374151; }
            .skill-rating { color: #ea580c; font-weight: bold; }
            .average-rating { 
              text-align: center; 
              font-size: 16px; 
              font-weight: bold; 
              color: #ea580c; 
              margin: 15px 0; 
              padding: 10px; 
              background: #fef3c7; 
              border-radius: 6px; 
            }
            .no-data { text-align: center; color: #6b7280; font-style: italic; padding: 40px; }
            @media print {
              body { margin: 0; }
              .employee-card { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee KPI List</h1>
            <p>Generated on: ${currentDate}</p>
            <p>Total Employees: ${filteredEmployees.length}</p>
          </div>
    `

    // Add active filters if any
    const activeFilters = []
    if (filters.employeeId) activeFilters.push(`Employee ID: ${filters.employeeId}`)
    if (filters.designation) activeFilters.push(`Designation: ${filters.designation}`)
    if (filters.department) activeFilters.push(`Department: ${filters.department}`)
    if (filters.levelOfWork) activeFilters.push(`Level: ${filters.levelOfWork}`)
    if (filters.year) activeFilters.push(`Year: ${filters.year}`)

    if (activeFilters.length > 0) {
      printContent += `
        <div class="filters">
          <h3>Applied Filters:</h3>
          ${activeFilters.map(filter => `<span class="filter-item"><span class="filter-label">${filter.split(':')[0]}:</span> <span class="filter-value">${filter.split(':')[1].trim()}</span></span>`).join('')}
        </div>
      `
    }

    // Add employee data
    if (filteredEmployees.length > 0) {
      filteredEmployees.forEach(employee => {
        const employeeSkills = getSkillsForEmployee(employee.designation, employee.department)
        const averageRating = calculateAverageRating(employee.skillRatings || {})
        
        printContent += `
          <div class="employee-card">
            <div class="employee-header">
              <h2 class="employee-name">${employee.name} || ${employee.designation} || ${employee.department}</h2>
            </div>
            
            <div class="employee-details">
              <div class="detail-item">
                <span class="detail-label">Employee ID:</span> <span class="detail-value">${employee.id}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Designation:</span> <span class="detail-value">${employee.designation}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Department:</span> <span class="detail-value">${employee.department}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Level of Work:</span> <span class="detail-value">${employee.levelOfWork}</span>
              </div>
            </div>

            <div class="average-rating">
              Average Rating: ${averageRating}/5
            </div>

            <div class="skills-section">
              <div class="skills-grid">
                <div class="skill-category">
                  <div class="skills-title">Soft Skills</div>
                  <div class="skill-list">
        `
        
        // Add soft skills
        employeeSkills.softSkills.forEach(skill => {
          const rating = employee.skillRatings?.[skill] || 0
          printContent += `
            <div class="skill-item">
              <span class="skill-name">${skill}</span>
              <span class="skill-rating">${rating}/5</span>
            </div>
          `
        })
        
        printContent += `
                  </div>
                </div>
                
                <div class="skill-category">
                  <div class="skills-title">Technical Skills</div>
                  <div class="skill-list">
        `
        
        // Add technical skills
        employeeSkills.technicalSkills.forEach(skill => {
          const rating = employee.skillRatings?.[skill] || 0
          printContent += `
            <div class="skill-item">
              <span class="skill-name">${skill}</span>
              <span class="skill-rating">${rating}/5</span>
            </div>
          `
        })
        
        printContent += `
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      })
    } else {
      printContent += `
        <div class="no-data">
          No employees found matching the current filters.
        </div>
      `
    }

    printContent += `
        </body>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  // Get skills for an employee based on designation and department
  const getSkillsForEmployee = (designation, department) => {
    const skills = {
      softSkills: [],
      technicalSkills: []
    }
    
    // Get soft skills
    const softSkills = skillMetrics.filter(skill => skill.type === 'soft')
    softSkills.forEach(skill => {
      if (skill.skills) {
        skill.skills.forEach(skillName => {
          skills.softSkills.push(skillName)
        })
      }
    })
    
    // Get technical skills for specific designation and department
    const technicalSkills = skillMetrics.filter(skill => 
      skill.type === 'technical' && 
      skill.name === designation && 
      skill.department === department
    )
    technicalSkills.forEach(skill => {
      if (skill.skills) {
        skill.skills.forEach(skillName => {
          skills.technicalSkills.push(skillName)
        })
      }
    })
    
    return skills
  }

  // Filter employees based on selected filters - only active staff employees
  const filteredEmployees = employees.filter(employee => {
    const matchesEmployeeId = !filters.employeeId || employee.id.toString().includes(filters.employeeId)
    const matchesDesignation = !filters.designation || employee.designation === filters.designation
    const matchesDepartment = !filters.department || employee.department === filters.department
    const matchesLevelOfWork = !filters.levelOfWork || employee.levelOfWork === filters.levelOfWork
    const matchesYear = !filters.year || (employee.dateOfJoining && new Date(employee.dateOfJoining).getFullYear().toString() === filters.year)
    
    return matchesEmployeeId && matchesDesignation && matchesDepartment && matchesLevelOfWork && matchesYear
  })

  // Calculate average rating for an employee
  const calculateAverageRating = (skillRatings) => {
    if (!skillRatings || Object.keys(skillRatings).length === 0) return 0
    const ratings = Object.values(skillRatings).filter(rating => rating > 0)
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, rating) => acc + rating, 0)
    return (sum / ratings.length).toFixed(1)
  }

  // Handle edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setEditFormData({
      name: employee.name,
      designation: employee.designation,
      department: employee.department,
      levelOfWork: employee.levelOfWork,
      skillRatings: { ...employee.skillRatings }
    })
    setShowEditModal(true)
  }

  // Handle designation or department change in edit form
  const handleEditFormChange = (field, value) => {
    setEditFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // If designation or department changes, reset skill ratings for technical skills
      if (field === 'designation' || field === 'department') {
        const newSkills = getSkillsForEmployee(
          field === 'designation' ? value : newData.designation,
          field === 'department' ? value : newData.department
        )
        
        // Keep existing ratings for soft skills, reset technical skills
        const updatedSkillRatings = { ...prev.skillRatings }
        
        // Remove ratings for technical skills that are no longer relevant
        Object.keys(updatedSkillRatings).forEach(skill => {
          if (!newSkills.softSkills.includes(skill) && !newSkills.technicalSkills.includes(skill)) {
            delete updatedSkillRatings[skill]
          }
        })
        
        newData.skillRatings = updatedSkillRatings
      }
      
      return newData
    })
  }

  // Handle skill rating change in edit form
  const handleSkillRatingChange = (skillName, rating) => {
    setEditFormData(prev => ({
      ...prev,
      skillRatings: {
        ...prev.skillRatings,
        [skillName]: parseInt(rating)
      }
    }))
  }

  // Handle save employee changes
  const handleSaveEmployee = () => {
    console.log('Save button clicked!')
    console.log('Editing employee:', editingEmployee)
    console.log('Edit form data:', editFormData)
    
    if (!editingEmployee) {
      console.error('No employee being edited')
      return
    }
    
    const updatedEmployees = employees.map(emp => 
      emp.id === editingEmployee.id 
        ? { ...emp, ...editFormData }
        : emp
    )
    
    console.log('Updated employees:', updatedEmployees)
    
    // Update local state
    setEmployees(updatedEmployees)
    
    // Save only skill ratings to localStorage (much smaller data)
    try {
      const ratingsOnly = updatedEmployees.map(emp => ({
        id: emp.id,
        skillRatings: emp.skillRatings || {}
      }))
      localStorage.setItem('kpiEmployeeRatings', JSON.stringify(ratingsOnly))
      console.log('Data saved to localStorage successfully')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
      // If still too large, try saving individual employee ratings
      try {
        const individualRatings = {}
        updatedEmployees.forEach(emp => {
          if (emp.skillRatings && Object.keys(emp.skillRatings).length > 0) {
            individualRatings[emp.id] = emp.skillRatings
          }
        })
        localStorage.setItem('kpiEmployeeRatings', JSON.stringify(individualRatings))
        console.log('Individual ratings saved to localStorage')
      } catch (secondError) {
        console.error('Error saving individual ratings:', secondError)
        // Clear old data and try again
        localStorage.removeItem('kpiEmployeeRatings')
        const minimalRatings = {}
        updatedEmployees.forEach(emp => {
          if (emp.skillRatings && Object.keys(emp.skillRatings).length > 0) {
            minimalRatings[emp.id] = emp.skillRatings
          }
        })
        localStorage.setItem('kpiEmployeeRatings', JSON.stringify(minimalRatings))
        console.log('Minimal ratings saved after clearing old data')
      }
    }
    
    setShowEditModal(false)
    setEditingEmployee(null)
    setEditFormData({})
    
    console.log('Modal closed and form reset')
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingEmployee(null)
    setEditFormData({})
  }

  return (
    <div className="space-y-6">
        <div>
        <h1 className="text-2xl font-semibold text-gray-900">KPI</h1>
        <p className="text-gray-600 mt-1">Track and manage key performance indicators</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Active Staff</p>
              <p className="text-2xl font-semibold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Filtered Results</p>
              <p className="text-2xl font-semibold text-gray-900">{filteredEmployees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-semibold text-gray-900">{new Set(employees.map(emp => emp.department)).size}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Designations</p>
              <p className="text-2xl font-semibold text-gray-900">{new Set(employees.map(emp => emp.designation)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter KPI Data</h3>
          <div className="flex gap-2">
            <button
              onClick={clearStoredRatings}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear Stored Ratings
            </button>
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Employee ID Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={filters.employeeId}
              onChange={(e) => handleFilterChange('employeeId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Designation Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              value={filters.designation}
              onChange={(e) => handleFilterChange('designation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Designations</option>
              {designations.map(designation => (
                <option key={designation.id} value={designation.name}>
                  {designation.name}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map(department => (
                <option key={department.id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          {/* Level of Work Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work</label>
            <select
              value={filters.levelOfWork}
              onChange={(e) => handleFilterChange('levelOfWork', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Levels</option>
              <option value="Worker">Worker</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                )
              })}
            </select>
        </div>
      </div>

        {/* Active Filters Display */}
        {(filters.employeeId || filters.designation || filters.department || filters.levelOfWork || filters.year) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-700">Active Filters:</span>
              {filters.employeeId && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Employee ID: {filters.employeeId}
                  <button
                    onClick={() => handleFilterChange('employeeId', '')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.designation && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Designation: {filters.designation}
                  <button
                    onClick={() => handleFilterChange('designation', '')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {filters.department && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Department: {filters.department}
                  <button
                    onClick={() => handleFilterChange('department', '')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                  </span>
              )}
              {filters.levelOfWork && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Level: {filters.levelOfWork}
                  <button
                    onClick={() => handleFilterChange('levelOfWork', '')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                  </span>
              )}
              {filters.year && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Year: {filters.year}
                  <button
                    onClick={() => handleFilterChange('year', '')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                  </span>
              )}
                </div>
                  </div>
        )}
                  </div>

      {/* Employee List Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
                  <div>
              <h3 className="text-lg font-semibold text-gray-900">Employee List</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredEmployees.length} of {employees.length} employees
              </p>
                  </div>
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print List
            </button>
                  </div>
                </div>

        <div className="p-6">
          {filteredEmployees.length > 0 ? (
      <div className="space-y-4">
              {filteredEmployees.map(employee => {
                const employeeSkills = getSkillsForEmployee(employee.designation, employee.department)
                return (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:scale-[1.02] bg-white hover:bg-orange-50/30">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left Section - Employee Information */}
                      <div className="space-y-4">
                <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">ID:</span>
                            <span className="text-sm font-semibold text-gray-900 group-hover/info:text-orange-800 transition-colors duration-200">{employee.id}</span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">Name:</span>
                            <span className="text-sm font-semibold text-gray-900 group-hover/info:text-orange-800 transition-colors duration-200">{employee.name}</span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">Designation:</span>
                            <span className="text-sm text-gray-700 group-hover/info:text-orange-800 transition-colors duration-200">{employee.designation}</span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">Department:</span>
                            <span className="text-sm text-gray-700 group-hover/info:text-orange-800 transition-colors duration-200">{employee.department}</span>
                          </div>
                          <div className="flex items-center space-x-3 group/info">
                            <span className="text-sm font-medium text-gray-500 group-hover/info:text-orange-600 transition-colors duration-200 min-w-[80px]">Level:</span>
                            <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 group-hover/info:bg-blue-200 group-hover/info:text-blue-900 transition-all duration-200 shadow-sm group-hover/info:shadow-md">
                              {employee.levelOfWork}
                    </span>
                  </div>
                        </div>
                      </div>

                      {/* Middle Section - Soft Skills Ratings */}
                      <div className="group">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center group-hover:text-blue-600 transition-colors duration-200">
                          <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full group-hover:bg-blue-600 transition-colors duration-200"></div>
                          </div>
                          Soft Skills
                        </h4>
                        <div className="space-y-2">
                          {employeeSkills.softSkills.length > 0 ? (
                            employeeSkills.softSkills.map((skill, index) => {
                              const rating = employee.skillRatings[skill] || 0
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 group/skill">
                                  <span className="text-sm text-gray-700 group-hover/skill:text-blue-800 transition-colors duration-200">{skill}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-blue-600 group-hover/skill:text-blue-700 transition-colors duration-200">{rating}/5</span>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          className={`w-3 h-3 transition-all duration-200 ${star <= rating ? 'text-blue-400 group-hover/skill:text-blue-500' : 'text-gray-300 group-hover/skill:text-gray-400'}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <span className="text-xs text-gray-400">No soft skills defined for this role</span>
                          )}
                        </div>
                      </div>

                      {/* Right Section - Technical Skills Ratings */}
                      <div className="group">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center group-hover:text-green-600 transition-colors duration-200">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors duration-200">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full group-hover:bg-green-600 transition-colors duration-200"></div>
                          </div>
                          Technical Skills
                        </h4>
                        <div className="space-y-2">
                          {employeeSkills.technicalSkills.length > 0 ? (
                            employeeSkills.technicalSkills.map((skill, index) => {
                              const rating = employee.skillRatings[skill] || 0
                              return (
                                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 group/skill">
                                  <span className="text-sm text-gray-700 group-hover/skill:text-green-800 transition-colors duration-200">{skill}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-green-600 group-hover/skill:text-green-700 transition-colors duration-200">{rating}/5</span>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                          key={star}
                                          className={`w-3 h-3 transition-all duration-200 ${star <= rating ? 'text-green-400 group-hover/skill:text-green-500' : 'text-gray-300 group-hover/skill:text-gray-400'}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <span className="text-xs text-gray-400">No technical skills defined for this role</span>
                          )}
                        </div>
                  </div>
                </div>

                    {/* Average Rating */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-700">Average Rating:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-orange-600">
                              {calculateAverageRating(employee.skillRatings)}/5
                        </span>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${star <= calculateAverageRating(employee.skillRatings) ? 'text-orange-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleEditEmployee(employee)}
                          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Employee Skills</h2>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Employee Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <select
                      value={editFormData.designation || ''}
                      onChange={(e) => handleEditFormChange('designation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Designation</option>
                      {designations.map(designation => (
                        <option key={designation.id} value={designation.name}>
                          {designation.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={editFormData.department || ''}
                      onChange={(e) => handleEditFormChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(department => (
                        <option key={department.id} value={department.name}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work</label>
                    <select
                      value={editFormData.levelOfWork || ''}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, levelOfWork: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="Staff">Staff</option>
                      <option value="Worker">Worker</option>
                    </select>
                  </div>
                </div>

                {/* Skills Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Soft Skills Ratings */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      Soft Skills Ratings
                    </h4>
                    <div className="space-y-3">
                      {editingEmployee && getSkillsForEmployee(editingEmployee.designation, editingEmployee.department).softSkills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">{skill}</span>
                          <select
                            value={editFormData.skillRatings?.[skill] || 0}
                            onChange={(e) => handleSkillRatingChange(skill, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value={0}>No Rating</option>
                            <option value={1}>1 - Poor</option>
                            <option value={2}>2 - Fair</option>
                            <option value={3}>3 - Good</option>
                            <option value={4}>4 - Very Good</option>
                            <option value={5}>5 - Excellent</option>
                          </select>
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Technical Skills Ratings */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      Technical Skills Ratings
                    </h4>
                    <div className="space-y-3">
                      {editFormData.designation && editFormData.department ? (
                        getSkillsForEmployee(editFormData.designation, editFormData.department).technicalSkills.map((skill, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                            <select
                              value={editFormData.skillRatings?.[skill] || 0}
                              onChange={(e) => handleSkillRatingChange(skill, e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                            >
                              <option value={0}>No Rating</option>
                              <option value={1}>1 - Poor</option>
                              <option value={2}>2 - Fair</option>
                              <option value={3}>3 - Good</option>
                              <option value={4}>4 - Very Good</option>
                              <option value={5}>5 - Excellent</option>
                            </select>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">Please select Designation and Department to view technical skills</p>
                        </div>
                      )}
                    </div>
                </div>
              </div>
              
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                </button>
                  <button
                    onClick={handleSaveEmployee}
                    className="px-4 py-2 text-sm font-medium text-white rounded transition-colors"
                    style={{ background: 'linear-gradient(135deg, #ffb366, #ff8c42)' }}
                    onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #ff9f4d, #ff7a2e)'}
                    onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #ffb366, #ff8c42)'}
                  >
                    Save Changes
                </button>
              </div>
            </div>
          </div>
      </div>
        </div>
      )}

    </div>
  )
}

