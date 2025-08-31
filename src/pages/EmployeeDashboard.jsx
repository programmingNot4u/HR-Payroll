import { useState, useMemo } from 'react'

// Sample employee data
const sampleEmployees = [
  {
    id: 'EMP001',
    name: 'Ahmed Khan',
    designation: 'Senior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    phone: '+880 1712-345678',
    joiningDate: '2022-03-15',
    status: 'Active'
  },
  {
    id: 'EMP002',
    name: 'Fatima Begum',
    designation: 'Quality Inspector',
    department: 'Quality Control',
    levelOfWork: 'Staff',
    phone: '+880 1812-345679',
    joiningDate: '2023-01-20',
    status: 'Active'
  },
  {
    id: 'EMP003',
    name: 'Rahim Ali',
    designation: 'Cutting Master',
    department: 'Cutting',
    levelOfWork: 'Worker',
    phone: '+880 1912-345680',
    joiningDate: '2021-08-10',
    status: 'Active'
  },
  {
    id: 'EMP004',
    name: 'Ayesha Rahman',
    designation: 'Finishing Supervisor',
    department: 'Finishing',
    levelOfWork: 'Staff',
    phone: '+880 1612-345681',
    joiningDate: '2023-06-05',
    status: 'On Probation'
  },
  {
    id: 'EMP005',
    name: 'Mohammad Hassan',
    designation: 'Production Manager',
    department: 'Management',
    levelOfWork: 'Staff',
    phone: '+880 1512-345682',
    joiningDate: '2020-12-01',
    status: 'Active'
  },
  {
    id: 'EMP006',
    name: 'Nusrat Jahan',
    designation: 'Junior Tailor',
    department: 'Sewing',
    levelOfWork: 'Worker',
    phone: '+880 1412-345683',
    joiningDate: '2024-01-15',
    status: 'New Joined'
  },
  {
    id: 'EMP007',
    name: 'Karim Uddin',
    designation: 'Machine Operator',
    department: 'Cutting',
    levelOfWork: 'Worker',
    phone: '+880 1312-345684',
    joiningDate: '2022-11-20',
    status: 'InActive'
  },
  {
    id: 'EMP008',
    name: 'Salma Khatun',
    designation: 'Quality Assistant',
    department: 'Quality Control',
    levelOfWork: 'Staff',
    phone: '+880 1212-345685',
    joiningDate: '2023-09-12',
    status: 'Resigned'
  }
]

const departments = ['All', 'Cutting', 'Sewing', 'Finishing', 'Quality Control', 'Management']
const designations = ['All', 'Senior Tailor', 'Quality Inspector', 'Cutting Master', 'Finishing Supervisor', 'Production Manager', 'Junior Tailor', 'Machine Operator', 'Quality Assistant']
const levelOfWorkOptions = ['All', 'Worker', 'Staff']
const statuses = ['All', 'Active', 'InActive', 'New Joined', 'Resigned', 'Terminated', 'On Probation']

export default function EmployeeDashboard() {
  const [departmentFilter, setDepartmentFilter] = useState('All')
  const [designationFilter, setDesignationFilter] = useState('All')
  const [levelOfWorkFilter, setLevelOfWorkFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  // Calculate statistics
  const stats = useMemo(() => {
    const total = sampleEmployees.length
    const active = sampleEmployees.filter(emp => emp.status === 'Active').length
    const inactive = sampleEmployees.filter(emp => emp.status === 'InActive').length
    const newJoined = sampleEmployees.filter(emp => emp.status === 'New Joined').length
    const resigned = sampleEmployees.filter(emp => emp.status === 'Resigned').length
    const terminated = sampleEmployees.filter(emp => emp.status === 'Terminated').length
    const onProbation = sampleEmployees.filter(emp => emp.status === 'On Probation').length

    return { total, active, inactive, newJoined, resigned, terminated, onProbation }
  }, [])

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return sampleEmployees.filter(employee => {
      const matchesDepartment = departmentFilter === 'All' || employee.department === departmentFilter
      const matchesDesignation = designationFilter === 'All' || employee.designation === designationFilter
      const matchesLevelOfWork = levelOfWorkFilter === 'All' || employee.levelOfWork === levelOfWorkFilter
      const matchesStatus = statusFilter === 'All' || employee.status === statusFilter
      const matchesSearch = searchTerm === '' || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm)

      return matchesDepartment && matchesDesignation && matchesLevelOfWork && matchesStatus && matchesSearch
    })
  }, [departmentFilter, designationFilter, levelOfWorkFilter, statusFilter, searchTerm])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'InActive': return 'bg-red-100 text-red-800'
      case 'New Joined': return 'bg-blue-100 text-blue-800'
      case 'Resigned': return 'bg-yellow-100 text-yellow-800'
      case 'Terminated': return 'bg-red-100 text-red-800'
      case 'On Probation': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
        <p className="text-sm text-gray-500">Manage and view all employee information</p>
      </div>

      {/* Statistics Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Total Employee</div>
          <div className="mt-2 text-2xl font-semibold text-blue-600">{stats.total}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Active Employee</div>
          <div className="mt-2 text-2xl font-semibold text-green-600">{stats.active}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">InActive Employee</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">{stats.inactive}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">New Joined</div>
          <div className="mt-2 text-2xl font-semibold text-blue-600">{stats.newJoined}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Resigned</div>
          <div className="mt-2 text-2xl font-semibold text-yellow-600">{stats.resigned}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Terminated</div>
          <div className="mt-2 text-2xl font-semibold text-red-600">{stats.terminated}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">On Probation</div>
          <div className="mt-2 text-2xl font-semibold text-orange-600">{stats.onProbation}</div>
        </div>
      </section>

      {/* Filters */}
      <section className="rounded border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
            <select
              value={designationFilter}
              onChange={(e) => setDesignationFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level of Work</label>
            <select
              value={levelOfWorkFilter}
              onChange={(e) => setLevelOfWorkFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {levelOfWorkOptions.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setDepartmentFilter('All')
                setDesignationFilter('All')
                setLevelOfWorkFilter('All')
                setStatusFilter('All')
                setSearchTerm('')
              }}
              className="w-full h-10 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Employee Table */}
      <section className="rounded border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Employee List</h2>
          <p className="text-sm text-gray-500">Showing {filteredEmployees.length} of {sampleEmployees.length} employees</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level of Work</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Joining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.levelOfWork}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(employee.joiningDate).toLocaleDateString('en-BD')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button className="text-orange-600 hover:text-orange-700">View</button>
                      <button className="text-blue-600 hover:text-blue-700">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEmployees.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-500">No employees found matching your filters.</div>
          </div>
        )}
      </section>
    </div>
  )
}
