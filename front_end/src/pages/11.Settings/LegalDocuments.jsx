import {
  AlertTriangle,
  Download,
  Edit2,
  Eye,
  FileText,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";

const LegalDocuments = () => {
  // State management
  const [documents, setDocuments] = useState([]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [fileInputRef] = useState(useRef(null));

  // Form data for new document
  const [formData, setFormData] = useState({
    serialNumber: "",
    documentName: "",
    issueDate: "",
    expiryDate: "",
    alertDays: 30,
    file: null,
    fileName: "",
    fileSize: "",
  });

  // Generate next serial number
  const generateSerialNumber = () => {
    const year = new Date().getFullYear();
    const lastDoc = documents[documents.length - 1];
    const lastNumber = lastDoc
      ? parseInt(lastDoc.serialNumber.split("-")[2])
      : 0;
    return `LD-${year}-${String(lastNumber + 1).padStart(3, "0")}`;
  };

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Check if document is expiring soon
  const isExpiringSoon = (document) => {
    const daysUntilExpiry = getDaysUntilExpiry(document.expiryDate);
    return daysUntilExpiry <= document.alertDays && daysUntilExpiry > 0;
  };

  // Check if document is expired
  const isExpired = (document) => {
    const daysUntilExpiry = getDaysUntilExpiry(document.expiryDate);
    return daysUntilExpiry <= 0;
  };

  // Get document status
  const getDocumentStatus = (document) => {
    if (isExpired(document)) return "Expired";
    if (isExpiringSoon(document)) return "Expiring Soon";
    return "Active";
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      }));
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      }));
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newDocument = {
      id: `LD${String(documents.length + 1).padStart(3, "0")}`,
      serialNumber: formData.serialNumber || generateSerialNumber(),
      documentName: formData.documentName,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      alertDays: parseInt(formData.alertDays),
      file: formData.file,
      fileName: formData.fileName,
      fileSize: formData.fileSize,
      status: getDocumentStatus({
        expiryDate: formData.expiryDate,
        alertDays: parseInt(formData.alertDays),
      }),
      uploadedDate: new Date().toISOString().split("T")[0],
    };

    setDocuments((prev) => [...prev, newDocument]);
    setIsUploadModalOpen(false);
    resetForm();
  };

  // Handle edit
  const handleEdit = (document) => {
    setEditingDocument(document);
    setFormData({
      serialNumber: document.serialNumber,
      documentName: document.documentName,
      issueDate: document.issueDate,
      expiryDate: document.expiryDate,
      alertDays: document.alertDays,
      file: document.file,
      fileName: document.fileName,
      fileSize: document.fileSize,
    });
    setIsEditModalOpen(true);
  };

  // Handle edit submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === editingDocument.id
          ? {
              ...doc,
              serialNumber: formData.serialNumber,
              documentName: formData.documentName,
              issueDate: formData.issueDate,
              expiryDate: formData.expiryDate,
              alertDays: parseInt(formData.alertDays),
              file: formData.file,
              fileName: formData.fileName,
              fileSize: formData.fileSize,
              status: getDocumentStatus({
                expiryDate: formData.expiryDate,
                alertDays: parseInt(formData.alertDays),
              }),
            }
          : doc
      )
    );
    setIsEditModalOpen(false);
    setEditingDocument(null);
    resetForm();
  };

  // Handle delete
  const handleDelete = (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    }
  };

  // Handle document view
  const handleViewDocument = (doc) => {
    if (doc.file) {
      try {
        const url = URL.createObjectURL(doc.file);
        window.open(url, "_blank");
        // Clean up the URL after a delay to allow the browser to load it
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (error) {
        console.error("Error viewing document:", error);
        alert("Error opening document. Please try again.");
      }
    } else {
      alert("No file available to view.");
    }
  };

  // Handle document download
  const handleDownloadDocument = (doc) => {
    if (doc.file) {
      try {
        const url = URL.createObjectURL(doc.file);
        const a = document.createElement("a");
        a.href = url;
        a.download = doc.fileName || `${doc.documentName}.pdf`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading document:", error);
        alert("Error downloading document. Please try again.");
      }
    } else {
      alert("No file available for download.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      serialNumber: "",
      documentName: "",
      issueDate: "",
      expiryDate: "",
      alertDays: 30,
      file: null,
      fileName: "",
      fileSize: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Expiring Soon":
        return "bg-yellow-100 text-yellow-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get alert color
  const getAlertColor = (document) => {
    const daysUntilExpiry = getDaysUntilExpiry(document.expiryDate);
    if (daysUntilExpiry <= 0) return "text-red-600";
    if (daysUntilExpiry <= document.alertDays) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Legal Documents</h1>
          <p className="text-sm text-gray-500">
            Manage legal documents, licenses, and certificates
          </p>
        </div>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Documents</p>
              <p className="text-2xl font-semibold">{documents.length}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-green-600">
                {documents.filter((doc) => doc.status === "Active").length}
              </p>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {
                  documents.filter((doc) => doc.status === "Expiring Soon")
                    .length
                }
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expired</p>
              <p className="text-2xl font-semibold text-red-600">
                {documents.filter((doc) => doc.status === "Expired").length}
              </p>
            </div>
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serial No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Left
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p className="text-lg font-medium">No documents found</p>
                      <p className="text-sm">
                        Upload your first legal document to get started
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((document) => {
                  const daysUntilExpiry = getDaysUntilExpiry(
                    document.expiryDate
                  );
                  return (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {document.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.documentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(document.issueDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(document.expiryDate).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={getAlertColor(document)}>
                          {daysUntilExpiry > 0
                            ? `${daysUntilExpiry} days`
                            : "Expired"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            document.status
                          )}`}>
                          {document.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDocument(document)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Document">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(document)}
                            className="text-green-600 hover:text-green-900"
                            title="Download Document">
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(document)}
                            className="text-orange-600 hover:text-orange-900"
                            title="Edit Document">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(document.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Document">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Upload Legal Document</h2>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        serialNumber: e.target.value,
                      }))
                    }
                    placeholder="Auto-generated if empty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    value={formData.documentName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        documentName: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        issueDate: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Before Expiry (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.alertDays}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        alertDays: e.target.value,
                      }))
                    }
                    min="1"
                    max="365"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Document *
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop your document here, or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                    Choose File
                  </button>
                  {formData.fileName && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {formData.fileName}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Upload Document
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
              <h2 className="text-xl font-semibold">Edit Document</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingDocument(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        serialNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    value={formData.documentName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        documentName: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        issueDate: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expiryDate: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alert Before Expiry (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.alertDays}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        alertDays: e.target.value,
                      }))
                    }
                    min="1"
                    max="365"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current File
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {formData.fileName}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({formData.fileSize})
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  To change the file, upload a new document
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingDocument(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                  Update Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalDocuments;
