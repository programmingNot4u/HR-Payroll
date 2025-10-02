import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Package,
  Search,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import assetService from "../../services/assetService";
import { formatDateToDDMMYYYY } from "../../utils/dateUtils";

const AssetTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [maintenanceHistory, setMaintenanceHistory] = useState([]);
  const [assetHistory, setAssetHistory] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Update current time every minute for real-time asset age calculation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await assetService.searchAssets(query);
      setSearchResults(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching assets:", error);
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAssetSelect = async (asset) => {
    setSearchTerm(`${asset.id} - ${asset.name}`);
    setShowSuggestions(false);

    // Load complete asset history including assignments, returns, and maintenance
    try {
      const history = await assetService.getAssetHistory(asset.id);
      setAssetHistory(history);

      // Update selectedAsset with complete data from history (includes all purchase info)
      setSelectedAsset(history.asset);

      // Transform maintenance data from snake_case to camelCase
      const transformedMaintenance = (history.maintenance || []).map(
        (maintenance) => ({
          ...maintenance,
          maintenanceProvider: maintenance.maintenance_provider,
          scheduledDate: maintenance.scheduled_date,
          completedDate: maintenance.completed_date,
          description: maintenance.description,
          cost: maintenance.cost,
          notes: maintenance.notes,
          status: maintenance.status,
          id: maintenance.id,
        })
      );

      setMaintenanceHistory(transformedMaintenance);
    } catch (error) {
      console.error("Error loading asset history:", error);
      setAssetHistory(null);
      setMaintenanceHistory([]);
      setSelectedAsset(asset); // Fallback to search result if history fails
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedAsset(null);
    setShowSuggestions(false);
  };

  const calculateAssetAge = (purchaseDate) => {
    if (!purchaseDate) return "Unknown";

    let purchase;
    // Handle DD/MM/YYYY format
    if (purchaseDate.includes("/")) {
      const parts = purchaseDate.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        purchase = new Date(year, month, day);
      } else {
        purchase = new Date(purchaseDate);
      }
    } else {
      purchase = new Date(purchaseDate);
    }

    // Check if date is valid
    if (isNaN(purchase.getTime())) return "Invalid Date";

    const now = currentTime; // Use currentTime state for real-time updates
    const diffTime = Math.abs(now - purchase);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? "s" : ""} ${
        remainingMonths > 0
          ? remainingMonths + " month" + (remainingMonths > 1 ? "s" : "")
          : ""
      }`;
    }
  };

  const calculateTotalUsageTime = (assignmentHistory) => {
    if (!assignmentHistory || assignmentHistory.length === 0) return "0 days";

    let totalDays = 0;
    assignmentHistory.forEach((assignment) => {
      const startDate = new Date(assignment.assignmentDate);
      const endDate = assignment.returnDate
        ? new Date(assignment.returnDate)
        : new Date();
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      totalDays += diffDays;
    });

    if (totalDays < 30) {
      return `${totalDays} days`;
    } else if (totalDays < 365) {
      const months = Math.floor(totalDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(totalDays / 365);
      const remainingMonths = Math.floor((totalDays % 365) / 30);
      return `${years} year${years > 1 ? "s" : ""} ${
        remainingMonths > 0
          ? remainingMonths + " month" + (remainingMonths > 1 ? "s" : "")
          : ""
      }`;
    }
  };

  const calculateUsageDuration = (assignment) => {
    if (!assignment.assignment_date) return "Unknown";

    // Parse assignment date with proper format handling
    let startDate;
    if (assignment.assignment_date.includes("/")) {
      // Handle DD/MM/YYYY or MM/DD/YYYY format
      const parts = assignment.assignment_date.split("/");
      if (parts.length === 3) {
        // Check if it's DD/MM/YYYY (day <= 12) or MM/DD/YYYY (month > 12)
        const firstPart = parseInt(parts[0], 10);
        const secondPart = parseInt(parts[1], 10);
        if (firstPart > 12) {
          // DD/MM/YYYY format
          const day = firstPart;
          const month = secondPart - 1; // Month is 0-indexed
          const year = parseInt(parts[2], 10);
          startDate = new Date(year, month, day);
        } else if (secondPart > 12) {
          // MM/DD/YYYY format
          const month = firstPart - 1; // Month is 0-indexed
          const day = secondPart;
          const year = parseInt(parts[2], 10);
          startDate = new Date(year, month, day);
        } else {
          // Ambiguous case, try DD/MM/YYYY first
          const day = firstPart;
          const month = secondPart - 1;
          const year = parseInt(parts[2], 10);
          startDate = new Date(year, month, day);
        }
      } else {
        startDate = new Date(assignment.assignment_date);
      }
    } else {
      startDate = new Date(assignment.assignment_date);
    }

    // Parse return date with proper format handling
    let endDate;
    if (assignment.return_date) {
      if (assignment.return_date.includes("/")) {
        // Handle DD/MM/YYYY or MM/DD/YYYY format
        const parts = assignment.return_date.split("/");
        if (parts.length === 3) {
          // Check if it's DD/MM/YYYY (day <= 12) or MM/DD/YYYY (month > 12)
          const firstPart = parseInt(parts[0], 10);
          const secondPart = parseInt(parts[1], 10);
          if (firstPart > 12) {
            // DD/MM/YYYY format
            const day = firstPart;
            const month = secondPart - 1; // Month is 0-indexed
            const year = parseInt(parts[2], 10);
            endDate = new Date(year, month, day);
          } else if (secondPart > 12) {
            // MM/DD/YYYY format
            const month = firstPart - 1; // Month is 0-indexed
            const day = secondPart;
            const year = parseInt(parts[2], 10);
            endDate = new Date(year, month, day);
          } else {
            // Ambiguous case, try DD/MM/YYYY first
            const day = firstPart;
            const month = secondPart - 1;
            const year = parseInt(parts[2], 10);
            endDate = new Date(year, month, day);
          }
        } else {
          endDate = new Date(assignment.return_date);
        }
      } else {
        endDate = new Date(assignment.return_date);
      }
    } else {
      endDate = new Date(); // Current date for ongoing assignments
    }

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
      return "Invalid Date";

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Same day";
    } else if (diffDays === 1) {
      return "1 day";
    } else if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      const remainingDays = diffDays % 30;
      return `${months} month${months > 1 ? "s" : ""}${
        remainingDays > 0
          ? ` ${remainingDays} day${remainingDays > 1 ? "s" : ""}`
          : ""
      }`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      const months = Math.floor(remainingDays / 30);
      return `${years} year${years > 1 ? "s" : ""}${
        months > 0 ? ` ${months} month${months > 1 ? "s" : ""}` : ""
      }`;
    }
  };

  const getMaintenanceCount = () => {
    // Use actual maintenance history count from state
    return maintenanceHistory ? maintenanceHistory.length : 0;
  };

  const formatDuration = (days) => {
    if (days === 0) return "today";

    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30.44);
    const remainingDays = Math.floor(days % 30.44);

    const parts = [];
    if (years > 0) {
      parts.push(`${years} year${years > 1 ? "s" : ""}`);
    }
    if (months > 0) {
      parts.push(`${months} month${months > 1 ? "s" : ""}`);
    }
    if (remainingDays > 0) {
      parts.push(`${remainingDays} day${remainingDays > 1 ? "s" : ""}`);
    }

    return parts.join(", ");
  };

  const calculateWarrantyStatus = (purchaseDate, warrantyPeriod) => {
    if (!purchaseDate || !warrantyPeriod) {
      return {
        status: "Unknown",
        message: "Warranty information not available",
      };
    }

    try {
      // Parse purchase date
      const purchase = new Date(purchaseDate);
      if (isNaN(purchase.getTime())) {
        return { status: "Unknown", message: "Invalid purchase date" };
      }

      // Parse warranty period (expecting format like "2 years", "24 months", "730 days", etc.)
      const warrantyText = warrantyPeriod.toLowerCase().trim();
      let warrantyDays = 0;

      if (warrantyText.includes("year")) {
        const years = parseFloat(
          warrantyText.match(/(\d+(?:\.\d+)?)/)?.[1] || "0"
        );
        warrantyDays = years * 365;
      } else if (warrantyText.includes("month")) {
        const months = parseFloat(
          warrantyText.match(/(\d+(?:\.\d+)?)/)?.[1] || "0"
        );
        warrantyDays = months * 30.44; // Average days per month
      } else if (warrantyText.includes("day")) {
        warrantyDays = parseFloat(
          warrantyText.match(/(\d+(?:\.\d+)?)/)?.[1] || "0"
        );
      } else {
        // Try to parse as number (assume months)
        const number = parseFloat(
          warrantyText.match(/(\d+(?:\.\d+)?)/)?.[1] || "0"
        );
        if (number > 0) {
          warrantyDays = number * 30.44; // Assume months
        }
      }

      if (warrantyDays <= 0) {
        return { status: "Unknown", message: "Invalid warranty period format" };
      }

      // Calculate warranty end date
      const warrantyEndDate = new Date(purchase);
      warrantyEndDate.setDate(warrantyEndDate.getDate() + warrantyDays);

      const now = new Date();
      const daysUntilExpiry = Math.ceil(
        (warrantyEndDate - now) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry < 0) {
        const expiredDays = Math.abs(daysUntilExpiry);
        return {
          status: "Expired",
          message: `Expired ${formatDuration(expiredDays)} ago`,
          daysRemaining: daysUntilExpiry,
        };
      } else if (daysUntilExpiry <= 30) {
        return {
          status: "Expiring Soon",
          message: `Expires in ${formatDuration(daysUntilExpiry)}`,
          daysRemaining: daysUntilExpiry,
        };
      } else {
        return {
          status: "Active",
          message: `Expires in ${formatDuration(daysUntilExpiry)}`,
          daysRemaining: daysUntilExpiry,
        };
      }
    } catch (error) {
      return {
        status: "Unknown",
        message: "Error calculating warranty status",
      };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Assigned":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "Available":
        return <Package className="w-4 h-4 text-gray-500" />;
      case "Maintenance":
        return <Wrench className="w-4 h-4 text-yellow-500" />;
      case "Damaged":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "Retired":
        return <XCircle className="w-4 h-4 text-gray-400" />;
      case "Lost":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Available":
        return "bg-gray-100 text-gray-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Damaged":
        return "bg-red-100 text-red-800";
      case "Retired":
        return "bg-gray-100 text-gray-600";
      case "Lost":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Asset Tracker
          </h1>
          <p className="text-gray-600">
            Track comprehensive asset lifetime history and usage patterns
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by Asset ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {isSearching && (
                <div className="p-3 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                  <span className="ml-2">Searching...</span>
                </div>
              )}
              {!isSearching &&
                searchResults.length > 0 &&
                searchResults.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => handleAssetSelect(asset)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {asset.id} - {asset.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.category} • {asset.status}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{asset.value}</div>
                    </div>
                  </div>
                ))}
              {!isSearching &&
                searchResults.length === 0 &&
                searchTerm.trim().length >= 2 && (
                  <div className="p-3 text-center text-gray-500">
                    <Search className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                    <p>No assets found matching "{searchTerm}"</p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Asset Details */}
        {selectedAsset ? (
          <div className="space-y-6">
            {/* Asset Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedAsset.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      Asset ID:{" "}
                      <span className="font-medium">{selectedAsset.id}</span>
                    </span>
                    <span>•</span>
                    <span>
                      Category:{" "}
                      <span className="font-medium">
                        {selectedAsset.category}
                      </span>
                    </span>
                    <span>•</span>
                    <span>
                      Department:{" "}
                      <span className="font-medium">
                        {selectedAsset.department}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedAsset.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedAsset.status
                    )}`}>
                    {selectedAsset.status}
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Purchase Value
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {parseInt(
                      selectedAsset.value.replace(/[^\d]/g, "")
                    ).toLocaleString()}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Asset Age
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {calculateAssetAge(selectedAsset.purchase_date)}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Users Count
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {assetHistory && assetHistory.assignments
                      ? assetHistory.assignments.length
                      : 0}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Maintenance
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {getMaintenanceCount()} times
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Purchase Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Purchase Date
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedAsset.purchase_date
                      ? formatDateToDDMMYYYY(selectedAsset.purchase_date)
                      : "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Purchase Value
                  </label>
                  <p className="text-gray-900 mt-1">
                    {parseInt(
                      selectedAsset.value.replace(/[^\d]/g, "")
                    ).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Vendor
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedAsset.vendor || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    ACC Voucher
                  </label>
                  <p className="text-gray-900 mt-1">
                    {selectedAsset.acc_voucher || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Warranty Status
                  </label>
                  <div className="mt-1">
                    {selectedAsset.warranty_period ? (
                      (() => {
                        const warrantyStatus = calculateWarrantyStatus(
                          selectedAsset.purchase_date,
                          selectedAsset.warranty_period
                        );
                        return (
                          <div>
                            <p className="text-gray-900 font-medium">
                              {selectedAsset.warranty_period}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {warrantyStatus.status === "Active" && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              {warrantyStatus.status === "Expiring Soon" && (
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                              )}
                              {warrantyStatus.status === "Expired" && (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              {warrantyStatus.status === "Unknown" && (
                                <AlertCircle className="w-4 h-4 text-gray-500" />
                              )}
                              <span
                                className={`text-sm ${
                                  warrantyStatus.status === "Active"
                                    ? "text-green-600"
                                    : warrantyStatus.status === "Expiring Soon"
                                    ? "text-yellow-600"
                                    : warrantyStatus.status === "Expired"
                                    ? "text-red-600"
                                    : "text-gray-600"
                                }`}>
                                {warrantyStatus.message}
                              </span>
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* History Sections - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Usage History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Usage History
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  {assetHistory &&
                  assetHistory.assignments &&
                  assetHistory.assignments.length > 0 ? (
                    <div className="space-y-3">
                      {assetHistory.assignments.map((assignment, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900 text-sm">
                                {assignment.employee_name} (ID:{" "}
                                {assignment.employee_id})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {assignment.is_active ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Returned
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            {formatDateToDDMMYYYY(assignment.assignment_date)} -{" "}
                            {assignment.return_date
                              ? formatDateToDDMMYYYY(assignment.return_date)
                              : "Current"}
                          </div>
                          <div className="text-xs font-medium text-blue-600 mb-2">
                            Duration: {calculateUsageDuration(assignment)}
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>
                              <strong>Assigned Condition:</strong>{" "}
                              {assignment.assigned_condition || "Good"}
                            </p>
                            <p>
                              <strong>Assigned By:</strong>{" "}
                              {assignment.assigned_by || "N/A"}
                            </p>
                            {assignment.return_date && (
                              <>
                                <p>
                                  <strong>Returned Condition:</strong>{" "}
                                  {assignment.return_condition || "Good"}
                                </p>
                                <p>
                                  <strong>Returned By:</strong>{" "}
                                  {assignment.returned_by || "N/A"}
                                </p>
                                {assignment.return_reason && (
                                  <p>
                                    <strong>Return Reason:</strong>{" "}
                                    {assignment.return_reason}
                                  </p>
                                )}
                              </>
                            )}
                            {assignment.assignment_notes && (
                              <p>
                                <strong>Notes:</strong>{" "}
                                {assignment.assignment_notes}
                              </p>
                            )}
                            {assignment.return_notes && (
                              <p>
                                <strong>Return Notes:</strong>{" "}
                                {assignment.return_notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">
                        No usage history available for this asset.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Maintenance History */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Maintenance History
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  {maintenanceHistory && maintenanceHistory.length > 0 ? (
                    <div className="space-y-3">
                      {maintenanceHistory.map((maintenance, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Wrench className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900 text-sm">
                                {maintenance.maintenanceProvider}
                              </span>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                maintenance.status === "Complete"
                                  ? "bg-green-100 text-green-800"
                                  : maintenance.status === "Ongoing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : maintenance.status === "Pending"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                              {maintenance.status || "Pending"}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            <div>
                              Scheduled:{" "}
                              {formatDateToDDMMYYYY(maintenance.scheduledDate)}
                            </div>
                            {maintenance.completedDate && (
                              <div>
                                Completed:{" "}
                                {formatDateToDDMMYYYY(
                                  maintenance.completedDate
                                )}
                              </div>
                            )}
                          </div>
                          {maintenance.description && (
                            <div className="text-xs text-gray-600">
                              <strong>Description:</strong>{" "}
                              {maintenance.description}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Wrench className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">
                        No maintenance history available for this asset.
                      </p>
                      <p className="text-xs mt-2">
                        Estimated maintenance count: {getMaintenanceCount()}{" "}
                        times
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Asset Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Asset Timeline
                </h3>
                <div className="max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {/* Purchase Event */}
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium text-green-900 text-sm">
                          Asset Purchased
                        </p>
                        <p className="text-xs text-green-700">
                          {selectedAsset.purchase_date
                            ? formatDateToDDMMYYYY(selectedAsset.purchase_date)
                            : "Unknown Date"}{" "}
                          - {selectedAsset.vendor || "Unknown Vendor"}
                        </p>
                      </div>
                    </div>

                    {/* Status Changes */}
                    {selectedAsset.status === "Available" && (
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            Status: Available
                          </p>
                          <p className="text-xs text-gray-700">
                            Asset is available for assignment
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAsset.status === "Maintenance" && (
                      <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-yellow-900 text-sm">
                            Status: Under Maintenance
                          </p>
                          <p className="text-xs text-yellow-700">
                            Asset is currently being maintained
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAsset.status === "Damaged" && (
                      <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-red-900 text-sm">
                            Status: Damaged
                          </p>
                          <p className="text-xs text-red-700">
                            Asset requires repair or replacement
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAsset.status === "Lost" && (
                      <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-red-900 text-sm">
                            Status: Lost
                          </p>
                          <p className="text-xs text-red-700">
                            Asset has been reported as lost
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedAsset.status === "Retired" && (
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            Status: Retired
                          </p>
                          <p className="text-xs text-gray-700">
                            Asset has been retired from service
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Assignment History */}
                    {selectedAsset.assignmentHistory &&
                      selectedAsset.assignmentHistory.map(
                        (assignment, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="font-medium text-blue-900 text-sm">
                                Assigned to {assignment.employeeName}
                              </p>
                              <p className="text-xs text-blue-700">
                                {formatDateToDDMMYYYY(
                                  assignment.assignmentDate
                                )}{" "}
                                -{" "}
                                {assignment.returnDate
                                  ? formatDateToDDMMYYYY(assignment.returnDate)
                                  : "Current"}
                              </p>
                            </div>
                          </div>
                        )
                      )}

                    {/* Maintenance History */}
                    {maintenanceHistory &&
                      maintenanceHistory.map((maintenance, index) => (
                        <div
                          key={`maintenance-${index}`}
                          className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-orange-900 text-sm">
                              Maintenance - {maintenance.status}
                            </p>
                            <p className="text-xs text-orange-700">
                              {formatDateToDDMMYYYY(maintenance.scheduledDate)}{" "}
                              - {maintenance.maintenanceProvider}
                              {maintenance.completedDate &&
                                ` (Completed: ${formatDateToDDMMYYYY(
                                  maintenance.completedDate
                                )})`}
                            </p>
                          </div>
                        </div>
                      ))}

                    {/* Return Events */}
                    {selectedAsset.returnDate && (
                      <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-purple-900 text-sm">
                            Asset Returned
                          </p>
                          <p className="text-xs text-purple-700">
                            {formatDateToDDMMYYYY(selectedAsset.returnDate)} -{" "}
                            {selectedAsset.returnCondition || "Good"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Search for an Asset
            </h3>
            <p className="text-gray-500">
              Enter an Asset ID or Name to view its complete lifetime history
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetTracker;
