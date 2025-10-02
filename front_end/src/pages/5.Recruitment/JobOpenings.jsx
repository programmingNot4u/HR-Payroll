import React, { useEffect, useState } from "react";
import organizationalDataService from "../../services/organizationalDataService";
import recruitmentService from "../../services/recruitmentService";

const JobOpenings = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    jobOpeningId: "",
    designation: "",
    department: "",
    salaryRange: "",
    experience: "",
    postedDate: "",
    description: "",
    requirements: [""],
    deadline: "",
    manpower: "",
  });

  // Load organizational data
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [organizationalDataLoading, setOrganizationalDataLoading] =
    useState(true);
  const statuses = ["Active", "Closed", "On Hold"];

  // API functions
  const fetchJobOpenings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recruitmentService.jobOpenings.getAll(1, 100);
      console.log("API Response:", response); // Debug log

      // Handle different possible response structures
      let jobOpeningsData = [];
      if (response && Array.isArray(response)) {
        jobOpeningsData = response;
      } else if (
        response &&
        response.jobOpenings &&
        Array.isArray(response.jobOpenings)
      ) {
        jobOpeningsData = response.jobOpenings;
      } else if (
        response &&
        response.results &&
        Array.isArray(response.results)
      ) {
        jobOpeningsData = response.results;
      }

      setJobOpenings(jobOpeningsData);
    } catch (err) {
      console.error("Failed to fetch job openings:", err);
      if (err.message.includes("401")) {
        setError("Please log in to access job openings.");
      } else {
        setError("Failed to fetch job openings. Please try again.");
      }
      setJobOpenings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const createJobOpening = async (jobData) => {
    try {
      setLoading(true);
      const response = await recruitmentService.jobOpenings.create(jobData);
      await fetchJobOpenings(); // Refresh the list
      return response;
    } catch (err) {
      console.error("Failed to create job opening:", err);

      // Check if it's an authentication error
      if (
        err.message.includes("401") ||
        err.message.includes("Authentication")
      ) {
        setError("Authentication failed. Please log in again.");
      } else if (err.message.includes("400")) {
        setError(
          "Invalid data provided. Please check all fields and try again."
        );
      } else {
        setError("Failed to create job opening. Please try again.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJobOpening = async (id, jobData) => {
    try {
      setLoading(true);
      const response = await recruitmentService.jobOpenings.update(id, jobData);
      await fetchJobOpenings(); // Refresh the list
      return response;
    } catch (err) {
      console.error("Failed to update job opening:", err);
      setError("Failed to update job opening. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJobOpening = async (id) => {
    try {
      setLoading(true);
      await recruitmentService.jobOpenings.delete(id);
      await fetchJobOpenings(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete job opening:", err);
      setError("Failed to delete job opening. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateJobOpeningStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await recruitmentService.jobOpenings.updateStatus(
        id,
        status
      );
      await fetchJobOpenings(); // Refresh the list
      return response;
    } catch (err) {
      console.error("Failed to update job opening status:", err);
      setError("Failed to update job opening status. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load organizational data asynchronously
  const loadOrganizationalData = async () => {
    try {
      setOrganizationalDataLoading(true);

      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Data loading timeout")), 10000)
      );

      // Wait for organizational data to be loaded with timeout
      await Promise.race([
        organizationalDataService.loadAllData(),
        timeoutPromise,
      ]);

      // Set the data after it's loaded
      setDepartments(organizationalDataService.getDepartmentNames());
      setDesignations(organizationalDataService.getDesignationNames());
      console.log("Organizational data loaded:", {
        departments: organizationalDataService.getDepartmentNames(),
        designations: organizationalDataService.getDesignationNames(),
      });
    } catch (error) {
      console.error("Failed to load organizational data:", error);

      // Try to load from localStorage as fallback
      try {
        const storedDepartments = JSON.parse(
          localStorage.getItem("organizational_departments") || "[]"
        );
        const storedDesignations = JSON.parse(
          localStorage.getItem("organizational_designations") || "[]"
        );

        if (storedDepartments.length > 0) {
          setDepartments(
            storedDepartments.map((dept) => dept.name).filter(Boolean)
          );
        }
        if (storedDesignations.length > 0) {
          setDesignations(
            storedDesignations.map((des) => des.name).filter(Boolean)
          );
        }

        console.log("Loaded data from localStorage fallback:", {
          departments: storedDepartments.map((dept) => dept.name),
          designations: storedDesignations.map((des) => des.name),
        });
      } catch (localError) {
        console.error("Failed to load from localStorage:", localError);
        // Final fallback to empty arrays
        setDepartments([]);
        setDesignations([]);
      }
    } finally {
      setOrganizationalDataLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizationalData();

    // Load initial data
    fetchJobOpenings();
  }, []);

  // Date formatting functions
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // If the date is already in dd/mm/yyyy format, return as is
    if (dateString.includes("/") && dateString.split("/").length === 3) {
      return dateString;
    }
    // Otherwise, parse as a date and format to dd/mm/yyyy
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    // If the date is already in dd/mm/yyyy format, return as is
    if (dateString.includes("/") && dateString.split("/").length === 3) {
      return dateString;
    }
    // Otherwise, parse as a date and format to dd/mm/yyyy
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredJobs = Array.isArray(jobOpenings)
    ? jobOpenings.filter((job) => {
        const matchesSearch =
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.designation_name || job.designation)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesDepartment =
          filterDepartment === "" ||
          (job.department_name || job.department) === filterDepartment;
        const matchesDesignation =
          filterDesignation === "" ||
          (job.designation_name || job.designation) === filterDesignation;
        const matchesStatus =
          filterStatus === "" || job.status === filterStatus;

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesDesignation &&
          matchesStatus
        );
      })
    : [];

  const totalOpenings = Array.isArray(jobOpenings) ? jobOpenings.length : 0;
  const activeOpenings = Array.isArray(jobOpenings)
    ? jobOpenings.filter((job) => job.status === "Active").length
    : 0;
  const onHoldOpenings = Array.isArray(jobOpenings)
    ? jobOpenings.filter((job) => job.status === "On Hold").length
    : 0;
  const closedOpenings = Array.isArray(jobOpenings)
    ? jobOpenings.filter((job) => job.status === "Closed").length
    : 0;

  const handleJobFormChange = (field, value) => {
    setJobForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...jobForm.requirements];
    newRequirements[index] = value;
    setJobForm((prev) => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const addRequirement = () => {
    setJobForm((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const removeRequirement = (index) => {
    const newRequirements = jobForm.requirements.filter((_, i) => i !== index);
    setJobForm((prev) => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const handleSubmitJob = async (e) => {
    e.preventDefault();

    // Check authentication status
    const loginType = localStorage.getItem("loginType");
    const hasToken =
      localStorage.getItem("adminToken") ||
      localStorage.getItem("employeeToken") ||
      localStorage.getItem("access_token");

    if (!hasToken) {
      setError("You are not logged in. Please log in first.");
      return;
    }

    // Check if organizational data is still loading
    if (organizationalDataLoading) {
      console.log("Organizational data is still loading, please wait...");
      return;
    }

    // Check if required data is available
    if (departments.length === 0 || designations.length === 0) {
      console.error("Organizational data not loaded yet");
      setError(
        "Please wait for organizational data to load before creating a job."
      );
      return;
    }

    try {
      // Find department and designation IDs from names
      const departmentObj = organizationalDataService
        .getDepartments()
        .find((dept) => dept.name === jobForm.department);
      const designationObj = organizationalDataService
        .getDesignations()
        .find((des) => des.name === jobForm.designation);

      if (!departmentObj) {
        throw new Error("Selected department not found");
      }
      if (!designationObj) {
        throw new Error("Selected designation not found");
      }

      // Convert dates - HTML date inputs already provide YYYY-MM-DD format
      const convertDate = (dateString) => {
        if (!dateString) return "";
        // HTML date inputs already provide dates in YYYY-MM-DD format
        return dateString;
      };

      // Prepare job data for API
      const jobData = {
        job_opening_id: jobForm.jobOpeningId,
        title: jobForm.designation, // Using designation as title for now
        designation: designationObj.id, // Send designation ID
        department: departmentObj.id, // Send department ID
        job_type: "Full-time", // Default job type
        salary_range: jobForm.salaryRange,
        experience_required: jobForm.experience,
        posted_date: convertDate(jobForm.postedDate),
        deadline: convertDate(jobForm.deadline),
        description: jobForm.description,
        requirements: jobForm.requirements.filter((req) => req.trim() !== ""),
        manpower: parseInt(jobForm.manpower) || 1,
        status: "Active",
      };

      console.log("Converted dates:", {
        posted_date: convertDate(jobForm.postedDate),
        deadline: convertDate(jobForm.deadline),
        original_posted: jobForm.postedDate,
        original_deadline: jobForm.deadline,
      });

      console.log("Sending job data to API:", jobData);

      if (editingJob) {
        // Update existing job
        await updateJobOpening(editingJob.id, jobData);
      } else {
        // Create new job
        await createJobOpening(jobData);
      }

      handleCancelJob();
    } catch (error) {
      console.error("Error submitting job opening:", error);

      setError(
        `Failed to ${editingJob ? "update" : "create"} job opening: ${
          error.message
        }`
      );
    }
  };

  const handleCancelJob = () => {
    setShowJobForm(false);
    setEditingJob(null);
    setJobForm({
      jobOpeningId: "",
      designation: "",
      department: "",
      salaryRange: "",
      experience: "",
      postedDate: "",
      description: "",
      requirements: [""],
      deadline: "",
      manpower: "",
    });
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      jobOpeningId: job.job_opening_id || job.jobOpeningId || "",
      designation: job.designation_name || job.designation || "",
      department: job.department_name || job.department || "",
      jobType: job.job_type || job.jobType || "Full-time",
      salaryRange: job.salary_range || job.salary || "",
      experienceRequired: job.experience_required || job.experience || "",
      postedDate: job.posted_date || job.postedDate || "",
      deadline: job.deadline || "",
      description: job.description || "",
      requirements: job.requirements || [],
      manpower: job.manpower || 1,
      status: job.status || "Active",
    });
    setShowJobForm(true);
  };

  const handleUpdateJob = (e) => {
    e.preventDefault();
    setJobOpenings((prev) =>
      prev.map((job) =>
        job.id === editingJob.id
          ? {
              ...job,
              jobOpeningId: jobForm.jobOpeningId,
              title: jobForm.designation,
              designation: jobForm.designation,
              department: jobForm.department,
              salary: jobForm.salaryRange,
              experience: jobForm.experience,
              postedDate: jobForm.postedDate,
              description: jobForm.description,
              requirements: jobForm.requirements.filter(
                (req) => req.trim() !== ""
              ),
              deadline: jobForm.deadline,
              manpower: parseInt(jobForm.manpower) || 0,
            }
          : job
      )
    );
    handleCancelJob();
  };

  const handleHoldJob = (jobId) => {
    setJobOpenings((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: job.status === "On Hold" ? "Active" : "On Hold",
            }
          : job
      )
    );
  };

  const handleCloseJob = (jobId) => {
    setJobOpenings((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: "Closed" } : job))
    );
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await deleteJobOpening(jobId);
      } catch (error) {
        console.error("Error deleting job opening:", error);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Job Openings
              </h1>
              <p className="text-gray-600">
                Manage recruitment opportunities for RMG industry positions
              </p>
            </div>
            <button
              onClick={() => setShowJobForm(true)}
              className="px-6 py-3 text-white rounded-lg transition-colors flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #ffb366, #ff8c42)",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background =
                  "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
              }
              onMouseLeave={(e) =>
                (e.target.style.background =
                  "linear-gradient(135deg, #ffb366, #ff8c42)")
              }>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Open A Job
            </button>
          </div>
        </div>

        {/* Authentication Status */}
        {(() => {
          const loginType = localStorage.getItem("loginType");
          const hasToken =
            localStorage.getItem("adminToken") ||
            localStorage.getItem("employeeToken") ||
            localStorage.getItem("access_token");

          if (!hasToken) {
            return (
              <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    You are not logged in. Please log in to create job openings.
                  </span>
                </div>
                <div className="mt-2">
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Go to Login
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
            {error.includes("log in") && (
              <div className="mt-2">
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  Go to Login
                </button>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            Loading job openings...
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Openings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalOpenings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Openings
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeOpenings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Hold</p>
                <p className="text-2xl font-bold text-gray-900">
                  {onHoldOpenings}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {closedOpenings}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search jobs, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">All Departments</option>
                {(departments || []).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">All Designations</option>
                {(designations || []).map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">All Status</option>
                {(statuses || []).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterDepartment("");
                  setFilterDesignation("");
                  setFilterStatus("");
                }}
                className="w-full px-4 py-2 text-white rounded-md transition-colors"
                style={{
                  background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    "linear-gradient(135deg, #ffb366, #ff8c42)")
                }>
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Job Opening Form Modal */}
        {showJobForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingJob ? "Edit Job" : "Open A Job"}
                    {organizationalDataLoading && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Loading data...)
                      </span>
                    )}
                    {!organizationalDataLoading && departments.length === 0 && (
                      <div className="ml-2 flex gap-2">
                        <button
                          onClick={() => {
                            setOrganizationalDataLoading(true);
                            loadOrganizationalData();
                          }}
                          className="text-sm text-blue-500 hover:text-blue-700 underline">
                          Retry Loading Data
                        </button>
                        <button
                          onClick={() => {
                            console.log("Debug - Current state:", {
                              departments,
                              designations,
                              organizationalDataLoading,
                            });
                            console.log("Debug - localStorage:", {
                              departments: localStorage.getItem(
                                "organizational_departments"
                              ),
                              designations: localStorage.getItem(
                                "organizational_designations"
                              ),
                            });
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700 underline">
                          Debug
                        </button>
                      </div>
                    )}
                  </h2>
                  <button
                    onClick={handleCancelJob}
                    className="text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmitJob} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Job Opening ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Opening ID
                    </label>
                    <input
                      type="text"
                      value={jobForm.jobOpeningId}
                      onChange={(e) =>
                        handleJobFormChange("jobOpeningId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter job opening ID"
                      required
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <select
                      value={jobForm.designation}
                      onChange={(e) =>
                        handleJobFormChange("designation", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required>
                      <option value="">
                        {organizationalDataLoading
                          ? "Loading designations..."
                          : "Select Designation"}
                      </option>
                      {(designations || []).map((designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={jobForm.department}
                      onChange={(e) =>
                        handleJobFormChange("department", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required>
                      <option value="">
                        {organizationalDataLoading
                          ? "Loading departments..."
                          : "Select Department"}
                      </option>
                      {(departments || []).map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      value={jobForm.salaryRange}
                      onChange={(e) =>
                        handleJobFormChange("salaryRange", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ৳50,000 - ৳80,000"
                      required
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      value={jobForm.experience}
                      onChange={(e) =>
                        handleJobFormChange("experience", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 3-5 years"
                      required
                    />
                  </div>

                  {/* Posted Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posted Date
                    </label>
                    <input
                      type="date"
                      value={jobForm.postedDate}
                      onChange={(e) =>
                        handleJobFormChange("postedDate", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Manpower */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manpower (Person)
                    </label>
                    <input
                      type="number"
                      value={jobForm.manpower}
                      onChange={(e) =>
                        handleJobFormChange("manpower", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 5"
                      required
                    />
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={jobForm.deadline}
                      onChange={(e) =>
                        handleJobFormChange("deadline", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={jobForm.description}
                      onChange={(e) =>
                        handleJobFormChange("description", e.target.value)
                      }
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Enter job description"
                      required
                    />
                  </div>

                  {/* Requirements */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requirements
                    </label>
                    <div className="space-y-2">
                      {(jobForm.requirements || []).map(
                        (requirement, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={requirement}
                                onChange={(e) =>
                                  handleRequirementChange(index, e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder={`Requirement ${index + 1}`}
                              />
                            </div>
                            {jobForm.requirements.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeRequirement(index)}
                                className="px-3 py-2 text-red-600 hover:text-red-800">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={addRequirement}
                        className="px-4 py-2 text-blue-600 hover:text-blue-800 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Add Requirement
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancelJob}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={organizationalDataLoading || loading}
                    className={`px-6 py-2 text-white rounded-md transition-colors ${
                      organizationalDataLoading || loading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    style={{
                      background: "linear-gradient(135deg, #ffb366, #ff8c42)",
                    }}
                    onMouseEnter={(e) =>
                      !organizationalDataLoading &&
                      !loading &&
                      (e.target.style.background =
                        "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                    }
                    onMouseLeave={(e) =>
                      !organizationalDataLoading &&
                      !loading &&
                      (e.target.style.background =
                        "linear-gradient(135deg, #ffb366, #ff8c42)")
                    }>
                    {organizationalDataLoading
                      ? "Loading Data..."
                      : loading
                      ? "Processing..."
                      : editingJob
                      ? "Update Job"
                      : "Create Job Opening"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            console.log("Job object:", job); // Debug log
            // Ensure job has all required fields with defaults
            const safeJob = {
              id: job.id || job.job_opening_id || Math.random(),
              job_opening_id: job.job_opening_id || job.jobOpeningId || "",
              title: job.title || "",
              designation: job.designation || "",
              designation_name: job.designation_name || job.designation || "",
              department: job.department || "",
              department_name: job.department_name || job.department || "",
              job_type: job.job_type || job.jobType || "Full-time",
              description: job.description || "",
              requirements: job.requirements || [],
              experience_required:
                job.experience_required || job.experience || "",
              salary_range: job.salary_range || job.salary || "",
              manpower: job.manpower || 1,
              posted_date: job.posted_date || job.postedDate || "",
              deadline: job.deadline || "",
              status: job.status || "Active",
              applications_count: job.applications_count || 0,
              created_by: job.created_by || "",
              created_by_name: job.created_by_name || "",
              created_at: job.created_at || "",
              updated_at: job.updated_at || "",
            };
            return (
              <div
                key={safeJob.id}
                className="bg-white rounded-lg shadow p-6 relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              {safeJob.title}
                            </h3>
                            <div className="mb-3">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                  {safeJob.designation_name}
                                </span>{" "}
                                ||{" "}
                                <span className="font-medium">
                                  {safeJob.department_name}
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              {safeJob.salary_range}
                            </p>
                            <p className="text-sm text-gray-500">Monthly</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Notification Bar */}
                    {safeJob.status === "On Hold" && (
                      <div className="w-full mb-4">
                        <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-yellow-100 border-2 border-yellow-300 shadow-sm">
                          <svg
                            className="w-5 h-5 mr-3 text-yellow-600"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-lg font-semibold text-yellow-800">
                            JOB ON HOLD
                          </span>
                        </div>
                      </div>
                    )}

                    {safeJob.status === "Closed" && (
                      <div className="w-full mb-4">
                        <div className="flex items-center justify-center px-6 py-3 rounded-lg bg-red-100 border-2 border-red-300 shadow-sm">
                          <svg
                            className="w-5 h-5 mr-3 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4 2a1 1 0 00-1 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 10-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-lg font-semibold text-red-800">
                            JOB CLOSED
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Job ID
                        </p>
                        <p className="text-gray-900">
                          {safeJob.job_opening_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Experience
                        </p>
                        <p className="text-gray-900">
                          {safeJob.experience_required}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Manpower
                        </p>
                        <p className="text-gray-900">
                          {safeJob.manpower} Person
                          {safeJob.manpower !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Posted Date
                        </p>
                        <p className="text-gray-900">
                          {formatDateForDisplay(safeJob.posted_date)}
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{safeJob.description}</p>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Requirements:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {(safeJob.requirements || []).map((req, index) => (
                          <li key={index} className="text-gray-700 text-sm">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Deadline:</span>{" "}
                        {formatDateForDisplay(safeJob.deadline)}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditJob(job)}
                          className="px-4 py-2 text-white rounded-md transition-colors"
                          style={{
                            background:
                              "linear-gradient(135deg, #ffb366, #ff8c42)",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ffb366, #ff8c42)")
                          }>
                          Edit Job
                        </button>
                        <button
                          onClick={() => handleHoldJob(safeJob.id)}
                          className="px-4 py-2 text-white rounded-md transition-colors"
                          style={{
                            background:
                              "linear-gradient(135deg, #ffb366, #ff8c42)",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ffb366, #ff8c42)")
                          }>
                          {safeJob.status === "On Hold"
                            ? "Activate Job"
                            : "Hold Job"}
                        </button>
                        <button
                          onClick={() => handleCloseJob(safeJob.id)}
                          className="px-4 py-2 text-white rounded-md transition-colors"
                          style={{
                            background:
                              "linear-gradient(135deg, #ffb366, #ff8c42)",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ffb366, #ff8c42)")
                          }>
                          Close Job
                        </button>
                        <button
                          onClick={() => handleDeleteJob(safeJob.id)}
                          className="px-4 py-2 text-white rounded-md transition-colors"
                          style={{
                            background:
                              "linear-gradient(135deg, #ffb366, #ff8c42)",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ff9f4d, #ff7a2e)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.background =
                              "linear-gradient(135deg, #ffb366, #ff8c42)")
                          }>
                          Delete Job
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No jobs found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOpenings;
