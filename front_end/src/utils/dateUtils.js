// Date utility functions for DD/MM/YYYY format

// Convert date from various formats to DD/MM/YYYY
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return ''
  
  try {
    // Handle different date formats
    let date
    
    // If it's already in DD/MM/YYYY format, return as is
    if (dateString.includes('/') && dateString.split('/')[0].length <= 2) {
      return dateString
    }
    
    // If it's in MM/DD/YYYY format, convert to DD/MM/YYYY
    if (dateString.includes('/') && dateString.split('/')[0].length > 2) {
      const [month, day, year] = dateString.split('/')
      return `${day}/${month}/${year}`
    }
    
    // If it's in YYYY-MM-DD format, convert to DD/MM/YYYY
    if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-')
      return `${day}/${month}/${year}`
    }
    
    // For other formats, try to parse with Date constructor
    date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

// Convert date from DD/MM/YYYY to YYYY-MM-DD (for HTML date input)
export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return ''
  
  try {
    // Check if already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
    
    // Parse DD/MM/YYYY format
    const parts = dateString.split('/')
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0')
      const month = parts[1].padStart(2, '0')
      const year = parts[2]
      
      return `${year}-${month}-${day}`
    }
    
    return dateString
  } catch (error) {
    console.error('Error parsing date:', error)
    return dateString
  }
}

// Get current date in DD/MM/YYYY format
export const getCurrentDateDDMMYYYY = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  
  return `${day}/${month}/${year}`
}

// Get current date in YYYY-MM-DD format (for HTML date inputs)
export const getCurrentDateYYYYMMDD = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// Parse date string and return Date object
export const parseDate = (dateString) => {
  if (!dateString || dateString.trim() === '') return null
  
  try {
    // Try DD/MM/YYYY format first
    if (dateString.includes('/')) {
      const parts = dateString.split('/')
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10)
        const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
        const year = parseInt(parts[2], 10)
        
        // Validate date components
        if (day < 1 || day > 31 || month < 0 || month > 11 || year < 1900 || year > 2100) {
          console.warn('Invalid date components:', { day, month: month + 1, year })
          return null
        }
        
        const date = new Date(year, month, day)
        
        // Verify the date is valid
        if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) {
          console.warn('Invalid date:', dateString)
          return null
        }
        
        return date
      }
    }
    
    // Try YYYY-MM-DD format
    if (dateString.includes('-')) {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString)
        return null
      }
      return date
    }
    
    // Try other formats
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn('Invalid date format:', dateString)
      return null
    }
    return date
  } catch (error) {
    console.error('Error parsing date:', error, 'Input:', dateString)
    return null
  }
}
