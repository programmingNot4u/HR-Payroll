import { useState, useEffect, useCallback } from 'react'
import organizationalDataService from '../../services/organizationalDataService'
import employeeService from '../../services/employeeService'
import employeeLogService from '../../services/employeeLogService'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed']
const educationLevels = ['Alphabetic Knowledge', 'JSC or Equivalent', 'SSC or Equivalent', 'HSC or Equivalent', 'Hon\'s', 'Master\'s', 'BSc', 'MSc', 'PhD']
const subjects = [
  'Textile Engineering',
  'Computer Science & Engineering',
  'English',
  'Bangla',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business Administration',
  'Accounting',
  'Marketing',
  'Human Resource Management',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Civil Engineering',
  'Architecture',
  'Medicine',
  'Law',
  'Education',
  'Psychology',
  'Sociology',
  'Political Science',
  'History',
  'Geography',
  'Fine Arts',
  'Music',
  'Drama',
  'Journalism',
  'Mass Communication',
  'Agriculture',
  'Veterinary Science',
  'Pharmacy',
  'Nursing',
  'Public Health',
  'Environmental Science',
  'Information Technology',
  'Software Engineering',
  'Data Science',
  'Cybersecurity',
  'Graphic Design',
  'Fashion Design',
  'Interior Design',
  'Other'
]
const offDays = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
const units = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5']

export default function AddEmployee() {
  const [employeeType, setEmployeeType] = useState('Worker') // 'Worker' or 'Staff'
  const [showPreview, setShowPreview] = useState(false)
  const [hasSeenPreview, setHasSeenPreview] = useState(false)
  const [departments, setDepartments] = useState([])
  const [designations, setDesignations] = useState([])
  const [operations, setOperations] = useState([])
  const [allMachines, setAllMachines] = useState([])
  const [salaryGrades, setSalaryGrades] = useState([])
  
  // Bulk document upload states
  const [bulkDocuments, setBulkDocuments] = useState([])
  const [excelFile, setExcelFile] = useState(null)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadErrors, setUploadErrors] = useState([])
  const [formErrors, setFormErrors] = useState([])
  const [picturePreviewUrl, setPicturePreviewUrl] = useState(null)

  // Load organizational data on component mount
  useEffect(() => {
    const loadOrganizationalData = () => {
      setDepartments(organizationalDataService.getDepartmentNames())
      setDesignations(organizationalDataService.getDesignationNames())
      setOperations(organizationalDataService.getUniqueProcessExpertiseOperations())
      setAllMachines(organizationalDataService.getUniqueProcessExpertiseMachines())
      setSalaryGrades(organizationalDataService.getAllSalaryGrades())
    }
    
    loadOrganizationalData()
    
    // Listen for storage changes and custom events to update data
    const handleStorageChange = () => {
      loadOrganizationalData()
    }
    
    const handleOrganizationalDataChange = () => {
      loadOrganizationalData()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('organizationalDataChanged', handleOrganizationalDataChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('organizationalDataChanged', handleOrganizationalDataChange)
    }
  }, [])


  // Function to format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '_________________'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  // Custom Date Input Component
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
          console.log('Saving date:', isoDate) // Debug log
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

    const handleCalendarClick = () => {
      // Create a temporary date input for date selection
      const tempInput = document.createElement('input')
      tempInput.type = 'date'
      tempInput.value = value || ''
      tempInput.style.position = 'fixed'
      tempInput.style.top = '50%'
      tempInput.style.left = '50%'
      tempInput.style.transform = 'translate(-50%, -50%)'
      tempInput.style.zIndex = '9999'
      tempInput.style.opacity = '0'
      tempInput.style.pointerEvents = 'none'
      document.body.appendChild(tempInput)
      
      // Focus and show picker
      tempInput.focus()
      tempInput.showPicker?.() || tempInput.click()
      
      // Helper function to safely remove the temp input
      let isRemoved = false
      const removeTempInput = () => {
        if (!isRemoved && document.body.contains(tempInput)) {
          isRemoved = true
          document.body.removeChild(tempInput)
        }
      }

      tempInput.addEventListener('change', (e) => {
        console.log('Calendar selected date:', e.target.value) // Debug log
        onChange(e)
        removeTempInput()
      })
      
      tempInput.addEventListener('blur', () => {
        removeTempInput()
      })
      
      // Remove after 5 seconds if no interaction
      setTimeout(() => {
        removeTempInput()
      }, 5000)
    }

    return (
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          placeholder="DD/MM/YYYY"
          className={className}
          required={required}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={10}
          {...props}
        />
        <div 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={handleCalendarClick}
        >
          <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  }

  // Function to migrate legacy form data to new format
  const migrateLegacyFormData = (data) => {
    const migratedData = { ...data }
    
    // Migrate presentAddress from string to object format
    if (typeof data.presentAddress === 'string') {
      migratedData.presentAddress = {
        houseOwnerName: '',
        village: data.presentAddress || '',
        postOffice: '',
        upazilla: '',
        district: ''
      }
    }
    
    // Migrate permanentAddress from string to object format
    if (typeof data.permanentAddress === 'string') {
      migratedData.permanentAddress = {
        village: data.permanentAddress || '',
        postOffice: '',
        upazilla: '',
        district: ''
      }
    }
    
    return migratedData
  }

  // Initialize formData from localStorage or default values
  const [formData, setFormData] = useState(() => {
    const savedFormData = localStorage.getItem('addEmployeeFormData')
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData)
        return migrateLegacyFormData(parsedData)
      } catch (error) {
        console.error('Error parsing saved form data:', error)
      }
    }
    return {
      // Personal Information
      nameBangla: '',
      nameEnglish: '',
      mobileNumber: '+880 ',
      emailAddress: '',
      nationality: 'Bangladeshi',
      fathersName: '',
      mothersName: '',
      spouseName: '',
    dateOfBirth: '',
    nidNumber: '',
    birthCertificateNumber: '',
    bloodGroup: '',
    religion: 'Islam',
    maritalStatus: '',
    height: '',
    educationLevel: '',
    subject: '',
    gender: '',
    weight: '',
    picture: null, // Picture file
    
    // Children Information
    children: [
      { name: '', age: '', education: '', institute: '' },
      { name: '', age: '', education: '', institute: '' },
      { name: '', age: '', education: '', institute: '' }
    ],
    
    // Present Address
    presentAddress: {
      houseOwnerName: '',
      village: '',
      postOffice: '',
      upazilla: '',
      district: ''
    },
    
    // Permanent Address
    permanentAddress: {
      houseOwnerName: '',
      village: '',
      postOffice: '',
      upazilla: '',
      district: ''
    },
    
    // Work Experience
    hasWorkExperience: 'No',
    workExperience: [
      { companyName: '', department: '', designation: '', salary: '', duration: '' }
    ],
    
    // Process Expertise (for Workers only)
    processExpertise: [
      { operation: '', machine: '', duration: '' }
    ],
    
    // Process Efficiency (for Workers only)
    processEfficiency: [
      { itemDescription: '', processDeliveryPerHour: '', remarks: '' }
    ],
    
    // Nominee (renamed from References)
    nominee: [
      { name: '', mobile: '+880 ', nidBirthCertificate: '' },
      { name: '', mobile: '+880 ', nidBirthCertificate: '' }
    ],
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      mobile: '+880 ',
      relation: ''
    },
    
    // Administration Section
    employeeId: '',
    levelOfWork: 'Worker', // Worker or Staff
    offDay: '',
    unit: '',
    designation: '',
    department: '',
    line: '',
    supervisorName: '',
    grossSalary: '',
    salaryGrade: '',
    dateOfJoining: '',
    dateOfIssue: '',
    
    // Salary Components
    salaryComponents: {
      basicSalary: { enabled: true, amount: 0, custom: false },
      houseRent: { enabled: true, amount: 0, custom: false },
      medicalAllowance: { enabled: true, amount: 0, custom: false },
      foodAllowance: { enabled: true, amount: 0, custom: false },
      conveyance: { enabled: true, amount: 0, custom: false },
      mobileBill: { enabled: false, amount: 0, custom: false }
    }
    }
  })

  // Handle picture preview URL creation and cleanup
  useEffect(() => {
    if (formData.picture && formData.picture instanceof File) {
      const url = URL.createObjectURL(formData.picture)
      setPicturePreviewUrl(url)
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (formData.picture && typeof formData.picture === 'string') {
      setPicturePreviewUrl(formData.picture)
    } else {
      setPicturePreviewUrl(null)
    }
  }, [formData.picture])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (picturePreviewUrl && formData.picture instanceof File) {
        URL.revokeObjectURL(picturePreviewUrl)
      }
    }
  }, [picturePreviewUrl, formData.picture])

  // Ensure salaryComponents is always initialized and level of work matches employee type
  useEffect(() => {
    if (!formData.salaryComponents) {
      setFormData(prev => ({
        ...prev,
        salaryComponents: {
          basicSalary: { enabled: true, amount: 0, custom: false },
          houseRent: { enabled: true, amount: 0, custom: false },
          medicalAllowance: { enabled: true, amount: 0, custom: false },
          foodAllowance: { enabled: true, amount: 0, custom: false },
          conveyance: { enabled: true, amount: 0, custom: false },
          mobileBill: { enabled: false, amount: 0, custom: false }
        }
      }))
    }
    
    // Ensure level of work matches employee type
    if (formData.levelOfWork !== employeeType) {
      setFormData(prev => ({
        ...prev,
        levelOfWork: employeeType
      }))
    }
  }, [formData.salaryComponents, employeeType, formData.levelOfWork])

  // Save form data to localStorage whenever it changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('addEmployeeFormData', JSON.stringify(formData))
    }, 300) // Debounce by 300ms
    
    return () => clearTimeout(timeoutId)
  }, [formData])

  // Set locale for date inputs
  useEffect(() => {
    // Set the document language to en-GB for DD/MM/YYYY format
    document.documentElement.lang = 'en-GB'
    
    // Force date inputs to use DD/MM/YYYY format
    const dateInputs = document.querySelectorAll('input[type="date"]')
    dateInputs.forEach(input => {
      // Set the input's locale
      input.setAttribute('lang', 'en-GB')
      // Add custom styling
      input.style.direction = 'ltr'
      input.style.textAlign = 'left'
      
      // Add event listener to ensure proper formatting
      input.addEventListener('focus', () => {
        input.style.color = '#374151'
      })
      
      input.addEventListener('blur', () => {
        if (input.value) {
          input.style.color = '#374151'
        }
      })
    })
  }, []) // Only run once on mount

  const updateFormData = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear form errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([])
    }
  }, [formErrors.length])

  // Memoized callbacks for date fields to prevent unnecessary re-renders
  const handleDateOfBirthChange = useCallback((e) => {
    updateFormData('dateOfBirth', e.target.value)
  }, [updateFormData])

  const handleDateOfJoiningChange = useCallback((e) => {
    updateFormData('dateOfJoining', e.target.value)
  }, [updateFormData])

  const handleDateOfIssueChange = useCallback((e) => {
    updateFormData('dateOfIssue', e.target.value)
  }, [updateFormData])

  const updateNestedField = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: { ...(prev[parentField] || {}), [childField]: value }
    }))
  }

  const updateArrayField = (field, index, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? { ...item, [childField]: value } : item
      )
    }))
  }

  // Add more children
  const addMoreChildren = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '', education: '', institute: '' }]
    }))
  }

  // Remove child
  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }))
  }

  // Function to update operation and clear machine when operation changes
  const updateOperationAndMachines = (index, operation) => {
    updateArrayField('processExpertise', index, 'operation', operation)
    updateArrayField('processExpertise', index, 'machine', '')
  }

  // Function to handle salary grade selection
  const handleSalaryGradeChange = (gradeName) => {
    updateFormData('salaryGrade', gradeName)
    
    if (gradeName) {
      const selectedGrade = organizationalDataService.getSalaryGradeByName(gradeName)
      if (selectedGrade) {
        // Update gross salary
        updateFormData('grossSalary', selectedGrade.grossSalary.toString())
        
        // Update salary components based on the grade
        setFormData(prev => ({
          ...prev,
          salaryComponents: {
            basicSalary: { enabled: true, amount: selectedGrade.basicSalary, custom: false },
            houseRent: { enabled: true, amount: selectedGrade.houseRent, custom: false },
            medicalAllowance: { enabled: true, amount: selectedGrade.medicalAllowance, custom: false },
            conveyance: { enabled: true, amount: selectedGrade.conveyance, custom: false },
            foodAllowance: { enabled: selectedGrade.type === 'Worker', amount: selectedGrade.foodAllowance || 0, custom: false },
            mobileBill: { enabled: selectedGrade.type === 'Staff', amount: selectedGrade.mobileBill || 0, custom: false }
          }
        }))
      }
    } else {
      // Clear salary components when no grade is selected
      setFormData(prev => ({
        ...prev,
        grossSalary: '',
        salaryComponents: {
          basicSalary: { enabled: true, amount: 0, custom: false },
          houseRent: { enabled: true, amount: 0, custom: false },
          medicalAllowance: { enabled: true, amount: 0, custom: false },
          foodAllowance: { enabled: true, amount: 0, custom: false },
          conveyance: { enabled: true, amount: 0, custom: false },
          mobileBill: { enabled: false, amount: 0, custom: false }
        }
      }))
    }
  }

  const addWorkExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { companyName: '', department: '', designation: '', salary: '', duration: '' }]
    }))
  }

  const removeWorkExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  const addProcessExpertise = () => {
    setFormData(prev => ({
      ...prev,
      processExpertise: [...prev.processExpertise, { operation: '', machine: '', duration: '' }]
    }))
  }

  const removeProcessExpertise = (index) => {
    setFormData(prev => ({
      ...prev,
      processExpertise: prev.processExpertise.filter((_, i) => i !== index)
    }))
  }

  const addProcessEfficiency = () => {
    setFormData(prev => ({
      ...prev,
      processEfficiency: [...prev.processEfficiency, { itemDescription: '', processDeliveryPerHour: '', remarks: '' }]
    }))
  }

  const removeProcessEfficiency = (index) => {
    setFormData(prev => ({
      ...prev,
      processEfficiency: prev.processEfficiency.filter((_, i) => i !== index)
    }))
  }

  // Note: addChild and removeChild functions are available for future use
  // when implementing dynamic child addition/removal functionality

  // Salary calculation functions
  const calculateWorkerSalary = useCallback((grossSalary) => {
    if (!grossSalary || grossSalary <= 0) return
    
    // Find the selected salary grade to get the actual component amounts
    const selectedGrade = salaryGrades.find(grade => grade.name === formData.salaryGrade)
    
    if (selectedGrade && selectedGrade.type === 'Worker') {
      setFormData(prev => ({
        ...prev,
        salaryComponents: {
          basicSalary: { ...prev.salaryComponents.basicSalary, amount: selectedGrade.basicSalary, custom: false },
          houseRent: { ...prev.salaryComponents.houseRent, amount: selectedGrade.houseRent, custom: false },
          medicalAllowance: { ...prev.salaryComponents.medicalAllowance, amount: selectedGrade.medicalAllowance, custom: false },
          foodAllowance: { ...prev.salaryComponents.foodAllowance, amount: selectedGrade.foodAllowance || 0, custom: false },
          conveyance: { ...prev.salaryComponents.conveyance, amount: selectedGrade.conveyance, custom: false },
          mobileBill: { ...prev.salaryComponents.mobileBill, amount: 0, custom: false } // Mobile bill not for workers
        }
      }))
    }
  }, [salaryGrades, formData.salaryGrade])

  const calculateStaffSalary = useCallback((grossSalary) => {
    if (!grossSalary || grossSalary <= 0) return
    
    // Find the selected salary grade to get the actual component amounts
    const selectedGrade = salaryGrades.find(grade => grade.name === formData.salaryGrade)
    
    if (selectedGrade && selectedGrade.type === 'Staff') {
      setFormData(prev => ({
        ...prev,
        salaryComponents: {
          basicSalary: { ...prev.salaryComponents.basicSalary, amount: selectedGrade.basicSalary, custom: false },
          houseRent: { ...prev.salaryComponents.houseRent, amount: selectedGrade.houseRent, custom: false },
          medicalAllowance: { ...prev.salaryComponents.medicalAllowance, amount: selectedGrade.medicalAllowance, custom: false },
          foodAllowance: { ...prev.salaryComponents.foodAllowance, amount: 0, custom: false }, // Food not included for staff
          conveyance: { ...prev.salaryComponents.conveyance, amount: selectedGrade.conveyance, custom: false },
          mobileBill: { ...prev.salaryComponents.mobileBill, amount: selectedGrade.mobileBill || 0, custom: false }
        }
      }))
    }
  }, [salaryGrades, formData.salaryGrade])

  const handleGrossSalaryChange = (value) => {
    updateFormData('grossSalary', value)
    
    // Only calculate if a salary grade is selected
    if (formData.salaryGrade) {
      if (employeeType === 'Worker') {
        calculateWorkerSalary(parseFloat(value))
      } else {
        calculateStaffSalary(parseFloat(value))
      }
    }
  }


  const updateSalaryComponent = (component, amount) => {
    setFormData(prev => ({
      ...prev,
      salaryComponents: {
        ...prev.salaryComponents,
        [component]: { enabled: true, amount: parseFloat(amount) || 0, custom: true }
      }
    }))
  }

  const handlePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, picture: file }))
    }
  }

  const handleEmployeeTypeChange = (newType) => {
    setEmployeeType(newType)
    
    // Clear salary grade and set level of work to match employee type
    setFormData(prev => ({
      ...prev,
      salaryGrade: '',
      levelOfWork: newType, // Auto-set level of work to match employee type
      grossSalary: '',
      salaryComponents: {
        basicSalary: { enabled: true, amount: 0, custom: false },
        houseRent: { enabled: true, amount: 0, custom: false },
        medicalAllowance: { enabled: true, amount: 0, custom: false },
        foodAllowance: { enabled: true, amount: 0, custom: false },
        conveyance: { enabled: true, amount: 0, custom: false },
        mobileBill: { enabled: false, amount: 0, custom: false }
      }
    }))
  }

  // Initialize salary components when component mounts or salary grade changes
  useEffect(() => {
    if (formData.grossSalary && formData.grossSalary > 0 && formData.salaryGrade) {
      if (employeeType === 'Worker') {
        calculateWorkerSalary(parseFloat(formData.grossSalary))
      } else {
        calculateStaffSalary(parseFloat(formData.grossSalary))
      }
    }
  }, [employeeType, formData.grossSalary, formData.salaryGrade, calculateWorkerSalary, calculateStaffSalary]) // Dependencies for salary calculation

  const handlePreview = () => {
    setShowPreview(true)
    setHasSeenPreview(true)
  }

  // Bulk document upload functions
  const handleExcelFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setExcelFile(file)
      parseExcelFile(file)
    }
  }

  const parseExcelFile = async (file) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        // Dynamic import of xlsx library
        const XLSX = await import('xlsx')
        
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // Skip header row and process data
        const employees = jsonData.slice(1).map((row, index) => {
          return {
            id: index + 1,
            employeeType: row[0] || '',
            employeeId: row[1] || '',
            nameEnglish: row[2] || '',
            nameBangla: row[3] || '',
            fatherNameEnglish: row[4] || '',
            fatherNameBangla: row[5] || '',
            motherNameEnglish: row[6] || '',
            motherNameBangla: row[7] || '',
            dateOfBirth: row[8] || '',
            gender: row[9] || '',
            bloodGroup: row[10] || '',
            maritalStatus: row[11] || '',
            educationLevel: row[12] || '',
            subject: row[13] || '',
            religion: row[14] || '',
            nationality: row[15] || '',
            nidNumber: row[16] || '',
            passportNumber: row[17] || '',
            height: row[18] || '',
            weight: row[19] || '',
            presentAddress: row[20] || '',
            permanentAddress: row[21] || '',
            phoneNumber: row[22] || '',
            email: row[23] || '',
            emergencyContactName: row[24] || '',
            emergencyContactPhone: row[25] || '',
            emergencyContactRelation: row[26] || '',
            department: row[27] || '',
            designation: row[28] || '',
            unit: row[29] || '',
            supervisorName: row[30] || '',
            levelOfWork: row[31] || '',
            grossSalary: row[32] || '',
            salaryGrade: row[33] || '',
            basicSalary: row[34] || '',
            houseRent: row[35] || '',
            medicalAllowance: row[36] || '',
            foodAllowance: row[37] || '',
            conveyance: row[38] || '',
            mobileBill: row[39] || '',
            joinDate: row[40] || '',
            offDay: row[41] || '',
            picturePath: row[42] || '',
            // Children Information
            child1Name: row[43] || '',
            child1Age: row[44] || '',
            child1Gender: row[45] || '',
            child2Name: row[46] || '',
            child2Age: row[47] || '',
            child2Gender: row[48] || '',
            child3Name: row[49] || '',
            child3Age: row[50] || '',
            child3Gender: row[51] || '',
            // Nominee Information
            nominee1Name: row[52] || '',
            nominee1Mobile: row[53] || '',
            nominee1Relation: row[54] || '',
            nominee2Name: row[55] || '',
            nominee2Mobile: row[56] || '',
            nominee2Relation: row[57] || '',
            // Process Expertise
            process1Operation: row[58] || '',
            process1Machine: row[59] || '',
            process2Operation: row[60] || '',
            process2Machine: row[61] || '',
            process3Operation: row[62] || '',
            process3Machine: row[63] || '',
            // Process Efficiency
            efficiency1Process: row[64] || '',
            efficiency1Delivery: row[65] || '',
            efficiency2Process: row[66] || '',
            efficiency2Delivery: row[67] || '',
            status: 'Pending',
            errors: []
          }
        }).filter(emp => emp.employeeId && emp.nameEnglish) // Filter out empty rows
        
        setBulkDocuments(employees)
        setUploadErrors([])
      } catch (error) {
        console.error('Error parsing Excel file:', error)
        setUploadErrors([{ message: 'Error parsing Excel file. Please check the format.', type: 'error' }])
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const validateBulkDocuments = () => {
    const errors = []
    
    bulkDocuments.forEach((emp, index) => {
      const empErrors = []
      
      // Required fields validation
      if (!emp.employeeId) {
        empErrors.push('Employee ID is required')
      }
      if (!emp.nameEnglish) {
        empErrors.push('Name (English) is required')
      }
      if (!emp.nameBangla) {
        empErrors.push('Name (Bangla) is required')
      }
      if (!emp.department) {
        empErrors.push('Department is required')
      }
      if (!emp.designation) {
        empErrors.push('Designation is required')
      }
      if (!emp.dateOfBirth) {
        empErrors.push('Date of Birth is required')
      }
      if (!emp.gender) {
        empErrors.push('Gender is required')
      }
      if (!emp.phoneNumber) {
        empErrors.push('Phone Number is required')
      }
      
      // Employee type specific validation
      if (emp.employeeType === 'Worker') {
        if (!emp.unit) {
          empErrors.push('Unit is required for Workers')
        }
        if (!emp.supervisorName) {
          empErrors.push('Supervisor Name is required for Workers')
        }
        // At least one child should be provided for workers
        if (!emp.child1Name && !emp.child2Name && !emp.child3Name) {
          empErrors.push('At least one child information is required for Workers')
        }
        // At least one nominee should be provided for workers
        if (!emp.nominee1Name && !emp.nominee2Name) {
          empErrors.push('At least one nominee information is required for Workers')
        }
      }
      
      if (empErrors.length > 0) {
        errors.push({
          row: index + 2, // +2 because we skip header and arrays are 0-indexed
          employeeId: emp.employeeId,
          errors: empErrors
        })
      }
    })
    
    setUploadErrors(errors)
    return errors.length === 0
  }

  const handleBulkUpload = () => {
    if (validateBulkDocuments()) {
      setUploadProgress(0)
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            alert(`Successfully uploaded ${bulkDocuments.length} documents!`)
            setBulkDocuments([])
            setExcelFile(null)
            setShowBulkUpload(false)
            return 100
          }
          return prev + 10
        })
      }, 200)
    } else {
      alert('Please fix the validation errors before uploading.')
    }
  }

  const downloadTemplate = async () => {
    try {
      // Dynamic import of xlsx library
      const XLSX = await import('xlsx')
      
      const templateData = [
        // Header row with all form fields
        [
          'Employee Type', 'Employee ID', 'Name (English)', 'Name (Bangla)', 'Father Name (English)',
          'Mother Name (English)', 'Date of Birth', 'Gender', 'Blood Group', 'Marital Status',
          'Education Level', 'Subject', 'Religion', 'Nationality', 'NID Number', 'Passport Number', 'Height', 'Weight',
          'Present Address', 'Permanent Address', 'Phone Number', 'Email', 'Emergency Contact Name', 'Emergency Contact Phone',
          'Emergency Contact Relation', 'Department', 'Designation', 'Unit', 'Supervisor Name',
          'Level of Work', 'Gross Salary', 'Salary Grade', 'Basic Salary', 'House Rent', 'Medical Allowance',
          'Food Allowance', 'Conveyance', 'Mobile Bill', 'Join Date', 'Off Day', 'Picture Path',
          // Children Information (for Workers)
          'Child 1 Name', 'Child 1 Age', 'Child 1 Gender', 'Child 2 Name', 'Child 2 Age', 'Child 2 Gender',
          'Child 3 Name', 'Child 3 Age', 'Child 3 Gender',
          // Nominee Information (for Workers)
          'Nominee 1 Name', 'Nominee 1 Mobile', 'Nominee 1 Relation', 'Nominee 2 Name', 'Nominee 2 Mobile', 'Nominee 2 Relation',
          // Process Expertise (for Workers)
          'Process 1 Operation', 'Process 1 Machine', 'Process 2 Operation', 'Process 2 Machine',
          'Process 3 Operation', 'Process 3 Machine',
          // Process Efficiency (for Workers)
          'Efficiency 1 Process', 'Efficiency 1 Delivery', 'Efficiency 2 Process', 'Efficiency 2 Delivery'
        ],
        // Sample data row
        [
          'Worker', 'EMP001', 'Ahmed Khan', 'আহমেদ খান', 'Rashid Khan', 'Fatima Begum',
          '1990-05-15', 'Male', 'A+', 'Married', 'HSC or Equivalent', 'Islam', 'Bangladeshi', '1234567890123',
          'A1234567', '5\'8"', '70 kg', '123 Main St, Dhaka', '456 Village Rd, Chittagong', '+880-1234-567890',
          'ahmed@email.com', 'Rashid Khan', '+880-1234-567891', 'Father', 'IT', 'Software Developer', 'Development',
          'Unit 1', 'John Smith', 'Worker', '50000', 'Worker Grade-1', '30000', '15000', '2000', '3000', '0', '0',
          '2023-01-15', 'Friday', '/pictures/emp001.jpg',
          'Ali Khan', '8', 'Male', 'Sara Khan', '6', 'Female', 'Hassan Khan', '4', 'Male',
          'Rashid Khan', '+880-1234-567891', 'Father', 'Fatima Begum', '+880-1234-567892', 'Mother',
          'Cutting', 'Machine A', 'Sewing', 'Machine B', 'Finishing', 'Machine C',
          'Cutting Process', '50 per hour', 'Sewing Process', '40 per hour'
        ],
        // Another sample for Staff
        [
          'Staff', 'EMP002', 'Sarah Ahmed', 'সারা আহমেদ', 'Mohammed Ahmed', 'Ayesha Begum',
          '1988-03-20', 'Female', 'B+', 'Single', 'Master\'s', 'Islam', 'Bangladeshi', '9876543210987',
          'B9876543', '5\'6"', '60 kg', '789 Office St, Dhaka', '321 Home Rd, Sylhet', '+880-9876-543210',
          'sarah@email.com', 'Mohammed Ahmed', '+880-9876-543211', 'Father', 'HR', 'HR Manager', 'Management',
          '', 'Jane Doe', 'Staff', '75000', 'Staff Grade-2', '45000', '22500', '3000', '0', '2500', '1500',
          '2022-06-01', 'Saturday', '/pictures/emp002.jpg',
          '', '', '', '', '', '', '', '', '',
          '', '', '', '', '', '',
          '', '', '', '', '', '',
          '', '', '', ''
        ]
      ]
      
      const ws = XLSX.utils.aoa_to_sheet(templateData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Employee Template')
      XLSX.writeFile(wb, 'employee_template.xlsx')
    } catch (error) {
      console.error('Error downloading template:', error)
      alert('Error downloading template. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Debug: Log current form data
    console.log('=== FORM SUBMISSION STARTED ===')
    console.log('Form submission started with data:', formData)
    console.log('Employee type:', employeeType)
    console.log('Event type:', e.type)
    
    // Comprehensive form validation
    const errors = []
    
    // Required fields validation
    if (!formData.nameEnglish?.trim()) {
      errors.push('Name (English) is required')
    }
    
    if (!formData.employeeId?.trim()) {
      errors.push('Employee ID is required')
    }
    
    if (!formData.mobileNumber?.trim() || formData.mobileNumber === '+880 ') {
      errors.push('Mobile Number is required')
    }
    
    if (!formData.dateOfBirth) {
      errors.push('Date of Birth is required')
    }
    
    if (!formData.dateOfJoining) {
      errors.push('Date of Joining is required')
    }
    
    if (!formData.department) {
      errors.push('Department is required')
    }
    
    if (!formData.designation) {
      errors.push('Designation is required')
    }
    
    if (!formData.levelOfWork) {
      errors.push('Level of Work is required')
    }
    
    if (!formData.grossSalary || formData.grossSalary <= 0) {
      errors.push('Gross Salary is required and must be greater than 0')
    }
    
    if (!formData.gender) {
      errors.push('Gender is required')
    }
    
    if (!formData.bloodGroup) {
      errors.push('Blood Group is required')
    }
    
    if (!formData.maritalStatus) {
      errors.push('Marital Status is required')
    }
    
    if (!formData.nationality) {
      errors.push('Nationality is required')
    }
    
    if (!formData.religion) {
      errors.push('Religion is required')
    }
    
    if (!formData.educationLevel) {
      errors.push('Education Level is required')
    }
    
    if (!formData.nidNumber?.trim()) {
      errors.push('NID Number is required')
    }
    
    if (!formData.fathersName?.trim()) {
      errors.push('Father\'s Name is required')
    }
    
    if (!formData.mothersName?.trim()) {
      errors.push('Mother\'s Name is required')
    }
    
    // Validate present address (handle both object and legacy string formats)
    if (typeof formData.presentAddress === 'string') {
      // Legacy string format
      if (!formData.presentAddress?.trim()) {
        errors.push('Present Address is required')
      }
    } else if (typeof formData.presentAddress === 'object' && formData.presentAddress !== null) {
      // New object format - at least village and district should be filled
      if (!formData.presentAddress?.village?.trim() || 
          !formData.presentAddress?.district?.trim()) {
        errors.push('Present Address is required (at least Village and District must be filled)')
      }
    } else {
      errors.push('Present Address is required')
    }
    
    // Validate permanent address (handle both object and legacy string formats)
    if (typeof formData.permanentAddress === 'string') {
      // Legacy string format
      if (!formData.permanentAddress?.trim()) {
        errors.push('Permanent Address is required')
      }
    } else if (typeof formData.permanentAddress === 'object' && formData.permanentAddress !== null) {
      // New object format - at least village and district should be filled
      if (!formData.permanentAddress?.village?.trim() || 
          !formData.permanentAddress?.district?.trim()) {
        errors.push('Permanent Address is required (at least Village and District must be filled)')
      }
    } else {
      errors.push('Permanent Address is required')
    }
    
    if (!formData.emergencyContact?.name?.trim()) {
      errors.push('Emergency Contact Name is required')
    }
    
    if (!formData.emergencyContact?.mobile?.trim()) {
      errors.push('Emergency Contact Mobile is required')
    }
    
    if (!formData.emergencyContact?.relation?.trim()) {
      errors.push('Emergency Contact Relation is required')
    }
    
    // Employee type specific validation
    if (employeeType === 'Worker') {
      if (!formData.unit) {
        errors.push('Unit is required for Workers')
      }
      
      if (!formData.supervisorName?.trim()) {
        errors.push('Supervisor Name is required for Workers')
      }
      
      // For workers, only nominee is required, children is optional
      const hasValidNominee = formData.nominee.some(nominee => nominee.name?.trim() && nominee.mobile?.trim())
      
      if (!hasValidNominee) {
        errors.push('At least one nominee is required for workers')
      }
      
      // Validate process expertise for workers
      if (!formData.processExpertise?.[0]?.operation?.trim()) {
        errors.push('Process Expertise Operation is required for Workers')
      }
      
      if (!formData.processExpertise?.[0]?.machine?.trim()) {
        errors.push('Process Expertise Machine is required for Workers')
      }
    }
    
    // Show validation errors if any
    if (errors.length > 0) {
      console.log('Validation errors found:', errors)
      console.log('Current form data for debugging:', {
        nameEnglish: formData.nameEnglish,
        employeeId: formData.employeeId,
        mobileNumber: formData.mobileNumber,
        dateOfBirth: formData.dateOfBirth,
        dateOfJoining: formData.dateOfJoining,
        department: formData.department,
        designation: formData.designation,
        levelOfWork: formData.levelOfWork,
        grossSalary: formData.grossSalary,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality,
        religion: formData.religion,
        educationLevel: formData.educationLevel,
        nidNumber: formData.nidNumber,
        fathersName: formData.fathersName,
        mothersName: formData.mothersName,
        presentAddress: formData.presentAddress,
        permanentAddress: formData.permanentAddress,
        emergencyContact: formData.emergencyContact
      })
      setFormErrors(errors)
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    
    // Clear any previous errors
    setFormErrors([])
    
    // Show confirmation dialog
    const confirmMessage = `Are you sure you want to add this ${employeeType.toLowerCase()}?\n\nEmployee ID: ${formData.employeeId}\nName: ${formData.nameEnglish}\n${employeeType} Salary Grade: ${formData.salaryGrade || 'Not selected'}\nGross Salary: ৳${formData.grossSalary}`
    
    if (window.confirm(confirmMessage)) {
      try {
        // Convert picture file to data URL if present
        let pictureDataUrl = null
        if (formData.picture) {
          pictureDataUrl = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(e.target.result)
            reader.readAsDataURL(formData.picture)
          })
        }
        // Prepare employee data for storage
        const employeeData = {
          // Basic Information
          name: formData.nameEnglish,
          nameBangla: formData.nameBangla,
          designation: formData.designation,
          department: formData.department,
          levelOfWork: formData.levelOfWork,
          employeeType: employeeType,
          
          // Contact Information
          phone: formData.mobileNumber,
          email: formData.emailAddress,
          
          // Personal Details
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          bloodGroup: formData.bloodGroup,
          maritalStatus: formData.maritalStatus,
          nationality: formData.nationality,
          religion: formData.religion,
          educationLevel: formData.educationLevel,
          subject: formData.subject,
          nidNumber: formData.nidNumber,
          birthCertificateNumber: formData.birthCertificateNumber,
          height: formData.height,
          weight: formData.weight,
          fathersName: formData.fathersName,
          mothersName: formData.mothersName,
          spouseName: formData.spouseName,
          
          // Work Information
          employeeId: formData.employeeId,
          dateOfJoining: formData.dateOfJoining,
          dateOfIssue: formData.dateOfIssue,
          offDay: formData.offDay,
          unit: formData.unit,
          line: formData.line,
          supervisorName: formData.supervisorName,
          grossSalary: formData.grossSalary,
          salaryGrade: formData.salaryGrade,
          
          // Process Expertise (for Workers) - Save as array to match EmployeeDashboard
          processExpertise: formData.processExpertise || [],
          
          // Address Information
          presentAddress: formData.presentAddress,
          permanentAddress: formData.permanentAddress,
          
          // Emergency Contact
          emergencyContact: formData.emergencyContact,
          
          // Additional Data
          children: formData.children,
          nominee: formData.nominee,
          processEfficiency: formData.processEfficiency,
          workExperience: formData.workExperience,
          salaryComponents: formData.salaryComponents,
          picture: pictureDataUrl
        }
        
        // Save employee using the service
        const newEmployee = await employeeService.addEmployee(employeeData)
        
        // Log employee creation
        employeeLogService.logEmployeeCreated(newEmployee.id, employeeData)
        
        console.log('Employee Data:', employeeData)
        console.log('New Employee Created:', newEmployee)
        console.log('Employee Type:', employeeType)
        console.log('Level of Work:', formData.levelOfWork)
        console.log('Salary Components:', formData.salaryComponents)
        console.log('Picture:', formData.picture ? formData.picture.name : 'No picture uploaded')
        
        // Verify the employee was saved by checking localStorage
        const savedEmployees = JSON.parse(localStorage.getItem('hr_employees_data') || '[]')
        console.log('All saved employees:', savedEmployees)
        console.log('New employee found in storage:', savedEmployees.find(emp => emp.id === newEmployee.id))
        
        console.log('=== EMPLOYEE SUCCESSFULLY ADDED ===')
        console.log('New Employee ID:', newEmployee.id)
        console.log('Employee Name:', newEmployee.name)
        
        alert(`${employeeType} added successfully!`)
        
        // Dispatch event to refresh Employee Dashboard
        window.dispatchEvent(new CustomEvent('employeeAdded'))
        
        // Set the newly created employee ID in localStorage for Employee Details
        localStorage.setItem('selectedEmployeeId', newEmployee.id)
        
        // Navigate to Employee Details to show the newly created employee
        setTimeout(() => {
          // Use the app's navigation system instead of window.location
          const event = new CustomEvent('navigateTo', { detail: 'Employee Details' })
          window.dispatchEvent(event)
        }, 1000)
        
      } catch (error) {
        console.error('Error saving employee:', error)
        alert('Error saving employee. Please try again.')
        return
      }
      
      // Clear form data and localStorage after successful submission
      setFormData({
        // Personal Information
        nameBangla: '',
        nameEnglish: '',
        mobileNumber: '+880 ',
        emailAddress: '',
        nationality: 'Bangladeshi',
        fathersName: '',
        mothersName: '',
        spouseName: '',
        dateOfBirth: '',
        nidNumber: '',
        birthCertificateNumber: '',
        bloodGroup: '',
        religion: 'Islam',
        maritalStatus: '',
        educationLevel: '',
        subject: '',
        hasWorkExperience: 'No',
        workExperience: [{ companyName: '', department: '', designation: '', salary: '', duration: '' }],
        processExpertise: [{ operation: '', machine: '', duration: '' }],
        processEfficiency: [{ itemDescription: '', processDeliveryPerHour: '', remarks: '' }],
        children: [{ name: '', age: '', education: '', institute: '' }],
        nominee: [{ name: '', mobile: '', nidBirthCertificate: '' }],
        // Work Information
        employeeId: '',
        dateOfJoining: '',
        dateOfIssue: '',
        offDay: '',
        unit: '',
        designation: '',
        department: '',
        levelOfWork: '',
        grossSalary: '',
        picture: null,
        // Salary Components
        salaryComponents: {
          basicSalary: { enabled: true, amount: 0, custom: false },
          houseRent: { enabled: true, amount: 0, custom: false },
          medicalAllowance: { enabled: true, amount: 0, custom: false },
          foodAllowance: { enabled: true, amount: 0, custom: false },
          conveyance: { enabled: true, amount: 0, custom: false },
          mobileBill: { enabled: false, amount: 0, custom: false }
        }
      })
      localStorage.removeItem('addEmployeeFormData')
    }
  }

  return (
    <div className="space-y-6">
      {/* Employee Type Selection */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Select Employee Type</h2>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={downloadTemplate}
              className="px-4 py-2 bg-orange-300 text-white rounded hover:bg-orange-400 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Template
            </button>
            <button
              type="button"
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              className="px-4 py-2 bg-orange-300 text-white rounded hover:bg-orange-400 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {showBulkUpload ? 'Hide Upload' : 'Bulk Upload'}
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleEmployeeTypeChange('Worker')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              employeeType === 'Worker'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={employeeType === 'Worker' ? { backgroundColor: 'rgb(255,200,150)' } : {}}
            onMouseEnter={(e) => {
              if (employeeType === 'Worker') {
                e.target.style.backgroundColor = 'rgb(255,185,125)'
              }
            }}
            onMouseLeave={(e) => {
              if (employeeType === 'Worker') {
                e.target.style.backgroundColor = 'rgb(255,200,150)'
              }
            }}
          >
            Add Worker
          </button>
          <button
            type="button"
            onClick={() => handleEmployeeTypeChange('Staff')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              employeeType === 'Staff'
                ? 'text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            style={employeeType === 'Staff' ? { backgroundColor: 'rgb(255,185,125)' } : {}}
            onMouseEnter={(e) => {
              if (employeeType === 'Staff') {
                e.target.style.backgroundColor = 'rgb(255,170,100)'
              }
            }}
            onMouseLeave={(e) => {
              if (employeeType === 'Staff') {
                e.target.style.backgroundColor = 'rgb(255,185,125)'
              }
            }}
          >
            Add Staff
          </button>
        </div>
        
        {/* Bulk Upload Content */}
        {showBulkUpload && (
          <div className="mt-6 space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleExcelFileChange}
                className="hidden"
                id="excel-upload"
              />
              <label
                htmlFor="excel-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {excelFile ? excelFile.name : 'Click to upload Excel file'}
                </p>
                <p className="text-sm text-gray-500">
                  Upload .xlsx or .xls file with employee data
                </p>
              </label>
            </div>

            {/* Picture Upload Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Picture Upload Information</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>• The Excel template includes a "Picture Path" column for employee photos</p>
                    <p>• Enter the file path or URL of the employee's picture in this column</p>
                    <p>• Example: <code className="bg-blue-100 px-1 rounded">/pictures/emp001.jpg</code> or <code className="bg-blue-100 px-1 rounded">https://example.com/photo.jpg</code></p>
                    <p>• Leave empty if no picture is available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Uploading employees...</span>
                  <span className="text-sm text-gray-500">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {uploadErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-sm font-medium text-red-800">Validation Errors</h3>
                </div>
                <div className="space-y-2">
                  {uploadErrors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      {error.message && (
                        <p>{error.message}</p>
                      )}
                      {error.employeeId && (
                        <p>Row {error.row}: Employee ID "{error.employeeId}" - {error.errors.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Employee Preview */}
            {bulkDocuments.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Employee Preview ({bulkDocuments.length} employees)
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name (English)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name (Bangla)</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Picture Path</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bulkDocuments.slice(0, 10).map((employee) => (
                        <tr key={employee.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{employee.employeeId}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{employee.nameEnglish}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{employee.nameBangla}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{employee.department}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{employee.designation}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {employee.picturePath ? (
                              <span className="text-green-600 text-xs">✓ {employee.picturePath}</span>
                            ) : (
                              <span className="text-gray-400 text-xs">No picture</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              {employee.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bulkDocuments.length > 10 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Showing first 10 employees. Total: {bulkDocuments.length}
                    </p>
                  )}
                </div>
                
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setBulkDocuments([])
                      setExcelFile(null)
                      setUploadErrors([])
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkUpload}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Upload Employees
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Instructions:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Download the template and fill in the employee information</li>
                <li>• Required fields: Employee ID, Name (English), Name (Bangla), Department, Designation, etc.</li>
                <li>• Make sure Employee IDs are unique and not already in the system</li>
                <li>• Supported file formats: .xlsx, .xls</li>
                <li>• All form fields are included in the template for complete employee data</li>
              </ul>
            </div>
          </div>
        )}
        
      </div>

      {/* Form Errors Display */}
      {formErrors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  {formErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form Type Indicator */}
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: employeeType === 'Worker' ? 'rgb(255,200,150)' : 'rgb(255,185,125)' }}
            ></div>
            <span className="font-medium text-gray-700">
              {employeeType === 'Worker' ? 'Worker' : 'Staff'}
            </span>
          </div>
        </div>


        {/* Personal Information */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
          
          {/* Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center bg-gray-50">
                {picturePreviewUrl ? (
                  <img 
                    src={picturePreviewUrl} 
                    alt="Employee" 
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="text-xs text-gray-500 mt-1">Upload Photo</p>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold"
                  style={{
                    '--tw-file-bg': 'rgb(255,250,245)',
                    '--tw-file-text': 'rgb(200,100,50)',
                    '--tw-file-hover-bg': 'rgb(255,240,220)'
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF up to 5MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (In Bangla) *</label>
              <input
                type="text"
                value={formData.nameBangla}
                onChange={(e) => updateFormData('nameBangla', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (In English) *</label>
              <input
                type="text"
                value={formData.nameEnglish}
                onChange={(e) => updateFormData('nameEnglish', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => updateFormData('mobileNumber', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.emailAddress}
                onChange={(e) => updateFormData('emailAddress', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => updateFormData('nationality', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
              <input
                type="text"
                value={formData.fathersName}
                onChange={(e) => updateFormData('fathersName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name *</label>
              <input
                type="text"
                value={formData.mothersName}
                onChange={(e) => updateFormData('mothersName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Husband/Wife's Name</label>
              <input
                type="text"
                value={formData.spouseName}
                onChange={(e) => updateFormData('spouseName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <CustomDateInput
                value={formData.dateOfBirth}
                onChange={handleDateOfBirthChange}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NID Number *</label>
              <input
                type="text"
                value={formData.nidNumber}
                onChange={(e) => updateFormData('nidNumber', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                placeholder="1234567890123"
                
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Certificate Number</label>
              <input
                type="text"
                value={formData.birthCertificateNumber}
                onChange={(e) => updateFormData('birthCertificateNumber', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => updateFormData('bloodGroup', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => updateFormData('religion', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              >
                <option value="">Select Marital Status</option>
                {maritalStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => updateFormData('height', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                placeholder="165"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Educational Status</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => {
                  const selectedLevel = e.target.value
                  updateFormData('educationLevel', selectedLevel)
                  
                  // Clear subject field if educational level doesn't require it
                  if (!["Hon's", "Master's", "BSc", "MSc", "PhD"].includes(selectedLevel)) {
                    updateFormData('subject', '')
                  }
                }}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              >
                <option value="">Select Education Level</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            {/* Show Subject field only for higher education levels */}
            {(formData.educationLevel === "Hon's" || 
              formData.educationLevel === "Master's" || 
              formData.educationLevel === "BSc" || 
              formData.educationLevel === "MSc" || 
              formData.educationLevel === "PhD") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => updateFormData('subject', e.target.value)}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => updateFormData('weight', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                placeholder="60"
              />
            </div>
          </div>
        </div>

        {/* Children Information - Only for Workers */}
        {employeeType === 'Worker' && (
          <div className="rounded border border-gray-200 bg-white p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Children Information <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
              <button
                type="button"
                onClick={addMoreChildren}
                className="px-4 py-2 bg-gradient-to-r from-orange-300 to-orange-400 text-white rounded hover:from-orange-400 hover:to-orange-500 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add More Children</span>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">You can add children information if available. This section is completely optional.</p>
            <div className="space-y-4">
              {formData.children.map((child, index) => (
                <div key={index} className="relative grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded">
                  {/* Remove button */}
                  {formData.children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(index)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1"
                      title="Remove this child"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateArrayField('children', index, 'name', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                      placeholder="Child's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={child.age}
                      onChange={(e) => updateArrayField('children', index, 'age', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <input
                      type="text"
                      value={child.education}
                      onChange={(e) => updateArrayField('children', index, 'education', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                      placeholder="Education level"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institute</label>
                    <input
                      type="text"
                      value={child.institute}
                      onChange={(e) => updateArrayField('children', index, 'institute', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                      placeholder="School/College name"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Present Address */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Present Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">House Number/ House Name</label>
              <input
                type="text"
                value={formData.presentAddress?.houseOwnerName || ''}
                onChange={(e) => updateNestedField('presentAddress', 'houseOwnerName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village/Area</label>
              <input
                type="text"
                value={formData.presentAddress?.village || ''}
                onChange={(e) => updateNestedField('presentAddress', 'village', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Office</label>
              <input
                type="text"
                value={formData.presentAddress?.postOffice || ''}
                onChange={(e) => updateNestedField('presentAddress', 'postOffice', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upazilla/City Corporation</label>
              <input
                type="text"
                value={formData.presentAddress?.upazilla || ''}
                onChange={(e) => updateNestedField('presentAddress', 'upazilla', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                value={formData.presentAddress?.district || ''}
                onChange={(e) => updateNestedField('presentAddress', 'district', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Permanent Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">House Number/ House Name</label>
              <input
                type="text"
                value={formData.permanentAddress?.houseOwnerName || ''}
                onChange={(e) => updateNestedField('permanentAddress', 'houseOwnerName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village/Area</label>
              <input
                type="text"
                value={formData.permanentAddress?.village || ''}
                onChange={(e) => updateNestedField('permanentAddress', 'village', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Office</label>
              <input
                type="text"
                value={formData.permanentAddress?.postOffice || ''}
                onChange={(e) => updateNestedField('permanentAddress', 'postOffice', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upazilla/City Corporation</label>
              <input
                type="text"
                value={formData.permanentAddress?.upazilla || ''}
                onChange={(e) => updateNestedField('permanentAddress', 'upazilla', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                value={formData.permanentAddress?.district || ''}
                onChange={(e) => updateNestedField('permanentAddress', 'district', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Working Experience</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Do you have work experience?</label>
            <select
              value={formData.hasWorkExperience}
              onChange={(e) => updateFormData('hasWorkExperience', e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
          
          {formData.hasWorkExperience === 'Yes' && (
            <div className="space-y-4">
              {formData.workExperience.map((exp, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={exp.companyName}
                      onChange={(e) => updateArrayField('workExperience', index, 'companyName', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={exp.department}
                      onChange={(e) => updateArrayField('workExperience', index, 'department', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    >
                      <option value="">Select Department</option>
                      {departments.map(department => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <select
                      value={exp.designation}
                      onChange={(e) => updateArrayField('workExperience', index, 'designation', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    >
                      <option value="">Select Designation</option>
                      {designations.map(designation => (
                        <option key={designation} value={designation}>{designation}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                    <input
                      type="number"
                      value={exp.salary}
                      onChange={(e) => updateArrayField('workExperience', index, 'salary', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateArrayField('workExperience', index, 'duration', e.target.value)}
                        className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                        placeholder="2 years"
                      />
                    </div>
                    {formData.workExperience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(index)}
                        className="h-10 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addWorkExperience}
                className="px-4 py-2 text-white rounded transition-colors"
                style={{ backgroundColor: 'rgb(255,200,150)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,200,150)'}
              >
                Add More Experience
              </button>
            </div>
          )}
        </div>

        {/* Process Expertise - Only for Workers */}
        {employeeType === 'Worker' && (
          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold mb-6">Process Expertise</h2>
            <div className="space-y-4">
              {formData.processExpertise.map((expertise, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                    <select
                      value={expertise.operation}
                      onChange={(e) => updateOperationAndMachines(index, e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    >
                      <option value="">Select Operation</option>
                      {operations.map((option) => (
                        <option key={option.id} value={option.operation}>
                          {option.operation}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Machine</label>
                    <select
                      value={expertise.machine}
                      onChange={(e) => updateArrayField('processExpertise', index, 'machine', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    >
                      <option value="">Select Machine</option>
                      {allMachines.map((machineOption) => (
                        <option key={machineOption.id} value={machineOption.machine}>
                          {machineOption.machine}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={expertise.duration}
                        onChange={(e) => updateArrayField('processExpertise', index, 'duration', e.target.value)}
                        className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                        placeholder="2 YEARS"
                      />
                    </div>
                    {formData.processExpertise.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProcessExpertise(index)}
                        className="h-10 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addProcessExpertise}
                className="px-4 py-2 text-white rounded transition-colors"
                style={{ backgroundColor: 'rgb(255,200,150)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,200,150)'}
              >
                Add More Process Expertise
              </button>
            </div>
          </div>
        )}

        {/* Process Efficiency - Only for Workers */}
        {employeeType === 'Worker' && (
          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold mb-6">Process Efficiency</h2>
            <div className="space-y-4">
              {formData.processEfficiency.map((efficiency, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Description</label>
                    <input
                      type="text"
                      value={efficiency.itemDescription}
                      onChange={(e) => updateArrayField('processEfficiency', index, 'itemDescription', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                      placeholder="T-SHIRT"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Process Delivery Per Hour</label>
                    <input
                      type="text"
                      value={efficiency.processDeliveryPerHour}
                      onChange={(e) => updateArrayField('processEfficiency', index, 'processDeliveryPerHour', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                      placeholder="50 PIECES"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                      <input
                        type="text"
                        value={efficiency.remarks}
                        onChange={(e) => updateArrayField('processEfficiency', index, 'remarks', e.target.value)}
                        className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                        placeholder="EXCELLENT QUALITY"
                      />
                    </div>
                    {formData.processEfficiency.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProcessEfficiency(index)}
                        className="h-10 px-3 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addProcessEfficiency}
                className="px-4 py-2 text-white rounded transition-colors"
                style={{ backgroundColor: 'rgb(255,200,150)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,200,150)'}
              >
                Add More Process Efficiency
              </button>
            </div>
          </div>
        )}

        {/* Nominee - For both Workers and Staff */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Nominee</h2>
          <div className="space-y-4">
            {formData.nominee.map((nominee, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={nominee.name}
                    onChange={(e) => updateArrayField('nominee', index, 'name', e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    placeholder="Hassan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                  <input
                    type="tel"
                    value={nominee.mobile}
                    onChange={(e) => updateArrayField('nominee', index, 'mobile', e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NID/Birth Certificate Number</label>
                  <input
                    type="text"
                    value={nominee.nidBirthCertificate}
                    onChange={(e) => updateArrayField('nominee', index, 'nidBirthCertificate', e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    placeholder="1234567890123"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Emergency Contact */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Emergency Contact Person</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.emergencyContact?.name || ''}
                onChange={(e) => updateNestedField('emergencyContact', 'name', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
              <input
                type="tel"
                value={formData.emergencyContact?.mobile || ''}
                onChange={(e) => updateNestedField('emergencyContact', 'mobile', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
              <input
                type="text"
                value={formData.emergencyContact?.relation || ''}
                onChange={(e) => updateNestedField('emergencyContact', 'relation', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Administration Section */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: 'rgb(200,100,50)' }}>Department Only For Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => updateFormData('employeeId', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                placeholder="EMP001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work *</label>
              <input
                type="text"
                value={formData.levelOfWork}
                className="w-full h-10 rounded border border-gray-300 px-3 bg-gray-100 cursor-not-allowed"
                readOnly
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Level of Work is automatically set to match the selected employee type
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Off-Day</label>
              <select
                value={formData.offDay}
                onChange={(e) => updateFormData('offDay', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              >
                <option value="">Select Off-Day</option>
                {offDays.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            {employeeType === 'Worker' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => updateFormData('unit', e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                  >
                    <option value="">Select Unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Line</label>
                  <input
                    type="text"
                    value={formData.line}
                    onChange={(e) => updateFormData('line', e.target.value)}
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                    placeholder="Line 1, Line 2, etc."
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
              <select
                value={formData.designation}
                onChange={(e) => updateFormData('designation', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              >
                <option value="">Select Designation</option>
                {designations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={formData.department}
                onChange={(e) => updateFormData('department', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </div>
            {employeeType === 'Worker' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supervisor's Name</label>
                <input
                  type="text"
                  value={formData.supervisorName}
                  onChange={(e) => updateFormData('supervisorName', e.target.value)}
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {employeeType} Salary Grade
              </label>
              <select
                value={formData.salaryGrade}
                onChange={(e) => handleSalaryGradeChange(e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              >
                <option value="">Select {employeeType} Salary Grade</option>
                {salaryGrades
                  .filter(grade => grade.type === employeeType)
                  .map((grade) => (
                    <option key={grade.id} value={grade.name}>
                      {grade.name} - ৳{grade.grossSalary.toLocaleString()}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gross Salary *</label>
              <input
                type="number"
                value={formData.grossSalary}
                onChange={(e) => handleGrossSalaryChange(e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining *</label>
              <CustomDateInput
                value={formData.dateOfJoining}
                onChange={handleDateOfJoiningChange}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Issue</label>
              <CustomDateInput
                value={formData.dateOfIssue}
                onChange={handleDateOfIssueChange}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2"
              />
            </div>
          </div>
        </div>

        {/* Salary Components Section */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6 text-orange-600">
            {employeeType} Salary Components
          </h2>
          
          {/* Salary Components Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Amount (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Basic Salary */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">Basic Salary</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={formData.salaryComponents?.basicSalary?.amount || 0}
                      onChange={(e) => updateSalaryComponent('basicSalary', e.target.value)}
                      className="w-24 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2"
                    />
                  </td>
                </tr>

                {/* House Rent */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">House Rent</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={formData.salaryComponents?.houseRent?.amount || 0}
                      onChange={(e) => updateSalaryComponent('houseRent', e.target.value)}
                      className="w-24 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2"
                    />
                  </td>
                </tr>

                {/* Medical */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">Medical</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={formData.salaryComponents?.medicalAllowance?.amount || 0}
                      onChange={(e) => updateSalaryComponent('medicalAllowance', e.target.value)}
                      className="w-24 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2"
                    />
                  </td>
                </tr>

                {/* Food - Only for Workers */}
                {employeeType === 'Worker' && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">Food</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={formData.salaryComponents?.foodAllowance?.amount || 0}
                        onChange={(e) => updateSalaryComponent('foodAllowance', e.target.value)}
                        className="w-24 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2"
                      />
                    </td>
                  </tr>
                )}

                {/* Conveyance */}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">Conveyance</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="number"
                      value={formData.salaryComponents?.conveyance?.amount || 0}
                      onChange={(e) => updateSalaryComponent('conveyance', e.target.value)}
                      className="w-24 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2"
                    />
                  </td>
                </tr>

                {/* Mobile Bill - Only for Staff */}
                {employeeType === 'Staff' && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">Mobile Bill</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={formData.salaryComponents?.mobileBill?.amount || 0}
                        onChange={(e) => updateSalaryComponent('mobileBill', e.target.value)}
                        className="w-24 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2"
                      />
                    </td>
                  </tr>
                )}

                {/* Total Row */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">Total</div>
                    <div className="text-xs text-gray-500">Calculated Total</div>
                  </td>
                  <td className="px-4 py-3 text-center text-lg">
                    ৳{Object.values(formData.salaryComponents)
                      .reduce((sum, comp) => sum + comp.amount, 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handlePreview}
            className="px-6 py-3 text-white rounded font-medium transition-colors"
            style={{ backgroundColor: 'rgb(255,200,150)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,200,150)'}
          >
            See Preview
          </button>
          <button
            type="button"
            onClick={() => {
              if (!hasSeenPreview) {
                alert('Please review the form by clicking "See Preview" before submitting.')
                return
              }
              // If preview has been shown, allow direct submission
              handleSubmit(new Event('submit'))
            }}
            className="px-8 py-3 text-white rounded font-medium transition-colors"
            style={{ backgroundColor: 'rgb(255,185,125)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,170,100)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
          >
            Add {employeeType}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Interactive Header */}
            <div className="border-b border-gray-200 p-6" style={{ background: 'linear-gradient(to right, rgb(255,250,245), rgb(255,240,220))' }}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Registration Form</h1>
                  <p className="text-lg text-gray-600">Company Name: RP Creations & Apparels Limited</p>
                  <p className="text-gray-600">Form Date: {formatDate(new Date().toISOString().split('T')[0])}</p>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgb(255,250,245)', color: 'rgb(200,100,50)' }}>
                      {employeeType} Registration
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: 'rgb(255,240,220)', color: 'rgb(180,90,40)' }}>
                      ID: {formData.employeeId || 'TBD'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-24 h-32 border-2 border-gray-300 bg-gray-100 flex items-center justify-center rounded-lg shadow-sm">
                    {picturePreviewUrl ? (
                      <img 
                        src={picturePreviewUrl} 
                        alt="Employee" 
                        className="w-20 h-28 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-gray-500 text-center">Photo</span>
                    )}
                  </div>
                </div>
              </div>
            </div>



            {/* A4 Style Content */}
            <div className="p-6 space-y-6">
              {/* Personal Information */}
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4 text-blue-800 border-b-2 border-blue-800 pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex">
                    <span className="font-bold w-32">Name (Bangla):</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.nameBangla || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Name (English):</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.nameEnglish || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Mobile:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.mobileNumber || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Email:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.emailAddress || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Nationality:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.nationality || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Father's Name:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.fathersName || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Mother's Name:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.mothersName || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Spouse Name:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.spouseName || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Date of Birth:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formatDate(formData.dateOfBirth)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">NID Number:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.nidNumber || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Blood Group:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.bloodGroup || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Religion:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.religion || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Marital Status:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.maritalStatus || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Gender:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.gender || '_________________'}</span>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4 text-green-800 border-b-2 border-green-800 pb-2">Address Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-green-700 mb-2">Present Address</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-bold w-24">House:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.presentAddress.houseOwnerName || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">Village:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.presentAddress.village || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">Post Office:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.presentAddress.postOffice || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">Upazilla:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.presentAddress.upazilla || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">District:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.presentAddress.district || '_________________'}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-green-700 mb-2">Permanent Address</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="font-bold w-24">House:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.permanentAddress.houseOwnerName || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">Village:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.permanentAddress.village || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">Post Office:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.permanentAddress.postOffice || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">Upazilla:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.permanentAddress.upazilla || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-24">District:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.permanentAddress.district || '_________________'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4 pb-2" style={{ color: 'rgb(200,100,50)', borderBottom: '2px solid rgb(255,200,150)' }}>Employment Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex">
                    <span className="font-bold w-32">Employee ID:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.employeeId || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Level of Work:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.levelOfWork || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Designation:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.designation || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Department:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.department || '_________________'}</span>
                  </div>
                  {employeeType === 'Worker' && (
                    <>
                      <div className="flex">
                        <span className="font-bold w-32">Unit:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.unit || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-32">Line:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.line || '_________________'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-32">Supervisor:</span>
                        <span className="border-b border-gray-400 flex-1 px-2">{formData.supervisorName || '_________________'}</span>
                      </div>
                    </>
                  )}
                  <div className="flex">
                    <span className="font-bold w-32">Date of Joining:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formatDate(formData.dateOfJoining)}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">{employeeType} Salary Grade:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.salaryGrade || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Gross Salary:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">৳{formData.grossSalary || '_________________'}</span>
                  </div>
                </div>
              </div>

              {/* Salary Components */}
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4 text-purple-800 border-b-2 border-purple-800 pb-2">Salary Breakdown</h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(formData.salaryComponents).map(([key, component]) => (
                    component.enabled && (
                      <div key={key} className="flex justify-between items-center border-b border-gray-200 pb-1">
                        <span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="font-medium">৳{component.amount.toLocaleString()}</span>
                      </div>
                    )
                  ))}
                  <div className="border-t-2 border-gray-400 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Salary:</span>
                      <span>৳{Object.values(formData.salaryComponents)
                        .filter(comp => comp.enabled)
                        .reduce((sum, comp) => sum + comp.amount, 0)
                        .toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Working Experience */}
              {formData.workExperience.some(exp => exp.company) && (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <h3 className="text-xl font-bold mb-4 text-cyan-800 border-b-2 border-cyan-800 pb-2">Working Experience</h3>
                  <div className="space-y-3 text-sm">
                    {formData.workExperience.filter(exp => exp.company).map((exp, index) => (
                      <div key={index} className="border-l-4 border-cyan-400 pl-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex">
                            <span className="font-bold w-20">Company:</span>
                            <span className="border-b border-gray-400 flex-1 px-2">{exp.company}</span>
                          </div>
                          <div className="flex">
                            <span className="font-bold w-20">Position:</span>
                            <span className="border-b border-gray-400 flex-1 px-2">{exp.position}</span>
                          </div>
                          <div className="flex">
                            <span className="font-bold w-20">Duration:</span>
                            <span className="border-b border-gray-400 flex-1 px-2">{exp.duration}</span>
                          </div>
                          <div className="flex">
                            <span className="font-bold w-20">Salary:</span>
                            <span className="border-b border-gray-400 flex-1 px-2">৳{exp.salary}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditional Sections for Workers */}
              {employeeType === 'Worker' && (
                <>
                  {formData.children.some(child => child.name) && (
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-4 text-indigo-800 border-b-2 border-indigo-800 pb-2">Children Information</h3>
                      <div className="space-y-3 text-sm">
                        {formData.children.filter(child => child.name).map((child, index) => (
                          <div key={index} className="border-l-4 border-indigo-400 pl-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex">
                                <span className="font-bold w-20">Name:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{child.name}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Age:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{child.age}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Education:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{child.education}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Institute:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{child.institute}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.processExpertise.some(expertise => expertise.operation) && (
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-4 text-yellow-800 border-b-2 border-yellow-800 pb-2">Process Expertise</h3>
                      <div className="space-y-3 text-sm">
                        {formData.processExpertise.filter(expertise => expertise.operation).map((expertise, index) => (
                          <div key={index} className="border-l-4 border-yellow-400 pl-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex">
                                <span className="font-bold w-20">Operation:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{expertise.operation}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Machine:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{expertise.machine}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Duration:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{expertise.duration}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.processEfficiency.some(efficiency => efficiency.itemDescription) && (
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-4 text-teal-800 border-b-2 border-teal-800 pb-2">Process Efficiency</h3>
                      <div className="space-y-3 text-sm">
                        {formData.processEfficiency.filter(efficiency => efficiency.itemDescription).map((efficiency, index) => (
                          <div key={index} className="border-l-4 border-teal-400 pl-3">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex">
                                <span className="font-bold w-20">Item Description:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{efficiency.itemDescription}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Delivery Per Hour:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{efficiency.processDeliveryPerHour}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Remarks:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{efficiency.remarks}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.nominee.some(nominee => nominee.name) && (
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-4 text-red-800 border-b-2 border-red-800 pb-2">Nominee</h3>
                      <div className="space-y-3 text-sm">
                        {formData.nominee.filter(nominee => nominee.name).map((nominee, index) => (
                          <div key={index} className="border-l-4 border-red-400 pl-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex">
                                <span className="font-bold w-20">Name:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{nominee.name}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Mobile:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{nominee.mobile}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">NID/Birth Certificate:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{nominee.nidBirthCertificate}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Emergency Contact */}
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <h3 className="text-xl font-bold mb-4 text-red-800 border-b-2 border-red-800 pb-2">Emergency Contact Person</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex">
                    <span className="font-bold w-32">Name:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.emergencyContact.name || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Mobile:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.emergencyContact.mobile || '_________________'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-bold w-32">Relation:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.emergencyContact.relation || '_________________'}</span>
                  </div>
                </div>
              </div>

              {/* Nominee Section for Staff */}
              {employeeType === 'Staff' && formData.nominee.some(nominee => nominee.name) && (
                <div className="border-2 border-gray-300 rounded-lg p-4">
                  <h3 className="text-xl font-bold mb-4 text-red-800 border-b-2 border-red-800 pb-2">Nominee</h3>
                  <div className="space-y-3 text-sm">
                    {formData.nominee.filter(nominee => nominee.name).map((nominee, index) => (
                      <div key={index} className="border-l-4 border-red-400 pl-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex">
                            <span className="font-bold w-20">Name:</span>
                            <span className="border-b border-gray-400 flex-1 px-2">{nominee.name}</span>
                          </div>
                          <div className="flex">
                            <span className="font-bold w-20">Mobile:</span>
                            <span className="border-b border-gray-400 flex-1 px-2">{nominee.mobile}</span>
                          </div>
                          <div className="flex">
                            <span className="font-bold w-20">NID/Birth Certificate:</span>
                            <span className="border-b border-gray-400 flex-1 px-2">{nominee.nidBirthCertificate}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signature Section */}
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
                    <p className="text-sm font-bold">Employee Signature</p>
                    <p className="text-xs text-gray-600">Date: {formatDate(new Date().toISOString().split('T')[0])}</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
                    <p className="text-sm font-bold">HR Manager Signature</p>
                    <p className="text-xs text-gray-600">Date: {formatDate(new Date().toISOString().split('T')[0])}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Preview Actions */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      // Print functionality
                      const printWindow = window.open('', '_blank')
                      // Get only the content without action buttons
                      const previewContent = document.querySelector('.bg-white.rounded-lg.shadow-2xl')
                      
                      // Create a clean copy for printing
                      const cleanContent = previewContent.cloneNode(true)
                      const cleanActionButtons = cleanContent.querySelector('.bg-gradient-to-r.from-gray-50.to-gray-100')
                      if (cleanActionButtons) {
                        cleanActionButtons.remove()
                      }
                      const printContent = cleanContent.innerHTML
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Employee Registration Form - ${formData.nameEnglish}</title>
                            <style>
                              body { 
                                font-family: Arial, sans-serif; 
                                margin: 0; 
                                padding: 20px; 
                                background: white;
                                color: #1f2937;
                              }
                              .bg-gradient-to-r { 
                                background: linear-gradient(to right, #eff6ff, #eef2ff) !important; 
                              }
                              .bg-gray-50 { background-color: #f9fafb !important; }
                              .bg-gray-100 { background-color: #f3f4f6 !important; }
                              .border-b, .border-t, .border-gray-200 { border: 1px solid #e5e7eb !important; }
                              .rounded-lg { border-radius: 8px !important; }
                              .rounded-full { border-radius: 50% !important; }
                              .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
                              .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
                              .flex { display: flex !important; }
                              .grid { display: grid !important; }
                              .hidden { display: none !important; }
                              .text-center { text-align: center !important; }
                              .font-bold { font-weight: bold !important; }
                              .font-semibold { font-weight: 600 !important; }
                              .font-medium { font-weight: 500 !important; }
                              .text-sm { font-size: 14px !important; }
                              .text-lg { font-size: 18px !important; }
                              .text-xl { font-size: 20px !important; }
                              .text-3xl { font-size: 30px !important; }
                              .mb-2 { margin-bottom: 8px !important; }
                              .mb-3 { margin-bottom: 12px !important; }
                              .mb-4 { margin-bottom: 16px !important; }
                              .mb-6 { margin-bottom: 24px !important; }
                              .p-4 { padding: 16px !important; }
                              .p-6 { padding: 24px !important; }
                              .px-2 { padding-left: 8px !important; padding-right: 8px !important; }
                              .py-1 { padding-top: 4px !important; padding-bottom: 4px !important; }
                              .py-2 { padding-top: 8px !important; padding-bottom: 8px !important; }
                              .gap-2 { gap: 8px !important; }
                              .gap-3 { gap: 12px !important; }
                              .gap-4 { gap: 16px !important; }
                              .gap-6 { gap: 24px !important; }
                              .w-20 { width: 80px !important; }
                              .w-24 { width: 96px !important; }
                              .w-32 { width: 128px !important; }
                              .h-16 { height: 64px !important; }
                              .h-28 { height: 112px !important; }
                              .h-32 { height: 128px !important; }
                              .border-2 { border-width: 2px !important; }
                              .border-b-2 { border-bottom-width: 2px !important; }
                              .border-l-4 { border-left-width: 4px !important; }
                              .border-gray-300 { border-color: #d1d5db !important; }
                              .border-gray-400 { border-color: #9ca3af !important; }
                              .border-blue-800 { border-color: #1e40af !important; }
                              .border-green-800 { border-color: #166534 !important; }
                              .border-orange-800 { border-color: #9a3412 !important; }
                              .border-purple-800 { border-color: #6b21a8 !important; }
                              .border-cyan-800 { border-color: #155e75 !important; }
                              .border-indigo-800 { border-color: #3730a3 !important; }
                              .border-yellow-800 { border-color: #854d0e !important; }
                              .border-teal-800 { border-color: #115e59 !important; }
                              .border-red-800 { border-color: #991b1b !important; }
                              .text-blue-800 { color: #1e40af !important; }
                              .text-green-800 { color: #166534 !important; }
                              .text-orange-800 { color: #9a3412 !important; }
                              .text-purple-800 { color: #6b21a8 !important; }
                              .text-cyan-800 { color: #155e75 !important; }
                              .text-indigo-800 { color: #3730a3 !important; }
                              .text-yellow-800 { color: #854d0e !important; }
                              .text-teal-800 { color: #115e59 !important; }
                              .text-red-800 { color: #991b1b !important; }
                              .text-gray-600 { color: #4b5563 !important; }
                              .text-gray-700 { color: #374151 !important; }
                              .text-gray-800 { color: #1f2937 !important; }
                              .bg-blue-100 { background-color: #dbeafe !important; }
                              .bg-green-100 { background-color: #dcfce7 !important; }
                              .bg-blue-50 { background-color: #eff6ff !important; }
                              .bg-indigo-50 { background-color: #eef2ff !important; }
                              .bg-cyan-400 { background-color: #22d3ee !important; }
                              .bg-indigo-400 { background-color: #818cf8 !important; }
                              .bg-yellow-400 { background-color: #facc15 !important; }
                              .bg-teal-400 { background-color: #2dd4bf !important; }
                              .bg-red-400 { background-color: #f87171 !important; }
                              .pb-2 { padding-bottom: 8px !important; }
                              .pl-3 { padding-left: 12px !important; }
                              .space-y-2 > * + * { margin-top: 8px !important; }
                              .space-y-3 > * + * { margin-top: 12px !important; }
                              .space-y-6 > * + * { margin-top: 24px !important; }
                              .grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
                              .grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
                              .grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
                              .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
                              .md\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
                              .md\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
                              .md\\:grid-cols-5 { grid-template-columns: repeat(5, 1fr) !important; }
                              .md\\:col-span-2 { grid-column: span 2 / span 2 !important; }
                              .justify-between { justify-content: space-between !important; }
                              .items-center { align-items: center !important; }
                              .items-start { align-items: flex-start !important; }
                              .text-right { text-align: right !important; }
                              .flex-1 { flex: 1 1 0% !important; }
                              .object-cover { object-fit: cover !important; }
                              .toLocaleString { font-variant-numeric: tabular-nums !important; }
                              @media print {
                                body { margin: 0; padding: 10px; }
                                .bg-gradient-to-r { background: linear-gradient(to right, #eff6ff, #eef2ff) !important; }
                                .shadow-2xl, .shadow-sm { box-shadow: none !important; }
                              }
                            </style>
                          </head>
                          <body>
                            ${printContent}
                          </body>
                        </html>
                      `)
                      printWindow.document.close()
                      printWindow.print()
                    }}
                    className="px-4 py-2 text-white rounded flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: 'rgb(255,200,150)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,200,150)'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Form
                  </button>
                  <button
                    onClick={() => {
                      // Download as PDF functionality
                      // Create clean content without action buttons
                      const previewContent = document.querySelector('.bg-white.rounded-lg.shadow-2xl')
                      const cleanContent = previewContent.cloneNode(true)
                      const cleanActionButtons = cleanContent.querySelector('.bg-gradient-to-r.from-gray-50.to-gray-100')
                      if (cleanActionButtons) {
                        cleanActionButtons.remove()
                      }
                      
                      // For now, open print dialog with clean content
                      const printWindow = window.open('', '_blank')
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Employee Registration Form - ${formData.nameEnglish}</title>
                            <style>
                              body { 
                                font-family: Arial, sans-serif; 
                                margin: 0; 
                                padding: 20px; 
                                background: white;
                                color: #1f2937;
                              }
                              .bg-gradient-to-r { 
                                background: linear-gradient(to right, #eff6ff, #eef2ff) !important; 
                              }
                              .bg-gray-50 { background-color: #f9fafb !important; }
                              .bg-gray-100 { background-color: #f3f4f6 !important; }
                              .border-b, .border-t, .border-gray-200 { border: 1px solid #e5e7eb !important; }
                              .rounded-lg { border-radius: 8px !important; }
                              .rounded-full { border-radius: 50% !important; }
                              .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
                              .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
                              .flex { display: flex !important; }
                              .grid { display: grid !important; }
                              .hidden { display: none !important; }
                              .text-center { text-align: center !important; }
                              .font-bold { font-weight: bold !important; }
                              .font-semibold { font-weight: 600 !important; }
                              .font-medium { font-weight: 500 !important; }
                              .text-sm { font-size: 14px !important; }
                              .text-lg { font-size: 18px !important; }
                              .text-xl { font-size: 20px !important; }
                              .text-3xl { font-size: 30px !important; }
                              .mb-2 { margin-bottom: 8px !important; }
                              .mb-3 { margin-bottom: 12px !important; }
                              .mb-4 { margin-bottom: 16px !important; }
                              .mb-6 { margin-bottom: 24px !important; }
                              .p-4 { padding: 16px !important; }
                              .p-6 { padding: 24px !important; }
                              .px-2 { padding-left: 8px !important; padding-right: 8px !important; }
                              .py-1 { padding-top: 4px !important; padding-bottom: 4px !important; }
                              .py-2 { padding-top: 8px !important; padding-bottom: 8px !important; }
                              .gap-2 { gap: 8px !important; }
                              .gap-3 { gap: 12px !important; }
                              .gap-4 { gap: 16px !important; }
                              .gap-6 { gap: 24px !important; }
                              .w-20 { width: 80px !important; }
                              .w-24 { width: 96px !important; }
                              .w-32 { width: 128px !important; }
                              .h-16 { height: 64px !important; }
                              .h-28 { height: 112px !important; }
                              .h-32 { height: 128px !important; }
                              .border-2 { border-width: 2px !important; }
                              .border-b-2 { border-bottom-width: 2px !important; }
                              .border-l-4 { border-left-width: 4px !important; }
                              .border-gray-300 { border-color: #d1d5db !important; }
                              .border-gray-400 { border-color: #9ca3af !important; }
                              .border-blue-800 { border-color: #1e40af !important; }
                              .border-green-800 { border-color: #166534 !important; }
                              .border-orange-800 { border-color: #9a3412 !important; }
                              .border-purple-800 { border-color: #6b21a8 !important; }
                              .border-cyan-800 { border-color: #155e75 !important; }
                              .border-indigo-800 { border-color: #3730a3 !important; }
                              .border-yellow-800 { border-color: #854d0e !important; }
                              .border-teal-800 { border-color: #115e59 !important; }
                              .border-red-800 { border-color: #991b1b !important; }
                              .text-blue-800 { color: #1e40af !important; }
                              .text-green-800 { color: #166534 !important; }
                              .text-orange-800 { color: #9a3412 !important; }
                              .text-purple-800 { color: #6b21a8 !important; }
                              .text-cyan-800 { color: #155e75 !important; }
                              .text-indigo-800 { color: #3730a3 !important; }
                              .text-yellow-800 { color: #854d0e !important; }
                              .text-teal-800 { color: #115e59 !important; }
                              .text-red-800 { color: #991b1b !important; }
                              .text-gray-600 { color: #4b5563 !important; }
                              .text-gray-700 { color: #374151 !important; }
                              .text-gray-800 { color: #1f2937 !important; }
                              .bg-blue-100 { background-color: #dbeafe !important; }
                              .bg-green-100 { background-color: #dcfce7 !important; }
                              .bg-blue-50 { background-color: #eff6ff !important; }
                              .bg-indigo-50 { background-color: #eef2ff !important; }
                              .bg-cyan-400 { background-color: #22d3ee !important; }
                              .bg-indigo-400 { background-color: #818cf8 !important; }
                              .bg-yellow-400 { background-color: #facc15 !important; }
                              .bg-teal-400 { background-color: #2dd4bf !important; }
                              .bg-red-400 { background-color: #f87171 !important; }
                              .pb-2 { padding-bottom: 8px !important; }
                              .pl-3 { padding-left: 12px !important; }
                              .space-y-2 > * + * { margin-top: 8px !important; }
                              .space-y-3 > * + * { margin-top: 12px !important; }
                              .space-y-6 > * + * { margin-top: 24px !important; }
                              .grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
                              .grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
                              .grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
                              .md\\:grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
                              .md\\:grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
                              .md\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
                              .md\\:grid-cols-5 { grid-template-columns: repeat(5, 1fr) !important; }
                              .md\\:col-span-2 { grid-column: span 2 / span 2 !important; }
                              .justify-between { justify-content: space-between !important; }
                              .items-center { align-items: center !important; }
                              .items-start { align-items: flex-start !important; }
                              .text-right { text-align: right !important; }
                              .flex-1 { flex: 1 1 0% !important; }
                              .object-cover { object-fit: cover !important; }
                              .toLocaleString { font-variant-numeric: tabular-nums !important; }
                              @media print {
                                body { margin: 0; padding: 10px; }
                                .bg-gradient-to-r { background: linear-gradient(to right, #eff6ff, #eef2ff) !important; }
                                .shadow-2xl, .shadow-sm { box-shadow: none !important; }
                              }
                            </style>
                          </head>
                          <body>
                            ${cleanContent.innerHTML}
                          </body>
                        </html>
                      `)
                      printWindow.document.close()
                      printWindow.print()
                    }}
                    className="px-4 py-2 text-white rounded flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: 'rgb(255,185,125)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,170,100)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      // Share functionality
                      const shareData = {
                        title: 'Employee Registration Form',
                        text: `Employee: ${formData.nameEnglish || 'Draft'}\nID: ${formData.employeeId || 'TBD'}\nType: ${employeeType}`,
                        url: window.location.href
                      }
                      
                      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                        navigator.share(shareData)
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(shareData.text)
                        alert('Employee info copied to clipboard!')
                      }
                    }}
                    className="px-4 py-2 text-white rounded flex items-center gap-2 transition-colors"
                    style={{ backgroundColor: 'rgb(255,170,100)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,155,75)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,170,100)'}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false)
                      // Submit the form
                      handleSubmit(new Event('submit'))
                    }}
                    className="px-6 py-2 text-white rounded font-medium transition-colors"
                    style={{ backgroundColor: 'rgb(255,185,125)' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(255,170,100)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(255,185,125)'}
                  >
                    Submit & Add to Dashboard
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
