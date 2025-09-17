import { useState, useEffect, useRef } from 'react'
import employeeService from '../../services/employeeService'
import assetService from '../../services/assetService'
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD, getCurrentDateYYYYMMDD } from '../../utils/dateUtils'

// Custom Date Input Component for DD/MM/YYYY format
const CustomDateInput = ({ value, onChange, required, className, minDate, ...props }) => {
  const [displayValue, setDisplayValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  useEffect(() => {
    if (value && !isTyping) {
      // Convert YYYY-MM-DD to DD/MM/YYYY for display
      const date = new Date(value)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      setDisplayValue(`${day}/${month}/${year}`)
    } else if (!value && !isTyping) {
      setDisplayValue('')
    }
  }, [value, isTyping])

  const handleInputChange = (e) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)
    setIsTyping(true)
    
    // Auto-format as user types (DD/MM/YYYY)
    if (inputValue.length === 2 && !inputValue.includes('/')) {
      setDisplayValue(inputValue + '/')
    } else if (inputValue.length === 5 && inputValue.charAt(2) === '/' && !inputValue.substring(3).includes('/')) {
      setDisplayValue(inputValue + '/')
    }
  }

  const handleBlur = () => {
    setIsTyping(false)
    
    // Validate and convert DD/MM/YYYY to YYYY-MM-DD
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
    const match = displayValue.match(dateRegex)
    
    if (match) {
      const [, day, month, year] = match
      const date = new Date(year, month - 1, day)
      
      // Check if date is valid
      if (date.getFullYear() == year && date.getMonth() == month - 1 && date.getDate() == day) {
        // Check if date is on or after minimum date
        if (minDate) {
          const minDateObj = new Date(minDate)
          // Set time to start of day for accurate comparison
          minDateObj.setHours(0, 0, 0, 0)
          const inputDate = new Date(year, month - 1, day)
          inputDate.setHours(0, 0, 0, 0)
          
          if (inputDate < minDateObj) {
            // Date is before minimum date, show error and reset
            alert(`Assignment date must be on or after the asset purchase date (${formatDateToDDMMYYYY(minDate)})`)
            if (value) {
              const date = new Date(value)
              const day = String(date.getDate()).padStart(2, '0')
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const year = date.getFullYear()
              setDisplayValue(`${day}/${month}/${year}`)
            } else {
              setDisplayValue('')
            }
            return
          }
        }
        
        const isoDate = `${year}-${month}-${day}`
        onChange({ target: { value: isoDate } })
        // Update display value to ensure consistency
        setDisplayValue(`${day}/${month}/${year}`)
      } else {
        // Invalid date, reset to previous value
        if (value) {
          const date = new Date(value)
          const day = String(date.getDate()).padStart(2, '0')
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const year = date.getFullYear()
          setDisplayValue(`${day}/${month}/${year}`)
        } else {
          setDisplayValue('')
        }
      }
    } else if (displayValue === '') {
      onChange({ target: { value: '' } })
    } else {
      // Invalid format, reset to previous value
      if (value) {
        const date = new Date(value)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        setDisplayValue(`${day}/${month}/${year}`)
      } else {
        setDisplayValue('')
      }
    }
  }

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder="DD/MM/YYYY"
      className={className}
      required={required}
      {...props}
    />
  )
}

const AssignAsset = () => {
  const [selectedAsset, setSelectedAsset] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [assignmentDate, setAssignmentDate] = useState('')
  const [assignedBy, setAssignedBy] = useState('')
  const [condition, setCondition] = useState('')
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [assetSearchTerm, setAssetSearchTerm] = useState('')
  const [showAssetSuggestions, setShowAssetSuggestions] = useState(false)

  const [availableAssets, setAvailableAssets] = useState([])
  const [allAssets, setAllAssets] = useState([])
  const [employees, setEmployees] = useState([])
  const [assignmentHistory, setAssignmentHistory] = useState([])
  const searchRef = useRef(null)
  const assetSearchRef = useRef(null)

  // Function to get condition color styling
  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Good':
        return 'bg-green-100 text-green-800'
      case 'Need Maintenance':
        return 'bg-orange-100 text-orange-800'
      case 'Lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Function to format assignment date for display
  const formatAssignmentDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    try {
      // If it's already in DD/MM/YYYY format, return as is
      if (dateString.includes('/') && dateString.split('/').length === 3) {
        return dateString
      }
      
      // If it's in YYYY-MM-DD format, convert to DD/MM/YYYY
      if (dateString.includes('-') && dateString.split('-').length === 3) {
        const dateParts = dateString.split('-')
        if (dateParts.length === 3) {
          return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`
        }
      }
      
      // Try to parse as a date and format
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
      }
      
      return 'Invalid Date'
    } catch (error) {
      console.error('Error formatting assignment date:', error, 'Input:', dateString)
      return 'Invalid Date'
    }
  }

  // Function to get minimum assignment date based on selected asset
  const getMinAssignmentDate = () => {
    if (!selectedAsset) return ''
    
    const asset = allAssets.find(a => a.id === selectedAsset)
    if (!asset || !asset.purchaseDate) return ''
    
    // Convert purchase date to YYYY-MM-DD format for HTML date input
    let purchaseDate = asset.purchaseDate
    
    // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (purchaseDate.includes('/') && purchaseDate.split('/').length === 3) {
      const dateParts = purchaseDate.split('/')
      if (dateParts.length === 3) {
        purchaseDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
      }
    }
    
    return purchaseDate
  }


  // Handle delete assignment
  const handleDeleteAssignment = async (assignment) => {
    if (window.confirm(`Are you sure you want to delete the assignment for ${assignment.asset}?`)) {
      try {
        // Unassign the asset
        await assetService.unassignAsset(assignment.assetId)
        
        // Reload assignment history
        const updatedAssignments = await assetService.getAssignmentHistory()
        setAssignmentHistory(updatedAssignments)
        
        // Reload available assets
        const availableAssets = await assetService.getAvailableAssets()
        setAvailableAssets(availableAssets)
        
        alert('Assignment deleted successfully!')
      } catch (error) {
        console.error('Error deleting assignment:', error)
        alert('Error deleting assignment. Please try again.')
      }
    }
  }

  // Load employees from employee service
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const allEmployees = await employeeService.getAllEmployees()
        setEmployees(allEmployees)
        // Set employees data in asset service for update operations
        assetService.setEmployees(allEmployees)
      } catch (error) {
        console.error('Error loading employees:', error)
        setEmployees([])
      }
    }
    
    loadEmployees()
  }, [])

  // Load all assets from asset service
  useEffect(() => {
    const loadAllAssets = async () => {
      try {
        const assets = await assetService.getAllAssets()
        setAllAssets(assets)
      } catch (error) {
        console.error('Error loading all assets:', error)
        setAllAssets([])
      }
    }
    
    loadAllAssets()
  }, [])

  // Load available assets from asset service
  useEffect(() => {
    const loadAvailableAssets = async () => {
      try {
        const assets = await assetService.getAvailableAssets()
        setAvailableAssets(assets)
      } catch (error) {
        console.error('Error loading available assets:', error)
        setAvailableAssets([])
      }
    }
    
    loadAvailableAssets()
  }, [])

  // Load assignment history from asset service
  useEffect(() => {
    const loadAssignmentHistory = async () => {
      try {
        const assignments = await assetService.getAssignmentHistory()
        setAssignmentHistory(assignments)
      } catch (error) {
        console.error('Error loading assignment history:', error)
        setAssignmentHistory([])
      }
    }
    
    loadAssignmentHistory()
  }, [])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
      if (assetSearchRef.current && !assetSearchRef.current.contains(event.target)) {
        setShowAssetSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Filter employees based on search term
  const filteredEmployees = employees.filter(emp => 
    emp.id.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(employeeSearchTerm.toLowerCase())
  )

  // Filter assets based on search term
  const filteredAssets = availableAssets.filter(asset => 
    asset.id.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
    asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
    asset.category.toLowerCase().includes(assetSearchTerm.toLowerCase()) ||
    asset.department.toLowerCase().includes(assetSearchTerm.toLowerCase())
  )

  // Handle employee search input
  const handleEmployeeSearch = (value) => {
    setEmployeeSearchTerm(value)
    setShowSuggestions(value.length > 0)
    if (value === '') {
      setSelectedEmployee('')
    }
  }

  // Handle employee selection from suggestions
  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee.id)
    setEmployeeSearchTerm(`${employee.id} - ${employee.name} (${employee.department})`)
    setShowSuggestions(false)
  }

  // Clear employee selection
  const clearEmployeeSelection = () => {
    setSelectedEmployee('')
    setEmployeeSearchTerm('')
    setShowSuggestions(false)
  }

  // Handle asset search input
  const handleAssetSearch = (value) => {
    setAssetSearchTerm(value)
    setShowAssetSuggestions(value.length > 0)
    if (value === '') {
      setSelectedAsset('')
    }
  }

  // Handle asset selection from suggestions
  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset.id)
    setAssetSearchTerm(`${asset.id} - ${asset.name} (${asset.category}) - ${asset.value}`)
    setShowAssetSuggestions(false)
    // Clear assignment date when asset changes to force user to select valid date
    setAssignmentDate('')
  }

  // Clear asset selection
  const clearAssetSelection = () => {
    setSelectedAsset('')
    setAssetSearchTerm('')
    setShowAssetSuggestions(false)
    // Clear assignment date when asset is cleared
    setAssignmentDate('')
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Find the selected asset and employee details
    const asset = availableAssets.find(a => a.id === selectedAsset)
    const employee = employees.find(emp => emp.id === selectedEmployee)
    
    if (!asset || !employee) {
      alert('Please select both an asset and an employee')
      return
    }
    
    try {
      // Create assignment data
      const assignmentData = {
        assignmentDate: assignmentDate ? formatDateToDDMMYYYY(assignmentDate) : assignmentDate,
      assignedBy,
        assignedCondition: condition
      }
      
      // Assign the asset using the asset service
      await assetService.assignAsset(selectedAsset, selectedEmployee, employee.name, assignmentData)
      
      // Show success message
      alert(`Asset "${asset.name}" has been successfully assigned to ${employee.name} (${selectedEmployee})`)
      
      // Reload available assets and assignment history to reflect the assignment
      const updatedAssets = await assetService.getAvailableAssets()
      const updatedAssignments = await assetService.getAssignmentHistory()
      setAvailableAssets(updatedAssets)
      setAssignmentHistory(updatedAssignments)
      
      // Reset form
      setSelectedAsset('')
      setSelectedEmployee('')
      setAssignmentDate('')
      setAssignedBy('')
      setCondition('')
      setEmployeeSearchTerm('')
      setShowSuggestions(false)
      setAssetSearchTerm('')
      setShowAssetSuggestions(false)
      
    } catch (error) {
      console.error('Error assigning asset:', error)
      alert(`Error assigning asset: ${error.message}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Returned': return 'bg-blue-100 text-blue-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Assign Asset</h1>
        <p className="text-sm text-gray-500">Assign company assets to employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">New Asset Assignment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset *</label>
              <div className="relative" ref={assetSearchRef}>
                <input
                  type="text"
                  placeholder="Search by ID, name, category, or department..."
                  value={assetSearchTerm}
                  onChange={(e) => handleAssetSearch(e.target.value)}
                  onFocus={() => setShowAssetSuggestions(assetSearchTerm.length > 0)}
                required
                  className="w-full h-10 rounded border border-gray-300 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {selectedAsset && (
                  <button
                    type="button"
                    onClick={clearAssetSelection}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* Asset Suggestions Dropdown */}
                {showAssetSuggestions && filteredAssets.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredAssets.map(asset => (
                      <div
                        key={asset.id}
                        onClick={() => handleAssetSelect(asset)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{asset.id} - {asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.category} • {asset.department} • {asset.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {showAssetSuggestions && filteredAssets.length === 0 && assetSearchTerm.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      No assets found matching "{assetSearchTerm}"
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee *</label>
              <div className="relative" ref={searchRef}>
                <input
                  type="text"
                  placeholder="Search by ID, name, or department..."
                  value={employeeSearchTerm}
                  onChange={(e) => handleEmployeeSearch(e.target.value)}
                  onFocus={() => setShowSuggestions(employeeSearchTerm.length > 0)}
                required
                  className="w-full h-10 rounded border border-gray-300 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {selectedEmployee && (
                  <button
                    type="button"
                    onClick={clearEmployeeSelection}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* Suggestions Dropdown */}
                {showSuggestions && filteredEmployees.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredEmployees.map(emp => (
                      <div
                        key={emp.id}
                        onClick={() => handleEmployeeSelect(emp)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{emp.id} - {emp.name}</div>
                        <div className="text-sm text-gray-500">{emp.department}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No results message */}
                {showSuggestions && filteredEmployees.length === 0 && employeeSearchTerm.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="px-3 py-2 text-gray-500 text-sm">
                      No employees found matching "{employeeSearchTerm}"
                    </div>
              </div>
                )}
              </div>
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Date *</label>
              <CustomDateInput
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                minDate={getMinAssignmentDate()}
                  required
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              {selectedAsset && getMinAssignmentDate() && (
                <p className="text-xs text-gray-500 mt-1">
                  Must be on or after purchase date: {formatDateToDDMMYYYY(getMinAssignmentDate())}
                </p>
              )}
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned By *</label>
              <select
                value={assignedBy}
                onChange={(e) => setAssignedBy(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select employee...</option>
                {employees.map(emp => (
                  <option key={emp.id} value={`${emp.id} - ${emp.name}`}>
                    {emp.id} - {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select condition...</option>
                <option value="Good">Good</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-100 text-orange-700 py-2 px-4 rounded hover:bg-orange-200 transition-colors font-medium"
            >
              Assign Asset
            </button>
          </form>
        </div>

        {/* Available Assets Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Available Assets</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {availableAssets.map(asset => (
                <div key={asset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                  <div>
                    <div className="font-medium text-gray-900">{asset.name}</div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">ID: {asset.id}</span> • {asset.category} • {asset.department}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{asset.value}</div>
                    <div className="text-xs text-green-600">Available</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium mb-4">Quick Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-semibold text-gray-600">{allAssets.length}</div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-2xl font-semibold text-blue-600">{availableAssets.length}</div>
                <div className="text-sm text-blue-600">Available</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-2xl font-semibold text-green-600">{assignmentHistory.length}</div>
                <div className="text-sm text-green-600">Assigned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Asset Assignments</h3>
          <p className="text-sm text-gray-500">Track current asset assignments</p>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignmentHistory.length > 0 ? (
                assignmentHistory.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{assignment.assetId || 'N/A'}</div>
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{assignment.asset}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{assignment.employee}</div>
                      <div className="text-xs text-gray-500">{assignment.employeeId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatAssignmentDate(assignment.assignedDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionColor(assignment.assignedCondition)}`}>
                        {assignment.assignedCondition || 'Good'}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded">
                      {assignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{assignment.assignedBy || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteAssignment(assignment)}
                        className="px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-md font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    No asset assignments found. Assign an asset to see it here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default AssignAsset
