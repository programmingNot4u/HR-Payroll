import React, { useState } from 'react'

const JobOpenings = () => {
  const [jobOpenings, setJobOpenings] = useState([
    {
      id: 1,
      title: 'Senior Production Manager',
      department: 'Production',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      experience: '5-8 years',
      salary: '৳80,000 - ৳120,000',
      status: 'Active',
      postedDate: '2024-01-15',
      deadline: '2024-02-15',
      applications: 24,
      description: 'Lead production operations for RMG manufacturing unit, manage team of 50+ workers, ensure quality standards and production targets.',
      requirements: ['BSc in Textile Engineering', 'Production management experience', 'Team leadership skills', 'Quality control knowledge'],
      category: 'Management'
    },
    {
      id: 2,
      title: 'Quality Control Supervisor',
      department: 'Quality Assurance',
      location: 'Chittagong, Bangladesh',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '৳45,000 - ৳65,000',
      status: 'Active',
      postedDate: '2024-01-18',
      deadline: '2024-02-18',
      applications: 18,
      description: 'Supervise quality control processes, conduct inspections, maintain quality standards for RMG products.',
      requirements: ['Diploma in Textile Technology', 'Quality control experience', 'Attention to detail', 'Communication skills'],
      category: 'Supervisory'
    },
    {
      id: 3,
      title: 'Fashion Designer',
      department: 'Design',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '৳35,000 - ৳55,000',
      status: 'Active',
      postedDate: '2024-01-20',
      deadline: '2024-02-20',
      applications: 32,
      description: 'Create innovative designs for RMG products, work with international clients, develop seasonal collections.',
      requirements: ['BSc in Fashion Design', 'Design software proficiency', 'Creative thinking', 'Market trend knowledge'],
      category: 'Creative'
    },
    {
      id: 4,
      title: 'Machine Operator',
      department: 'Production',
      location: 'Narayanganj, Bangladesh',
      type: 'Full-time',
      experience: '1-3 years',
      salary: '৳25,000 - ৳35,000',
      status: 'Active',
      postedDate: '2024-01-22',
      deadline: '2024-02-22',
      applications: 45,
      description: 'Operate industrial sewing machines, maintain equipment, ensure production efficiency and quality.',
      requirements: ['High school education', 'Machine operation experience', 'Physical stamina', 'Team work'],
      category: 'Technical'
    },
    {
      id: 5,
      title: 'HR Coordinator',
      department: 'Human Resources',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '৳30,000 - ৳45,000',
      status: 'Active',
      postedDate: '2024-01-25',
      deadline: '2024-02-25',
      applications: 15,
      description: 'Support HR operations, manage recruitment process, handle employee relations for RMG workforce.',
      requirements: ['BBA in HRM', 'HR experience', 'Communication skills', 'MS Office proficiency'],
      category: 'Administrative'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  const departments = ['Production', 'Quality Assurance', 'Design', 'Human Resources', 'Finance', 'Marketing']
  const statuses = ['Active', 'Closed', 'On Hold']
  const categories = ['Management', 'Supervisory', 'Creative', 'Technical', 'Administrative']

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === '' || job.department === filterDepartment
    const matchesStatus = filterStatus === '' || job.status === filterStatus
    const matchesCategory = filterCategory === '' || job.category === filterCategory

    return matchesSearch && matchesDepartment && matchesStatus && matchesCategory
  })

  const totalOpenings = jobOpenings.length
  const activeOpenings = jobOpenings.filter(job => job.status === 'Active').length
  const totalApplications = jobOpenings.reduce((sum, job) => sum + job.applications, 0)
  const avgApplications = Math.round(totalApplications / totalOpenings)

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Openings</h1>
          <p className="text-gray-600">Manage recruitment opportunities for RMG industry positions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Openings</p>
                <p className="text-2xl font-bold text-gray-900">{totalOpenings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Openings</p>
                <p className="text-2xl font-bold text-gray-900">{activeOpenings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Applications</p>
                <p className="text-2xl font-bold text-gray-900">{avgApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterDepartment('')
                  setFilterStatus('')
                  setFilterCategory('')
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{job.department}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{job.type}</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">{job.category}</span>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{job.salary}</p>
                      <p className="text-sm text-gray-500">Monthly</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Location</p>
                      <p className="text-gray-900">{job.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Experience</p>
                      <p className="text-gray-900">{job.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Posted Date</p>
                      <p className="text-gray-900">{job.postedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Applications</p>
                      <p className="text-gray-900">{job.applications}</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{job.description}</p>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Requirements:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-gray-700 text-sm">{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Deadline:</span> {job.deadline}
                    </p>
                    <div className="flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                        Edit Job
                      </button>
                      <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                        Close Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobOpenings
