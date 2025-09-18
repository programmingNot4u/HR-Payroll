import React, { useState, useEffect, useRef } from 'react'
import { Plus, Search, Filter, Download, Eye, Edit2, Trash2, Calendar, DollarSign, User, Building, FileText, Upload, X, Printer } from 'lucide-react'
import * as XLSX from 'xlsx'
import organizationalDataService from '../../services/organizationalDataService'

const AdvanceFromAccounts = () => {
  // State management
  const [advances, setAdvances] = useState([])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAdvance, setEditingAdvance] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [filters, setFilters] = useState({
    employeeId: '',
    designation: '',
    department: '',
    adjustSalaryMonth: '',
    year: ''
  })
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])

  // Load departments and designations from organizational data service
  useEffect(() => {
    const loadOrganizationalData = () => {
      try {
        const deptData = organizationalDataService.getDepartmentNames()
        const desigData = organizationalDataService.getDesignationNames()
        setDepartments(deptData)
        setDesignations(desigData)
      } catch (error) {
        console.error('Error loading organizational data:', error)
        // Fallback to empty arrays if service fails
        setDepartments([])
        setDesignations([])
      }
    }

    loadOrganizationalData()
  }, [])

  // Load advance data from localStorage on component mount
  useEffect(() => {
    const savedAdvances = localStorage.getItem('advanceData')
    if (savedAdvances) {
      try {
        const parsedAdvances = JSON.parse(savedAdvances)
        setAdvances(parsedAdvances)
      } catch (error) {
        console.error('Error loading advance data from localStorage:', error)
      }
    }
  }, [])

  // Save advance data to localStorage whenever advances change
  useEffect(() => {
    if (advances.length > 0) {
      localStorage.setItem('advanceData', JSON.stringify(advances))
    }
  }, [advances])

  // Format date to dd/mm/yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-GB')
  }

  // Custom date input component for dd/mm/yyyy format
  const CustomDateInput = ({ value, onChange, placeholder }) => {
    const [displayValue, setDisplayValue] = useState('')
    
    useEffect(() => {
      if (value) {
        setDisplayValue(formatDateToDDMMYYYY(value))
      } else {
        setDisplayValue('')
      }
    }, [value])

    const handleChange = (e) => {
      const inputValue = e.target.value
      setDisplayValue(inputValue)
      
      // Try to parse dd/mm/yyyy format
      const parts = inputValue.split('/')
      if (parts.length === 3) {
        const day = parseInt(parts[0])
        const month = parseInt(parts[1])
        const year = parseInt(parts[2])
        
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
          const date = new Date(year, month - 1, day)
          if (!isNaN(date.getTime())) {
            onChange(date.toISOString().split('T')[0])
          }
        }
      }
    }

    return (
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder || "DD/MM/YYYY"}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    )
  }

  // Form data for new advance
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    designation: '',
    advanceAmount: '',
    voucherNumber: '',
    reason: '',
    advanceDate: '',
    adjustSalaryMonth: '',
    year: ''
  })


  // Generate unique voucher number
  const generateUniqueVoucherNumber = () => {
    let voucherNumber = `V${String(advances.length + 1).padStart(4, '0')}`
    let counter = 1
    
    // Check if voucher number already exists and generate a new one if needed
    while (advances.some(adv => adv.voucherNumber === voucherNumber)) {
      voucherNumber = `V${String(advances.length + counter + 1).padStart(4, '0')}`
      counter++
    }
    
    return voucherNumber
  }
  const thisMonthAdvances = advances.filter(adv => {
    const advanceDate = new Date(adv.advanceDate)
    const currentDate = new Date()
    return advanceDate.getMonth() === currentDate.getMonth() && 
           advanceDate.getFullYear() === currentDate.getFullYear()
  }).length

  // Filter advances
  const filteredAdvances = advances.filter(advance => {
    const matchesSearch = advance.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advance.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         advance.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilters = 
      (!filters.employeeId || advance.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())) &&
      (!filters.designation || advance.designation.toLowerCase().includes(filters.designation.toLowerCase())) &&
      (!filters.department || advance.department.toLowerCase().includes(filters.department.toLowerCase())) &&
      (!filters.adjustSalaryMonth || advance.adjustSalaryMonth.toLowerCase().includes(filters.adjustSalaryMonth.toLowerCase())) &&
      (!filters.year || advance.year.toString().includes(filters.year))
    
    return matchesSearch && matchesFilters
  })

  // Calculate statistics based on filtered data
  const totalAdvances = filteredAdvances.length
  const totalAmount = filteredAdvances.reduce((sum, adv) => sum + adv.advanceAmount, 0)
  const averageAmount = totalAdvances > 0 ? Math.round(totalAmount / totalAdvances) : 0


  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Check if voucher number already exists
    const voucherExists = advances.some(adv => adv.voucherNumber === formData.voucherNumber)
    if (voucherExists) {
      alert('Voucher Number already exists. Please enter a unique voucher number.')
      return
    }
    
    const newAdvance = {
      id: `ADV${String(advances.length + 1).padStart(3, '0')}`,
      ...formData,
      advanceAmount: parseInt(formData.advanceAmount),
      advanceDate: formData.advanceDate || new Date().toISOString().split('T')[0],
      adjustSalaryMonth: formData.adjustSalaryMonth || '',
      year: formData.year || new Date().getFullYear().toString()
    }

    setAdvances(prev => [...prev, newAdvance])
    setIsCreateModalOpen(false)
    resetForm()
  }

  // Handle edit
  const handleEdit = (advance) => {
    setEditingAdvance(advance)
    setFormData({
      employeeId: advance.employeeId,
      employeeName: advance.employeeName || '',
      department: advance.department || '',
      designation: advance.designation || '',
      advanceAmount: advance.advanceAmount.toString(),
      voucherNumber: advance.voucherNumber || '',
      reason: advance.reason,
      advanceDate: advance.advanceDate,
      adjustSalaryMonth: advance.adjustSalaryMonth || '',
      year: advance.year || ''
    })
    setIsEditModalOpen(true)
  }

  // Handle edit submission
  const handleEditSubmit = (e) => {
    e.preventDefault()
    
    // Check if voucher number already exists (excluding current record)
    const voucherExists = advances.some(adv => 
      adv.voucherNumber === formData.voucherNumber && adv.id !== editingAdvance.id
    )
    if (voucherExists) {
      alert('Voucher Number already exists. Please enter a unique voucher number.')
      return
    }
    
    setAdvances(prev => prev.map(adv => 
      adv.id === editingAdvance.id 
        ? {
            ...adv,
            employeeId: formData.employeeId,
            employeeName: formData.employeeName,
            department: formData.department,
            designation: formData.designation,
            advanceAmount: parseInt(formData.advanceAmount),
            voucherNumber: formData.voucherNumber,
            reason: formData.reason,
            advanceDate: formData.advanceDate,
            adjustSalaryMonth: formData.adjustSalaryMonth,
            year: formData.year
          }
        : adv
    ))
    setIsEditModalOpen(false)
    setEditingAdvance(null)
    resetForm()
  }

  // Handle delete
  const handleDelete = (advanceId) => {
    if (window.confirm('Are you sure you want to delete this advance request?')) {
      setAdvances(prev => {
        const updatedAdvances = prev.filter(adv => adv.id !== advanceId)
        // Update localStorage immediately
        localStorage.setItem('advanceData', JSON.stringify(updatedAdvances))
        return updatedAdvances
      })
    }
  }

  // Clear all data (optional function for admin use)
  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all advance data? This action cannot be undone.')) {
      setAdvances([])
      localStorage.removeItem('advanceData')
    }
  }


  // Reset form
  const resetForm = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      department: '',
      designation: '',
      advanceAmount: '',
      voucherNumber: '',
      reason: '',
      advanceDate: '',
      adjustSalaryMonth: '',
      year: ''
    })
  }

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      employeeId: '',
      designation: '',
      department: '',
      adjustSalaryMonth: '',
      year: ''
    })
  }

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const currentDate = new Date().toLocaleDateString('en-GB')
    
    const activeFilters = Object.entries(filters)
      .filter(([key, value]) => value !== '')
      .map(([key, value]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
        return `${label}: ${value}`
      })
      .join(', ')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Advance Records Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #333; margin-bottom: 10px; }
            .header p { color: #666; margin: 5px 0; }
            .filters { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .filters h3 { margin: 0 0 10px 0; color: #333; }
            .filters p { margin: 0; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .summary { margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 5px; }
            .summary h3 { margin: 0 0 10px 0; color: #333; }
            .summary p { margin: 5px 0; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Advance Records Report</h1>
            <p>Generated on: ${currentDate}</p>
            <p>Total Records: ${filteredAdvances.length}</p>
          </div>
          
          ${activeFilters ? `
            <div class="filters">
              <h3>Applied Filters:</h3>
              <p>${activeFilters}</p>
            </div>
          ` : ''}
          
          <table>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Designation</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Voucher Number</th>
                <th>Advance Date</th>
                <th>Adjust S.Month</th>
                <th>Year</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAdvances.map(advance => `
                <tr>
                  <td>${advance.employeeId}</td>
                  <td>${advance.employeeName || '-'}</td>
                  <td>${advance.designation || '-'}</td>
                  <td>${advance.department || '-'}</td>
                  <td>${advance.advanceAmount.toLocaleString()}</td>
                  <td>${advance.voucherNumber || '-'}</td>
                  <td>${formatDateToDDMMYYYY(advance.advanceDate)}</td>
                  <td>${advance.adjustSalaryMonth || '-'}</td>
                  <td>${advance.year || '-'}</td>
                  <td>${advance.reason || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Records:</strong> ${filteredAdvances.length}</p>
            <p><strong>Total Amount:</strong> ${filteredAdvances.reduce((sum, adv) => sum + adv.advanceAmount, 0).toLocaleString()}</p>
            <p><strong>Average Amount:</strong> ${filteredAdvances.length > 0 ? Math.round(filteredAdvances.reduce((sum, adv) => sum + adv.advanceAmount, 0) / filteredAdvances.length).toLocaleString() : '0'}</p>
          </div>
        </body>
      </html>
    `)
    
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  // Handle file import
  const handleFileImport = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImportFile(file)
    }
  }

  // Process imported data
  const processImportData = () => {
    if (!importFile) return

    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // Skip header row and process data
        const rows = jsonData.slice(1).filter(row => row.length > 0)
        
        if (rows.length === 0) {
          alert('No data found in the Excel file. Please check the format.')
          return
        }

        // Generate unique voucher numbers for imported data
        const generateUniqueVoucherNumber = (baseIndex) => {
          let voucherNumber = `V${String(advances.length + baseIndex + 1).padStart(4, '0')}`
          let counter = 1
          
          // Check if voucher number already exists and generate a new one if needed
          while (advances.some(adv => adv.voucherNumber === voucherNumber)) {
            voucherNumber = `V${String(advances.length + baseIndex + counter + 1).padStart(4, '0')}`
            counter++
          }
          
          return voucherNumber
        }

        const parsedData = rows.map((row, index) => {
          // Expected format: Employee ID, Name, Department, Amount, Reason, Advance Date, Adjust S.Month, Year
          const [employeeId, name, department, amount, reason, advanceDate, adjustSalaryMonth, year] = row
          
          // Validate required fields
          if (!employeeId || !name || !department || !amount || !reason || !advanceDate) {
            throw new Error(`Row ${index + 2} is missing required data. Please check the format.`)
          }

          // Parse amount to number
          const advanceAmount = typeof amount === 'number' ? amount : parseFloat(amount.toString().replace(/[^\d.-]/g, ''))
          
          // Parse date - handle different date formats
          let parsedDate
          try {
            if (typeof advanceDate === 'number') {
              // Excel date number
              if (advanceDate > 25569) { // Excel date (days since 1900-01-01)
                const excelDate = new Date((advanceDate - 25569) * 86400 * 1000)
                parsedDate = excelDate.toISOString().split('T')[0]
              } else {
                // Try XLSX date parsing
                const dateObj = XLSX.SSF.parse_date_code(advanceDate)
                parsedDate = new Date(dateObj.y, dateObj.m - 1, dateObj.d).toISOString().split('T')[0]
              }
            } else {
              // String date - try multiple formats
              const dateStr = advanceDate.toString().trim()
              
              // Try dd/mm/yyyy format first
              if (dateStr.includes('/')) {
                const parts = dateStr.split('/')
                if (parts.length === 3) {
                  const day = parseInt(parts[0])
                  const month = parseInt(parts[1])
                  const year = parseInt(parts[2])
                  if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900) {
                    parsedDate = new Date(year, month - 1, day).toISOString().split('T')[0]
                  }
                }
              }
              
              // If dd/mm/yyyy didn't work, try other formats
              if (!parsedDate) {
                const date = new Date(advanceDate)
                if (!isNaN(date.getTime())) {
                  parsedDate = date.toISOString().split('T')[0]
                }
              }
              
              // If still no valid date, use current date
              if (!parsedDate) {
                parsedDate = new Date().toISOString().split('T')[0]
              }
            }
          } catch (error) {
            // If all parsing fails, use current date
            parsedDate = new Date().toISOString().split('T')[0]
          }

          return {
            id: `ADV${String(advances.length + index + 1).padStart(3, '0')}`,
            employeeId: employeeId.toString(),
            employeeName: name.toString(),
            department: department.toString(),
            designation: 'Employee', // Default designation
            advanceAmount: advanceAmount,
            voucherNumber: generateUniqueVoucherNumber(index), // Generate unique voucher number
            advanceDate: parsedDate,
            adjustSalaryMonth: adjustSalaryMonth ? adjustSalaryMonth.toString() : '', // Use imported value or empty
            year: year ? year.toString() : new Date().getFullYear().toString(), // Use imported value or current year
            reason: reason.toString()
          }
        })

        setAdvances(prev => {
          const updatedAdvances = [...prev, ...parsedData]
          // Update localStorage immediately
          localStorage.setItem('advanceData', JSON.stringify(updatedAdvances))
          return updatedAdvances
        })
        setImportFile(null)
        setIsImportModalOpen(false)
        alert(`Successfully imported ${parsedData.length} advance records!`)
      } catch (error) {
        alert(`Error parsing Excel file: ${error.message}`)
        console.error('Excel parsing error:', error)
      }
    }

    reader.onerror = () => {
      alert('Error reading file. Please try again.')
    }

    reader.readAsBinaryString(importFile)
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Advance From Accounts</h1>
          <p className="text-sm text-gray-500">Manage employee advance requests and approvals</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Advances</p>
              <p className="text-2xl font-semibold">{totalAdvances}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-semibold text-blue-600">{totalAmount.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>


      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search advances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                placeholder="Employee ID"
                value={filters.employeeId}
                onChange={(e) => handleFilterChange('employeeId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <select
                value={filters.designation}
                onChange={(e) => handleFilterChange('designation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Designations</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Departments</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>{department}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adjust S.Month</label>
              <select
                value={filters.adjustSalaryMonth}
                onChange={(e) => handleFilterChange('adjustSalaryMonth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Months</option>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Years</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - 5 + i
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Advances List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Advance Records</h3>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-200 flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advance Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adjust S.Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAdvances.map((advance) => (
                <tr key={advance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advance.employeeId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{advance.employeeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advance.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advance.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">৳{advance.advanceAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advance.voucherNumber || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={advance.reason}>
                      {advance.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateToDDMMYYYY(advance.advanceDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advance.adjustSalaryMonth || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {advance.year || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(advance)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(advance.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">New Advance Request</h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount *</label>
                  <input
                    type="number"
                    value={formData.advanceAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, advanceAmount: e.target.value }))}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Number *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.voucherNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, voucherNumber: e.target.value }))}
                      required
                      placeholder="Enter voucher number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, voucherNumber: generateUniqueVoucherNumber() }))}
                      className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                    >
                      Auto
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Date *</label>
                  <CustomDateInput
                    value={formData.advanceDate}
                    onChange={(isoDate) => setFormData(prev => ({ ...prev, advanceDate: isoDate }))}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adjust S.Month</label>
                  <select
                    value={formData.adjustSalaryMonth}
                    onChange={(e) => setFormData(prev => ({ ...prev, adjustSalaryMonth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i
                      return (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Create Advance Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Edit Advance Request</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingAdvance(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                  <input
                    type="text"
                    value={formData.employeeName}
                    onChange={(e) => setFormData(prev => ({ ...prev, employeeName: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((department, index) => (
                      <option key={index} value={department}>{department}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Designation</option>
                    {designations.map((designation, index) => (
                      <option key={index} value={designation}>{designation}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount *</label>
                  <input
                    type="number"
                    value={formData.advanceAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, advanceAmount: e.target.value }))}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Number *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.voucherNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, voucherNumber: e.target.value }))}
                      required
                      placeholder="Enter voucher number"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, voucherNumber: generateUniqueVoucherNumber() }))}
                      className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                    >
                      Auto
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Date *</label>
                  <CustomDateInput
                    value={formData.advanceDate}
                    onChange={(isoDate) => setFormData(prev => ({ ...prev, advanceDate: isoDate }))}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adjust S.Month</label>
                  <select
                    value={formData.adjustSalaryMonth}
                    onChange={(e) => setFormData(prev => ({ ...prev, adjustSalaryMonth: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i
                      return (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setEditingAdvance(null)
                    resetForm()
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Update Advance Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Import Advance Data</h2>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Excel File
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileImport}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Expected Excel Format:</h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Employee ID</li>
                    <li>• Name</li>
                    <li>• Department</li>
                    <li>• Amount</li>
                    <li>• Reason</li>
                    <li>• Advance Date</li>
                    <li>• Adjust S.Month (optional)</li>
                    <li>• Year (optional)</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processImportData}
                  disabled={!importFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Import Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvanceFromAccounts
