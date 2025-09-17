import { useState, useEffect } from 'react'
import organizationalDataService from '../../services/organizationalDataService'
import assetService from '../../services/assetService'
import { formatDateToDDMMYYYY, formatDateToYYYYMMDD, parseDate } from '../../utils/dateUtils'

// Custom Date Input Component for DD/MM/YYYY format
const CustomDateInput = ({ value, onChange, required, className, ...props }) => {
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

const AssetInventory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [assignedPersonSearch, setAssignedPersonSearch] = useState('')
  const [departments, setDepartments] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)
  const [showDoneAnimation, setShowDoneAnimation] = useState(false)
  const [animationMessage, setAnimationMessage] = useState('')
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    model: '',
    category: '',
    department: '',
    status: 'Available',
    quantity: 1,
    value: '',
    purchaseDate: '',
    depreciationRate: 20,
    vendor: '',
    accVoucher: '',
    warrantyPeriod: ''
  })

  // Load departments from organizational data service
  useEffect(() => {
    const loadDepartments = () => {
      const deptData = organizationalDataService.getDepartments()
      setDepartments(deptData)
    }
    
    loadDepartments()
    
    // Listen for storage changes to update departments
    const handleStorageChange = () => {
      loadDepartments()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const [assets, setAssets] = useState([])

  // Load assets from asset service
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const allAssets = await assetService.getAllAssets()
        setAssets(allAssets)
      } catch (error) {
        console.error('Error loading assets:', error)
        setAssets([])
      }
    }
    
    loadAssets()
  }, [])

  const categories = ['all', 'Electronics', 'Office Equipment', 'Furniture', 'HVAC', 'Security', 'Machinery', 'Vehicles']
  const statuses = ['all', 'Assigned', 'Available', 'Damaged', 'Lost', 'Maintenance', 'Retired']

  const handleAddAsset = () => {
    setShowAddModal(true)
    setEditingAsset(null)
    setFormData({
      id: '',
      name: '',
      model: '',
      category: '',
      department: '',
      status: 'Available',
      quantity: 1,
      value: '',
      purchaseDate: '',
      depreciationRate: 20,
      vendor: '',
      accVoucher: '',
      warrantyPeriod: ''
    })
  }

  const handleEditAsset = (asset) => {
    setShowEditModal(true)
    setEditingAsset(asset)
    setFormData({
      id: asset.id,
      name: asset.name,
      model: asset.model || '',
      category: asset.category,
      department: asset.department,
      status: asset.status,
      quantity: asset.quantity || 1,
      value: asset.value,
      purchaseDate: asset.purchaseDate ? formatDateToYYYYMMDD(asset.purchaseDate) : '',
      depreciationRate: asset.depreciationRate || 20,
      vendor: asset.vendor || '',
      accVoucher: asset.accVoucher || '',
      warrantyPeriod: asset.warrantyPeriod || ''
    })
  }

  const handleSaveAsset = async () => {
    if (!formData.name || !formData.category || !formData.department || !formData.value) {
      alert('Please fill in all required fields (Asset Name, Category, Department, Purchased Value)')
      return
    }

    // Check for duplicate asset ID
    if (formData.id) {
      const existingAsset = assets.find(asset => asset.id === formData.id && asset.id !== editingAsset?.id)
      if (existingAsset) {
        alert('Asset ID already exists. Please choose a different ID.')
        return
      }
    }

    try {
      if (editingAsset) {
        // Update existing asset
        const updatedAsset = {
          ...editingAsset,
          ...formData,
          purchaseDate: formData.purchaseDate ? formatDateToDDMMYYYY(formData.purchaseDate) : editingAsset.purchaseDate,
          depreciationRate: formData.depreciationRate !== undefined ? formData.depreciationRate : 20,
          lastMaintenance: new Date().toISOString().split('T')[0]
        }
        
        await assetService.updateAsset(editingAsset.id, updatedAsset)
        
        // Reload assets
        const allAssets = await assetService.getAllAssets()
        setAssets(allAssets)
        
        setShowEditModal(false)
        
        // Show done animation
        showDoneAnimationWithMessage('Asset Updated Successfully!')
      } else {
        // Add new asset
        const newAssetData = {
          ...formData,
          purchaseDate: formData.purchaseDate ? formatDateToDDMMYYYY(formData.purchaseDate) : '',
          depreciationRate: formData.depreciationRate !== undefined ? formData.depreciationRate : 20
        }
        
        // Remove empty ID to trigger auto-generation
        if (!newAssetData.id || newAssetData.id.trim() === '') {
          delete newAssetData.id
        }
        
        await assetService.addAsset(newAssetData)
        
        // Reload assets
        const allAssets = await assetService.getAllAssets()
        setAssets(allAssets)
        
        setShowAddModal(false)
        
        // Show done animation
        showDoneAnimationWithMessage('Asset Added Successfully!')
      }

      // Reset form
      setFormData({
        id: '',
        name: '',
        category: '',
        department: '',
      status: 'Available',
        value: '',
        purchaseDate: '',
        depreciationRate: 20
      })
      setEditingAsset(null)
    } catch (error) {
      console.error('Error saving asset:', error)
      alert(`Error saving asset: ${error.message}`)
    }
  }

  const showDoneAnimationWithMessage = (message) => {
    setAnimationMessage(message)
    setShowDoneAnimation(true)
    setTimeout(() => {
      setShowDoneAnimation(false)
      setAnimationMessage('')
    }, 100)
  }

  const handleCancelAdd = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingAsset(null)
    setFormData({
      id: '',
      name: '',
      model: '',
      category: '',
      department: '',
      status: 'Available',
      quantity: 1,
      value: '',
      purchaseDate: '',
      depreciationRate: 20,
      vendor: '',
      accVoucher: '',
      warrantyPeriod: ''
    })
  }

  const handleDeleteAsset = async (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      try {
        await assetService.deleteAsset(assetId)
        
        // Reload assets
        const allAssets = await assetService.getAllAssets()
        setAssets(allAssets)
        
        // Show done animation
        showDoneAnimationWithMessage('Asset Deleted Successfully!')
      } catch (error) {
        console.error('Error deleting asset:', error)
        alert(`Error deleting asset: ${error.message}`)
      }
    }
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus
    const matchesDepartment = selectedDepartment === 'all' || asset.department === selectedDepartment
    const matchesAssignedPerson = assignedPersonSearch === '' || 
      (asset.assignedTo && asset.assignedTo.toLowerCase().includes(assignedPersonSearch.toLowerCase())) ||
      (asset.assignedToId && asset.assignedToId.toLowerCase().includes(assignedPersonSearch.toLowerCase()))

    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment && matchesAssignedPerson
  }).sort((a, b) => {
    // Sort by Asset ID in ascending order (treating as numbers)
    const idA = parseInt(a.id) || 0
    const idB = parseInt(b.id) || 0
    return idA - idB
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Assigned': return 'bg-blue-100 text-blue-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Retired': return 'bg-gray-100 text-gray-800'
      case 'Lost': return 'bg-red-100 text-red-800'
      case 'Damaged': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Excellent': return 'text-green-600'
      case 'Good': return 'text-blue-600'
      case 'Fair': return 'text-yellow-600'
      case 'Poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  // Calculate asset age in years for depreciation calculation
  const calculateAssetAgeInYears = (purchaseDate) => {
    if (!purchaseDate || purchaseDate.trim() === '') return 0
    
    const purchase = parseDate(purchaseDate)
    if (!purchase || isNaN(purchase.getTime())) return 0
    
    const now = new Date()
    const diffInMs = now - purchase
    
    // Check if purchase date is in the future
    if (diffInMs < 0) return 0
    
    const yearsDiff = diffInMs / (1000 * 60 * 60 * 24 * 365.25)
    return Math.max(0, yearsDiff)
  }

  // Calculate asset age in user-friendly format
  const calculateAssetAge = (purchaseDate) => {
    if (!purchaseDate || purchaseDate.trim() === '') return 'Unknown'
    
    const purchase = parseDate(purchaseDate)
    if (!purchase || isNaN(purchase.getTime())) {
      console.warn('Invalid purchase date for age calculation:', purchaseDate)
      return 'Invalid Date'
    }
    
    const now = new Date()
    const diffInMs = now - purchase
    
    // Check if purchase date is in the future
    if (diffInMs < 0) {
      return 'Future Date'
    }
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    const diffInMonths = Math.floor(diffInDays / 30.44) // Average days per month
    const diffInYears = Math.floor(diffInDays / 365.25)
    
    if (diffInYears > 0) {
      const remainingMonths = Math.floor((diffInDays % 365.25) / 30.44)
      if (remainingMonths > 0) {
        return `${diffInYears} Year${diffInYears > 1 ? 's' : ''} ${remainingMonths} Month${remainingMonths > 1 ? 's' : ''}`
      }
      return `${diffInYears} Year${diffInYears > 1 ? 's' : ''}`
    } else if (diffInMonths > 0) {
      const remainingDays = diffInDays % 30.44
      if (remainingDays > 0) {
        return `${diffInMonths} Month${diffInMonths > 1 ? 's' : ''} ${Math.floor(remainingDays)} Day${Math.floor(remainingDays) > 1 ? 's' : ''}`
      }
      return `${diffInMonths} Month${diffInMonths > 1 ? 's' : ''}`
    } else if (diffInDays > 0) {
      return `${diffInDays} Day${diffInDays > 1 ? 's' : ''}`
    } else {
      return 'Today'
    }
  }

  // Calculate depreciation with annual depreciation rate based on asset age
  const calculateDepreciation = (purchaseDate, purchaseValue, annualDepreciationRate = 20) => {
    if (!purchaseDate || !purchaseValue || purchaseValue <= 0) {
      return { depreciation: 0, depreciatedValue: purchaseValue || 0, ageInYears: 0 }
    }
    
    // Calculate asset age in years
    const ageInYears = calculateAssetAgeInYears(purchaseDate)
    
    // If no age or invalid date, no depreciation
    if (ageInYears <= 0) {
      return { depreciation: 0, depreciatedValue: purchaseValue, ageInYears: 0 }
    }
    
    // Convert annual percentage to decimal
    const annualRate = Math.max(0, Math.min(100, annualDepreciationRate)) / 100
    
    // Calculate total depreciation: Amount × Annual Rate × Years
    const totalDepreciation = purchaseValue * annualRate * ageInYears
    
    // Cap depreciation at 90% of original value
    const maxDepreciation = purchaseValue * 0.9
    const cappedDepreciation = Math.min(totalDepreciation, maxDepreciation)
    
    // Calculate book value: Amount - Capped Depreciation
    const depreciatedValue = Math.max(purchaseValue - cappedDepreciation, purchaseValue * 0.1) // Minimum 10% of original value
    
    // For display purposes, show the actual depreciation percentage (capped at 90%)
    const displayDepreciation = Math.round((cappedDepreciation / purchaseValue) * 100)
    
    return {
      depreciation: displayDepreciation,
      depreciatedValue: Math.round(depreciatedValue),
      ageInYears: Math.round(ageInYears * 100) / 100 // Round to 2 decimal places
    }
  }

  // Calculate total amount (quantity × purchased value)
  const totalAmount = assets.reduce((total, asset) => {
    const value = parseInt(asset.value.replace(/[^\d]/g, ''))
    const quantity = asset.quantity || 1
    return total + (value * quantity)
  }, 0)

  // Calculate total book value (based on amount and depreciation rate)
  const totalBookValue = assets.reduce((total, asset) => {
    const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
    const quantity = asset.quantity || 1
    const amount = purchaseValue * quantity
    const depreciationRate = asset.depreciationRate || 20
    const depreciation = calculateDepreciation(asset.purchaseDate, amount, depreciationRate)
    return total + depreciation.depreciatedValue
  }, 0)

  // Calculate search values based on selected category filter
  const getSearchValues = () => {
    const assetsToCalculate = selectedCategory === 'all' 
      ? filteredAssets 
      : filteredAssets.filter(asset => asset.category === selectedCategory)
    
    return assetsToCalculate.reduce((totals, asset) => {
      const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
      const quantity = asset.quantity || 1
      const amount = purchaseValue * quantity
      const depreciationRate = asset.depreciationRate || 20
      const depreciation = calculateDepreciation(asset.purchaseDate, amount, depreciationRate)
      
      return {
        quantity: totals.quantity + quantity,
        amount: totals.amount + amount,
        bookValue: totals.bookValue + depreciation.depreciatedValue
      }
    }, {
      quantity: 0,
      amount: 0,
      bookValue: 0
    })
  }

  // Calculate values by status
  const getValueByStatus = (status) => {
    return assets
      .filter(asset => asset.status === status)
      .reduce((total, asset) => {
        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
        const quantity = asset.quantity || 1
        const amount = purchaseValue * quantity
        const depreciationRate = asset.depreciationRate || 20
        const depreciation = calculateDepreciation(asset.purchaseDate, amount, depreciationRate)
        return total + depreciation.depreciatedValue
      }, 0)
  }

  // Calculate purchased value by status
  const getPurchasedValueByStatus = (status) => {
    return assets
      .filter(asset => asset.status === status)
      .reduce((total, asset) => {
        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
        const quantity = asset.quantity || 1
        const amount = purchaseValue * quantity
        return total + amount
      }, 0)
  }

  const retiredItemsValue = getValueByStatus('Retired')
  const lostItemsValue = getValueByStatus('Lost')
  const damagedItemsValue = getValueByStatus('Damaged')
  const assignedItemsValue = getValueByStatus('Assigned')
  const maintenanceItemsValue = getValueByStatus('Maintenance')

  // Calculate purchased values by status (Available + Assigned only)
  const activeItemsPurchasedValue = assets
    .filter(asset => ['Available', 'Assigned'].includes(asset.status))
    .reduce((total, asset) => {
      const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
      const quantity = asset.quantity || 1
      const amount = purchaseValue * quantity
      return total + amount
    }, 0)
  
  // Active Items Value includes only Available and Assigned items
  const activeItemsValue = assets
    .filter(asset => ['Available', 'Assigned'].includes(asset.status))
    .reduce((total, asset) => {
      const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
      const quantity = asset.quantity || 1
      const amount = purchaseValue * quantity
      const depreciationRate = asset.depreciationRate || 20
      const depreciation = calculateDepreciation(asset.purchaseDate, amount, depreciationRate)
      return total + depreciation.depreciatedValue
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Inventory</h1>
        <p className="text-sm text-gray-500">Manage and track all company assets</p>
      </div>


      {/* Asset Statistics - 2 rows of 5 cards each */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Assets</p>
              <p className="text-lg font-semibold text-gray-900">{assets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Active Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {assets.filter(asset => ['Available', 'Assigned'].includes(asset.status)).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Assigned Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Assigned').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Available Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Available').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-orange-100 rounded">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Damaged Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Damaged').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-yellow-100 rounded">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Asset In Maintenance</p>
              <p className="text-lg font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Maintenance').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-gray-100 rounded">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Retired Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Retired').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-red-100 rounded">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Lost Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {assets.filter(asset => asset.status === 'Lost').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-orange-100 rounded">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Book Value</p>
              <p className="text-lg font-semibold text-gray-900">{totalBookValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Values by Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">Asset Value By Status According to Purchased Value</h3>
        <div className="grid grid-cols-7 gap-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-gray-100 rounded mb-1">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Active Items Value</p>
              <p className="text-sm font-semibold text-gray-900">{activeItemsPurchasedValue.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-blue-100 rounded mb-1">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Assigned Items Value</p>
              <p className="text-sm font-semibold text-gray-900">{getPurchasedValueByStatus('Assigned').toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-green-100 rounded mb-1">
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Available Items Value</p>
              <p className="text-sm font-semibold text-gray-900">{getPurchasedValueByStatus('Available').toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-yellow-100 rounded mb-1">
                <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Maintenance Items Value</p>
              <p className="text-sm font-semibold text-gray-900">{getPurchasedValueByStatus('Maintenance').toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-gray-100 rounded mb-1">
                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Retired Items Value</p>
              <p className="text-sm font-semibold text-gray-900">{getPurchasedValueByStatus('Retired').toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-red-100 rounded mb-1">
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Lost Items Value</p>
              <p className="text-sm font-semibold text-gray-900">{getPurchasedValueByStatus('Lost').toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-orange-100 rounded mb-1">
                <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">Damaged Items Value</p>
              <p className="text-sm font-semibold text-gray-900">{getPurchasedValueByStatus('Damaged').toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Assets</label>
            <input
              type="text"
              placeholder="Search by name, ID, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
            <input
              type="text"
              placeholder="Search by assigned person name or ID..."
              value={assignedPersonSearch}
              onChange={(e) => setAssignedPersonSearch(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleAddAsset}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors"
            >
              Add New Asset
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Asset List</h3>
          <p className="text-sm text-gray-500">Showing {filteredAssets.length} of {assets.length} assets</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchased Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchased Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Depreciation Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{asset.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                      {asset.model && (
                        <div className="text-xs text-gray-500">{asset.model}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{asset.category}</span>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm text-gray-900">
                      {asset.department}
                     </span>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{asset.status}</span>
                  </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                     {asset.assignedTo === 'Unassigned' ? (
                       <span className="text-sm text-gray-500">-</span>
                     ) : (
                       <div>
                         <div className="text-sm font-medium text-gray-900">{asset.assignedTo}</div>
                         <div className="text-xs text-gray-500">{asset.assignedToId}</div>
                       </div>
                     )}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{asset.quantity || 1}</span>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{asset.value}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {(() => {
                        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
                        const quantity = asset.quantity || 1
                        return `${(purchaseValue * quantity).toLocaleString()}`
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{asset.purchaseDate || '-'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{calculateAssetAge(asset.purchaseDate)}</span>
                  </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-sm text-gray-900">
                {asset.depreciationRate || 20}%
              </span>
            </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(() => {
                        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ''))
                        const quantity = asset.quantity || 1
                        const amount = purchaseValue * quantity
                        const depreciationRate = asset.depreciationRate || 20
                        const depreciation = calculateDepreciation(asset.purchaseDate, amount, depreciationRate)
                        return (
                          <div>
                            <div className="font-semibold">{depreciation.depreciatedValue.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">
                              {depreciation.depreciation > 0 ? `${depreciation.depreciation}% depreciated` : 'No depreciation'}
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditAsset(asset)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteAsset(asset.id)}
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

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Asset</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset ID</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Auto-generated if left empty"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generation</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., HP Laptop EliteBook 840"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., EliteBook 840 G8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Category</option>
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {statuses.filter(status => status !== 'all').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value === '' ? 1 : parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchased Value *</label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 85,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchased Date</label>
                    <CustomDateInput
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Depreciation Rate (%)</label>
                    <input
                      type="number"
                      value={formData.depreciationRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, depreciationRate: e.target.value === '' ? 0 : parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="20"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Rate per year (e.g., 20% = 20% depreciation per year)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ABC Electronics Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ACC Voucher</label>
                    <input
                      type="text"
                      value={formData.accVoucher}
                      onChange={(e) => setFormData(prev => ({ ...prev, accVoucher: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., VCH-2024-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Period</label>
                    <input
                      type="text"
                      value={formData.warrantyPeriod}
                      onChange={(e) => setFormData(prev => ({ ...prev, warrantyPeriod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 2 years, 24 months, 1 year"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAsset}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors"
                >
                  Add Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Asset</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset ID</label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Auto-generated if left empty"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generation</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., HP Laptop EliteBook 840"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Asset Model</label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., EliteBook 840 G8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Category</option>
                      {categories.filter(cat => cat !== 'all').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {statuses.filter(status => status !== 'all').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value === '' ? 1 : parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchased Value *</label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 85,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchased Date</label>
                    <CustomDateInput
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Depreciation Rate (%)</label>
                    <input
                      type="number"
                      value={formData.depreciationRate}
                      onChange={(e) => setFormData(prev => ({ ...prev, depreciationRate: e.target.value === '' ? 0 : parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="20"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Rate per year (e.g., 20% = 20% depreciation per year)</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ABC Electronics Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ACC Voucher</label>
                    <input
                      type="text"
                      value={formData.accVoucher}
                      onChange={(e) => setFormData(prev => ({ ...prev, accVoucher: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., VCH-2024-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Period</label>
                    <input
                      type="text"
                      value={formData.warrantyPeriod}
                      onChange={(e) => setFormData(prev => ({ ...prev, warrantyPeriod: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 2 years, 24 months, 1 year"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAsset}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors"
                >
                  Update Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Value Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">Search Value</h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {selectedCategory === 'all' ? 'Total Value (All Categories)' : `${selectedCategory} Category Value`}
              </h4>
              <p className="text-xs text-gray-600">
                {selectedCategory === 'all' 
                  ? 'Total value of all assets based on current filters' 
                  : `Total value of assets in ${selectedCategory} category based on current filters`
                }
              </p>
            </div>
          </div>
          
          {/* 3 Column Value Display */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
              <div className="text-lg font-bold text-blue-600 mb-1">
                {getSearchValues().quantity.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-gray-700">Quantity</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
              <div className="text-lg font-bold text-purple-600 mb-1">
                {getSearchValues().amount.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-gray-700">Amount</div>
            </div>
            
            <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
              <div className="text-lg font-bold text-orange-600 mb-1">
                {getSearchValues().bookValue.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-gray-700">Book Value</div>
            </div>
          </div>
        </div>
      </div>

      {/* Light Orange Done Animation Overlay */}
      {showDoneAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center animate-bounce">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Done!</h3>
            <p className="text-sm text-gray-600 text-center">{animationMessage}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetInventory
