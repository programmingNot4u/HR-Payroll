import { useState } from 'react'

const OrganizationalMetrics = () => {
  const [activeTab, setActiveTab] = useState('designations')
  const [designations, setDesignations] = useState([
    { id: 1, name: 'Software Engineer', description: 'Develops and maintains software applications', level: 'Mid', isActive: true },
    { id: 2, name: 'Senior Software Engineer', description: 'Leads development projects and mentors junior developers', level: 'Senior', isActive: true },
    { id: 3, name: 'Product Manager', description: 'Manages product development and strategy', level: 'Senior', isActive: true },
    { id: 4, name: 'HR Manager', description: 'Manages human resources operations', level: 'Senior', isActive: true }
  ])
  
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Engineering', description: 'Software development and technical operations', head: 'John Smith', isActive: true },
    { id: 2, name: 'Human Resources', description: 'Employee management and organizational development', head: 'Sarah Johnson', isActive: true },
    { id: 3, name: 'Marketing', description: 'Brand management and customer acquisition', head: 'Mike Davis', isActive: true },
    { id: 4, name: 'Finance', description: 'Financial planning and accounting', head: 'Lisa Wilson', isActive: true }
  ])
  
  
  const [skillMetrics, setSkillMetrics] = useState([
    { id: 1, name: 'Technical Skills', description: 'Programming languages, frameworks, tools', category: 'Technical', isActive: true },
    { id: 2, name: 'Communication', description: 'Verbal and written communication abilities', category: 'Soft Skills', isActive: true },
    { id: 3, name: 'Leadership', description: 'Team management and leadership capabilities', category: 'Management', isActive: true },
    { id: 4, name: 'Problem Solving', description: 'Analytical thinking and problem resolution', category: 'Cognitive', isActive: true }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  const tabs = [
    { id: 'designations', name: 'Designations' },
    { id: 'departments', name: 'Departments' },
    { id: 'skillMetrics', name: 'Skill Metrics' }
  ]

  const getCurrentData = () => {
    switch (activeTab) {
      case 'designations': return designations
      case 'departments': return departments
      case 'skillMetrics': return skillMetrics
      default: return []
    }
  }

  const getCurrentSetter = () => {
    switch (activeTab) {
      case 'designations': return setDesignations
      case 'departments': return setDepartments
      case 'skillMetrics': return setSkillMetrics
      default: return () => {}
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({})
    setShowAddModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData(item)
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const setter = getCurrentSetter()
      setter(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleSave = () => {
    const setter = getCurrentSetter()
    const currentData = getCurrentData()
    
    if (editingItem) {
      // Update existing item
      setter(prev => prev.map(item => 
        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
      ))
    } else {
      // Add new item
      const newId = Math.max(...currentData.map(item => item.id), 0) + 1
      setter(prev => [...prev, { ...formData, id: newId, isActive: true }])
    }
    
    setShowAddModal(false)
    setEditingItem(null)
    setFormData({})
  }

  const toggleActive = (id) => {
    const setter = getCurrentSetter()
    setter(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
  }

  const renderFormFields = () => {
    switch (activeTab) {
      case 'designations':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Software Engineer"
            />
          </div>
        )
      
      case 'departments':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Engineering"
            />
          </div>
        )
      
      
      case 'skillMetrics':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Technical Skills"
            />
          </div>
        )
      
      default:
        return null
    }
  }

  const renderTable = () => {
    const data = getCurrentData()
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {tabs.find(tab => tab.id === activeTab)?.name} Management
          </h3>
          <button
            onClick={handleAdd}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            Add {tabs.find(tab => tab.id === activeTab)?.name.slice(0, -1)}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Organizational Metrics</h1>
          <p className="text-sm text-gray-500">Manage designations, departments, work levels, and skill metrics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderTable()}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingItem ? 'Edit' : 'Add'} {tabs.find(tab => tab.id === activeTab)?.name.slice(0, -1)}
              </h3>
              <div className="space-y-4">
                {renderFormFields()}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizationalMetrics

