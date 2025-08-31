import { useState, useEffect } from 'react'

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed']
const educationLevels = ['Alphabetic Knowledge', 'JSC or Equivalent', 'SSC or Equivalent', 'HSC or Equivalent', 'Hon\'s', 'Master\'s', 'BSC', 'MSC', 'PHD']
const offDays = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
const units = ['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5']
const sections = ['Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
const designations = ['Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']

export default function AddEmployee() {
  const [employeeType, setEmployeeType] = useState('Worker') // 'Worker' or 'Staff'
  const [showPreview, setShowPreview] = useState(false)
  const [formData, setFormData] = useState({
    // Personal Information
    nameBangla: '',
    nameEnglish: '',
    mobileNumber: '',
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
    
    // References
    references: [
      { name: '', mobile: '' },
      { name: '', mobile: '' }
    ],
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      mobile: '',
      relation: ''
    },
    
    // Administration Section
    employeeId: '',
    levelOfWork: 'Worker', // Worker or Staff
    offDay: '',
    unit: '',
    designation: '',
    section: '',
    line: '',
    supervisorName: '',
    grossSalary: '',
    dateOfJoining: '',
    dateOfIssue: '',
    
    // Salary Components
    salaryComponents: {
      basicSalary: { enabled: true, amount: 0, custom: false },
      houseRent: { enabled: true, amount: 0, custom: false },
      medical: { enabled: true, amount: 0, custom: false },
      food: { enabled: true, amount: 0, custom: false },
      conveyance: { enabled: true, amount: 0, custom: false }
    }
  })

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parentField, childField, value) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: { ...prev[parentField], [childField]: value }
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

  // Note: addChild and removeChild functions are available for future use
  // when implementing dynamic child addition/removal functionality

  // Salary calculation functions
  const calculateWorkerSalary = (grossSalary) => {
    if (!grossSalary || grossSalary <= 0) return
    
    const basicSalary = (grossSalary - 2450) / 1.5
    const houseRent = basicSalary * 0.5
    const medical = 750
    const food = 1250
    const conveyance = 450
    
    setFormData(prev => ({
      ...prev,
      salaryComponents: {
        basicSalary: { ...prev.salaryComponents.basicSalary, amount: Math.round(basicSalary), custom: false },
        houseRent: { ...prev.salaryComponents.houseRent, amount: Math.round(houseRent), custom: false },
        medical: { ...prev.salaryComponents.medical, amount: medical, custom: false },
        food: { ...prev.salaryComponents.food, amount: food, custom: false },
        conveyance: { ...prev.salaryComponents.conveyance, amount: conveyance, custom: false }
      }
    }))
  }

  const calculateStaffSalary = (grossSalary) => {
    if (!grossSalary || grossSalary <= 0) return
    
    const basicSalary = grossSalary * 0.45
    const houseRent = grossSalary * 0.35
    const medical = grossSalary * 0.15
    const conveyance = grossSalary * 0.05
    
    setFormData(prev => ({
      ...prev,
      salaryComponents: {
        basicSalary: { ...prev.salaryComponents.basicSalary, amount: Math.round(basicSalary), custom: false },
        houseRent: { ...prev.salaryComponents.houseRent, amount: Math.round(houseRent), custom: false },
        medical: { ...prev.salaryComponents.medical, amount: Math.round(medical), custom: false },
        food: { ...prev.salaryComponents.food, amount: 0, custom: false }, // Food not included for staff
        conveyance: { ...prev.salaryComponents.conveyance, amount: Math.round(conveyance), custom: false }
      }
    }))
  }

  const handleGrossSalaryChange = (value) => {
    updateFormData('grossSalary', value)
    
    if (employeeType === 'Worker') {
      calculateWorkerSalary(parseFloat(value))
    } else {
      calculateStaffSalary(parseFloat(value))
    }
  }

  const toggleSalaryComponent = (component, enabled) => {
    setFormData(prev => ({
      ...prev,
      salaryComponents: {
        ...prev.salaryComponents,
        [component]: { ...prev.salaryComponents[component], enabled }
      }
    }))
  }

  const updateSalaryComponent = (component, amount, custom = false) => {
    setFormData(prev => ({
      ...prev,
      salaryComponents: {
        ...prev.salaryComponents,
        [component]: { ...prev.salaryComponents[component], amount: parseFloat(amount) || 0, custom }
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
    // Recalculate salary if gross salary is already set
    if (formData.grossSalary && formData.grossSalary > 0) {
      if (newType === 'Worker') {
        calculateWorkerSalary(parseFloat(formData.grossSalary))
      } else {
        calculateStaffSalary(parseFloat(formData.grossSalary))
      }
    }
  }

  // Initialize salary components when component mounts
  useEffect(() => {
    if (formData.grossSalary && formData.grossSalary > 0) {
      if (employeeType === 'Worker') {
        calculateWorkerSalary(parseFloat(formData.grossSalary))
      } else {
        calculateStaffSalary(parseFloat(formData.grossSalary))
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required fields based on employee type
    if (employeeType === 'Worker') {
      // For workers, validate children and references
      const hasValidChildren = formData.children.some(child => child.name && child.age)
      const hasValidReferences = formData.references.some(ref => ref.name && ref.mobile)
      
      if (!hasValidChildren) {
        alert('Please provide at least one child\'s information for workers.')
        return
      }
      
      if (!hasValidReferences) {
        alert('Please provide at least one reference for workers.')
        return
      }
    }
    
    // Show confirmation dialog
    const confirmMessage = `Are you sure you want to add this ${employeeType.toLowerCase()}?\n\nEmployee ID: ${formData.employeeId}\nName: ${formData.nameEnglish}\nGross Salary: ৳${formData.grossSalary}`
    
    if (window.confirm(confirmMessage)) {
      console.log('Employee Data:', formData)
      console.log('Employee Type:', employeeType)
      console.log('Level of Work:', formData.levelOfWork)
      console.log('Salary Components:', formData.salaryComponents)
      console.log('Picture:', formData.picture ? formData.picture.name : 'No picture uploaded')
      // Here you would typically send the data to your backend
      alert(`${employeeType} added successfully!`)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Add New Employee</h1>
        <p className="text-sm text-gray-500">Complete all required information to add a new employee</p>
      </div>

      {/* Employee Type Selection */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Select Employee Type</h2>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleEmployeeTypeChange('Worker')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              employeeType === 'Worker'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Add Worker
          </button>
          <button
            type="button"
            onClick={() => handleEmployeeTypeChange('Staff')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              employeeType === 'Staff'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Add Staff
          </button>
        </div>
        
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form Type Indicator */}
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${employeeType === 'Worker' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
            <span className="font-medium text-gray-700">
              {employeeType === 'Worker' ? 'Worker Registration Form' : 'Staff Registration Form'}
            </span>
            <span className="text-sm text-gray-500">
              {employeeType === 'Worker' 
                ? '(Complete information required)' 
                : '(Basic information only)'
              }
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
                {formData.picture ? (
                  <img 
                    src={URL.createObjectURL(formData.picture)} 
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name (In English) *</label>
              <input
                type="text"
                value={formData.nameEnglish}
                onChange={(e) => updateFormData('nameEnglish', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => updateFormData('mobileNumber', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="+880 1712-345678"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => updateFormData('nationality', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
              <input
                type="text"
                value={formData.fathersName}
                onChange={(e) => updateFormData('fathersName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name *</label>
              <input
                type="text"
                value={formData.mothersName}
                onChange={(e) => updateFormData('mothersName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Husband/Wife's Name</label>
              <input
                type="text"
                value={formData.spouseName}
                onChange={(e) => updateFormData('spouseName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NID Number *</label>
              <input
                type="text"
                value={formData.nidNumber}
                onChange={(e) => updateFormData('nidNumber', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="1234567890123"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Certificate Number</label>
              <input
                type="text"
                value={formData.birthCertificateNumber}
                onChange={(e) => updateFormData('birthCertificateNumber', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => updateFormData('bloodGroup', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => updateFormData('maritalStatus', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="165"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Educational Status</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => updateFormData('educationLevel', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Education Level</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                value={formData.gender}
                onChange={(e) => updateFormData('gender', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="60"
              />
            </div>
          </div>
        </div>

        {/* Children Information - Only for Workers */}
        {employeeType === 'Worker' && (
          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold mb-6">Children Information</h2>
            <div className="space-y-4">
              {formData.children.map((child, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateArrayField('children', index, 'name', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={child.age}
                      onChange={(e) => updateArrayField('children', index, 'age', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <input
                      type="text"
                      value={child.education}
                      onChange={(e) => updateArrayField('children', index, 'education', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Institute</label>
                    <input
                      type="text"
                      value={child.institute}
                      onChange={(e) => updateArrayField('children', index, 'institute', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">House Owner Name</label>
              <input
                type="text"
                value={formData.presentAddress.houseOwnerName}
                onChange={(e) => updateNestedField('presentAddress', 'houseOwnerName', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <input
                type="text"
                value={formData.presentAddress.village}
                onChange={(e) => updateNestedField('presentAddress', 'village', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Office</label>
              <input
                type="text"
                value={formData.presentAddress.postOffice}
                onChange={(e) => updateNestedField('presentAddress', 'postOffice', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upazilla</label>
              <input
                type="text"
                value={formData.presentAddress.upazilla}
                onChange={(e) => updateNestedField('presentAddress', 'upazilla', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                value={formData.presentAddress.district}
                onChange={(e) => updateNestedField('presentAddress', 'district', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Permanent Address */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Permanent Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
              <input
                type="text"
                value={formData.permanentAddress.village}
                onChange={(e) => updateNestedField('permanentAddress', 'village', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Post Office</label>
              <input
                type="text"
                value={formData.permanentAddress.postOffice}
                onChange={(e) => updateNestedField('permanentAddress', 'postOffice', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upazilla</label>
              <input
                type="text"
                value={formData.permanentAddress.upazilla}
                onChange={(e) => updateNestedField('permanentAddress', 'upazilla', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                value={formData.permanentAddress.district}
                onChange={(e) => updateNestedField('permanentAddress', 'district', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={exp.department}
                      onChange={(e) => updateArrayField('workExperience', index, 'department', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                      type="text"
                      value={exp.designation}
                      onChange={(e) => updateArrayField('workExperience', index, 'designation', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                    <input
                      type="number"
                      value={exp.salary}
                      onChange={(e) => updateArrayField('workExperience', index, 'salary', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateArrayField('workExperience', index, 'duration', e.target.value)}
                        className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add More Experience
              </button>
            </div>
          )}
        </div>

        {/* References - Only for Workers */}
        {employeeType === 'Worker' && (
          <div className="rounded border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold mb-6">References</h2>
            <div className="space-y-4">
              {formData.references.map((ref, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={ref.name}
                      onChange={(e) => updateArrayField('references', index, 'name', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                    <input
                      type="tel"
                      value={ref.mobile}
                      onChange={(e) => updateArrayField('references', index, 'mobile', e.target.value)}
                      className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6">Emergency Contact Person</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.emergencyContact.name}
                onChange={(e) => updateNestedField('emergencyContact', 'name', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
              <input
                type="tel"
                value={formData.emergencyContact.mobile}
                onChange={(e) => updateNestedField('emergencyContact', 'mobile', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relation</label>
              <input
                type="text"
                value={formData.emergencyContact.relation}
                onChange={(e) => updateNestedField('emergencyContact', 'relation', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Administration Section */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6 text-orange-600">Section Only For Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => updateFormData('employeeId', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="EMP001"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work *</label>
              <select
                value={formData.levelOfWork}
                onChange={(e) => updateFormData('levelOfWork', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="Worker">Worker</option>
                <option value="Staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Off-Day</label>
              <select
                value={formData.offDay}
                onChange={(e) => updateFormData('offDay', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Designation</option>
                {designations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <select
                value={formData.section}
                onChange={(e) => updateFormData('section', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Section</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
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
                  className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gross Salary *</label>
              <input
                type="number"
                value={formData.grossSalary}
                onChange={(e) => handleGrossSalaryChange(e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Joining *</label>
              <input
                type="date"
                value={formData.dateOfJoining}
                onChange={(e) => updateFormData('dateOfJoining', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Issue</label>
              <input
                type="date"
                value={formData.dateOfIssue}
                onChange={(e) => updateFormData('dateOfIssue', e.target.value)}
                className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Salary Components Section */}
        <div className="rounded border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-semibold mb-6 text-green-600">Salary Components</h2>
          
          {/* Salary Components Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Enable</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Amount (৳)</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Custom</th>
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
                      type="checkbox"
                      checked={formData.salaryComponents.basicSalary.enabled}
                      onChange={(e) => toggleSalaryComponent('basicSalary', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                                         <input
                       type="number"
                       value={formData.salaryComponents.basicSalary.amount}
                       onChange={(e) => updateSalaryComponent('basicSalary', e.target.value, true)}
                       className="w-20 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                       disabled={!formData.salaryComponents.basicSalary.enabled}
                       readOnly={!formData.salaryComponents.basicSalary.custom}
                     />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={formData.salaryComponents.basicSalary.custom}
                      onChange={(e) => updateSalaryComponent('basicSalary', formData.salaryComponents.basicSalary.amount, e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      disabled={!formData.salaryComponents.basicSalary.enabled}
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
                      type="checkbox"
                      checked={formData.salaryComponents.houseRent.enabled}
                      onChange={(e) => toggleSalaryComponent('houseRent', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                                         <input
                       type="number"
                       value={formData.salaryComponents.houseRent.amount}
                       onChange={(e) => updateSalaryComponent('houseRent', e.target.value, true)}
                       className="w-20 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                       disabled={!formData.salaryComponents.houseRent.enabled}
                       readOnly={!formData.salaryComponents.houseRent.custom}
                     />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={formData.salaryComponents.houseRent.custom}
                      onChange={(e) => updateSalaryComponent('houseRent', formData.salaryComponents.houseRent.amount, e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      disabled={!formData.salaryComponents.houseRent.enabled}
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
                      type="checkbox"
                      checked={formData.salaryComponents.medical.enabled}
                      onChange={(e) => toggleSalaryComponent('medical', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                                         <input
                       type="number"
                       value={formData.salaryComponents.medical.amount}
                       onChange={(e) => updateSalaryComponent('medical', e.target.value, true)}
                       className="w-20 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                       disabled={!formData.salaryComponents.medical.enabled}
                       readOnly={!formData.salaryComponents.medical.custom}
                     />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={formData.salaryComponents.medical.custom}
                      onChange={(e) => updateSalaryComponent('medical', formData.salaryComponents.medical.amount, e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      disabled={!formData.salaryComponents.medical.enabled}
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
                        type="checkbox"
                        checked={formData.salaryComponents.food.enabled}
                        onChange={(e) => toggleSalaryComponent('food', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                                             <input
                         type="number"
                         value={formData.salaryComponents.food.amount}
                         onChange={(e) => updateSalaryComponent('food', e.target.value, true)}
                         className="w-20 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                         disabled={!formData.salaryComponents.food.enabled}
                         readOnly={!formData.salaryComponents.food.custom}
                       />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={formData.salaryComponents.food.custom}
                        onChange={(e) => updateSalaryComponent('food', formData.salaryComponents.food.amount, e.target.checked)}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        disabled={!formData.salaryComponents.food.enabled}
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
                      type="checkbox"
                      checked={formData.salaryComponents.conveyance.enabled}
                      onChange={(e) => toggleSalaryComponent('conveyance', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                                         <input
                       type="number"
                       value={formData.salaryComponents.conveyance.amount}
                       onChange={(e) => updateSalaryComponent('conveyance', e.target.value, true)}
                       className="w-20 h-8 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                       disabled={!formData.salaryComponents.conveyance.enabled}
                       readOnly={!formData.salaryComponents.conveyance.custom}
                     />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={formData.salaryComponents.conveyance.custom}
                      onChange={(e) => updateSalaryComponent('conveyance', formData.salaryComponents.conveyance.amount, e.target.checked)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                      disabled={!formData.salaryComponents.conveyance.enabled}
                    />
                  </td>
                </tr>

                {/* Total Row */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">Total</div>
                    <div className="text-xs text-gray-500">Calculated Total</div>
                  </td>
                  <td className="px-4 py-3 text-center">-</td>
                  <td className="px-4 py-3 text-center text-lg">
                    ৳{Object.values(formData.salaryComponents)
                      .filter(comp => comp.enabled)
                      .reduce((sum, comp) => sum + comp.amount, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">-</td>
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
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            See Preview
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
          >
            Add {employeeType}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* A4 Style Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Registration Form</h1>
                  <p className="text-lg text-gray-600">Company Name: [Your Company Name]</p>
                  <p className="text-gray-600">Form Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="w-24 h-32 border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                    {formData.picture ? (
                      <img 
                        src={URL.createObjectURL(formData.picture)} 
                        alt="Employee" 
                        className="w-20 h-28 object-cover"
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
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.dateOfBirth || '_________________'}</span>
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
                <h3 className="text-xl font-bold mb-4 text-orange-800 border-b-2 border-orange-800 pb-2">Employment Information</h3>
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
                    <span className="font-bold w-32">Section:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.section || '_________________'}</span>
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
                    <span className="border-b border-gray-400 flex-1 px-2">{formData.dateOfJoining || '_________________'}</span>
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

                  {formData.references.some(ref => ref.name) && (
                    <div className="border-2 border-gray-300 rounded-lg p-4">
                      <h3 className="text-xl font-bold mb-4 text-red-800 border-b-2 border-red-800 pb-2">References</h3>
                      <div className="space-y-3 text-sm">
                        {formData.references.filter(ref => ref.name).map((ref, index) => (
                          <div key={index} className="border-l-4 border-red-400 pl-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex">
                                <span className="font-bold w-20">Name:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{ref.name}</span>
                              </div>
                              <div className="flex">
                                <span className="font-bold w-20">Mobile:</span>
                                <span className="border-b border-gray-400 flex-1 px-2">{ref.mobile}</span>
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
                <h3 className="text-xl font-bold mb-4 text-red-800 border-b-2 border-red-800 pb-2">Emergency Contact</h3>
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

              {/* Signature Section */}
              <div className="border-2 border-gray-300 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
                    <p className="text-sm font-bold">Employee Signature</p>
                    <p className="text-xs text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="border-b-2 border-gray-400 h-16 mb-2"></div>
                    <p className="text-sm font-bold">HR Manager Signature</p>
                    <p className="text-xs text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Actions */}
            <div className="bg-gray-50 border-t border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Generate and download PDF functionality would go here
                      alert('PDF download functionality will be implemented here')
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => {
                      // Share functionality would go here
                      alert('Share functionality will be implemented here')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Share
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false)
                      // Submit the form
                      document.querySelector('form').requestSubmit()
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
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
