import React, { useEffect, useState } from "react";
import organizationalDataService from "../../services/organizationalDataService";
import recruitmentService from "../../services/recruitmentService";

const Candidates = () => {
  // Utility functions
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateAverageRating = (skillRatings) => {
    if (!skillRatings || Object.keys(skillRatings).length === 0) return 0;
    const ratings = Object.values(skillRatings).filter((rating) => rating > 0);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // State management
  const [candidates, setCandidates] = useState([]);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    page_size: 10,
    total_pages: 1,
    has_next: false,
    has_previous: false,
    start_index: 0,
    end_index: 0,
    count: 0,
  });

  const [searchTerm] = useState("");
  const [filterJobId, setFilterJobId] = useState("");
  const [filterCandidateId, setFilterCandidateId] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    jobId: "",
    candidateId: "",
    email: "",
    phone: "",
    location: "",
    education: "",
    experience: "",
    softSkills: "",
    technicalSkills: "",
    appliedDate: "",
    lastContact: "",
    skillRatings: {}, // Store skill ratings as {skillName: rating}
  });

  // Load organizational data
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [skillMetrics, setSkillMetrics] = useState([]);

  // API functions
  const fetchCandidates = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recruitmentService.candidates.getAll(
        1,
        50,
        filters
      );
      console.log("Candidates API Response:", response); // Debug log

      // Handle different possible response structures
      let candidatesData = [];
      if (response && Array.isArray(response)) {
        candidatesData = response;
      } else if (
        response &&
        response.candidates &&
        Array.isArray(response.candidates)
      ) {
        candidatesData = response.candidates;
      } else if (
        response &&
        response.results &&
        Array.isArray(response.results)
      ) {
        candidatesData = response.results;
      }

      setCandidates(candidatesData);
      setPagination(response.pagination || pagination);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
      if (err.message.includes("401")) {
        setError("Please log in to access candidates.");
      } else {
        setError("Failed to fetch candidates. Please try again.");
      }
      setCandidates([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchJobOpenings = async () => {
    try {
      const response = await recruitmentService.jobOpenings.getAll(1, 100);
      setJobOpenings(response.jobOpenings || []);
    } catch (err) {
      console.error("Failed to fetch job openings:", err);
    }
  };

  const createCandidate = async (candidateData) => {
    try {
      setLoading(true);
      const response = await recruitmentService.candidates.create(
        candidateData
      );

      // Show success message with generated candidate ID
      if (response && response.candidate_id) {
        setOverlayMessage(
          `Candidate created successfully! Generated ID: ${response.candidate_id}`
        );
        setShowOverlay(true);
        setTimeout(() => {
          setShowOverlay(false);
          setOverlayMessage("");
        }, 3000);
      }

      await fetchCandidates(); // Refresh the list
      return response;
    } catch (err) {
      console.error("Failed to create candidate:", err);
      setError("Failed to create candidate. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id, candidateData) => {
    try {
      setLoading(true);
      const response = await recruitmentService.candidates.update(
        id,
        candidateData
      );
      await fetchCandidates(); // Refresh the list
      return response;
    } catch (err) {
      console.error("Failed to update candidate:", err);
      setError("Failed to update candidate. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id) => {
    try {
      setLoading(true);
      await recruitmentService.candidates.delete(id);
      await fetchCandidates(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete candidate:", err);
      setError("Failed to delete candidate. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await recruitmentService.candidates.updateStatus(
        id,
        status
      );
      await fetchCandidates(); // Refresh the list
      return response;
    } catch (err) {
      console.error("Failed to update candidate status:", err);
      setError("Failed to update candidate status. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load organizational data asynchronously
    const loadOrganizationalData = async () => {
      try {
        // Wait for organizational data to be loaded
        await organizationalDataService.loadAllData();

        // Set the data after it's loaded
        setDepartments(organizationalDataService.getDepartmentNames());
        setDesignations(organizationalDataService.getDesignationNames());
        setSkillMetrics(organizationalDataService.getSkillMetrics());
      } catch (error) {
        console.error("Failed to load organizational data:", error);
        // Fallback to empty arrays
        setDepartments([]);
        setDesignations([]);
        setSkillMetrics([]);
      }
    };

    loadOrganizationalData();

    // Load initial data
    fetchCandidates();
    fetchJobOpenings();
  }, []);

  // Get skills based on designation and department
  const getSkillsForCandidate = (designation, department) => {
    const skills = [];

    // Get soft skills
    const softSkills = skillMetrics.filter((skill) => skill.type === "soft");
    softSkills.forEach((skill) => {
      if (skill.skills) {
        skill.skills.forEach((skillName) => {
          skills.push({
            name: skillName,
            type: "soft",
            category: skill.name,
          });
        });
      }
    });

    // Get technical skills for specific designation and department
    const technicalSkills = skillMetrics.filter(
      (skill) =>
        skill.type === "technical" &&
        skill.name === designation &&
        skill.department === department
    );
    technicalSkills.forEach((skill) => {
      if (skill.skills) {
        skill.skills.forEach((skillName) => {
          skills.push({
            name: skillName,
            type: "technical",
            category: skill.name,
          });
        });
      }
    });

    return skills;
  };

  // Filter candidates based on search and filter criteria
  const getFilteredCandidates = () => {
    if (!Array.isArray(candidates)) return [];

    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.designation_name &&
          candidate.designation_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));
      const matchesJobId =
        filterJobId === "" ||
        (candidate.job_opening_id &&
          candidate.job_opening_id
            .toLowerCase()
            .includes(filterJobId.toLowerCase()));
      const matchesCandidateId =
        filterCandidateId === "" ||
        candidate.candidate_id?.toString().includes(filterCandidateId);
      const matchesDepartment =
        filterDepartment === "" ||
        (candidate.department_name || candidate.department) ===
          filterDepartment;
      const matchesDesignation =
        filterDesignation === "" ||
        (candidate.designation_name || candidate.designation) ===
          filterDesignation;

      // Determine candidate status - if not 'Hired' or 'Did Not Qualify', mark as 'Available'
      const candidateStatus =
        candidate.status === "Hired" || candidate.status === "Did Not Qualify"
          ? candidate.status
          : "Available";
      const matchesStatus =
        filterStatus === "" || candidateStatus === filterStatus;

      return (
        matchesSearch &&
        matchesJobId &&
        matchesCandidateId &&
        matchesDepartment &&
        matchesDesignation &&
        matchesStatus
      );
    });
  };

  const filteredCandidates = getFilteredCandidates();

  const totalCandidates = Array.isArray(candidates) ? candidates.length : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        [name]: value,
      };

      // If designation or department changes, reset skill ratings
      if (name === "designation" || name === "department") {
        newFormData.skillRatings = {};
      }

      return newFormData;
    });
  };

  const handleSkillRatingChange = (skillName, rating) => {
    setFormData((prev) => ({
      ...prev,
      skillRatings: {
        ...prev.skillRatings,
        [skillName]: rating,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Calculate average rating from skill ratings
      const averageRating = calculateAverageRating(formData.skillRatings);

      // Prepare candidate data for API
      // Find department and designation IDs from names
      const departmentObj = organizationalDataService
        .getDepartments()
        .find((dept) => dept.name === formData.department);
      const designationObj = organizationalDataService
        .getDesignations()
        .find((des) => des.name === formData.designation);

      if (!departmentObj) {
        throw new Error("Selected department not found");
      }
      if (!designationObj) {
        throw new Error("Selected designation not found");
      }

      // Convert dates from DD/MM/YYYY to YYYY-MM-DD format
      const convertDate = (dateString) => {
        if (!dateString) return "";
        if (dateString.includes("/")) {
          const [day, month, year] = dateString.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        }
        return dateString; // Already in correct format
      };

      const candidateData = {
        candidate_id: formData.candidateId || null, // Let backend auto-generate if empty
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        designation: designationObj.id, // Send designation ID
        department: departmentObj.id, // Send department ID
        job_opening: formData.jobId ? parseInt(formData.jobId) : null,
        experience: formData.experience,
        education: formData.education,
        location: formData.location,
        status: editingCandidate ? editingCandidate.status : "Applied",
        applied_date: convertDate(formData.appliedDate),
        last_contact: convertDate(formData.lastContact),
        skills: [
          ...(formData.softSkills || "")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
          ...(formData.technicalSkills || "")
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s),
        ],
        skill_ratings: formData.skillRatings,
        source: editingCandidate ? editingCandidate.source : "Manual Entry",
        notes: formData.notes || "",
      };

      console.log("Sending candidate data to API:", candidateData);

      if (editingCandidate) {
        // Update existing candidate
        await updateCandidate(editingCandidate.id, candidateData);
      } else {
        // Create new candidate
        await createCandidate(candidateData);
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting candidate:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      designation: "",
      department: "",
      jobId: "",
      candidateId: "",
      email: "",
      phone: "",
      location: "",
      education: "",
      experience: "",
      softSkills: "",
      technicalSkills: "",
      appliedDate: "",
      lastContact: "",
      skillRatings: {},
    });
    setShowAddForm(false);
    setEditingCandidate(null);
  };

  const handleEdit = (candidate) => {
    console.log("Edit button clicked for candidate:", candidate);

    // Handle skills - if candidate has separate softSkills/technicalSkills, use them
    // Otherwise, split the skills array (for backward compatibility)
    let softSkills = "";
    let technicalSkills = "";

    if (candidate.softSkills && candidate.technicalSkills) {
      // New format with separate skill arrays
      softSkills = Array.isArray(candidate.softSkills)
        ? candidate.softSkills.join(", ")
        : candidate.softSkills;
      technicalSkills = Array.isArray(candidate.technicalSkills)
        ? candidate.technicalSkills.join(", ")
        : candidate.technicalSkills;
    } else if (candidate.skills) {
      // Old format - split skills array
      const skillsArray = candidate.skills || [];
      const midPoint = Math.ceil(skillsArray.length / 2);
      softSkills = skillsArray.slice(0, midPoint).join(", ");
      technicalSkills = skillsArray.slice(midPoint).join(", ");
    }

    const formDataToSet = {
      name: candidate.name,
      designation: candidate.designation_name || candidate.designation,
      department: candidate.department_name || candidate.department,
      jobId: candidate.job_opening ? candidate.job_opening.toString() : "",
      candidateId: candidate.candidate_id,
      email: candidate.email,
      phone: candidate.phone,
      location: candidate.location,
      education: candidate.education,
      experience: candidate.experience,
      softSkills: softSkills,
      technicalSkills: technicalSkills,
      appliedDate: candidate.applied_date,
      lastContact: candidate.last_contact,
      skillRatings: candidate.skill_ratings || {},
      notes: candidate.notes || "",
    };

    console.log("Setting form data:", formDataToSet);
    setFormData(formDataToSet);
    setEditingCandidate(candidate);
    setShowAddForm(true);
    console.log("Form should be showing now");
  };

  const handleDelete = async (candidateId) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(candidateId);
      } catch (error) {
        console.error("Error deleting candidate:", error);
      }
    }
  };

  const handleHired = async (candidate) => {
    try {
      await updateCandidateStatus(candidate.id, "Hired");
      setOverlayMessage("Hired");
      setShowOverlay(true);
    } catch (error) {
      console.error("Error updating candidate status:", error);
    }
  };

  const handleDidNotQualify = async (candidate) => {
    try {
      await updateCandidateStatus(candidate.id, "Did Not Qualify");
      setOverlayMessage("Did Not Qualify");
      setShowOverlay(true);
    } catch (error) {
      console.error("Error updating candidate status:", error);
    }
  };

  const handleAvailable = async (candidate) => {
    try {
      await updateCandidateStatus(candidate.id, "Available");
      setOverlayMessage("Available");
      setShowOverlay(true);
    } catch (error) {
      console.error("Error updating candidate status:", error);
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
    setOverlayMessage("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidates</h1>
          <p className="text-gray-600">
            Manage job applicants and recruitment pipeline for RMG positions
          </p>
        </div>

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
            Loading candidates...
          </div>
        )}

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Job ID..."
                  value={filterJobId}
                  onChange={(e) => setFilterJobId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Candidate ID..."
                  value={filterCandidateId}
                  onChange={(e) => setFilterCandidateId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Designations</option>
                  {designations.map((designation) => (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Hired">Hired</option>
                  <option value="Did Not Qualify">Did Not Qualify</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilterJobId("");
                  setFilterCandidateId("");
                  setFilterDepartment("");
                  setFilterDesignation("");
                  setFilterStatus("");
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                Clear Filters
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Add Candidates
              </button>
            </div>
          </div>
        </div>

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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Candidates
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCandidates}
                </p>
              </div>
            </div>
          </div>

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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    candidates.filter(
                      (c) =>
                        (c.status !== "Hired" &&
                          c.status !== "Did Not Qualify") ||
                        !c.status
                    ).length
                  }
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
                <p className="text-sm font-medium text-gray-600">Hired</p>
                <p className="text-2xl font-bold text-gray-900">
                  {candidates.filter((c) => c.status === "Hired").length}
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
                <p className="text-sm font-medium text-gray-600">
                  Did Not Qualify
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    candidates.filter((c) => c.status === "Did Not Qualify")
                      .length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Candidate Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
                  </h2>
                  <button
                    onClick={resetForm}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation *
                      </label>
                      <select
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Designation</option>
                        {designations.map((designation) => (
                          <option key={designation} value={designation}>
                            {designation}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Opening *
                      </label>
                      <select
                        name="jobId"
                        value={formData.jobId}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Job Opening</option>
                        {jobOpenings.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.job_opening_id} - {job.title} ({job.department}
                            )
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Candidate ID
                      </label>
                      <input
                        type="text"
                        name="candidateId"
                        value={formData.candidateId}
                        onChange={handleInputChange}
                        placeholder="Leave empty for auto-generation (e.g., CAND-20241224-001)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to auto-generate a unique candidate ID
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone No *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education *
                      </label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience *
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 3 years, 2-4 years"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Dynamic Skills Section */}
                    {formData.designation && formData.department && (
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Skills Assessment
                        </h3>
                        <div className="space-y-6">
                          {(() => {
                            const skills = getSkillsForCandidate(
                              formData.designation,
                              formData.department
                            );
                            const softSkills = skills.filter(
                              (skill) => skill.type === "soft"
                            );
                            const technicalSkills = skills.filter(
                              (skill) => skill.type === "technical"
                            );

                            return (
                              <>
                                {/* Soft Skills */}
                                {softSkills.length > 0 && (
                                  <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-3">
                                      Soft Skills
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {softSkills.map((skill, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                          <span className="text-sm font-medium text-gray-700">
                                            {skill.name}
                                          </span>
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500">
                                              Rating:
                                            </span>
                                            <select
                                              value={
                                                formData.skillRatings[
                                                  skill.name
                                                ] || ""
                                              }
                                              onChange={(e) =>
                                                handleSkillRatingChange(
                                                  skill.name,
                                                  parseInt(e.target.value)
                                                )
                                              }
                                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                              <option value="">Select</option>
                                              <option value="1">
                                                1 - Poor
                                              </option>
                                              <option value="2">
                                                2 - Fair
                                              </option>
                                              <option value="3">
                                                3 - Good
                                              </option>
                                              <option value="4">
                                                4 - Very Good
                                              </option>
                                              <option value="5">
                                                5 - Excellent
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Technical Skills */}
                                {technicalSkills.length > 0 && (
                                  <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-3">
                                      Technical Skills
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {technicalSkills.map((skill, index) => (
                                        <div
                                          key={index}
                                          className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                          <span className="text-sm font-medium text-gray-700">
                                            {skill.name}
                                          </span>
                                          <div className="flex items-center space-x-2">
                                            <span className="text-xs text-gray-500">
                                              Rating:
                                            </span>
                                            <select
                                              value={
                                                formData.skillRatings[
                                                  skill.name
                                                ] || ""
                                              }
                                              onChange={(e) =>
                                                handleSkillRatingChange(
                                                  skill.name,
                                                  parseInt(e.target.value)
                                                )
                                              }
                                              className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                                              <option value="">Select</option>
                                              <option value="1">
                                                1 - Poor
                                              </option>
                                              <option value="2">
                                                2 - Fair
                                              </option>
                                              <option value="3">
                                                3 - Good
                                              </option>
                                              <option value="4">
                                                4 - Very Good
                                              </option>
                                              <option value="5">
                                                5 - Excellent
                                              </option>
                                            </select>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {skills.length === 0 && (
                                  <div className="text-center py-8 text-gray-500">
                                    <p>
                                      No skills defined for this designation and
                                      department combination.
                                    </p>
                                    <p className="text-sm">
                                      Please add skills in the Organizational
                                      Metrics section first.
                                    </p>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Applied Date *
                      </label>
                      <input
                        type="date"
                        name="appliedDate"
                        value={formData.appliedDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Contact *
                      </label>
                      <input
                        type="date"
                        name="lastContact"
                        value={formData.lastContact}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                      {editingCandidate ? "Update Candidate" : "Add Candidate"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Candidates List */}
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => {
            // Ensure candidate has all required fields with defaults
            const safeCandidate = {
              id: candidate.id || Math.random(),
              name: candidate.name || "",
              email: candidate.email || "",
              phone: candidate.phone || "",
              designation: candidate.designation || "",
              designation_name:
                candidate.designation_name || candidate.designation || "",
              department: candidate.department || "",
              department_name:
                candidate.department_name || candidate.department || "",
              job_opening: candidate.job_opening || "",
              job_opening_id:
                candidate.job_opening_id || candidate.jobOpeningId || "",
              skills: candidate.skills || [],
              softSkills: candidate.softSkills || [],
              technicalSkills: candidate.technicalSkills || [],
              skillRatings: candidate.skillRatings || {},
              experience: candidate.experience || "",
              education: candidate.education || "",
              resume: candidate.resume || "",
              status: candidate.status || "Applied",
              rating: candidate.rating || candidate.average_rating || 0,
              notes: candidate.notes || "",
              applied_date:
                candidate.applied_date || candidate.appliedDate || "",
              created_at: candidate.created_at || "",
              updated_at: candidate.updated_at || "",
            };
            return (
              <div
                key={safeCandidate.id}
                className="bg-white rounded-lg shadow p-6 relative">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {safeCandidate.name} -{" "}
                          {safeCandidate.designation_name ||
                            safeCandidate.designation}{" "}
                          -{" "}
                          {safeCandidate.department_name ||
                            safeCandidate.department}
                        </h3>

                        {/* Status Flag - Middle of Card */}
                        {(() => {
                          const candidateStatus =
                            safeCandidate.status === "Hired" ||
                            safeCandidate.status === "Did Not Qualify"
                              ? safeCandidate.status
                              : "Available";

                          if (candidateStatus === "Hired") {
                            return (
                              <div className="flex justify-center items-center my-4">
                                <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform rotate-2">
                                  <span className="font-bold text-lg">
                                    HIRED
                                  </span>
                                </div>
                              </div>
                            );
                          } else if (candidateStatus === "Did Not Qualify") {
                            return (
                              <div className="flex justify-center items-center my-4">
                                <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform rotate-2">
                                  <span className="font-bold text-lg">
                                    DID NOT QUALIFY
                                  </span>
                                </div>
                              </div>
                            );
                          } else if (candidateStatus === "Available") {
                            return (
                              <div className="flex justify-center items-center my-4">
                                <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg transform rotate-2">
                                  <span className="font-bold text-lg">
                                    AVAILABLE
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Candidate ID
                            </p>
                            <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded border">
                              {safeCandidate.candidate_id}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Job ID
                            </p>
                            <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded border">
                              {safeCandidate.job_opening_id || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              Experience
                            </p>
                            <p className="text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded border">
                              {safeCandidate.experience}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <span className="text-sm text-gray-600 mr-2">
                            Average Rating:
                          </span>
                          <span className="text-lg font-bold text-orange-600">
                            {safeCandidate.rating ||
                              safeCandidate.average_rating ||
                              0}
                            /5
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Applied:{" "}
                          {formatDateToDDMMYYYY(safeCandidate.applied_date)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Email
                        </p>
                        <p className="text-gray-900">{safeCandidate.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Phone
                        </p>
                        <p className="text-gray-900">{safeCandidate.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Location
                        </p>
                        <p className="text-gray-900">
                          {safeCandidate.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Education
                        </p>
                        <p className="text-gray-900">
                          {safeCandidate.education}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {(safeCandidate.skills || [])
                              .slice(
                                0,
                                Math.ceil(
                                  (safeCandidate.skills || []).length / 2
                                )
                              )
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {(safeCandidate.skills || [])
                              .slice(
                                Math.ceil(
                                  (safeCandidate.skills || []).length / 2
                                )
                              )
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>

                      {/* Skill Ratings Display */}
                      {safeCandidate.skillRatings &&
                        Object.keys(safeCandidate.skillRatings).length > 0 && (
                          <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Soft Skills Ratings Column */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                                  <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  </div>
                                  Soft Skill Ratings
                                </h4>
                                <div className="space-y-2">
                                  {(() => {
                                    const softSkills = getSkillsForCandidate(
                                      safeCandidate.designation,
                                      safeCandidate.department
                                    ).filter((skill) => skill.type === "soft");
                                    return softSkills.map((skill) => {
                                      const rating =
                                        safeCandidate.skillRatings[
                                          skill.name
                                        ] || 0;
                                      return (
                                        <div
                                          key={skill.name}
                                          className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                                          <span className="text-sm text-gray-700">
                                            {skill.name}
                                          </span>
                                          <div className="flex items-center space-x-1">
                                            <span className="text-sm font-medium text-blue-600">
                                              {rating}/5
                                            </span>
                                            <div className="flex space-x-1">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                  key={star}
                                                  className={`w-3 h-3 ${
                                                    star <= rating
                                                      ? "text-blue-400"
                                                      : "text-gray-300"
                                                  }`}
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20">
                                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>

                              {/* Technical Skills Ratings Column */}
                              <div>
                                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  </div>
                                  Technical Skill Ratings
                                </h4>
                                <div className="space-y-2">
                                  {(() => {
                                    const technicalSkills =
                                      getSkillsForCandidate(
                                        safeCandidate.designation,
                                        safeCandidate.department
                                      ).filter(
                                        (skill) => skill.type === "technical"
                                      );
                                    return technicalSkills.map((skill) => {
                                      const rating =
                                        safeCandidate.skillRatings[
                                          skill.name
                                        ] || 0;
                                      return (
                                        <div
                                          key={skill.name}
                                          className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                          <span className="text-sm text-gray-700">
                                            {skill.name}
                                          </span>
                                          <div className="flex items-center space-x-1">
                                            <span className="text-sm font-medium text-green-600">
                                              {rating}/5
                                            </span>
                                            <div className="flex space-x-1">
                                              {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                  key={star}
                                                  className={`w-3 h-3 ${
                                                    star <= rating
                                                      ? "text-green-400"
                                                      : "text-gray-300"
                                                  }`}
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20">
                                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    });
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Notes:
                      </p>
                      <p className="text-gray-700">{safeCandidate.notes}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Last Contact:</span>{" "}
                        {formatDateToDDMMYYYY(safeCandidate.last_contact)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEdit(candidate)}
                          className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(safeCandidate.id)}
                          className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Delete
                        </button>
                        <button
                          onClick={() => handleHired(candidate)}
                          className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-md hover:from-green-500 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Hired
                        </button>
                        <button
                          onClick={() => handleDidNotQualify(candidate)}
                          className="px-4 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-md hover:from-red-500 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Did Not Qualify
                        </button>
                        <button
                          onClick={() => handleAvailable(candidate)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Available
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCandidates.length === 0 && (
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No candidates found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Overlay for status messages */}
        {showOverlay && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="mb-4">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {overlayMessage}
                  </h3>
                  <p className="text-gray-600">
                    Candidate status has been updated successfully.
                  </p>
                </div>
                <button
                  onClick={closeOverlay}
                  className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
