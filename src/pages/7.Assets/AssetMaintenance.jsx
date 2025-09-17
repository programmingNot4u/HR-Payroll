import React, { useState, useEffect } from 'react'
import assetService from '../../services/assetService'

// Custom Date Input Component for DD/MM/YYYY format
const CustomDateInput = ({ value, onChange, required, className, ...props }) => {
  const [displayValue, setDisplayValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  React.useEffect(() => {
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
        onChange(isoDate)
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

const AssetMaintenance = () => {
  const [selectedAsset, setSelectedAsset] = useState('')
  const [maintenanceDate, setMaintenanceDate] = useState('')
  const [maintenanceProvider, setMaintenanceProvider] = useState('')
  
  // Edit form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMaintenance, setEditingMaintenance] = useState(null)
  const [editMaintenanceProvider, setEditMaintenanceProvider] = useState('')
  const [editCompletedDate, setEditCompletedDate] = useState('')
  
  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingMaintenanceId, setDeletingMaintenanceId] = useState(null)

  // Edit provider state
  const [isEditProviderModalOpen, setIsEditProviderModalOpen] = useState(false)
  const [editingProviderId, setEditingProviderId] = useState(null)
  const [newProviderName, setNewProviderName] = useState('')

  // Completion date modal state
  const [isCompletionDateModalOpen, setIsCompletionDateModalOpen] = useState(false)
  const [completingMaintenanceId, setCompletingMaintenanceId] = useState(null)
  const [completionDate, setCompletionDate] = useState('')

  // Edit dates modal state
  const [isEditDatesModalOpen, setIsEditDatesModalOpen] = useState(false)
  const [editingDatesId, setEditingDatesId] = useState(null)
  const [editScheduledDate, setEditScheduledDate] = useState('')
  const [editCompletedDateNew, setEditCompletedDateNew] = useState('')


  const [assets, setAssets] = useState([])

  const [maintenanceHistory, setMaintenanceHistory] = useState(() => {
    // Load from localStorage on component mount
    const saved = localStorage.getItem('assetMaintenanceHistory')
    return saved ? JSON.parse(saved) : []
  })

  // Load assets from asset service
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const allAssets = await assetService.getAllAssets()
        setAssets(allAssets)
      } catch (error) {
        console.error('Error loading assets:', error)
      }
    }
    loadAssets()
  }, [])

  // Save maintenance history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('assetMaintenanceHistory', JSON.stringify(maintenanceHistory))
  }, [maintenanceHistory])


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedAsset || !maintenanceDate || !maintenanceProvider) {
      alert('Please fill in all required fields')
      return
    }

    // Find the selected asset details
    const selectedAssetData = assets.find(asset => asset.id === selectedAsset)
    if (!selectedAssetData) {
      alert('Selected asset not found')
      return
    }

    try {
      // Update asset status to 'Maintenance'
      await assetService.updateAssetStatusForMaintenance(selectedAsset, 'Maintenance')
      
      // Add maintenance record to asset
      const maintenanceData = {
        scheduledDate: maintenanceDate,
        completedDate: '', // Will be filled when maintenance is completed
        maintenanceProvider: maintenanceProvider,
        status: 'Pending'
      }
      
      await assetService.addMaintenanceRecord(selectedAsset, maintenanceData)

      // Create new maintenance history entry for local state
      const newMaintenanceEntry = {
        id: `HIST-${Date.now()}`, // Generate unique ID
        assetId: selectedAssetData.id,
        asset: selectedAssetData.name,
        scheduledDate: maintenanceDate,
        completedDate: '', // Will be filled when maintenance is completed
        maintenanceProvider: maintenanceProvider,
        status: 'Pending'
      }

      // Add to maintenance history
      setMaintenanceHistory(prev => [newMaintenanceEntry, ...prev])

      // Reset form
      setSelectedAsset('')
      setMaintenanceDate('')
      setMaintenanceProvider('')

      alert('Maintenance request submitted successfully! Asset status updated to "Maintenance".')
    } catch (error) {
      console.error('Error submitting maintenance request:', error)
      alert(`Error submitting maintenance request: ${error.message}`)
    }
  }

  const handleEditMaintenance = (historyId) => {
    const maintenanceRecord = maintenanceHistory.find(record => record.id === historyId)
    if (maintenanceRecord) {
      setEditingMaintenance(maintenanceRecord)
      setEditMaintenanceProvider(maintenanceRecord.maintenanceProvider || '')
      // Ensure completed date is a string
      const completedDate = maintenanceRecord.completedDate || ''
      setEditCompletedDate(typeof completedDate === 'string' ? completedDate : '')
      setIsEditModalOpen(true)
    }
  }

  const handleDeleteMaintenance = (historyId) => {
    setDeletingMaintenanceId(historyId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (deletingMaintenanceId) {
      // Remove from maintenance history
      setMaintenanceHistory(prev => prev.filter(record => record.id !== deletingMaintenanceId))
      console.log('Delete maintenance record:', deletingMaintenanceId)
    }
    // Close modal and reset
    setIsDeleteModalOpen(false)
    setDeletingMaintenanceId(null)
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setDeletingMaintenanceId(null)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    if (!editMaintenanceProvider.trim()) {
      alert('Please enter a maintenance provider')
      return
    }

    try {
      // Ensure editCompletedDate is a string
      const completedDate = typeof editCompletedDate === 'string' ? editCompletedDate : ''
      
      // If completed date is provided, update asset status to 'Available'
      if (completedDate) {
        await assetService.updateAssetStatusForMaintenance(editingMaintenance.assetId, 'Available')
      }

      // Update the maintenance record in local state
      setMaintenanceHistory(prev => 
        prev.map(record => 
          record.id === editingMaintenance.id 
            ? {
                ...record,
                maintenanceProvider: editMaintenanceProvider,
                completedDate: completedDate
              }
            : record
        )
      )

      // Close modal and reset form
      setIsEditModalOpen(false)
      setEditingMaintenance(null)
      setEditMaintenanceProvider('')
      setEditCompletedDate('')
      
      if (completedDate) {
        alert('Maintenance record updated successfully! Asset status updated to "Available".')
      } else {
        alert('Maintenance record updated successfully!')
      }
    } catch (error) {
      console.error('Error updating maintenance record:', error)
      alert(`Error updating maintenance record: ${error.message}`)
    }
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingMaintenance(null)
    setEditMaintenanceProvider('')
    setEditCompletedDate('')
  }


  const handleStatusChange = async (historyId, newStatus) => {
    try {
      // If status is Complete, open completion date modal
      if (newStatus === 'Complete') {
        setCompletingMaintenanceId(historyId)
        setCompletionDate('')
        setIsCompletionDateModalOpen(true)
      } else {
        // For Pending or Ongoing, update status and asset status
        const maintenanceRecord = maintenanceHistory.find(record => record.id === historyId)
        if (maintenanceRecord) {
          // Update maintenance record status
          setMaintenanceHistory(prev => 
            prev.map(record => 
              record.id === historyId 
                ? {
                    ...record,
                    status: newStatus
                  }
                : record
            )
          )
          
          // Update asset status based on maintenance status
          let assetStatus = 'Available' // Default
          if (newStatus === 'Pending' || newStatus === 'Ongoing') {
            assetStatus = 'Maintenance'
          }
          
          await assetService.updateAssetStatusForMaintenance(maintenanceRecord.assetId, assetStatus)
        }
        
        alert(`Maintenance status updated to "${newStatus}" successfully! Asset status updated to "${newStatus === 'Pending' || newStatus === 'Ongoing' ? 'Maintenance' : 'Available'}".`)
      }
    } catch (error) {
      console.error('Error updating maintenance status:', error)
      alert(`Error updating maintenance status: ${error.message}`)
    }
  }

  const handleCompletionDateSubmit = async (e) => {
    e.preventDefault()
    
    if (!completionDate) {
      alert('Please select a completion date')
      return
    }

    try {
      // Convert DD/MM/YYYY to YYYY-MM-DD for storage
      let completedDateForStorage = ''
      if (completionDate) {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
        const match = completionDate.match(dateRegex)
        if (match) {
          const [, day, month, year] = match
          completedDateForStorage = `${year}-${month}-${day}`
        } else {
          // If it's already in YYYY-MM-DD format, use as is
          completedDateForStorage = completionDate
        }
      }

      // Update the maintenance record in local state
      setMaintenanceHistory(prev => 
        prev.map(record => 
          record.id === completingMaintenanceId 
            ? {
                ...record,
                status: 'Complete',
                completedDate: completedDateForStorage
              }
            : record
        )
      )
      
      // Update asset status to Available
      const maintenanceRecord = maintenanceHistory.find(record => record.id === completingMaintenanceId)
      if (maintenanceRecord) {
        await assetService.updateAssetStatusForMaintenance(maintenanceRecord.assetId, 'Available')
      }
      
      // Close modal and reset form
      setIsCompletionDateModalOpen(false)
      setCompletingMaintenanceId(null)
      setCompletionDate('')
      
      alert('Maintenance status updated to "Complete" successfully! Asset status updated to "Available".')
    } catch (error) {
      console.error('Error updating maintenance status:', error)
      alert(`Error updating maintenance status: ${error.message}`)
    }
  }

  const handleCloseCompletionDateModal = () => {
    setIsCompletionDateModalOpen(false)
    setCompletingMaintenanceId(null)
    setCompletionDate('')
  }

  const handleEditDates = (historyId) => {
    const maintenanceRecord = maintenanceHistory.find(record => record.id === historyId)
    if (maintenanceRecord) {
      setEditingDatesId(historyId)
      setEditScheduledDate(maintenanceRecord.scheduledDate || '')
      setEditCompletedDateNew(maintenanceRecord.completedDate || '')
      setIsEditDatesModalOpen(true)
    }
  }

  const handleDatesSubmit = async (e) => {
    e.preventDefault()
    
    if (!editScheduledDate) {
      alert('Please enter a scheduled date')
      return
    }

    try {
      // Convert DD/MM/YYYY to YYYY-MM-DD for storage
      let scheduledDateForStorage = ''
      let completedDateForStorage = ''
      
      if (editScheduledDate) {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
        const match = editScheduledDate.match(dateRegex)
        if (match) {
          const [, day, month, year] = match
          scheduledDateForStorage = `${year}-${month}-${day}`
        } else {
          scheduledDateForStorage = editScheduledDate
        }
      }
      
      if (editCompletedDateNew) {
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/
        const match = editCompletedDateNew.match(dateRegex)
        if (match) {
          const [, day, month, year] = match
          completedDateForStorage = `${year}-${month}-${day}`
        } else {
          completedDateForStorage = editCompletedDateNew
        }
      }

      // Update the maintenance record in local state
      setMaintenanceHistory(prev => 
        prev.map(record => 
          record.id === editingDatesId 
            ? {
                ...record,
                scheduledDate: scheduledDateForStorage,
                completedDate: completedDateForStorage,
                status: completedDateForStorage ? 'Complete' : record.status
              }
            : record
        )
      )

      // Update asset status based on completion date
      const maintenanceRecord = maintenanceHistory.find(record => record.id === editingDatesId)
      if (maintenanceRecord) {
        let assetStatus = 'Available' // Default
        if (completedDateForStorage) {
          assetStatus = 'Available' // Completed maintenance
        } else {
          // If no completion date, check current maintenance status
          const currentRecord = maintenanceHistory.find(record => record.id === editingDatesId)
          if (currentRecord && (currentRecord.status === 'Pending' || currentRecord.status === 'Ongoing')) {
            assetStatus = 'Maintenance'
          }
        }
        
        await assetService.updateAssetStatusForMaintenance(maintenanceRecord.assetId, assetStatus)
      }

      // Close modal and reset form
      setIsEditDatesModalOpen(false)
      setEditingDatesId(null)
      setEditScheduledDate('')
      setEditCompletedDateNew('')
      
      alert('Maintenance dates updated successfully!')
    } catch (error) {
      console.error('Error updating maintenance dates:', error)
      alert(`Error updating maintenance dates: ${error.message}`)
    }
  }

  const handleCloseDatesModal = () => {
    setIsEditDatesModalOpen(false)
    setEditingDatesId(null)
    setEditScheduledDate('')
    setEditCompletedDateNew('')
  }

  const handleEditProvider = (historyId) => {
    const maintenanceRecord = maintenanceHistory.find(record => record.id === historyId)
    if (maintenanceRecord) {
      setEditingProviderId(historyId)
      setNewProviderName(maintenanceRecord.maintenanceProvider || '')
      setIsEditProviderModalOpen(true)
    }
  }

  const handleProviderSubmit = (e) => {
    e.preventDefault()
    
    if (!newProviderName.trim()) {
      alert('Please enter a maintenance provider name')
      return
    }

    // Update the maintenance record in local state
    setMaintenanceHistory(prev => 
      prev.map(record => 
        record.id === editingProviderId 
          ? {
              ...record,
              maintenanceProvider: newProviderName.trim()
            }
          : record
      )
    )

    // Close modal and reset form
    setIsEditProviderModalOpen(false)
    setEditingProviderId(null)
    setNewProviderName('')
    
    alert('Maintenance provider updated successfully!')
  }

  const handleCloseProviderModal = () => {
    setIsEditProviderModalOpen(false)
    setEditingProviderId(null)
    setNewProviderName('')
  }


  // Helper function to calculate time since last maintenance
  const getTimeSinceLastMaintenance = (assetId) => {
    // Find the most recent maintenance record for this asset
    const assetMaintenance = maintenanceHistory
      .filter(record => record.assetId === assetId)
      .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))
    
    if (assetMaintenance.length === 0) {
      return 'Never maintained'
    }

    const lastMaintenanceDate = new Date(assetMaintenance[0].scheduledDate)
    const now = new Date()
    const diffTime = Math.abs(now - lastMaintenanceDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return '1 day ago'
    } else if (diffDays < 30) {
      return `${diffDays} days ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return months === 1 ? '1 month ago' : `${months} months ago`
    } else {
      const years = Math.floor(diffDays / 365)
      return years === 1 ? '1 year ago' : `${years} years ago`
    }
  }

  // Helper function to get all assets with their maintenance status
  const getAssetsWithMaintenanceStatus = () => {
    return assets.map(asset => ({
      ...asset,
      timeSinceLastMaintenance: getTimeSinceLastMaintenance(asset.id),
      lastMaintenanceDate: maintenanceHistory
        .filter(record => record.assetId === asset.id)
        .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate))[0]?.scheduledDate || null
    }))
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Maintenance</h1>
        <p className="text-sm text-gray-500">Manage asset maintenance schedules and requests</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Request Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">New Maintenance Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset *</label>
              <select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Choose an asset...</option>
                {assets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.id} - {asset.name} - {asset.category} ({asset.department})
                  </option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Scheduled Date *</label>
              <CustomDateInput
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                required
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Provider</label>
              <input
                type="text"
                value={maintenanceProvider}
                onChange={(e) => setMaintenanceProvider(e.target.value)}
                placeholder="Enter provider name"
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 py-2 px-4 rounded hover:from-orange-200 hover:to-orange-300 transition-all duration-200 font-medium"
            >
              Submit Maintenance Request
            </button>
          </form>
        </div>

        {/* Assets Due for Maintenance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium mb-4">Assets Due for Maintenance</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {getAssetsWithMaintenanceStatus().map(asset => (
              <div key={asset.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{asset.name}</div>
                  <div className="text-sm text-gray-500">{asset.category} • {asset.department}</div>
                  <div className="text-xs text-gray-400">ID: {asset.id}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">{asset.timeSinceLastMaintenance}</div>
                  <div className="text-xs text-gray-500">
                    {asset.lastMaintenanceDate ? `Last: ${asset.lastMaintenanceDate}` : 'No maintenance history'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Maintenance History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Maintenance History</h3>
          <p className="text-sm text-gray-500">Completed maintenance records</p>
        </div>
        {maintenanceHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maintenance Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {maintenanceHistory.map((history) => (
                  <tr key={history.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{history.assetId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{history.asset}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{history.scheduledDate}</span>
                        <button
                          onClick={() => handleEditDates(history.id)}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="Edit dates"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{history.completedDate || '-'}</span>
                        <button
                          onClick={() => handleEditDates(history.id)}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="Edit dates"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{history.maintenanceProvider}</span>
                        <button
                          onClick={() => handleEditProvider(history.id)}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="Edit maintenance provider"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={history.status || 'Pending'}
                        onChange={(e) => handleStatusChange(history.id, e.target.value)}
                        className={`text-xs font-semibold rounded-md px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          history.status === 'Complete' 
                            ? 'bg-green-100 text-green-800' 
                            : history.status === 'Ongoing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : history.status === 'Pending'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Complete">Complete</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditMaintenance(history.id)}
                          className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-3 py-1 rounded-md hover:from-orange-200 hover:to-orange-300 transition-all duration-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteMaintenance(history.id)}
                          className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-3 py-1 rounded-md hover:from-orange-200 hover:to-orange-300 transition-all duration-200"
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
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Maintenance Records</h3>
            <p className="text-gray-500">Submit your first maintenance request using the form above.</p>
          </div>
        )}
      </div>

      {/* Edit Maintenance Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Maintenance Record</h3>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset
                </label>
                <input
                  type="text"
                  value={editingMaintenance?.asset || ''}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset ID
                </label>
                <input
                  type="text"
                  value={editingMaintenance?.assetId || ''}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="text"
                  value={editingMaintenance?.scheduledDate || ''}
                  disabled
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maintenance Provider *
                </label>
                <input
                  type="text"
                  value={editMaintenanceProvider}
                  onChange={(e) => setEditMaintenanceProvider(e.target.value)}
                  placeholder="Enter maintenance provider"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Completed Date
                </label>
                <CustomDateInput
                  value={editCompletedDate}
                  onChange={setEditCompletedDate}
                  placeholder="Select completion date (optional)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-md hover:from-orange-200 hover:to-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 font-medium"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Maintenance Record</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this maintenance record? This action cannot be undone.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-md hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 rounded-md hover:from-orange-200 hover:to-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 font-medium"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Provider Modal */}
      {isEditProviderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Maintenance Provider</h3>
            
            <form onSubmit={handleProviderSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Provider *
                </label>
                <input
                  type="text"
                  value={newProviderName}
                  onChange={(e) => setNewProviderName(e.target.value)}
                  required
                  placeholder="Enter maintenance provider name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-4 py-2 rounded-md hover:from-orange-200 hover:to-orange-300 transition-all duration-200 font-medium"
                >
                  Update Provider
                </button>
                <button
                  type="button"
                  onClick={handleCloseProviderModal}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-md hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion Date Modal */}
      {isCompletionDateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Completion Date</h3>
            
            <form onSubmit={handleCompletionDateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completion Date *
                </label>
                <CustomDateInput
                  value={completionDate}
                  onChange={setCompletionDate}
                  required
                  placeholder="Select completion date (DD/MM/YYYY)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the completion date in DD/MM/YYYY format
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-4 py-2 rounded-md hover:from-orange-200 hover:to-orange-300 transition-all duration-200 font-medium"
                >
                  Complete Maintenance
                </button>
                <button
                  type="button"
                  onClick={handleCloseCompletionDateModal}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-md hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Dates Modal */}
      {isEditDatesModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Maintenance Dates</h3>
            
            <form onSubmit={handleDatesSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date *
                </label>
                <CustomDateInput
                  value={editScheduledDate}
                  onChange={setEditScheduledDate}
                  required
                  placeholder="Enter scheduled date (DD/MM/YYYY)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Completed Date
                </label>
                <CustomDateInput
                  value={editCompletedDateNew}
                  onChange={setEditCompletedDateNew}
                  placeholder="Enter completion date (DD/MM/YYYY) - Optional"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if maintenance is not yet completed
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 px-4 py-2 rounded-md hover:from-orange-200 hover:to-orange-300 transition-all duration-200 font-medium"
                >
                  Update Dates
                </button>
                <button
                  type="button"
                  onClick={handleCloseDatesModal}
                  className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-4 py-2 rounded-md hover:from-gray-200 hover:to-gray-300 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AssetMaintenance
