import { useState, useEffect } from 'react'
import employeeService from '../../services/employeeService'
import organizationalDataService from '../../services/organizationalDataService'
import employeeLogService from '../../services/employeeLogService'

export default function EmployeeDetails() {
  const [searchId, setSearchId] = useState('')
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [promotionData, setPromotionData] = useState({
    newDesignation: '',
    newDepartment: '',
    newSalary: '',
    effectiveDate: '',
    reason: ''
  })
  const [showPromotionModal, setShowPromotionModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusData, setStatusData] = useState({
    newStatus: '',
    effectiveDate: '',
    reason: ''
  })
  const [showLogModal, setShowLogModal] = useState(false)
  const [employeeLogs, setEmployeeLogs] = useState([])

  // Add print styles
  useEffect(() => {
    const printStyles = `
      <style>
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
            background: white !important;
            color: #000 !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .printable-content, .printable-content * {
            visibility: visible;
          }
          
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-form {
            background: white;
            padding: 30px;
            border: 2px solid #000;
            max-width: 800px;
            margin: 0 auto;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
          }
          
          .print-header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #000;
          }
          
          .print-header .company-info {
            font-size: 14px;
            margin: 5px 0;
            color: #000;
          }
          
          .print-header .form-date {
            font-size: 12px;
            margin: 5px 0;
            color: #000;
          }
          
          .print-header .worker-id {
            font-size: 12px;
            margin: 5px 0;
            color: #000;
          }
          
          .print-photo {
            position: absolute;
            top: 20px;
            right: 20px;
            width: 120px;
            height: 150px;
            border: 2px solid #000;
            background: #f9f9f9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #666;
          }
          
          .print-section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          
          .print-section h2 {
            background-color: #f0f0f0;
            padding: 8px 12px;
            margin: 0 0 15px 0;
            border-left: 4px solid #000;
            font-size: 16px;
            font-weight: bold;
            color: #000;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
          }
          
          .print-field {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .print-field-label {
            font-weight: bold;
            color: #000;
            font-size: 12px;
            min-width: 120px;
            flex-shrink: 0;
          }
          
          .print-field-value {
            border-bottom: 1px solid #000;
            padding: 2px 0;
            min-height: 18px;
            color: #000;
            font-size: 14px;
            flex: 1;
            background: transparent;
            border: none;
            border-bottom: 1px solid #000;
            outline: none;
          }
          
          .print-field-value.empty {
            border-bottom: 1px solid #ccc;
            min-height: 18px;
          }
          
          .print-address-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 20px;
          }
          
          .print-address-section h3 {
            font-size: 14px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #000;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }
          
          .print-address-section .print-field {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .print-address-section .print-field-label {
            font-weight: bold;
            color: #000;
            font-size: 11px;
            min-width: 80px;
            flex-shrink: 0;
          }
          
          .print-address-section .print-field-value {
            border-bottom: 1px solid #000;
            padding: 2px 0;
            min-height: 16px;
            color: #000;
            font-size: 12px;
            flex: 1;
            background: transparent;
            border: none;
            border-bottom: 1px solid #000;
            outline: none;
          }
          
          .print-salary-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 15px;
          }
          
          .print-salary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          
          .print-salary-label {
            font-size: 12px;
            color: #000;
            font-weight: bold;
          }
          
          .print-salary-value {
            font-size: 12px;
            color: #000;
            font-weight: bold;
            border-bottom: 1px solid #000;
            padding: 2px 0;
            min-width: 80px;
            text-align: right;
          }
          
          .print-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          
          .print-table th,
          .print-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-size: 12px;
            color: #000;
          }
          
          .print-table th {
            background-color: #f0f0f0;
            font-weight: bold;
          }
          
          .print-signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #000;
          }
          
          .print-signature {
            text-align: center;
            width: 200px;
          }
          
          .print-signature-line {
            border-bottom: 1px solid #000;
            height: 40px;
            margin-bottom: 5px;
          }
          
          .print-signature-label {
            font-size: 12px;
            color: #000;
            font-weight: bold;
          }
          
          .print-signature-date {
            font-size: 10px;
            color: #666;
            margin-top: 5px;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      </style>
    `
    
    // Add styles to head
    const styleElement = document.createElement('div')
    styleElement.innerHTML = printStyles
    document.head.appendChild(styleElement.firstElementChild)
    
    return () => {
      // Cleanup on unmount
      const addedStyle = document.querySelector('style[data-print-styles]')
      if (addedStyle) {
        addedStyle.remove()
      }
    }
  }, [])

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Please enter an Employee ID')
      return
    }

    setLoading(true)
    setError('')
    setEmployee(null)

    try {
      let searchQuery = searchId.trim()
      
      // If the search query doesn't start with "EMP", add it
      if (!searchQuery.toUpperCase().startsWith('EMP')) {
        searchQuery = `EMP${searchQuery}`
      }
      
      // Search for employee by ID
      const foundEmployee = await employeeService.getEmployeeById(searchQuery)
      
      if (foundEmployee) {
        setEmployee(foundEmployee)
      } else {
        setError('Employee not found with the given ID')
      }
    } catch (error) {
      console.error('Error searching for employee:', error)
      setError('Error searching for employee. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleEdit = () => {
    console.log('Employee data:', employee)
    console.log('Employee picture:', employee.picture)
    setEditData({ 
      ...employee,
      children: employee.children || [],
      processExpertise: employee.processExpertise || [],
      nominee: employee.nominee || [],
      presentAddress: employee.presentAddress || {},
      permanentAddress: employee.permanentAddress || {},
      emergencyContact: employee.emergencyContact || {}
    })
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditData({})
    setIsEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Log changes before saving
      const changes = []
      Object.keys(editData).forEach(key => {
        if (editData[key] !== employee[key]) {
          changes.push({
            field: key,
            oldValue: employee[key],
            newValue: editData[key]
          })
        }
      })
      
      // Save employee
      await employeeService.updateEmployee(employee.id, editData)
      
      // Log each change
      changes.forEach(change => {
        employeeLogService.logEmployeeUpdated(
          employee.id,
          change.field,
          change.oldValue,
          change.newValue
        )
      })
      
      // If picture was changed, log it separately
      if (editData.picture !== employee.picture) {
        employeeLogService.logPhotoUpdated(
          employee.id,
          employee.picture,
          editData.picture
        )
      }
      
      setEmployee(editData)
      setIsEditing(false)
      alert('Employee information updated successfully!')
    } catch (error) {
      console.error('Error updating employee:', error)
      alert('Error updating employee. Please try again.')
    } finally {
      setSaving(false)
    }
  }


  const handlePromotionSubmit = async () => {
    if (!promotionData.newDesignation || !promotionData.newDepartment || !promotionData.newSalary) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const updatedData = {
        ...employee,
        designation: promotionData.newDesignation,
        department: promotionData.newDepartment,
        grossSalary: promotionData.newSalary,
        promotionHistory: [
          ...(employee.promotionHistory || []),
          {
            previousDesignation: employee.designation,
            newDesignation: promotionData.newDesignation,
            previousDepartment: employee.department,
            newDepartment: promotionData.newDepartment,
            previousSalary: employee.grossSalary,
            newSalary: promotionData.newSalary,
            effectiveDate: promotionData.effectiveDate,
            reason: promotionData.reason,
            date: new Date().toISOString().split('T')[0]
          }
        ]
      }

      await employeeService.updateEmployee(employee.id, updatedData)
      
      // Log the promotion
      employeeLogService.logEmployeePromoted(employee.id, {
        previousDesignation: employee.designation,
        newDesignation: promotionData.newDesignation,
        previousDepartment: employee.department,
        newDepartment: promotionData.newDepartment,
        previousSalary: employee.grossSalary,
        newSalary: promotionData.newSalary,
        effectiveDate: promotionData.effectiveDate
      })
      
      setEmployee(updatedData)
      setShowPromotionModal(false)
      alert('Promotion/Demotion processed successfully!')
    } catch (error) {
      console.error('Error processing promotion:', error)
      alert('Error processing promotion. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field, value) => {
    setEditData(prev => {
      const newData = {
      ...prev,
        [field]: value
      }
      
      // If salary grade changes, automatically update gross salary and salary components
      if (field === 'salaryGrade' && value) {
        const selectedGrade = organizationalDataService.getSalaryGradeByName(value)
        if (selectedGrade) {
          newData.grossSalary = selectedGrade.grossSalary
          
          // Auto-populate salary components based on selected grade
          newData.salaryComponents = {
            basicSalary: {
              enabled: true,
              amount: selectedGrade.basicSalary,
              custom: false
            },
            houseRent: {
              enabled: true,
              amount: selectedGrade.houseRent,
              custom: false
            },
            medicalAllowance: {
              enabled: true,
              amount: selectedGrade.medicalAllowance,
              custom: false
            },
            conveyance: {
              enabled: true,
              amount: selectedGrade.conveyance,
              custom: false
            },
            foodAllowance: {
              enabled: true,
              amount: selectedGrade.foodAllowance || 0,
              custom: false
            },
            mobileBill: {
              enabled: selectedGrade.mobileBill ? true : false,
              amount: selectedGrade.mobileBill || 0,
              custom: false
            }
          }
        }
      }
      
      return newData
    })
  }

  const handlePictureChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Convert file to data URL
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })
      setEditData(prev => ({
        ...prev,
        picture: dataUrl
      }))
    }
  }

  const handleNestedInputChange = (parentField, childField, value) => {
    setEditData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value
      }
    }))
  }

  const handlePromotionInputChange = (field, value) => {
    setPromotionData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const handleStatusSubmit = async () => {
    if (!statusData.newStatus || !statusData.effectiveDate) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const updatedData = {
        ...employee,
        status: statusData.newStatus,
        statusHistory: [
          ...(employee.statusHistory || []),
          {
            previousStatus: employee.status,
            newStatus: statusData.newStatus,
            effectiveDate: statusData.effectiveDate,
            reason: statusData.reason,
            date: new Date().toISOString().split('T')[0]
          }
        ]
      }

      await employeeService.updateEmployee(employee.id, updatedData)
      
      // Log the status change
      employeeLogService.logEmployeeStatusChanged(employee.id, {
        previousStatus: employee.status,
        newStatus: statusData.newStatus,
        reason: statusData.reason,
        effectiveDate: statusData.effectiveDate
      })
      
      setEmployee(updatedData)
      setShowStatusModal(false)
      alert(`Employee status changed to ${statusData.newStatus} successfully!`)
    } catch (error) {
      console.error('Error changing employee status:', error)
      alert('Error changing employee status. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusInputChange = (field, value) => {
    setStatusData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const loadEmployeeLogs = () => {
    if (employee && employee.id) {
      const logs = employeeLogService.getEmployeeLogs(employee.id)
      setEmployeeLogs(logs)
      setShowLogModal(true)
    }
  }


  const formatLogTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const printLogs = () => {
    if (employeeLogs.length === 0) return

    // Create a new window for printing logs
    const printWindow = window.open('', '_blank')
    const employeeName = employee?.name || 'All Employees'
    const currentDate = new Date().toLocaleDateString('en-GB')
    
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Employee Activity Logs - ${employeeName}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
          }
          h1 { 
            color: #333; 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
          }
          h2 { 
            color: #666; 
            margin-top: 30px; 
            margin-bottom: 20px;
          }
          .log-entry { 
            margin-bottom: 20px; 
            padding: 15px; 
            border: 1px solid #ddd; 
            border-radius: 5px; 
            page-break-inside: avoid;
          }
          .log-header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 10px; 
            font-weight: bold;
          }
          .action-badge { 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: bold; 
            color: white;
          }
          .employee-created { background-color: #28a745; }
          .employee-updated { background-color: #007bff; }
          .employee-deleted { background-color: #dc3545; }
          .log-details { margin-top: 10px; }
          .field-change { 
            background-color: #f8f9fa; 
            padding: 10px; 
            margin: 5px 0; 
            border-radius: 3px; 
            border-left: 4px solid #007bff;
          }
          .summary {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          @media print {
            body { margin: 0; }
            .log-entry { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>Employee Activity Logs</h1>
        <div class="summary">
          <h2>Summary</h2>
          <p><strong>Employee:</strong> ${employeeName}</p>
          <p><strong>Generated on:</strong> ${currentDate}</p>
          <p><strong>Total Logs:</strong> ${employeeLogs.length}</p>
        </div>
    `

    // Add each log entry
    employeeLogs.forEach((log, index) => {
      const logDate = new Date(log.timestamp).toLocaleDateString('en-GB')
      const logTime = new Date(log.timestamp).toLocaleTimeString('en-GB')
      const actionClass = log.action.toLowerCase().replace(/_/g, '-')
      
      printContent += `
        <div class="log-entry">
          <div class="log-header">
            <span class="action-badge ${actionClass}">${log.action.replace(/_/g, ' ')}</span>
            <span>${logDate} at ${logTime}</span>
          </div>
          <div class="log-details">
            <p><strong>User:</strong> ${log.user.name}</p>
            ${log.field ? `<p><strong>Field:</strong> ${log.field}</p>` : ''}
            ${log.details.message ? `<p><strong>Message:</strong> ${log.details.message}</p>` : ''}
            ${log.details.reason ? `<p><strong>Reason:</strong> ${log.details.reason}</p>` : ''}
            ${log.oldValue !== null && log.newValue !== null ? `
              <div class="field-change">
                <p><strong>Previous Value:</strong> ${typeof log.oldValue === 'object' ? JSON.stringify(log.oldValue, null, 2) : (log.oldValue || 'N/A')}</p>
                <p><strong>New Value:</strong> ${typeof log.newValue === 'object' ? JSON.stringify(log.newValue, null, 2) : (log.newValue || 'N/A')}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `
    })

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

  const downloadLogs = () => {
    if (employeeLogs.length === 0) return

    // Create HTML content for Word document
    const employeeName = employee?.name || 'All Employees'
    const currentDate = new Date().toLocaleDateString('en-GB')
    
    let htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Employee Activity Logs - ${employeeName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; margin-bottom: 30px; }
          h2 { color: #666; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .log-entry { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .log-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .action-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
          .created { background-color: #d4edda; color: #155724; }
          .updated { background-color: #cce5ff; color: #004085; }
          .deleted { background-color: #f8d7da; color: #721c24; }
          .log-details { margin-top: 10px; }
          .field-change { background-color: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>Employee Activity Logs</h1>
        <h2>Employee: ${employeeName}</h2>
        <p><strong>Generated on:</strong> ${currentDate}</p>
        <p><strong>Total Logs:</strong> ${employeeLogs.length}</p>
    `

    // Add each log entry
    employeeLogs.forEach((log, index) => {
      const logDate = new Date(log.timestamp).toLocaleDateString('en-GB')
      const logTime = new Date(log.timestamp).toLocaleTimeString('en-GB')
      const actionClass = log.action.toLowerCase().replace(/_/g, '-')
      
      htmlContent += `
        <div class="log-entry">
          <div class="log-header">
            <span class="action-badge ${actionClass}">${log.action.replace(/_/g, ' ')}</span>
            <span>${logDate} at ${logTime}</span>
          </div>
          <div class="log-details">
            <p><strong>User:</strong> ${log.user.name}</p>
            ${log.field ? `<p><strong>Field:</strong> ${log.field}</p>` : ''}
            ${log.details.message ? `<p><strong>Message:</strong> ${log.details.message}</p>` : ''}
            ${log.details.reason ? `<p><strong>Reason:</strong> ${log.details.reason}</p>` : ''}
            ${log.oldValue !== null && log.newValue !== null ? `
              <div class="field-change">
                <p><strong>Previous Value:</strong> ${typeof log.oldValue === 'object' ? JSON.stringify(log.oldValue, null, 2) : (log.oldValue || 'N/A')}</p>
                <p><strong>New Value:</strong> ${typeof log.newValue === 'object' ? JSON.stringify(log.newValue, null, 2) : (log.newValue || 'N/A')}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `
    })

    htmlContent += `
      </body>
      </html>
    `

    // Create and download file
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `employee_logs_${employeeName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.doc`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'EMPLOYEE_CREATED': return 'bg-green-100 text-green-800'
      case 'EMPLOYEE_UPDATED': return 'bg-blue-100 text-blue-800'
      case 'EMPLOYEE_PROMOTED': return 'bg-purple-100 text-purple-800'
      case 'STATUS_CHANGED': return 'bg-orange-100 text-orange-800'
      case 'PHOTO_UPDATED': return 'bg-pink-100 text-pink-800'
      case 'EMPLOYEE_DELETED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-GB')
    } catch {
      return dateString
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Employee Search Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Search</h2>
              <p className="text-gray-600">Search and manage employee information</p>
            </div>
          </div>
        
        {/* Search Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex gap-6 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Employee ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Employee ID (e.g., 001 or EMP001)"
                  className="w-full h-12 rounded-lg border-2 border-gray-300 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-lg"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgb(255,200,150)' }}
              onMouseEnter={(e) => {
                if (!loading) e.target.style.backgroundColor = 'rgb(255,185,125)'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.target.style.backgroundColor = 'rgb(255,200,150)'
              }}
            >
              {loading ? (
            <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                  Searching...
              </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
              </div>
              )}
          </button>
            </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
          </div>


      {/* Employee Details */}
      {employee && (
        <div className="printable-content space-y-6">
          {/* Print Header */}
          <div className="print-header">
            <h1 className="text-3xl font-bold text-gray-900">Employee Details</h1>
            <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
            </div>

          {/* Print-Only Layout */}
          <div className="hidden print:block">
            <div className="print-form">
              {/* Header Section */}
              <div className="print-header">
                <h1>Employee Registration Form</h1>
                <div className="company-info">Company Name: RP Creations & Apparels Limited</div>
                <div className="form-date">Form Date: {new Date().toLocaleDateString('en-GB')}</div>
                <div className="worker-id">Worker Registration ID: {employee.id}</div>
          </div>

              {/* Employee Photo */}
              <div className="print-photo">
                {(isEditing ? editData.picture : employee.picture) ? (
                  <img 
                    src={(isEditing ? editData.picture : employee.picture).startsWith('data:') ? 
                      (isEditing ? editData.picture : employee.picture) : 
                      `/pictures/${isEditing ? editData.picture : employee.picture}`} 
                    alt="Employee" 
                    className="w-16 h-20 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                ) : null}
                <div className={`text-center text-xs ${(isEditing ? editData.picture : employee.picture) ? 'hidden' : 'block'}`}>
                  Photo
                </div>
              </div>
              
              {/* Personal Information Section */}
              <div className="print-section">
                <h2>Personal Information</h2>
                <div className="print-grid">
                  <div className="print-field">
                    <div className="print-field-label">Name (Bangla):</div>
                    <div className="print-field-value">{employee.nameBangla || ''}</div>
              </div>
                  <div className="print-field">
                    <div className="print-field-label">Name (English):</div>
                    <div className="print-field-value">{employee.name || ''}</div>
              </div>
                  <div className="print-field">
                    <div className="print-field-label">Mobile:</div>
                    <div className="print-field-value">{employee.phone || '+880'}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Email:</div>
                    <div className="print-field-value">{employee.email || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Nationality:</div>
                    <div className="print-field-value">{employee.nationality || 'Bangladeshi'}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Father's Name:</div>
                    <div className="print-field-value">{employee.fathersName || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Mother's Name:</div>
                    <div className="print-field-value">{employee.mothersName || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Spouse Name:</div>
                    <div className="print-field-value">{employee.spouseName || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Date of Birth:</div>
                    <div className="print-field-value">{formatDate(employee.dateOfBirth)}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">NID Number:</div>
                    <div className="print-field-value">{employee.nidNumber || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Blood Group:</div>
                    <div className="print-field-value">{employee.bloodGroup || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Religion:</div>
                    <div className="print-field-value">{employee.religion || 'Islam'}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Marital Status:</div>
                    <div className="print-field-value">{employee.maritalStatus || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Gender:</div>
                    <div className="print-field-value">{employee.gender || ''}</div>
                  </div>
            </div>
          </div>

              {/* Address Information Section */}
              <div className="print-section">
                <h2>Address Information</h2>
                <div className="print-address-grid">
                  <div className="print-address-section">
                    <h3>Present Address</h3>
                    <div className="print-field">
                      <div className="print-field-label">Village:</div>
                      <div className="print-field-value">{employee.presentAddress?.village || ''}</div>
              </div>
                    <div className="print-field">
                      <div className="print-field-label">Post Office:</div>
                      <div className="print-field-value">{employee.presentAddress?.postOffice || ''}</div>
              </div>
                    <div className="print-field">
                      <div className="print-field-label">Upazilla:</div>
                      <div className="print-field-value">{employee.presentAddress?.upazilla || ''}</div>
                    </div>
                    <div className="print-field">
                      <div className="print-field-label">District:</div>
                      <div className="print-field-value">{employee.presentAddress?.district || ''}</div>
                    </div>
                  </div>
                  <div className="print-address-section">
                    <h3>Permanent Address</h3>
                    <div className="print-field">
                      <div className="print-field-label">Village:</div>
                      <div className="print-field-value">{employee.permanentAddress?.village || ''}</div>
                    </div>
                    <div className="print-field">
                      <div className="print-field-label">Post Office:</div>
                      <div className="print-field-value">{employee.permanentAddress?.postOffice || ''}</div>
                    </div>
                    <div className="print-field">
                      <div className="print-field-label">Upazilla:</div>
                      <div className="print-field-value">{employee.permanentAddress?.upazilla || ''}</div>
                    </div>
                    <div className="print-field">
                      <div className="print-field-label">District:</div>
                      <div className="print-field-value">{employee.permanentAddress?.district || ''}</div>
                    </div>
                  </div>
            </div>
          </div>

              {/* Employment Information Section */}
              <div className="print-section">
                <h2>Employment Information</h2>
                <div className="print-grid">
                  <div className="print-field">
                    <div className="print-field-label">Employee ID:</div>
                    <div className="print-field-value">{employee.id}</div>
              </div>
                  <div className="print-field">
                    <div className="print-field-label">Level of Work:</div>
                    <div className="print-field-value">{employee.levelOfWork || 'Worker'}</div>
              </div>
                  <div className="print-field">
                    <div className="print-field-label">Designation:</div>
                    <div className="print-field-value">{employee.designation || ''}</div>
            </div>
                  <div className="print-field">
                    <div className="print-field-label">Department:</div>
                    <div className="print-field-value">{employee.department || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Unit:</div>
                    <div className="print-field-value">{employee.unit || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Line:</div>
                    <div className="print-field-value">{employee.line || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Supervisor:</div>
                    <div className="print-field-value">{employee.supervisorName || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Date of Joining:</div>
                    <div className="print-field-value">{formatDate(employee.dateOfJoining)}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Worker Salary Grade:</div>
                    <div className="print-field-value">{employee.salaryGrade || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Gross Salary:</div>
                    <div className="print-field-value">৳{employee.grossSalary ? Number(employee.grossSalary).toLocaleString() : ''}</div>
                  </div>
          </div>
        </div>

              {/* Salary Breakdown Section */}
              <div className="print-section">
                <h2>Salary Breakdown</h2>
                <div className="print-salary-grid">
                  <div className="print-salary-item">
                    <div className="print-salary-label">Basic Salary:</div>
                    <div className="print-salary-value">৳{employee.salaryComponents?.basicSalary?.amount || 0}</div>
                  </div>
                  <div className="print-salary-item">
                    <div className="print-salary-label">House Rent:</div>
                    <div className="print-salary-value">৳{employee.salaryComponents?.houseRent?.amount || 0}</div>
                  </div>
                  <div className="print-salary-item">
                    <div className="print-salary-label">Medical Allowance:</div>
                    <div className="print-salary-value">৳{employee.salaryComponents?.medicalAllowance?.amount || 0}</div>
                  </div>
                  <div className="print-salary-item">
                    <div className="print-salary-label">Food Allowance:</div>
                    <div className="print-salary-value">৳{employee.salaryComponents?.foodAllowance?.amount || 0}</div>
                  </div>
                  <div className="print-salary-item">
                    <div className="print-salary-label">Conveyance:</div>
                    <div className="print-salary-value">৳{employee.salaryComponents?.conveyance?.amount || 0}</div>
                  </div>
                  <div className="print-salary-item">
                    <div className="print-salary-label">Total Salary:</div>
                    <div className="print-salary-value">৳{employee.grossSalary ? Number(employee.grossSalary).toLocaleString() : 0}</div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Person Section */}
              <div className="print-section">
                <h2>Emergency Contact Person</h2>
                <div className="print-grid">
                  <div className="print-field">
                    <div className="print-field-label">Name:</div>
                    <div className="print-field-value">{employee.emergencyContact?.name || ''}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Mobile:</div>
                    <div className="print-field-value">{employee.emergencyContact?.mobile || '+880'}</div>
                  </div>
                  <div className="print-field">
                    <div className="print-field-label">Relation:</div>
                    <div className="print-field-value">{employee.emergencyContact?.relation || ''}</div>
                  </div>
                </div>
              </div>

              {/* Signatures Section */}
              <div className="print-signatures">
                <div className="print-signature">
                  <div className="print-signature-line"></div>
                  <div className="print-signature-label">Employee Signature</div>
                  <div className="print-signature-date">Date: {new Date().toLocaleDateString('en-GB')}</div>
                </div>
                <div className="print-signature">
                  <div className="print-signature-line"></div>
                  <div className="print-signature-label">HR Manager Signature</div>
                  <div className="print-signature-date">Date: {new Date().toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 print:hidden">
            <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                  </div>
              </div>
              <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600">Employee personal details and contact information</p>
              </div>
            </div>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-6 py-3 text-white rounded-lg transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      style={{ backgroundColor: 'rgb(255,200,150)' }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgb(255,185,125)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgb(255,200,150)'
                      }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Details
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="px-6 py-3 text-white rounded-lg transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      style={{ backgroundColor: 'rgb(255,200,150)' }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgb(255,185,125)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgb(255,200,150)'
                      }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Details
                    </button>
                    <button
                      onClick={loadEmployeeLogs}
                      className="px-6 py-3 text-white rounded-lg transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      style={{ backgroundColor: 'rgb(255,200,150)' }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgb(255,185,125)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgb(255,200,150)'
                      }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Logs
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      style={{ backgroundColor: 'rgb(255,200,150)' }}
                      onMouseEnter={(e) => {
                        if (!saving) e.target.style.backgroundColor = 'rgb(255,185,125)'
                      }}
                      onMouseLeave={(e) => {
                        if (!saving) e.target.style.backgroundColor = 'rgb(255,200,150)'
                      }}
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
          </div>
                      ) : (
            <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                          Save Changes
                        </div>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="px-6 py-3 text-white rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      style={{ backgroundColor: 'rgb(255,200,150)' }}
                      onMouseEnter={(e) => {
                        if (!saving) e.target.style.backgroundColor = 'rgb(255,185,125)'
                      }}
                      onMouseLeave={(e) => {
                        if (!saving) e.target.style.backgroundColor = 'rgb(255,200,150)'
                      }}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Employee Picture */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Employee Picture</label>
              <div className="flex items-start space-x-4">
                <div className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 flex-shrink-0">
                  {isEditing ? (
                    <div className="text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePictureChange}
                        className="hidden"
                        id="picture-upload"
                      />
                      <label
                        htmlFor="picture-upload"
                        className="cursor-pointer flex flex-col items-center w-full h-full"
                      >
                        {(isEditing ? editData.picture : employee.picture) ? (
                          <img 
                            src={(isEditing ? editData.picture : employee.picture).startsWith('data:') ? 
                              (isEditing ? editData.picture : employee.picture) : 
                              `/pictures/${isEditing ? editData.picture : employee.picture}`} 
                            alt="Employee" 
                            className="w-20 h-20 object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'block'
                            }}
                          />
                        ) : null}
                        <div className={`text-center ${(isEditing ? editData.picture : employee.picture) ? 'hidden' : 'block'}`}>
                          <svg className="mx-auto h-6 w-6 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="text-xs text-gray-500 mt-1">Click to Upload</p>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="text-center w-full h-full flex flex-col items-center justify-center">
                      {(isEditing ? editData.picture : employee.picture) ? (
                        <img 
                          src={(isEditing ? editData.picture : employee.picture).startsWith('data:') ? 
                            (isEditing ? editData.picture : employee.picture) : 
                            `/pictures/${isEditing ? editData.picture : employee.picture}`} 
                          alt="Employee" 
                          className="w-20 h-20 object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'block'
                          }}
                        />
                      ) : null}
                      <div className={`text-center ${(isEditing ? editData.picture : employee.picture) ? 'hidden' : 'block'}`}>
                        <svg className="mx-auto h-6 w-6 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">No Photo</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">
                    {isEditing ? (
                      editData.picture ? 'Photo uploaded successfully' : 'No photo uploaded'
                    ) : (
                      employee.picture ? 'Photo available' : 'No photo available'
                    )}
                  </p>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleInputChange('picture', null)}
                      className="mt-2 text-xs text-red-600 hover:text-red-800"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="print-field">
                <div className="print-field-label">Employee ID</div>
                <div className="print-field-value">{employee.id}</div>
              </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Name (English)</label>
                {isEditing ? (
              <input
                type="text"
                    value={editData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter English name"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.name || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Name (Bangla)</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.nameBangla || ''}
                    onChange={(e) => handleInputChange('nameBangla', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter Bangla name"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.nameBangla || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter mobile number"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.phone || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter email address"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.email || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Nationality</label>
                {isEditing ? (
                  <select
                    value={editData.nationality || ''}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select Nationality</option>
                    <option value="Bangladeshi">Bangladeshi</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.nationality || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Father's Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.fathersName || ''}
                    onChange={(e) => handleInputChange('fathersName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter father's name"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.fathersName || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Mother's Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.mothersName || ''}
                    onChange={(e) => handleInputChange('mothersName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter mother's name"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.mothersName || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Spouse Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.spouseName || ''}
                    onChange={(e) => handleInputChange('spouseName', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter spouse name"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.spouseName || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{formatDate(employee.dateOfBirth) || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">NID Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.nidNumber || ''}
                    onChange={(e) => handleInputChange('nidNumber', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter NID number"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.nidNumber || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Birth Certificate Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.birthCertificateNumber || ''}
                    onChange={(e) => handleInputChange('birthCertificateNumber', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="Enter birth certificate number"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.birthCertificateNumber || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Blood Group</label>
                {isEditing ? (
                  <select
                    value={editData.bloodGroup || ''}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.bloodGroup || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Religion</label>
                {isEditing ? (
                  <select
                    value={editData.religion || ''}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select Religion</option>
                    <option value="Islam">Islam</option>
                    <option value="Hinduism">Hinduism</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Buddhism">Buddhism</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.religion || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Marital Status</label>
                {isEditing ? (
                  <select
                    value={editData.maritalStatus || ''}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.maritalStatus || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Height</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.height || ''}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="e.g., 5'8 inches"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.height || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Weight</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.weight || ''}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                    placeholder="e.g., 70 kg"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.weight || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Education Level</label>
                {isEditing ? (
                  <select
                    value={editData.educationLevel || ''}
                    onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select Education Level</option>
                    <option value="Alphabetic Knowledge">Alphabetic Knowledge</option>
                    <option value="JSC or Equivalent">JSC or Equivalent</option>
                    <option value="SSC or Equivalent">SSC or Equivalent</option>
                    <option value="HSC or Equivalent">HSC or Equivalent</option>
                    <option value="Hon's">Hon's</option>
                    <option value="Master's">Master's</option>
                    <option value="BSc">BSc</option>
                    <option value="MSc">MSc</option>
                    <option value="PhD">PhD</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.educationLevel || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Subject</label>
                {isEditing ? (
                  <select
                    value={editData.subject || ''}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select Subject</option>
                    <option value="Textile Engineering">Textile Engineering</option>
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="English">English</option>
                    <option value="Bangla">Bangla</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Economics">Economics</option>
                    <option value="Business Administration">Business Administration</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.subject || 'N/A'}</p>
                )}
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Gender</label>
                {isEditing ? (
                  <select
                    value={editData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.gender || 'N/A'}</p>
                )}
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Designation</label>
                {isEditing ? (
              <select
                    value={editData.designation || ''}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Designation</option>
                    {organizationalDataService.getDesignations().map((designation) => (
                      <option key={designation.id} value={designation.name}>
                        {designation.name}
                      </option>
                ))}
              </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.designation || 'N/A'}</p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                {isEditing ? (
              <select
                    value={editData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {organizationalDataService.getDepartments().map((department) => (
                      <option key={department.id} value={department.name}>
                        {department.name}
                      </option>
                ))}
              </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.department || 'N/A'}</p>
                )}
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Level of Work</label>
                {isEditing ? (
              <select
                    value={editData.levelOfWork || ''}
                    onChange={(e) => {
                      const selectedLevel = e.target.value
                      handleInputChange('levelOfWork', selectedLevel)
                      
                      // Clear salary grade and components when level of work changes
                      handleInputChange('salaryGrade', '')
                      handleInputChange('grossSalary', '')
                      handleInputChange('salaryComponents', {})
                    }}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Level</option>
                    <option value="Worker">Worker</option>
                    <option value="Staff">Staff</option>
              </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.levelOfWork || 'N/A'}</p>
                )}
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Status</label>
                {isEditing ? (
                  <select
                    value={editData.status || ''}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Terminated">Terminated</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                ) : (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    employee.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {employee.status || 'N/A'}
                  </span>
                )}
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Joining</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfJoining || ''}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.dateOfJoining)}</p>
                )}
          </div>
        </div>
            </div>

          {/* Contact Information */}
          <div className="rounded border border-gray-200 bg-white p-6 print:hidden">
            <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.phone || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Emergency Contact</label>
                {isEditing ? (
                  <div className="space-y-2">
              <input
                type="text"
                      value={editData.emergencyContact?.name || ''}
                      onChange={(e) => handleInputChange('emergencyContact', { ...editData.emergencyContact, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Emergency contact name"
                    />
                    <input
                      type="tel"
                      value={editData.emergencyContact?.mobile || ''}
                      onChange={(e) => handleInputChange('emergencyContact', { ...editData.emergencyContact, mobile: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Emergency contact mobile"
              />
            </div>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">
                    {employee.emergencyContact?.name ? 
                      `${employee.emergencyContact.name} (${employee.emergencyContact.mobile})` : 
                      'N/A'
                    }
                  </p>
                )}
          </div>
        </div>
      </div>

          {/* Personal Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 print:hidden">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.dateOfBirth)}</p>
                )}
        </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Gender</label>
                {isEditing ? (
              <select
                    value={editData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    
              </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.gender || 'N/A'}</p>
                )}
                      </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Blood Group</label>
                {isEditing ? (
                  <select
                    value={editData.bloodGroup || ''}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.bloodGroup || 'N/A'}</p>
                )}
                      </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Marital Status</label>
                {isEditing ? (
                  <select
                    value={editData.maritalStatus || ''}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.maritalStatus || 'N/A'}</p>
                )}
                    </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Nationality</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.nationality || ''}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter nationality"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.nationality || 'N/A'}</p>
                )}
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Religion</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.religion || ''}
                    onChange={(e) => handleInputChange('religion', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter religion"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.religion || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Education Level</label>
                {isEditing ? (
                  <select
                    value={editData.educationLevel || ''}
                    onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Education Level</option>
                    <option value="Alphabetic Knowledge">Alphabetic Knowledge</option>
                    <option value="JSC or Equivalent">JSC or Equivalent</option>
                    <option value="SSC or Equivalent">SSC or Equivalent</option>
                    <option value="HSC or Equivalent">HSC or Equivalent</option>
                    <option value="Hon's">Hon's</option>
                    <option value="Master's">Master's</option>
                    <option value="BSc">BSc</option>
                    <option value="MSc">MSc</option>
                    <option value="PhD">PhD</option>
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.educationLevel || 'N/A'}</p>
                )}
        </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">NID Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.nidNumber || ''}
                    onChange={(e) => handleInputChange('nidNumber', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter NID number"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.nidNumber || 'N/A'}</p>
                )}
          </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Height</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.height || ''}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 5'8 inches"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.height || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Weight</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.weight || ''}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 70 kg"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.weight || 'N/A'}</p>
                )}
              </div>
                      </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 print:hidden">
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              </div>
              <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
              <p className="text-gray-600">Present and permanent address details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Present Address */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-green-200 pb-2">Present Address</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">House Owner Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.houseOwnerName || ''}
                      onChange={(e) => handleInputChange('presentAddress', { ...editData.presentAddress, houseOwnerName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter house owner name"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.presentAddress?.houseOwnerName || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Village</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.village || ''}
                      onChange={(e) => handleInputChange('presentAddress', { ...editData.presentAddress, village: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter village"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.presentAddress?.village || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Post Office</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.postOffice || ''}
                      onChange={(e) => handleInputChange('presentAddress', { ...editData.presentAddress, postOffice: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter post office"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.presentAddress?.postOffice || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Upazilla</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.upazilla || ''}
                      onChange={(e) => handleInputChange('presentAddress', { ...editData.presentAddress, upazilla: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter upazilla"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.presentAddress?.upazilla || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.district || ''}
                      onChange={(e) => handleInputChange('presentAddress', { ...editData.presentAddress, district: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter district"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.presentAddress?.district || 'N/A'}</p>
                  )}
              </div>
            </div>
          </div>

            {/* Permanent Address */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-green-200 pb-2">Permanent Address</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Village</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.village || ''}
                      onChange={(e) => handleInputChange('permanentAddress', { ...editData.permanentAddress, village: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter village"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.permanentAddress?.village || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Post Office</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.postOffice || ''}
                      onChange={(e) => handleInputChange('permanentAddress', { ...editData.permanentAddress, postOffice: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter post office"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.permanentAddress?.postOffice || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Upazilla</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.upazilla || ''}
                      onChange={(e) => handleInputChange('permanentAddress', { ...editData.permanentAddress, upazilla: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter upazilla"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.permanentAddress?.upazilla || 'N/A'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.district || ''}
                      onChange={(e) => handleInputChange('permanentAddress', { ...editData.permanentAddress, district: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                      placeholder="Enter district"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.permanentAddress?.district || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Information */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 print:hidden">
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              </div>
              <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-900">Emergency Contact Information</h2>
              <p className="text-gray-600">Emergency contact details for the employee</p>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Contact Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.emergencyContact?.name || ''}
                  onChange={(e) => handleInputChange('emergencyContact', { ...editData.emergencyContact, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  placeholder="Enter contact name"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.emergencyContact?.name || 'N/A'}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.emergencyContact?.mobile || ''}
                  onChange={(e) => handleInputChange('emergencyContact', { ...editData.emergencyContact, mobile: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  placeholder="Enter mobile number"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.emergencyContact?.mobile || 'N/A'}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Relation</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.emergencyContact?.relation || ''}
                  onChange={(e) => handleInputChange('emergencyContact', { ...editData.emergencyContact, relation: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                  placeholder="Enter relation"
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{employee.emergencyContact?.relation || 'N/A'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Work Information */}
          <div className="rounded border border-gray-200 bg-white p-6 print:hidden">
            <h2 className="text-xl font-semibold mb-6">Work Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-500">Joining Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfJoining || ''}
                    onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.dateOfJoining)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Issue Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.dateOfIssue || ''}
                    onChange={(e) => handleInputChange('dateOfIssue', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.dateOfIssue)}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Off Day</label>
                {isEditing ? (
              <select
                    value={editData.offDay || ''}
                    onChange={(e) => handleInputChange('offDay', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Off Day</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
              </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.offDay || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Unit</label>
                {isEditing ? (
              <input
                type="text"
                    value={editData.unit || ''}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter unit"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.unit || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Supervisor</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.supervisorName || ''}
                    onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter supervisor name"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.supervisorName || 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Gross Salary</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.grossSalary || ''}
                    onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter gross salary"
                  />
                ) : (
                  <p className="mt-1 text-sm text-gray-900">৳{employee.grossSalary ? Number(employee.grossSalary).toLocaleString() : 'N/A'}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Salary Grade</label>
                {isEditing ? (
                  <select
                    value={editData.salaryGrade || ''}
                    onChange={(e) => handleInputChange('salaryGrade', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Salary Grade</option>
                    {editData.levelOfWork === 'Worker' 
                      ? organizationalDataService.getAllSalaryGrades()
                          .filter(grade => grade.type === 'Worker')
                          .map((grade) => (
                            <option key={grade.id} value={grade.name}>
                              {grade.name}
                            </option>
                          ))
                      : editData.levelOfWork === 'Staff'
                      ? organizationalDataService.getAllSalaryGrades()
                          .filter(grade => grade.type === 'Staff')
                          .map((grade) => (
                            <option key={grade.id} value={grade.name}>
                              {grade.name}
                            </option>
                          ))
                      : organizationalDataService.getAllSalaryGrades().map((grade) => (
                          <option key={grade.id} value={grade.name}>
                            {grade.name}
                          </option>
                        ))
                    }
                  </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.salaryGrade || 'N/A'}</p>
                )}
              </div>
          </div>
            </div>

          {/* Process Expertise */}
          <div className="rounded border border-gray-200 bg-white p-6 print:hidden">
            <h2 className="text-xl font-semibold mb-6">Process Expertise</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-500">Operation</label>
                {isEditing ? (
              <select
                    value={editData.processExpertise || ''}
                    onChange={(e) => handleInputChange('processExpertise', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Operation</option>
                    {organizationalDataService.getProcessExpertise().map((item) => (
                      <option key={item.id} value={item.operation}>
                        {item.operation}
                      </option>
                ))}
              </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.processExpertise || 'N/A'}</p>
                )}
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-500">Machine</label>
                {isEditing ? (
              <select
                    value={editData.machine || ''}
                    onChange={(e) => handleInputChange('machine', e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Machine</option>
                    {organizationalDataService.getProcessExpertise().map((item) => (
                      <option key={item.id} value={item.machine}>
                        {item.machine}
                      </option>
                ))}
              </select>
                ) : (
                  <p className="mt-1 text-sm text-gray-900">{employee.machine || 'N/A'}</p>
                )}
              </div>
                  </div>
            </div>

          {/* Address Information */}
          <div className="rounded border border-gray-200 bg-white p-6 print:hidden">
            <h2 className="text-xl font-semibold mb-6">Address Information</h2>
            
            {/* Present Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Present Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                  <label className="block text-sm font-medium text-gray-500">House Number/ House Name</label>
                  {isEditing ? (
              <input
                type="text"
                      value={editData.presentAddress?.houseOwnerName || ''}
                      onChange={(e) => handleNestedInputChange('presentAddress', 'houseOwnerName', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter house number/name"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.presentAddress?.houseOwnerName || 'N/A'}</p>
                  )}
            </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Village/Area</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.village || ''}
                      onChange={(e) => handleNestedInputChange('presentAddress', 'village', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter village/area"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.presentAddress?.village || 'N/A'}</p>
                  )}
          </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Post Office</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.postOffice || ''}
                      onChange={(e) => handleNestedInputChange('presentAddress', 'postOffice', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter post office"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.presentAddress?.postOffice || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Upazilla</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.upazilla || ''}
                      onChange={(e) => handleNestedInputChange('presentAddress', 'upazilla', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter upazilla"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.presentAddress?.upazilla || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.presentAddress?.district || ''}
                      onChange={(e) => handleNestedInputChange('presentAddress', 'district', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter district"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.presentAddress?.district || 'N/A'}</p>
                  )}
                </div>
        </div>
      </div>

            {/* Permanent Address */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Permanent Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Village/Area</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.village || ''}
                      onChange={(e) => handleNestedInputChange('permanentAddress', 'village', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter village/area"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.permanentAddress?.village || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Post Office</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.postOffice || ''}
                      onChange={(e) => handleNestedInputChange('permanentAddress', 'postOffice', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter post office"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.permanentAddress?.postOffice || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Upazilla</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.upazilla || ''}
                      onChange={(e) => handleNestedInputChange('permanentAddress', 'upazilla', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter upazilla"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.permanentAddress?.upazilla || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.permanentAddress?.district || ''}
                      onChange={(e) => handleNestedInputChange('permanentAddress', 'district', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter district"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{employee.permanentAddress?.district || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
        </div>
        
          {/* Children Information */}
          {employee.children && employee.children.length > 0 && (
            <div className="rounded border border-gray-200 bg-white p-6 print:hidden">
              <h2 className="text-xl font-semibold mb-6">Children Information <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
                <div className="space-y-4">
                {employee.children.map((child, index) => (
                  child.name && (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Child {index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.children?.[index]?.name || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                if (!newChildren[index]) newChildren[index] = {}
                                newChildren[index].name = e.target.value
                                handleInputChange('children', newChildren)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Child name"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{child.name || 'N/A'}</p>
                          )}
                  </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Age</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editData.children?.[index]?.age || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                if (!newChildren[index]) newChildren[index] = {}
                                newChildren[index].age = e.target.value
                                handleInputChange('children', newChildren)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Age"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{child.age || 'N/A'}</p>
                          )}
                </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Gender</label>
                          {isEditing ? (
                            <select
                              value={editData.children?.[index]?.gender || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                if (!newChildren[index]) newChildren[index] = {}
                                newChildren[index].gender = e.target.value
                                handleInputChange('children', newChildren)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{child.gender || 'N/A'}</p>
                          )}
                    </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Education</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.children?.[index]?.education || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                if (!newChildren[index]) newChildren[index] = {}
                                newChildren[index].education = e.target.value
                                handleInputChange('children', newChildren)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Education level"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{child.education || 'N/A'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Nominee Information */}
          {employee.nominee && employee.nominee.length > 0 && (
            <div className="rounded border border-gray-200 bg-white p-6 print:hidden">
              <h2 className="text-xl font-semibold mb-6">Nominee Information</h2>
                <div className="space-y-4">
                {employee.nominee && Array.isArray(employee.nominee) && employee.nominee.map((nominee, index) => (
                  nominee.name && (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Nominee {index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.nominee?.[index]?.name || ''}
                              onChange={(e) => {
                                const newNominee = [...(editData.nominee || [])]
                                if (!newNominee[index]) newNominee[index] = {}
                                newNominee[index].name = e.target.value
                                handleInputChange('nominee', newNominee)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Nominee name"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{nominee.name || 'N/A'}</p>
                          )}
                  </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Relation</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.nominee?.[index]?.relation || ''}
                              onChange={(e) => {
                                const newNominee = [...(editData.nominee || [])]
                                if (!newNominee[index]) newNominee[index] = {}
                                newNominee[index].relation = e.target.value
                                handleInputChange('nominee', newNominee)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Relation"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{nominee.relation || 'N/A'}</p>
                          )}
                </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Mobile</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editData.nominee?.[index]?.mobile || ''}
                              onChange={(e) => {
                                const newNominee = [...(editData.nominee || [])]
                                if (!newNominee[index]) newNominee[index] = {}
                                newNominee[index].mobile = e.target.value
                                handleInputChange('nominee', newNominee)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Mobile number"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{nominee.mobile || 'N/A'}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">NID</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.nominee?.[index]?.nid || ''}
                              onChange={(e) => {
                                const newNominee = [...(editData.nominee || [])]
                                if (!newNominee[index]) newNominee[index] = {}
                                newNominee[index].nid = e.target.value
                                handleInputChange('nominee', newNominee)
                              }}
                              className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="NID number"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{nominee.nid || 'N/A'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ))}
        </div>
      </div>
          )}

          {/* Children Information - Only for Workers */}
          {employee.levelOfWork === 'Worker' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 print:hidden">
              <div className="flex items-center mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                      </div>
                      <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Children Information</h2>
                  <p className="text-gray-600">Children details (Optional)</p>
                      </div>
                    </div>

              <div className="space-y-6">
                {employee.children && Array.isArray(employee.children) && employee.children.length > 0 ? (
                  employee.children.map((child, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Child {index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.children?.[index]?.name || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                newChildren[index] = { ...newChildren[index], name: e.target.value }
                                handleInputChange('children', newChildren)
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                              placeholder="Enter child name"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">{child.name || 'N/A'}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Age</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.children?.[index]?.age || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                newChildren[index] = { ...newChildren[index], age: e.target.value }
                                handleInputChange('children', newChildren)
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                              placeholder="Enter age"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">{child.age || 'N/A'}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Education</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.children?.[index]?.education || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                newChildren[index] = { ...newChildren[index], education: e.target.value }
                                handleInputChange('children', newChildren)
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                              placeholder="Enter education level"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">{child.education || 'N/A'}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Institute</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.children?.[index]?.institute || ''}
                              onChange={(e) => {
                                const newChildren = [...(editData.children || [])]
                                newChildren[index] = { ...newChildren[index], institute: e.target.value }
                                handleInputChange('children', newChildren)
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                              placeholder="Enter institute name"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">{child.institute || 'N/A'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No children information available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Process Expertise - Only for Workers */}
          {employee.levelOfWork === 'Worker' && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 print:hidden">
              <div className="flex items-center mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-2xl font-bold text-gray-900">Process Expertise</h2>
                  <p className="text-gray-600">Work process and machine expertise details</p>
                </div>
              </div>

              <div className="space-y-6">
                {employee.processExpertise && Array.isArray(employee.processExpertise) && employee.processExpertise.length > 0 ? (
                  employee.processExpertise.map((expertise, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Process {index + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Operation</label>
                          {isEditing ? (
                            <select
                              value={editData.processExpertise?.[index]?.operation || ''}
                              onChange={(e) => {
                                const newExpertise = [...(editData.processExpertise || [])]
                                newExpertise[index] = { ...newExpertise[index], operation: e.target.value }
                                handleInputChange('processExpertise', newExpertise)
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                            >
                              <option value="">Select Operation</option>
                              {organizationalDataService.getUniqueProcessExpertiseOperations().map((op, idx) => (
                                <option key={idx} value={op}>{op}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">{expertise.operation || 'N/A'}</p>
                          )}
        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Machine</label>
                          {isEditing ? (
                            <select
                              value={editData.processExpertise?.[index]?.machine || ''}
                              onChange={(e) => {
                                const newExpertise = [...(editData.processExpertise || [])]
                                newExpertise[index] = { ...newExpertise[index], machine: e.target.value }
                                handleInputChange('processExpertise', newExpertise)
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                            >
                              <option value="">Select Machine</option>
                              {organizationalDataService.getUniqueProcessExpertiseMachines().map((machine, idx) => (
                                <option key={idx} value={machine}>{machine}</option>
                              ))}
                            </select>
                          ) : (
                            <p className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">{expertise.machine || 'N/A'}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">Duration</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editData.processExpertise?.[index]?.duration || ''}
                              onChange={(e) => {
                                const newExpertise = [...(editData.processExpertise || [])]
                                newExpertise[index] = { ...newExpertise[index], duration: e.target.value }
                                handleInputChange('processExpertise', newExpertise)
                              }}
                              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all duration-200 text-gray-900"
                              placeholder="Enter duration"
                            />
                          ) : (
                            <p className="px-4 py-3 bg-white rounded-lg text-gray-900 font-medium">{expertise.duration || 'N/A'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No process expertise information available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Salary Components */}
          {employee.salaryComponents && (
            <div className="rounded border border-gray-200 bg-white p-6 print:hidden">
              <h2 className="text-xl font-semibold mb-6">Salary Components</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(employee.salaryComponents).map(([component, data]) => (
                  <div key={component} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                      {component.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                      <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Enabled:</span>
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={editData.salaryComponents?.[component]?.enabled || false}
                            onChange={(e) => {
                              const newSalaryComponents = { ...editData.salaryComponents }
                              if (!newSalaryComponents[component]) newSalaryComponents[component] = {}
                              newSalaryComponents[component].enabled = e.target.checked
                              handleInputChange('salaryComponents', newSalaryComponents)
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <span className={`text-xs font-medium ${data.enabled ? 'text-green-600' : 'text-red-600'}`}>
                            {data.enabled ? 'Yes' : 'No'}
                    </span>
                        )}
          </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Amount:</span>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editData.salaryComponents?.[component]?.amount || 0}
                            onChange={(e) => {
                              const newSalaryComponents = { ...editData.salaryComponents }
                              if (!newSalaryComponents[component]) newSalaryComponents[component] = {}
                              newSalaryComponents[component].amount = parseFloat(e.target.value) || 0
                              handleInputChange('salaryComponents', newSalaryComponents)
                            }}
                            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="0"
                          />
                        ) : (
                          <span className="text-xs font-medium text-gray-900">৳{data.amount || 0}</span>
        )}
      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Custom:</span>
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={editData.salaryComponents?.[component]?.custom || false}
                            onChange={(e) => {
                              const newSalaryComponents = { ...editData.salaryComponents }
                              if (!newSalaryComponents[component]) newSalaryComponents[component] = {}
                              newSalaryComponents[component].custom = e.target.checked
                              handleInputChange('salaryComponents', newSalaryComponents)
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        ) : (
                          <span className={`text-xs font-medium ${data.custom ? 'text-blue-600' : 'text-gray-600'}`}>
                            {data.custom ? 'Yes' : 'No'}
                    </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                    </div>
          </div>
        )}
                  </div>
                )}

      {/* Promotion/Demotion Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Promotion/Demotion</h3>
                    <button
                onClick={() => setShowPromotionModal(false)}
                className="text-gray-400 hover:text-gray-600"
                    >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                    </button>
            </div>

                <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Designation *</label>
                  <select
                    value={promotionData.newDesignation}
                    onChange={(e) => handlePromotionInputChange('newDesignation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Designation</option>
                    {organizationalDataService.getDesignations().map((designation) => (
                      <option key={designation.id} value={designation.name}>
                        {designation.name}
                      </option>
                    ))}
                  </select>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Department *</label>
                  <select
                    value={promotionData.newDepartment}
                    onChange={(e) => handlePromotionInputChange('newDepartment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Department</option>
                    {organizationalDataService.getDepartments().map((department) => (
                      <option key={department.id} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                  </select>
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Salary *</label>
                  <input
                    type="number"
                    value={promotionData.newSalary}
                    onChange={(e) => handlePromotionInputChange('newSalary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter new salary"
                  />
                      </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
                  <input
                    type="date"
                    value={promotionData.effectiveDate}
                    onChange={(e) => handlePromotionInputChange('effectiveDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                  </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={promotionData.reason}
                  onChange={(e) => handlePromotionInputChange('reason', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter reason for promotion/demotion"
                />
                  </div>
        </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowPromotionModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePromotionSubmit}
                disabled={saving}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {saving ? 'Processing...' : 'Process Promotion/Demotion'}
              </button>
          </div>
      </div>
                  </div>
                )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-lg shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Change Employee Status</h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

                <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Status *</label>
                <select
                  value={statusData.newStatus}
                  onChange={(e) => handleStatusInputChange('newStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Terminated">Terminated</option>
                  <option value="Resigned">Resigned</option>
                </select>
                  </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
                <input
                  type="date"
                  value={statusData.effectiveDate}
                  onChange={(e) => handleStatusInputChange('effectiveDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  value={statusData.reason}
                  onChange={(e) => handleStatusInputChange('reason', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter reason for status change"
                />
                  </div>
                </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusSubmit}
                disabled={saving}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
              >
                {saving ? 'Processing...' : 'Change Status'}
              </button>
                  </div>
                </div>
        </div>
      )}

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {employeeLogs.length > 0 && employeeLogs[0].employeeId !== employee?.id 
                  ? 'All Employee Activity Logs' 
                  : `Employee Activity Log - ${employee?.name}`}
              </h2>
              <div className="flex items-center space-x-3">
                <button
                  onClick={printLogs}
                  className="px-4 py-2 text-white rounded-lg transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ backgroundColor: 'rgb(255,200,150)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgb(255,185,125)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgb(255,200,150)'
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
                <button
                  onClick={downloadLogs}
                  className="px-4 py-2 text-white rounded-lg transition-all duration-200 flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  style={{ backgroundColor: 'rgb(255,200,150)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgb(255,185,125)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgb(255,200,150)'
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Word
                </button>
                <button
                  onClick={() => setShowLogModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                  </div>
                </div>

            <div className="overflow-y-auto max-h-96">
              {employeeLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No activity logs found for this employee.</p>
                      </div>
              ) : (
                <div className="space-y-4">
                  {employeeLogs.map((log) => (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatLogTimestamp(log.timestamp)}
                          </span>
                          {employeeLogs.length > 0 && employeeLogs[0].employeeId !== employee?.id && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              Employee: {log.employeeId}
                            </span>
                          )}
                      </div>
                        <span className="text-xs text-gray-400">
                          by {log.user.name}
                        </span>
                    </div>
                      
                      <div className="text-sm text-gray-700 mb-2">
                        {log.details.message || `Field '${log.field}' was updated`}
                  </div>
                      
                      {log.field !== 'all' && log.oldValue !== null && log.newValue !== null && (
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="font-medium text-red-600">Previous:</span>
                              <div className="mt-1 text-gray-600">
                                {typeof log.oldValue === 'object' ? 
                                  JSON.stringify(log.oldValue, null, 2) : 
                                  String(log.oldValue || 'N/A')
                                }
                      </div>
                      </div>
                            <div>
                              <span className="font-medium text-green-600">New:</span>
                              <div className="mt-1 text-gray-600">
                                {typeof log.newValue === 'object' ? 
                                  JSON.stringify(log.newValue, null, 2) : 
                                  String(log.newValue || 'N/A')
                                }
                      </div>
                      </div>
                      </div>
                    </div>
                )}
                      
                      {log.details.reason && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-600">Reason:</span>
                          <span className="ml-2 text-gray-700">{log.details.reason}</span>
                  </div>
                )}
                      
                      {log.details.effectiveDate && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-gray-600">Effective Date:</span>
                          <span className="ml-2 text-gray-700">{formatDate(log.details.effectiveDate)}</span>
              </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Total Logs: {employeeLogs.length}</span>
                <span>Logs are immutable and cannot be modified</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
