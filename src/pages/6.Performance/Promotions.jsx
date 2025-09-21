import React, { useState, useEffect } from 'react'
import employeeService from '../../services/employeeService'
import organizationalDataService from '../../services/organizationalDataService'

export default function Promotions() {
  const [filters, setFilters] = useState({
    employeeId: '',
    designation: '',
    department: '',
    status: '',
    month: '',
    year: ''
  })

  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [salaryGrades, setSalaryGrades] = useState([])
  const [promotions, setPromotions] = useState({})
  const [kpiData, setKpiData] = useState({})

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
      status: '',
      month: '',
      year: ''
    })
  }

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const employeesData = await employeeService.getAllEmployees()
        setEmployees(employeesData.filter(emp => emp.status === 'Active'))
        setDepartments(organizationalDataService.getDepartments())
        setDesignations(organizationalDataService.getDesignations())
        setSalaryGrades(organizationalDataService.getAllSalaryGrades())
        
        // Load KPI data from localStorage (from KPI page)
        const savedRatings = localStorage.getItem('kpiEmployeeRatings')
        let kpiRatings = {}
        
        if (savedRatings) {
          try {
            const savedData = JSON.parse(savedRatings)
            console.log('Promotions - Loaded KPI ratings:', savedData)
            
            // Handle both old format (array) and new format (object)
            if (Array.isArray(savedData)) {
              // Old format: array of employees with skillRatings
              savedData.forEach(emp => {
                if (emp.skillRatings && Object.keys(emp.skillRatings).length > 0) {
                  const ratings = Object.values(emp.skillRatings).filter(rating => rating > 0)
                  if (ratings.length > 0) {
                    const average = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1)
                    kpiRatings[emp.id] = average
                  }
                }
              })
            } else {
              // New format: object with employee ID as key
              Object.keys(savedData).forEach(empId => {
                const skillRatings = savedData[empId]
                if (skillRatings && Object.keys(skillRatings).length > 0) {
                  const ratings = Object.values(skillRatings).filter(rating => rating > 0)
                  if (ratings.length > 0) {
                    const average = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1)
                    kpiRatings[empId] = average
                  }
                }
              })
            }
          } catch (error) {
            console.error('Error parsing KPI ratings:', error)
          }
        }
        
        // If no saved ratings, use mock data as fallback
        if (Object.keys(kpiRatings).length === 0) {
          employeesData.forEach(emp => {
            if (emp.status === 'Active') {
              const baseRating = 3.0
              const randomFactor = Math.random() * 2 // 0-2
              kpiRatings[emp.id] = (baseRating + randomFactor).toFixed(1)
            }
          })
        }
        
        setKpiData(kpiRatings)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  // Filter employees based on selected filters
  const filteredEmployees = employees.filter(employee => {
    const matchesEmployeeId = !filters.employeeId || employee.id.toString().includes(filters.employeeId)
    const matchesDesignation = !filters.designation || employee.designation === filters.designation
    const matchesDepartment = !filters.department || employee.department === filters.department
    const matchesStatus = !filters.status || (promotions[employee.id]?.status === filters.status)
    const matchesMonth = !filters.month || (promotions[employee.id]?.month === filters.month)
    const matchesYear = !filters.year || (promotions[employee.id]?.year === filters.year)
    
    return matchesEmployeeId && matchesDesignation && matchesDepartment && matchesStatus && matchesMonth && matchesYear
  })

  // Handle promotion selection
  const handlePromotionSelect = (employeeId, isSelected) => {
    if (isSelected) {
      setPromotions(prev => ({
        ...prev,
        [employeeId]: {
          status: 'Selected For Promotion',
          month: new Date().toLocaleDateString('en-GB').split('/')[1].padStart(2, '0'),
          year: new Date().getFullYear().toString(),
          promotedDesignation: '',
          promotedDepartment: '',
          promotedLevelOfWork: '',
          promotedSalaryGrade: ''
        }
      }))
    } else {
      setPromotions(prev => {
        const newPromotions = { ...prev }
        delete newPromotions[employeeId]
        return newPromotions
      })
    }
  }

  // Handle promotion details update
  const handlePromotionUpdate = (employeeId, field, value) => {
    setPromotions(prev => {
      const updatedPromotion = {
        ...prev[employeeId],
        [field]: value
      }
      
      // If level of work changes, clear the salary grade to avoid invalid combinations
      if (field === 'promotedLevelOfWork') {
        updatedPromotion.promotedSalaryGrade = ''
      }
      
      return {
        ...prev,
        [employeeId]: updatedPromotion
      }
    })
  }

  // Function to refresh KPI data from localStorage
  const refreshKpiData = () => {
    const savedRatings = localStorage.getItem('kpiEmployeeRatings')
    let kpiRatings = {}
    
    if (savedRatings) {
      try {
        const savedData = JSON.parse(savedRatings)
        
        // Handle both old format (array) and new format (object)
        if (Array.isArray(savedData)) {
          savedData.forEach(emp => {
            if (emp.skillRatings && Object.keys(emp.skillRatings).length > 0) {
              const ratings = Object.values(emp.skillRatings).filter(rating => rating > 0)
              if (ratings.length > 0) {
                const average = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1)
                kpiRatings[emp.id] = average
              }
            }
          })
        } else {
          Object.keys(savedData).forEach(empId => {
            const skillRatings = savedData[empId]
            if (skillRatings && Object.keys(skillRatings).length > 0) {
              const ratings = Object.values(skillRatings).filter(rating => rating > 0)
              if (ratings.length > 0) {
                const average = (ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length).toFixed(1)
                kpiRatings[empId] = average
              }
            }
          })
        }
      } catch (error) {
        console.error('Error parsing KPI ratings:', error)
      }
    }
    
    setKpiData(kpiRatings)
    console.log('KPI data refreshed:', kpiRatings)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Promotions</h1>
          <p className="text-gray-600 mt-1">Manage and track employee promotion requests and approvals</p>
        </div>
          <button
            onClick={refreshKpiData}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh KPI Data
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filter Promotion Data</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear All Filters
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
        {(filters.employeeId || filters.designation || filters.department || filters.status || filters.month || filters.year) && (
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
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Status: {filters.status}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                  </span>
              )}
              {filters.month && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Month: {filters.month === '01' ? 'January' : filters.month === '02' ? 'February' : filters.month === '03' ? 'March' : filters.month === '04' ? 'April' : filters.month === '05' ? 'May' : filters.month === '06' ? 'June' : filters.month === '07' ? 'July' : filters.month === '08' ? 'August' : filters.month === '09' ? 'September' : filters.month === '10' ? 'October' : filters.month === '11' ? 'November' : filters.month === '12' ? 'December' : filters.month}
                  <button
                    onClick={() => handleFilterChange('month', '')}
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

       {/* Employee List */}
       <div className="bg-white rounded-lg border border-gray-200">
         <div className="px-6 py-4 border-b border-gray-200">
           <h3 className="text-lg font-semibold text-gray-900">Employee List</h3>
           <p className="text-sm text-gray-600 mt-1">
             Showing {filteredEmployees.length} of {employees.length} employees
           </p>
                </div>
                
         <div className="p-6">
           {filteredEmployees.length > 0 ? (
             <div className="space-y-4">
               {filteredEmployees.map(employee => {
                 const promotion = promotions[employee.id]
                 const kpiRating = kpiData[employee.id] || '0.0'
                 const isSelectedForPromotion = promotion?.status === 'Selected For Promotion'
                 
                 return (
                   <div key={employee.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:scale-[1.01] bg-white hover:bg-orange-50/30">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                       {/* Left Section - Employee Information */}
                       <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-gray-900">Employee Details</h3>
                         
                         <div className="space-y-3">
                           <div className="flex items-center space-x-3">
                             <span className="text-sm font-medium text-gray-500 min-w-[120px]">ID:</span>
                             <span className="text-sm font-semibold text-gray-900">{employee.id}</span>
                           </div>
                           <div className="flex items-center space-x-3">
                             <span className="text-sm font-medium text-gray-500 min-w-[120px]">Name:</span>
                             <span className="text-sm font-semibold text-gray-900">{employee.name}</span>
                           </div>
                           <div className="flex items-center space-x-3">
                             <span className="text-sm font-medium text-gray-500 min-w-[120px]">Designation:</span>
                             <span className="text-sm text-gray-700">{employee.designation}</span>
                           </div>
                           <div className="flex items-center space-x-3">
                             <span className="text-sm font-medium text-gray-500 min-w-[120px]">Department:</span>
                             <span className="text-sm text-gray-700">{employee.department}</span>
                  </div>
                           <div className="flex items-center space-x-3">
                             <span className="text-sm font-medium text-gray-500 min-w-[120px]">Level of Work:</span>
                             <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                               {employee.levelOfWork}
                             </span>
                  </div>
                           <div className="flex items-center space-x-3">
                             <span className="text-sm font-medium text-gray-500 min-w-[120px]">Salary Grade:</span>
                             <span className="text-sm text-gray-700">{employee.salaryGrade || 'Not assigned'}</span>
                  </div>
                  </div>
                </div>

                       {/* Middle Section - KPI Rating */}
                       <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                         
                         <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
                           <div className="text-center">
                             <div className="text-3xl font-bold text-orange-600 mb-2">{kpiRating}/5</div>
                             <div className="text-sm font-medium text-gray-700 mb-2">KPI Rating</div>
                             <div className="text-xs text-gray-500 mb-3">From KPI Page</div>
                             <div className="flex justify-center space-x-1">
                               {[1, 2, 3, 4, 5].map((star) => (
                                 <svg
                                   key={star}
                                   className={`w-5 h-5 ${star <= parseFloat(kpiRating) ? 'text-orange-400' : 'text-gray-300'}`}
                                   fill="currentColor"
                                   viewBox="0 0 20 20"
                                 >
                                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                 </svg>
                               ))}
                  </div>
                  </div>
                </div>

                         {/* Performance Level Indicator */}
                         <div className="text-center">
                           <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                             parseFloat(kpiRating) >= 4.5 ? 'bg-green-100 text-green-800' :
                             parseFloat(kpiRating) >= 3.5 ? 'bg-yellow-100 text-yellow-800' :
                             parseFloat(kpiRating) >= 2.5 ? 'bg-orange-100 text-orange-800' :
                             'bg-red-100 text-red-800'
                           }`}>
                             {parseFloat(kpiRating) >= 4.5 ? 'Excellent' :
                              parseFloat(kpiRating) >= 3.5 ? 'Good' :
                              parseFloat(kpiRating) >= 2.5 ? 'Average' :
                              'Needs Improvement'}
                      </div>
                  </div>
                </div>

                       {/* Right Section - Promotion Actions */}
                       <div className="space-y-4">
                         <h3 className="text-lg font-semibold text-gray-900">Promotion Decision</h3>
                         
                         <div className="space-y-3">
                           <div className="flex gap-2">
                             <button
                               onClick={() => handlePromotionSelect(employee.id, true)}
                               className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                 isSelectedForPromotion
                                   ? 'bg-green-600 text-white hover:bg-green-700'
                                   : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                               }`}
                             >
                               Selected For Promotion
                             </button>
                             <button
                               onClick={() => handlePromotionSelect(employee.id, false)}
                               className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                 !isSelectedForPromotion
                                   ? 'bg-red-600 text-white hover:bg-red-700'
                                   : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                               }`}
                             >
                               No Promotion
                             </button>
                </div>

                           {isSelectedForPromotion && (
                             <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                               <h4 className="text-sm font-semibold text-green-800 mb-3">Promotion Details</h4>
                               <div className="space-y-3">
                  <div>
                                   <label className="block text-xs font-medium text-gray-600 mb-1">Promoted Designation</label>
                                   <select
                                     value={promotion.promotedDesignation || ''}
                                     onChange={(e) => handlePromotionUpdate(employee.id, 'promotedDesignation', e.target.value)}
                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                   <label className="block text-xs font-medium text-gray-600 mb-1">Promoted Department</label>
                                   <select
                                     value={promotion.promotedDepartment || ''}
                                     onChange={(e) => handlePromotionUpdate(employee.id, 'promotedDepartment', e.target.value)}
                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                   <label className="block text-xs font-medium text-gray-600 mb-1">Promoted Level of Work</label>
                                   <select
                                     value={promotion.promotedLevelOfWork || ''}
                                     onChange={(e) => handlePromotionUpdate(employee.id, 'promotedLevelOfWork', e.target.value)}
                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                   >
                                     <option value="">Select Level</option>
                                     <option value="Worker">Worker</option>
                                     <option value="Staff">Staff</option>
                                   </select>
                      </div>
                                 <div>
                                   <label className="block text-xs font-medium text-gray-600 mb-1">Promoted Salary Grade</label>
                                   <select
                                     value={promotion.promotedSalaryGrade || ''}
                                     onChange={(e) => handlePromotionUpdate(employee.id, 'promotedSalaryGrade', e.target.value)}
                                     className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                   >
                                     <option value="">Select Salary Grade</option>
                                     {salaryGrades
                                       .filter(grade => {
                                         if (!promotion.promotedLevelOfWork) return true
                                         return grade.type === promotion.promotedLevelOfWork
                                       })
                                       .map(grade => (
                                         <option key={grade.id} value={grade.name}>
                                           {grade.name}
                                         </option>
                                       ))}
                                   </select>
                    </div>
                  </div>
                </div>
                           )}
              </div>
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
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
         </div>
       </div>
    </div>
  )
}
