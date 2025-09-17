// Asset Service - Centralized asset management
class AssetService {
  constructor() {
    this.assets = this.loadAssetsFromStorage()
    this.employees = []
    
    // Initialize with empty array - no mock data
    if (this.assets.length === 0) {
      this.assets = []
    }
  }

  // Load assets from localStorage
  loadAssetsFromStorage() {
    try {
      const stored = localStorage.getItem('hr_payroll_assets')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading assets from storage:', error)
      return []
    }
  }

  // Set employees data (called from component)
  setEmployees(employeesData) {
    this.employees = employeesData
  }

  // Save assets to localStorage
  saveAssetsToStorage() {
    try {
      localStorage.setItem('hr_payroll_assets', JSON.stringify(this.assets))
    } catch (error) {
      console.error('Error saving assets to storage:', error)
    }
  }

  // Get all assets
  getAllAssets() {
    return Promise.resolve(this.assets)
  }

  // Get available assets (not assigned)
  getAvailableAssets() {
    return Promise.resolve(this.assets.filter(asset => asset.status === 'Available'))
  }

  // Get asset by ID
  getAssetById(id) {
    return Promise.resolve(this.assets.find(asset => asset.id === id))
  }

  // Add new asset
  addAsset(assetData) {
    // Generate unique ID if not provided or empty
    let assetId = assetData.id
    if (!assetId || assetId.trim() === '') {
      let newId = 1
      while (this.assets.some(asset => asset.id === String(newId))) {
        newId++
      }
      assetId = String(newId)
    }
    
    const newAsset = {
      id: assetId,
      ...assetData,
      assignedTo: 'Unassigned',
      assignedToId: null,
      assignmentDate: null,
      expectedReturnDate: null,
      assignmentReason: null,
      assignedBy: null,
      assignmentNotes: null,
      assignmentHistory: []
    }
    
    this.assets.push(newAsset)
    this.saveAssetsToStorage()
    return Promise.resolve(newAsset)
  }

  // Update asset
  updateAsset(assetId, updates) {
    const index = this.assets.findIndex(asset => asset.id === assetId)
    if (index !== -1) {
      this.assets[index] = { ...this.assets[index], ...updates }
      this.saveAssetsToStorage()
      return Promise.resolve(this.assets[index])
    }
    return Promise.reject(new Error('Asset not found'))
  }

  // Delete asset
  deleteAsset(assetId) {
    const index = this.assets.findIndex(asset => asset.id === assetId)
    if (index !== -1) {
      this.assets.splice(index, 1)
      this.saveAssetsToStorage()
      return Promise.resolve(true)
    }
    return Promise.reject(new Error('Asset not found'))
  }

  // Get assignment history
  getAssignmentHistory() {
    const assignedAssets = this.assets.filter(asset => 
      asset.status === 'Assigned' && asset.assignedToId && asset.assignmentDate
    )
    
    return Promise.resolve(assignedAssets.map(asset => ({
      id: `ASG-${asset.id}`,
      assetId: asset.id,
      asset: asset.name,
      employee: asset.assignedTo,
      employeeId: asset.assignedToId,
      assignedDate: asset.assignmentDate,
      assignedCondition: asset.assignedCondition || 'Good',
      expectedReturn: asset.expectedReturnDate,
      status: 'Active',
      assignedBy: asset.assignedBy,
      reason: asset.assignmentReason,
      notes: asset.assignmentNotes
    })))
  }

  // Get all assignments (including historical)
  getAllAssignments() {
    // This would include both active and historical assignments
    // For now, we'll return active assignments
    return this.getAssignmentHistory()
  }

  // Assign asset to employee
  assignAsset(assetId, employeeId, employeeName, assignmentData) {
    const asset = this.assets.find(a => a.id === assetId)
    if (!asset) {
      return Promise.reject(new Error('Asset not found'))
    }

    if (asset.status !== 'Available') {
      return Promise.reject(new Error('Asset is not available for assignment'))
    }

    // Initialize assignment history if it doesn't exist
    if (!asset.assignmentHistory) {
      asset.assignmentHistory = []
    }

    // Add current assignment to history
    asset.assignmentHistory.push({
      employeeId: employeeId,
      employeeName: employeeName,
      assignmentDate: assignmentData.assignmentDate,
      expectedReturnDate: assignmentData.expectedReturnDate,
      assignmentReason: assignmentData.assignmentReason,
      assignedBy: assignmentData.assignedBy,
      assignedCondition: assignmentData.assignedCondition || 'Good',
      assignmentNotes: assignmentData.notes,
      returnDate: null, // Will be set when returned
      returnCondition: null,
      returnReason: null,
      returnedBy: null,
      returnNotes: null
    })

    // Update asset status
    asset.status = 'Assigned'
    asset.assignedTo = employeeName
    asset.assignedToId = employeeId
    asset.assignmentDate = assignmentData.assignmentDate
    asset.expectedReturnDate = assignmentData.expectedReturnDate
    asset.assignmentReason = assignmentData.assignmentReason
    asset.assignedBy = assignmentData.assignedBy
    asset.assignmentNotes = assignmentData.notes

    this.saveAssetsToStorage()
    return Promise.resolve(asset)
  }

  // Update assignment
  updateAssignment(assignmentId, updateData) {
    console.log('updateAssignment called with:', { assignmentId, updateData })
    console.log('Employees available in service:', this.employees)
    
    // Find the assignment by ID (remove ASG- prefix)
    const currentAssetId = assignmentId.replace('ASG-', '')
    const currentAsset = this.assets.find(a => a.id === currentAssetId)
    
    console.log('Current asset found:', currentAsset)
    
    if (!currentAsset) {
      return Promise.reject(new Error('Asset not found'))
    }

    if (currentAsset.status !== 'Assigned') {
      return Promise.reject(new Error('Asset is not currently assigned'))
    }

    // Check if employees data is available
    if (!this.employees || this.employees.length === 0) {
      return Promise.reject(new Error('Employee data not available. Please refresh the page.'))
    }

    // If asset is being changed, we need to handle it differently
    if (updateData.selectedAsset && updateData.selectedAsset !== currentAssetId) {
      // Find the new asset
      const newAsset = this.assets.find(a => a.id === updateData.selectedAsset)
      if (!newAsset) {
        return Promise.reject(new Error('New asset not found'))
      }
      
      if (newAsset.status !== 'Available') {
        return Promise.reject(new Error('New asset is not available'))
      }

      // Find the employee for the new assignment
      console.log('Looking for employee with ID:', updateData.selectedEmployee)
      console.log('Available employees:', this.employees)
      const employee = this.employees ? this.employees.find(emp => emp.id === updateData.selectedEmployee) : null
      console.log('Found employee:', employee)
      if (!employee) {
        return Promise.reject(new Error('Employee not found'))
      }

      // Unassign current asset
      currentAsset.status = 'Available'
      currentAsset.assignedTo = 'Unassigned'
      currentAsset.assignedToId = null
      currentAsset.assignmentDate = null
      currentAsset.expectedReturnDate = null
      currentAsset.assignmentReason = null
      currentAsset.assignedBy = null
      currentAsset.assignmentNotes = null

      // Assign new asset
      newAsset.status = 'Assigned'
      newAsset.assignedTo = employee.name
      newAsset.assignedToId = employee.id
      newAsset.assignmentDate = updateData.assignedDate || new Date().toISOString().split('T')[0]
      newAsset.assignedCondition = updateData.assignedCondition || 'Good'
      newAsset.assignedBy = updateData.assignedBy || ''

      // Initialize assignment history for new asset if it doesn't exist
      if (!newAsset.assignmentHistory) {
        newAsset.assignmentHistory = []
      }

      // Add assignment to history
      newAsset.assignmentHistory.push({
        employeeId: employee.id,
        employeeName: employee.name,
        assignmentDate: newAsset.assignmentDate,
        assignedCondition: newAsset.assignedCondition,
        assignedBy: newAsset.assignedBy,
        returnDate: null,
        returnCondition: null,
        returnReason: null,
        returnedBy: null,
        returnNotes: null
      })

      this.saveAssetsToStorage()
      return Promise.resolve(newAsset)
    } else {
      console.log('Updating current asset (no asset change)')
      // Update current asset assignment data
      if (updateData.selectedEmployee) {
        console.log('Looking for employee with ID:', updateData.selectedEmployee)
        console.log('Available employees:', this.employees)
        const employee = this.employees ? this.employees.find(emp => emp.id === updateData.selectedEmployee) : null
        console.log('Found employee:', employee)
        if (employee) {
          currentAsset.assignedTo = employee.name
          currentAsset.assignedToId = employee.id
        }
      }
      
      if (updateData.assignedDate) {
        currentAsset.assignmentDate = updateData.assignedDate
      }
      
      if (updateData.assignedCondition) {
        currentAsset.assignedCondition = updateData.assignedCondition
      }
      
      if (updateData.assignedBy) {
        currentAsset.assignedBy = updateData.assignedBy
      }

      // Update the current assignment in history
      if (currentAsset.assignmentHistory && currentAsset.assignmentHistory.length > 0) {
        const currentAssignment = currentAsset.assignmentHistory[currentAsset.assignmentHistory.length - 1]
        if (currentAssignment && !currentAssignment.returnDate) {
          if (updateData.selectedEmployee && employee) {
            currentAssignment.employeeId = employee.id
            currentAssignment.employeeName = employee.name
          }
          if (updateData.assignedDate) currentAssignment.assignmentDate = updateData.assignedDate
          if (updateData.assignedCondition) currentAssignment.assignedCondition = updateData.assignedCondition
          if (updateData.assignedBy) currentAssignment.assignedBy = updateData.assignedBy
        }
      }

      this.saveAssetsToStorage()
      return Promise.resolve(currentAsset)
    }
  }

  // Unassign asset
  unassignAsset(assetId) {
    const asset = this.assets.find(a => a.id === assetId)
    if (!asset) {
      return Promise.reject(new Error('Asset not found'))
    }

    // Reset assignment data
    asset.status = 'Available'
    asset.assignedTo = 'Unassigned'
    asset.assignedToId = null
    asset.assignmentDate = null
    asset.expectedReturnDate = null
    asset.assignmentReason = null
    asset.assignedBy = null
    asset.assignmentNotes = null

    this.saveAssetsToStorage()
    return Promise.resolve(asset)
  }

  // Process asset return
  processReturn(assignmentId, returnData) {
    // Find the assignment by ID (remove ASG- prefix)
    const assetId = assignmentId.replace('ASG-', '')
    const asset = this.assets.find(a => a.id === assetId)
    
    if (!asset) {
      return Promise.reject(new Error('Asset not found'))
    }

    if (asset.status !== 'Assigned') {
      return Promise.reject(new Error('Asset is not currently assigned'))
    }

    // Store employee information before clearing assignment data
    const originalEmployee = asset.assignedTo
    const originalEmployeeId = asset.assignedToId
    
    // Store assignment date before clearing it
    const originalAssignmentDate = asset.assignmentDate
    const originalAssignedCondition = asset.assignedCondition
    const originalAssignedBy = asset.assignedBy
    
    // Update the current assignment in history with return information
    if (asset.assignmentHistory && asset.assignmentHistory.length > 0) {
      const currentAssignment = asset.assignmentHistory[asset.assignmentHistory.length - 1]
      if (currentAssignment && !currentAssignment.returnDate) {
        currentAssignment.returnDate = returnData.returnDate
        currentAssignment.returnCondition = returnData.returnCondition
        currentAssignment.returnReason = returnData.returnReason
        currentAssignment.returnedBy = returnData.receivedBy
        currentAssignment.returnNotes = returnData.returnNotes
      }
    }
    
    // Update asset status to Available
    asset.status = 'Available'
    asset.assignedTo = 'Unassigned'
    asset.assignedToId = null
    
    // Store return information
    asset.returnDate = returnData.returnDate
    asset.returnCondition = returnData.returnCondition
    asset.returnReason = returnData.returnReason
    asset.returnedBy = returnData.receivedBy
    asset.returnNotes = returnData.returnNotes
    asset.returnProcessedDate = new Date().toISOString().split('T')[0]
    
    // Store original employee information for return history
    asset.returnedByEmployee = originalEmployee
    asset.returnedByEmployeeId = originalEmployeeId

    // Preserve assignment date in assignment history for return history tracking
    if (asset.assignmentHistory && asset.assignmentHistory.length > 0) {
      const currentAssignment = asset.assignmentHistory[asset.assignmentHistory.length - 1]
      if (currentAssignment) {
        // Ensure assignment date is preserved in history
        if (!currentAssignment.assignmentDate) {
          currentAssignment.assignmentDate = originalAssignmentDate
        }
        if (!currentAssignment.assignedCondition) {
          currentAssignment.assignedCondition = originalAssignedCondition
        }
        if (!currentAssignment.assignedBy) {
          currentAssignment.assignedBy = originalAssignedBy
        }
      }
    }

    // Clear assignment data
    asset.assignmentDate = null
    asset.expectedReturnDate = null
    asset.assignmentReason = null
    asset.assignedBy = null
    asset.assignmentNotes = null

    this.saveAssetsToStorage()
    return Promise.resolve(asset)
  }

  // Update asset status for maintenance
  updateAssetStatusForMaintenance(assetId, status) {
    const asset = this.assets.find(a => a.id === assetId)
    if (!asset) {
      return Promise.reject(new Error('Asset not found'))
    }
    
    asset.status = status
    this.saveAssetsToStorage()
    return Promise.resolve(asset)
  }

  // Add maintenance record to asset
  addMaintenanceRecord(assetId, maintenanceData) {
    const asset = this.assets.find(a => a.id === assetId)
    if (!asset) {
      return Promise.reject(new Error('Asset not found'))
    }
    
    // Initialize maintenance history if it doesn't exist
    if (!asset.maintenanceHistory) {
      asset.maintenanceHistory = []
    }
    
    // Add maintenance record
    const maintenanceRecord = {
      id: `MAINT-${Date.now()}`,
      ...maintenanceData,
      assetId: assetId,
      assetName: asset.name
    }
    
    asset.maintenanceHistory.push(maintenanceRecord)
    this.saveAssetsToStorage()
    return Promise.resolve(asset)
  }

  // Update maintenance record
  updateMaintenanceRecord(assetId, maintenanceId, updates) {
    const asset = this.assets.find(a => a.id === assetId)
    if (!asset) {
      return Promise.reject(new Error('Asset not found'))
    }
    
    if (!asset.maintenanceHistory) {
      return Promise.reject(new Error('No maintenance history found'))
    }
    
    const maintenanceIndex = asset.maintenanceHistory.findIndex(m => m.id === maintenanceId)
    if (maintenanceIndex === -1) {
      return Promise.reject(new Error('Maintenance record not found'))
    }
    
    // Update maintenance record
    asset.maintenanceHistory[maintenanceIndex] = {
      ...asset.maintenanceHistory[maintenanceIndex],
      ...updates
    }
    
    this.saveAssetsToStorage()
    return Promise.resolve(asset)
  }

  // Delete maintenance record
  deleteMaintenanceRecord(assetId, maintenanceId) {
    const asset = this.assets.find(a => a.id === assetId)
    if (!asset) {
      return Promise.reject(new Error('Asset not found'))
    }
    
    if (!asset.maintenanceHistory) {
      return Promise.reject(new Error('No maintenance history found'))
    }
    
    const maintenanceIndex = asset.maintenanceHistory.findIndex(m => m.id === maintenanceId)
    if (maintenanceIndex === -1) {
      return Promise.reject(new Error('Maintenance record not found'))
    }
    
    // Remove the maintenance record
    asset.maintenanceHistory.splice(maintenanceIndex, 1)
    
    this.saveAssetsToStorage()
    return Promise.resolve(asset)
  }

  // Get maintenance history for asset
  getMaintenanceHistory(assetId) {
    const asset = this.assets.find(a => a.id === assetId)
    if (!asset) {
      return Promise.resolve([])
    }
    
    return Promise.resolve(asset.maintenanceHistory || [])
  }

  // Get return history
  getReturnHistory() {
    const returnedAssets = this.assets.filter(asset => 
      asset.returnDate && asset.returnProcessedDate
    )
    
    console.log('Return history - found returned assets:', returnedAssets.length)
    
    return Promise.resolve(returnedAssets.map(asset => {
      // Get assignment data from assignment history instead of cleared asset data
      let assignmentDate = null
      let assignedCondition = 'Good'
      let assignedBy = null
      
      if (asset.assignmentHistory && asset.assignmentHistory.length > 0) {
        const lastAssignment = asset.assignmentHistory[asset.assignmentHistory.length - 1]
        assignmentDate = lastAssignment.assignmentDate
        assignedCondition = lastAssignment.assignedCondition || 'Good'
        assignedBy = lastAssignment.assignedBy
      }
      
      // Calculate duration between assignment and return
      let duration = 'N/A'
      if (assignmentDate && asset.returnDate) {
        // Handle different date formats
        let parsedAssignmentDate, returnDate
        
        // Parse assignment date (could be DD/MM/YYYY or YYYY-MM-DD)
        if (assignmentDate.includes('/')) {
          // DD/MM/YYYY format
          const [day, month, year] = assignmentDate.split('/')
          parsedAssignmentDate = new Date(year, month - 1, day)
        } else {
          // YYYY-MM-DD format
          parsedAssignmentDate = new Date(assignmentDate)
        }
        
        // Parse return date (could be DD/MM/YYYY or YYYY-MM-DD)
        if (asset.returnDate.includes('/')) {
          // DD/MM/YYYY format
          const [day, month, year] = asset.returnDate.split('/')
          returnDate = new Date(year, month - 1, day)
        } else {
          // YYYY-MM-DD format
          returnDate = new Date(asset.returnDate)
        }
        
        const diffTime = Math.abs(returnDate - parsedAssignmentDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        console.log(`Duration calculation for ${asset.name}:`, {
          assignmentDate: assignmentDate,
          returnDate: asset.returnDate,
          parsedAssignmentDate: parsedAssignmentDate,
          parsedReturnDate: returnDate,
          diffDays: diffDays
        })
        
        if (diffDays === 1) {
          duration = '1 day'
        } else if (diffDays < 30) {
          duration = `${diffDays} days`
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30)
          const remainingDays = diffDays % 30
          duration = `${months} month${months > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''}`
        } else {
          const years = Math.floor(diffDays / 365)
          const remainingDays = diffDays % 365
          const months = Math.floor(remainingDays / 30)
          duration = `${years} year${years > 1 ? 's' : ''}${months > 0 ? ` ${months} month${months > 1 ? 's' : ''}` : ''}`
        }
      }

      const returnItem = {
        id: `RET-${asset.id}`,
        asset: asset.name,
        employee: asset.returnedByEmployee || 'Unknown',
        employeeId: asset.returnedByEmployeeId || 'Unknown',
        assignedDate: assignmentDate,
        assignedCondition: assignedCondition,
        returnDate: asset.returnDate,
        returnCondition: asset.returnCondition,
        returnReason: asset.returnReason,
        receivedBy: asset.returnedBy,
        assetValue: asset.value,
        returnProcessedDate: asset.returnProcessedDate,
        returnNotes: asset.returnNotes,
        duration: duration
      }
      
      console.log('Return item created:', returnItem)
      console.log('Asset data for debugging:', {
        id: asset.id,
        name: asset.name,
        assignmentDate: assignmentDate,
        returnDate: asset.returnDate,
        assignedCondition: assignedCondition
      })
      return returnItem
    }))
  }
}

// Export singleton instance
const assetService = new AssetService()
export default assetService