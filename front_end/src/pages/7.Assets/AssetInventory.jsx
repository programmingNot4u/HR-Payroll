import { useEffect, useState } from "react";
import assetService from "../../services/assetService";
import organizationalDataService from "../../services/organizationalDataService";
import {
  formatDateToDDMMYYYY,
  formatDateToYYYYMMDD,
  parseDate,
} from "../../utils/dateUtils";

// Custom Date Input Component for DD/MM/YYYY format
const CustomDateInput = ({
  value,
  onChange,
  required,
  className,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (value && !isTyping) {
      // Convert YYYY-MM-DD to DD/MM/YYYY for display
      const date = new Date(value);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      setDisplayValue(`${day}/${month}/${year}`);
    } else if (!value && !isTyping) {
      setDisplayValue("");
    }
  }, [value, isTyping]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);
    setIsTyping(true);

    // Auto-format as user types (DD/MM/YYYY)
    if (inputValue.length === 2 && !inputValue.includes("/")) {
      setDisplayValue(inputValue + "/");
    } else if (
      inputValue.length === 5 &&
      inputValue.charAt(2) === "/" &&
      !inputValue.substring(3).includes("/")
    ) {
      setDisplayValue(inputValue + "/");
    }
  };

  const handleBlur = () => {
    setIsTyping(false);

    // Validate and convert DD/MM/YYYY to YYYY-MM-DD
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = displayValue.match(dateRegex);

    if (match) {
      const [, day, month, year] = match;
      const date = new Date(year, month - 1, day);

      // Check if date is valid
      if (
        date.getFullYear() == year &&
        date.getMonth() == month - 1 &&
        date.getDate() == day
      ) {
        const isoDate = `${year}-${month}-${day}`;
        onChange(isoDate);
        // Update display value to ensure consistency
        setDisplayValue(`${day}/${month}/${year}`);
      } else {
        // Invalid date, reset to previous value
        if (value) {
          const date = new Date(value);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          setDisplayValue(`${day}/${month}/${year}`);
        } else {
          setDisplayValue("");
        }
      }
    } else if (displayValue === "") {
      onChange({ target: { value: "" } });
    } else {
      // Invalid format, reset to previous value
      if (value) {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        setDisplayValue(`${day}/${month}/${year}`);
      } else {
        setDisplayValue("");
      }
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder="DD/MM/YYYY"
      className={className}
      required={required}
      {...props}
    />
  );
};

const AssetInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [assignedPersonSearch, setAssignedPersonSearch] = useState("");
  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [showDoneAnimation, setShowDoneAnimation] = useState(false);
  const [animationMessage, setAnimationMessage] = useState("");
  const [editingDisposalDate, setEditingDisposalDate] = useState(null);
  const [disposalDateValue, setDisposalDateValue] = useState("");
  const [assetChoices, setAssetChoices] = useState({
    categories: [],
    statuses: [],
    conditions: [],
    maintenance_statuses: [],
  });
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    model: "",
    category: "",
    department: "",
    status: "Available",
    value: "",
    purchaseDate: "",
    depreciationRate: 20,
    vendor: "",
    accVoucher: "",
    warrantyYears: "",
    warrantyMonths: "",
    warrantyDays: "",
  });

  // Load departments from organizational data service
  useEffect(() => {
    const loadDepartments = async () => {
      setDepartmentsLoading(true);
      try {
        // First try to get from service (might be empty if not loaded yet)
        let deptData = organizationalDataService.getDepartments();

        // If no departments, try to load them
        if (!deptData || deptData.length === 0) {
          console.log("No departments found, loading from API...");
          try {
            await organizationalDataService.loadDepartments();
            deptData = organizationalDataService.getDepartments();
          } catch {
            console.log(
              "Organizational service failed, trying direct API call..."
            );
            // Fallback: direct API call
            const response = await fetch(
              "http://localhost:8000/api/departments/",
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.ok) {
              const apiData = await response.json();
              deptData = apiData.results || apiData;
            }
          }
        }

        console.log("Loaded departments:", deptData);
        setDepartments(deptData || []);
      } catch (error) {
        console.error("Error loading departments:", error);
        // Fallback to empty array
        setDepartments([]);
      } finally {
        setDepartmentsLoading(false);
      }
    };

    loadDepartments();

    // Listen for storage changes to update departments
    const handleStorageChange = () => {
      const deptData = organizationalDataService.getDepartments();
      setDepartments(deptData || []);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Load asset choices from API
  useEffect(() => {
    const loadAssetChoices = async () => {
      try {
        const choices = await assetService.getAssetChoices();
        setAssetChoices(choices);
      } catch (error) {
        console.error("Error loading asset choices:", error);
        // Fallback to hardcoded values if API fails
        setAssetChoices({
          categories: [
            "Electronics",
            "Office Equipment",
            "Furniture",
            "HVAC",
            "Security",
            "Machinery",
            "Vehicles",
          ],
          statuses: [
            "Available",
            "Assigned",
            "Maintenance",
            "Damaged",
            "Lost",
            "Retired",
          ],
          conditions: ["Good", "Need Maintenance", "Lost"],
          maintenance_statuses: ["Pending", "Ongoing", "Complete"],
        });
      }
    };

    loadAssetChoices();
  }, []);

  const [assets, setAssets] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);

  // Load assets and statistics from API
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load statistics for dashboard cards
        const stats = await assetService.getAssetStatistics();
        setStatistics(stats);

        // Load paginated assets
        const assetsData = await assetService.getPaginatedAssets(1, 10);
        setAssets(assetsData.results || []);
        setPagination({
          currentPage: assetsData.current_page || 1,
          totalPages: assetsData.total_pages || 1,
          totalCount: assetsData.count || 0,
          pageSize: 10,
        });
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const categories = ["all", ...assetChoices.categories];
  const statuses = ["all", ...assetChoices.statuses];

  const handleAddAsset = () => {
    setShowAddModal(true);
    setEditingAsset(null);
    setFormData({
      id: "",
      name: "",
      model: "",
      category: "",
      department: "",
      status: "Available",
      value: "",
      purchaseDate: "",
      depreciationRate: 20,
      vendor: "",
      accVoucher: "",
      warrantyYears: "",
      warrantyMonths: "",
      warrantyDays: "",
    });
  };

  const handleEditAsset = (asset) => {
    setShowEditModal(true);
    setEditingAsset(asset);
    setFormData({
      id: asset.id,
      name: asset.name,
      model: asset.model || "",
      category: asset.category,
      department: asset.department,
      status: asset.status,
      value: asset.value,
      purchaseDate: asset.purchase_date
        ? formatDateToYYYYMMDD(asset.purchase_date)
        : "",
      depreciationRate: asset.depreciation_rate || 20,
      vendor: asset.vendor || "",
      accVoucher: asset.acc_voucher || "",
      warrantyYears: "",
      warrantyMonths: "",
      warrantyDays: "",
    });
  };

  // Calculate warranty period from individual fields
  const calculateWarrantyPeriod = () => {
    const years = parseInt(formData.warrantyYears) || 0;
    const months = parseInt(formData.warrantyMonths) || 0;
    const days = parseInt(formData.warrantyDays) || 0;

    if (years === 0 && months === 0 && days === 0) {
      return ""; // No warranty period specified
    }

    let warrantyText = "";
    if (years > 0) warrantyText += `${years} year${years > 1 ? "s" : ""}`;
    if (months > 0)
      warrantyText += `${warrantyText ? " " : ""}${months} month${
        months > 1 ? "s" : ""
      }`;
    if (days > 0)
      warrantyText += `${warrantyText ? " " : ""}${days} day${
        days > 1 ? "s" : ""
      }`;

    return warrantyText.trim();
  };

  const handleSaveAsset = async () => {
    if (
      !formData.name ||
      !formData.category ||
      !formData.department ||
      !formData.value
    ) {
      alert(
        "Please fill in all required fields (Asset Name, Category, Department, Purchased Value)"
      );
      return;
    }

    // Check for duplicate asset ID
    if (formData.id) {
      const existingAsset = assets.find(
        (asset) => asset.id === formData.id && asset.id !== editingAsset?.id
      );
      if (existingAsset) {
        alert("Asset ID already exists. Please choose a different ID.");
        return;
      }
    }

    try {
      if (editingAsset) {
        // Update existing asset
        const updatedAsset = {
          id: formData.id,
          name: formData.name,
          model: formData.model,
          category: formData.category,
          department: formData.department,
          status: formData.status,
          value: formData.value,
          purchase_date: formData.purchaseDate || null,
          depreciation_rate:
            formData.depreciationRate !== undefined
              ? formData.depreciationRate
              : 20,
          vendor: formData.vendor,
          acc_voucher: formData.accVoucher,
          warranty_period: calculateWarrantyPeriod(),
        };

        await assetService.updateAsset(editingAsset.id, updatedAsset);

        // Reload assets
        const response = await assetService.getAllAssets();
        const assetsArray = Array.isArray(response)
          ? response
          : response.results || [];
        setAssets(assetsArray);

        setShowEditModal(false);

        // Show done animation
        showDoneAnimationWithMessage("Asset Updated Successfully!");
      } else {
        // Add new asset
        const newAssetData = {
          id: formData.id,
          name: formData.name,
          model: formData.model,
          category: formData.category,
          department: formData.department,
          status: formData.status,
          value: formData.value,
          purchase_date: formData.purchaseDate || null,
          depreciation_rate:
            formData.depreciationRate !== undefined
              ? formData.depreciationRate
              : 20,
          vendor: formData.vendor,
          acc_voucher: formData.accVoucher,
          warranty_period: calculateWarrantyPeriod(),
        };

        // Remove empty ID to trigger auto-generation
        if (!newAssetData.id || newAssetData.id.trim() === "") {
          delete newAssetData.id;
        }

        await assetService.addAsset(newAssetData);

        // Reload assets
        const response = await assetService.getAllAssets();
        const assetsArray = Array.isArray(response)
          ? response
          : response.results || [];
        setAssets(assetsArray);

        setShowAddModal(false);

        // Show done animation
        showDoneAnimationWithMessage("Asset Added Successfully!");
      }

      // Reset form
      setFormData({
        id: "",
        name: "",
        category: "",
        department: "",
        status: "Available",
        value: "",
        purchaseDate: "",
        depreciationRate: 20,
        warrantyYears: "",
        warrantyMonths: "",
        warrantyDays: "",
      });
      setEditingAsset(null);
    } catch (error) {
      console.error("Error saving asset:", error);
      alert(`Error saving asset: ${error.message}`);
    }
  };

  const showDoneAnimationWithMessage = (message) => {
    setAnimationMessage(message);
    setShowDoneAnimation(true);
    setTimeout(() => {
      setShowDoneAnimation(false);
      setAnimationMessage("");
    }, 100);
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingAsset(null);
    setFormData({
      id: "",
      name: "",
      model: "",
      category: "",
      department: "",
      status: "Available",
      value: "",
      purchaseDate: "",
      depreciationRate: 20,
      vendor: "",
      accVoucher: "",
      warrantyYears: "",
      warrantyMonths: "",
      warrantyDays: "",
    });
  };

  const handleDeleteAsset = async (assetId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this asset? This action cannot be undone."
      )
    ) {
      try {
        await assetService.deleteAsset(assetId);

        // Reload assets
        const response = await assetService.getAllAssets();
        const assetsArray = Array.isArray(response)
          ? response
          : response.results || [];
        setAssets(assetsArray);

        // Show done animation
        showDoneAnimationWithMessage("Asset Deleted Successfully!");
      } catch (error) {
        console.error("Error deleting asset:", error);
        alert(`Error deleting asset: ${error.message}`);
      }
    }
  };

  // Assets are now filtered by API, no local filtering needed
  const filteredAssets = assets || [];

  // Calculate asset age in years for depreciation calculation
  const calculateAssetAgeInYears = (purchaseDate, endDate = null) => {
    if (!purchaseDate || purchaseDate.trim() === "") return 0;

    const purchase = parseDate(purchaseDate);
    if (!purchase || isNaN(purchase.getTime())) return 0;

    const end = endDate || new Date();
    const diffInMs = end - purchase;

    // Check if purchase date is in the future
    if (diffInMs < 0) return 0;

    const yearsDiff = diffInMs / (1000 * 60 * 60 * 24 * 365.25);
    return Math.max(0, yearsDiff);
  };

  // Calculate asset age in user-friendly format
  const calculateAssetAge = (
    purchaseDate,
    assetStatus = null,
    disposalDate = null
  ) => {
    if (!purchaseDate || purchaseDate.trim() === "") return "Unknown";

    const purchase = parseDate(purchaseDate);
    if (!purchase || isNaN(purchase.getTime())) {
      console.warn("Invalid purchase date for age calculation:", purchaseDate);
      return "Invalid Date";
    }

    // For lost, damaged, or retired assets, use disposal date if available
    let endDate = new Date();
    if (
      assetStatus &&
      ["Lost", "Damaged", "Retired"].includes(assetStatus) &&
      disposalDate
    ) {
      // Parse disposal date (could be DD/MM/YYYY or YYYY-MM-DD format)
      let parsedDisposalDate;
      if (disposalDate.includes("/")) {
        // DD/MM/YYYY format
        const [day, month, year] = disposalDate.split("/");
        parsedDisposalDate = new Date(year, month - 1, day);
      } else {
        // YYYY-MM-DD format
        parsedDisposalDate = new Date(disposalDate);
      }

      if (!isNaN(parsedDisposalDate.getTime())) {
        endDate = parsedDisposalDate;
      }
    }

    const diffInMs = endDate - purchase;

    // Check if purchase date is in the future
    if (diffInMs < 0) {
      return "Future Date";
    }

    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInMonths = Math.floor(diffInDays / 30.44); // Average days per month
    const diffInYears = Math.floor(diffInDays / 365.25);

    if (diffInYears > 0) {
      const remainingMonths = Math.floor((diffInDays % 365.25) / 30.44);
      if (remainingMonths > 0) {
        return `${diffInYears} Year${
          diffInYears > 1 ? "s" : ""
        } ${remainingMonths} Month${remainingMonths > 1 ? "s" : ""}`;
      }
      return `${diffInYears} Year${diffInYears > 1 ? "s" : ""}`;
    } else if (diffInMonths > 0) {
      const remainingDays = diffInDays % 30.44;
      if (remainingDays > 0) {
        return `${diffInMonths} Month${
          diffInMonths > 1 ? "s" : ""
        } ${Math.floor(remainingDays)} Day${
          Math.floor(remainingDays) > 1 ? "s" : ""
        }`;
      }
      return `${diffInMonths} Month${diffInMonths > 1 ? "s" : ""}`;
    } else if (diffInDays > 0) {
      return `${diffInDays} Day${diffInDays > 1 ? "s" : ""}`;
    } else {
      return "Today";
    }
  };

  // Calculate depreciation with annual depreciation rate based on asset age
  const calculateDepreciation = (
    purchaseDate,
    purchaseValue,
    annualDepreciationRate = 20,
    assetStatus = null,
    disposalDate = null
  ) => {
    if (!purchaseDate || !purchaseValue || purchaseValue <= 0) {
      return {
        depreciation: 0,
        depreciatedValue: purchaseValue || 0,
        ageInYears: 0,
      };
    }

    // For lost, damaged, or retired assets, use disposal date if available
    let endDate = null;
    if (
      assetStatus &&
      ["Lost", "Damaged", "Retired"].includes(assetStatus) &&
      disposalDate
    ) {
      // Parse disposal date (could be DD/MM/YYYY or YYYY-MM-DD format)
      let parsedDisposalDate;
      if (disposalDate.includes("/")) {
        // DD/MM/YYYY format
        const [day, month, year] = disposalDate.split("/");
        parsedDisposalDate = new Date(year, month - 1, day);
      } else {
        // YYYY-MM-DD format
        parsedDisposalDate = new Date(disposalDate);
      }

      if (!isNaN(parsedDisposalDate.getTime())) {
        endDate = parsedDisposalDate;
      }
    }

    // Calculate asset age in years from purchase date to end date (disposal or current)
    const ageInYears = calculateAssetAgeInYears(purchaseDate, endDate);

    // If no age or invalid date, no depreciation
    if (ageInYears <= 0) {
      return {
        depreciation: 0,
        depreciatedValue: purchaseValue,
        ageInYears: 0,
      };
    }

    // Convert annual percentage to decimal
    const annualRate = Math.max(0, Math.min(100, annualDepreciationRate)) / 100;

    // Calculate total depreciation: Amount × Annual Rate × Years
    const totalDepreciation = purchaseValue * annualRate * ageInYears;

    // Allow depreciation up to 100% of original value (book value can reach 0)
    const maxDepreciation = purchaseValue;
    const cappedDepreciation = Math.min(totalDepreciation, maxDepreciation);

    // Calculate book value: Amount - Depreciation (can reach 0)
    const depreciatedValue = Math.max(purchaseValue - cappedDepreciation, 0); // Minimum 0 (can reach 0)

    // For display purposes, show the actual depreciation percentage (up to 100%)
    const displayDepreciation = Math.round(
      (cappedDepreciation / purchaseValue) * 100
    );

    return {
      depreciation: displayDepreciation,
      depreciatedValue: Math.round(depreciatedValue),
      ageInYears: Math.round(ageInYears * 100) / 100, // Round to 2 decimal places
    };
  };

  // Calculate total amount (purchased value) - now handled by API statistics
  // const totalAmount = assets.reduce((total, asset) => {
  //   const value = parseInt(asset.value.replace(/[^\d]/g, ""));
  //   return total + value;
  // }, 0);

  // Calculate total book value (based on amount and depreciation rate) - now handled by API statistics
  // const totalBookValue = assets
  //   .filter((asset) => !["Lost", "Damaged"].includes(asset.status))
  //   .reduce((total, asset) => {
  //     const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
  //     const amount = purchaseValue;
  //     const depreciationRate = asset.depreciation_rate || 20;
  //     const depreciation = calculateDepreciation(
  //       asset.purchase_date,
  //       amount,
  //       depreciationRate,
  //       asset.status,
  //       asset.disposal_date
  //     );
  //     return total + depreciation.depreciatedValue;
  //   }, 0);

  // Calculate search values based on selected category filter
  const getSearchValues = () => {
    const assetsToCalculate =
      selectedCategory === "all"
        ? filteredAssets
        : filteredAssets.filter((asset) => asset.category === selectedCategory);

    return assetsToCalculate.reduce(
      (totals, asset) => {
        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
        const amount = purchaseValue;
        const depreciationRate = asset.depreciation_rate || 20;
        const depreciation = calculateDepreciation(
          asset.purchase_date,
          amount,
          depreciationRate,
          asset.status,
          asset.disposal_date
        );

        // Only include book value for assets that are not lost or damaged
        const bookValue = !["Lost", "Damaged"].includes(asset.status)
          ? depreciation.depreciatedValue
          : 0;

        return {
          amount: totals.amount + amount,
          bookValue: totals.bookValue + bookValue,
        };
      },
      {
        amount: 0,
        bookValue: 0,
      }
    );
  };

  // Calculate purchased value by status
  const getPurchasedValueByStatus = (status) => {
    return assets
      .filter((asset) => asset.status === status)
      .reduce((total, asset) => {
        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
        const amount = purchaseValue;
        return total + amount;
      }, 0);
  };

  // Calculate book value by status
  // Exclude lost and damaged assets from book value calculations
  const getBookValueByStatus = (status) => {
    return assets
      .filter((asset) => asset.status === status)
      .reduce((total, asset) => {
        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
        const amount = purchaseValue;
        const depreciationRate = asset.depreciation_rate || 20;
        const depreciation = calculateDepreciation(
          asset.purchase_date,
          amount,
          depreciationRate,
          asset.status,
          asset.disposal_date
        );

        // Only include book value for assets that are not lost or damaged
        return (
          total +
          (!["Lost", "Damaged"].includes(asset.status)
            ? depreciation.depreciatedValue
            : 0)
        );
      }, 0);
  };

  // Calculate loss on lost assets (book value of lost assets)
  const getLossOnLostAssets = () => {
    return assets
      .filter((asset) => asset.status === "Lost")
      .reduce((total, asset) => {
        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
        const amount = purchaseValue;
        const depreciationRate = asset.depreciation_rate || 20;
        const depreciation = calculateDepreciation(
          asset.purchase_date,
          amount,
          depreciationRate,
          asset.status,
          asset.disposal_date
        );
        return total + depreciation.depreciatedValue;
      }, 0);
  };

  // Calculate loss on damaged assets (book value of damaged assets)
  const getLossOnDamagedAssets = () => {
    return assets
      .filter((asset) => asset.status === "Damaged")
      .reduce((total, asset) => {
        const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
        const amount = purchaseValue;
        const depreciationRate = asset.depreciation_rate || 20;
        const depreciation = calculateDepreciation(
          asset.purchase_date,
          amount,
          depreciationRate,
          asset.status,
          asset.disposal_date
        );
        return total + depreciation.depreciatedValue;
      }, 0);
  };

  // Calculate purchased values by status (Available + Assigned only)
  const activeItemsPurchasedValue = assets
    .filter((asset) => ["Available", "Assigned"].includes(asset.status))
    .reduce((total, asset) => {
      const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
      const amount = purchaseValue;
      return total + amount;
    }, 0);

  // Active Items Value includes only Available and Assigned items
  // Exclude lost and damaged assets from book value calculations
  const activeItemsValue = assets
    .filter((asset) => ["Available", "Assigned"].includes(asset.status))
    .reduce((total, asset) => {
      const purchaseValue = parseInt(asset.value.replace(/[^\d]/g, ""));
      const amount = purchaseValue;
      const depreciationRate = asset.depreciation_rate || 20;
      const depreciation = calculateDepreciation(
        asset.purchase_date,
        amount,
        depreciationRate,
        asset.status,
        asset.disposal_date
      );

      // Only include book value for assets that are not lost or damaged
      return (
        total +
        (!["Lost", "Damaged"].includes(asset.status)
          ? depreciation.depreciatedValue
          : 0)
      );
    }, 0);

  // Print function for asset list
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const currentDate = new Date().toLocaleDateString("en-GB");

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Inventory Report - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #333; margin-bottom: 5px; }
            .header p { color: #666; margin: 0; }
            .summary { display: flex; justify-content: space-around; margin-bottom: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .summary-item { text-align: center; }
            .summary-item .value { font-size: 18px; font-weight: bold; color: #333; }
            .summary-item .label { font-size: 12px; color: #666; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .status-available { background-color: #d4edda; color: #155724; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
            .status-assigned { background-color: #cce5ff; color: #004085; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
            .status-maintenance { background-color: #fff3cd; color: #856404; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
            .status-retired { background-color: #e2e3e5; color: #383d41; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
            .status-lost { background-color: #f8d7da; color: #721c24; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
            .status-damaged { background-color: #ffeaa7; color: #856404; padding: 2px 6px; border-radius: 3px; font-size: 10px; }
            .footer { margin-top: 30px; text-align: center; font-size: 10px; color: #666; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Asset Inventory Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          
          <div class="summary">
            <div class="summary-item">
              <div class="value">${filteredAssets.length}</div>
              <div class="label">Filtered Assets</div>
            </div>
            <div class="summary-item">
              <div class="value">${filteredAssets
                .reduce((total, asset) => {
                  const value = parseInt(asset.value.replace(/[^\d]/g, ""));
                  return total + value;
                }, 0)
                .toLocaleString()}</div>
              <div class="label">Total Value</div>
            </div>
            <div class="summary-item">
              <div class="value">${filteredAssets
                .filter((asset) => !["Lost", "Damaged"].includes(asset.status))
                .reduce((total, asset) => {
                  const purchaseValue = parseInt(
                    asset.value.replace(/[^\d]/g, "")
                  );
                  const quantity = asset.quantity || 1;
                  const amount = purchaseValue * quantity;
                  const depreciationRate = asset.depreciation_rate || 20;
                  const depreciation = calculateDepreciation(
                    asset.purchase_date,
                    amount,
                    depreciationRate,
                    asset.status,
                    asset.disposal_date
                  );
                  return total + depreciation.depreciatedValue;
                }, 0)
                .toLocaleString()}</div>
              <div class="label">Book Value</div>
            </div>
            <div class="summary-item">
              <div class="value">${filteredAssets
                .filter((asset) => asset.status === "Lost")
                .reduce((total, asset) => {
                  const purchaseValue = parseInt(
                    asset.value.replace(/[^\d]/g, "")
                  );
                  const quantity = asset.quantity || 1;
                  const amount = purchaseValue * quantity;
                  const depreciationRate = asset.depreciation_rate || 20;
                  const depreciation = calculateDepreciation(
                    asset.purchase_date,
                    amount,
                    depreciationRate,
                    asset.status,
                    asset.disposal_date
                  );
                  return total + depreciation.depreciatedValue;
                }, 0)
                .toLocaleString()}</div>
              <div class="label">Loss on Lost Asset</div>
            </div>
            <div class="summary-item">
              <div class="value">${filteredAssets
                .filter((asset) => asset.status === "Damaged")
                .reduce((total, asset) => {
                  const purchaseValue = parseInt(
                    asset.value.replace(/[^\d]/g, "")
                  );
                  const quantity = asset.quantity || 1;
                  const amount = purchaseValue * quantity;
                  const depreciationRate = asset.depreciation_rate || 20;
                  const depreciation = calculateDepreciation(
                    asset.purchase_date,
                    amount,
                    depreciationRate,
                    asset.status,
                    asset.disposal_date
                  );
                  return total + depreciation.depreciatedValue;
                }, 0)
                .toLocaleString()}</div>
              <div class="label">Loss on Damaged Asset</div>
            </div>
            <div class="summary-item">
              <div class="value">${filteredAssets
                .filter((asset) =>
                  ["Available", "Assigned"].includes(asset.status)
                )
                .reduce((total, asset) => {
                  const purchaseValue = parseInt(
                    asset.value.replace(/[^\d]/g, "")
                  );
                  const quantity = asset.quantity || 1;
                  const amount = purchaseValue * quantity;
                  const depreciationRate = asset.depreciation_rate || 20;
                  const depreciation = calculateDepreciation(
                    asset.purchase_date,
                    amount,
                    depreciationRate,
                    asset.status,
                    asset.disposal_date
                  );
                  return total + depreciation.depreciatedValue;
                }, 0)
                .toLocaleString()}</div>
              <div class="label">Active Items Value</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Asset Name</th>
                <th>Category</th>
                <th>Department</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Purchase Date</th>
                <th>Age</th>
                <th>Purchase Value</th>
                <th>Book Value</th>
                <th>Depreciation</th>
                <th>Disposal Date</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAssets
                .map((asset) => {
                  const purchaseValue = parseInt(
                    asset.value.replace(/[^\d]/g, "")
                  );
                  const quantity = asset.quantity || 1;
                  const amount = purchaseValue * quantity;
                  const depreciationRate = asset.depreciation_rate || 20;
                  const depreciation = calculateDepreciation(
                    asset.purchase_date,
                    amount,
                    depreciationRate,
                    asset.status,
                    asset.disposal_date
                  );

                  const getStatusClass = (status) => {
                    switch (status) {
                      case "Available":
                        return "status-available";
                      case "Assigned":
                        return "status-assigned";
                      case "Maintenance":
                        return "status-maintenance";
                      case "Retired":
                        return "status-retired";
                      case "Lost":
                        return "status-lost";
                      case "Damaged":
                        return "status-damaged";
                      default:
                        return "status-available";
                    }
                  };

                  return `
                  <tr>
                    <td>${asset.id}</td>
                    <td>${asset.name}</td>
                    <td>${asset.category}</td>
                    <td>${asset.department}</td>
                    <td><span class="${getStatusClass(asset.status)}">${
                    asset.status
                  }</span></td>
                    <td>${asset.assigned_to || "-"}</td>
                    <td>${
                      asset.purchase_date
                        ? formatDateToDDMMYYYY(asset.purchase_date)
                        : "-"
                    }</td>
                    <td>${calculateAssetAge(
                      asset.purchase_date,
                      asset.status,
                      asset.disposal_date
                    )}</td>
                    <td>${amount.toLocaleString()}</td>
                    <td>${
                      ["Lost", "Damaged"].includes(asset.status)
                        ? "Loss on Asset"
                        : depreciation.depreciatedValue.toLocaleString()
                    }</td>
                    <td>${depreciation.depreciation}%</td>
                    <td>${
                      (asset.status === "Retired" || asset.status === "Lost") &&
                      asset.disposal_date &&
                      typeof asset.disposal_date === "string"
                        ? formatDateToDDMMYYYY(asset.disposal_date)
                        : "-"
                    }</td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report was generated from the HR-Payroll Asset Management System</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Handle disposal date editing
  const handleEditDisposalDate = (asset) => {
    setEditingDisposalDate(asset.id);

    // Convert DD/MM/YYYY to YYYY-MM-DD for CustomDateInput
    let dateForInput = "";
    if (asset.disposal_date && typeof asset.disposal_date === "string") {
      if (asset.disposal_date.includes("/")) {
        // DD/MM/YYYY format - convert to YYYY-MM-DD
        const [day, month, year] = asset.disposal_date.split("/");
        dateForInput = `${year}-${month}-${day}`;
      } else {
        // Already in YYYY-MM-DD format
        dateForInput = asset.disposal_date;
      }
    }

    setDisposalDateValue(dateForInput);
  };

  const handleSaveDisposalDate = async (assetId) => {
    try {
      const asset = assets.find((a) => a.id === assetId);
      if (!asset) return;

      // Convert YYYY-MM-DD to DD/MM/YYYY for storage
      let disposalDateForStorage = disposalDateValue;
      if (disposalDateValue && disposalDateValue.includes("-")) {
        const [year, month, day] = disposalDateValue.split("-");
        disposalDateForStorage = `${day}/${month}/${year}`;
      }

      const updatedAsset = {
        ...asset,
        disposal_date: disposalDateForStorage,
      };

      await assetService.updateAsset(assetId, updatedAsset);

      // Update local state
      setAssets((prev) =>
        prev.map((a) => (a.id === assetId ? updatedAsset : a))
      );

      setEditingDisposalDate(null);
      setDisposalDateValue("");

      // Show success animation
      setAnimationMessage("Disposal date updated successfully!");
      setShowDoneAnimation(true);
      setTimeout(() => setShowDoneAnimation(false), 2000);
    } catch (error) {
      console.error("Error updating disposal date:", error);
      alert("Error updating disposal date. Please try again.");
    }
  };

  const handleCancelDisposalDate = () => {
    setEditingDisposalDate(null);
    setDisposalDateValue("");
  };

  // Handle pagination
  const handlePageChange = async (page) => {
    if (page < 1 || page > pagination.totalPages) return;

    setLoading(true);
    try {
      const filters = {
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        department:
          selectedDepartment !== "all" ? selectedDepartment : undefined,
      };

      const assetsData = await assetService.getPaginatedAssets(
        page,
        10,
        filters
      );
      setAssets(assetsData.results || []);
      setPagination({
        currentPage: assetsData.current_page || page,
        totalPages: assetsData.total_pages || 1,
        totalCount: assetsData.count || 0,
        pageSize: 10,
      });
    } catch (error) {
      console.error("Error loading page:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = async (filterType, value) => {
    setLoading(true);
    try {
      let newFilters = {};

      if (filterType === "category") {
        setSelectedCategory(value);
        newFilters = {
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          category: value !== "all" ? value : undefined,
          department:
            selectedDepartment !== "all" ? selectedDepartment : undefined,
        };
      } else if (filterType === "status") {
        setSelectedStatus(value);
        newFilters = {
          status: value !== "all" ? value : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          department:
            selectedDepartment !== "all" ? selectedDepartment : undefined,
        };
      } else if (filterType === "department") {
        setSelectedDepartment(value);
        newFilters = {
          status: selectedStatus !== "all" ? selectedStatus : undefined,
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          department: value !== "all" ? value : undefined,
        };
      }

      const assetsData = await assetService.getPaginatedAssets(
        1,
        10,
        newFilters
      );
      setAssets(assetsData.results || []);
      setPagination({
        currentPage: 1,
        totalPages: assetsData.total_pages || 1,
        totalCount: assetsData.count || 0,
        pageSize: 10,
      });
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Asset Inventory</h1>
        <p className="text-sm text-gray-500">
          Manage and track all company assets
        </p>
      </div>

      {/* Asset Statistics - 2 rows of 5 cards each */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Assets</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : statistics?.total_assets || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded">
              <svg
                className="w-4 h-4 text-green-600"
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
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Active Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading
                  ? "..."
                  : (statistics?.status_counts?.available || 0) +
                    (statistics?.status_counts?.assigned || 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-blue-100 rounded">
              <svg
                className="w-4 h-4 text-blue-600"
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
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">
                Assigned Asset
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : statistics?.status_counts?.assigned || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded">
              <svg
                className="w-4 h-4 text-green-600"
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
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">
                Available Asset
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : statistics?.status_counts?.available || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-orange-100 rounded">
              <svg
                className="w-4 h-4 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Damaged Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : statistics?.status_counts?.damaged || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row of Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-yellow-100 rounded">
              <svg
                className="w-4 h-4 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">
                Asset In Maintenance
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : statistics?.status_counts?.maintenance || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-gray-100 rounded">
              <svg
                className="w-4 h-4 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Retired Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : statistics?.status_counts?.retired || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-red-100 rounded">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Lost Asset</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "..." : statistics?.status_counts?.lost || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-green-100 rounded">
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading
                  ? "..."
                  : (statistics?.total_value || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="p-1.5 bg-orange-100 rounded">
              <svg
                className="w-4 h-4 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">Book Value</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading
                  ? "..."
                  : (statistics?.total_value || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Values by Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">
          Asset Value By Status According to Purchased Value
        </h3>
        <div className="grid grid-cols-7 gap-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-gray-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-gray-600"
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
              <p className="text-xs font-medium text-gray-600 mb-1">
                Active Items Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {activeItemsPurchasedValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-blue-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-blue-600"
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
              <p className="text-xs font-medium text-gray-600 mb-1">
                Assigned Items Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getPurchasedValueByStatus("Assigned").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-green-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Available Items Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getPurchasedValueByStatus("Available").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-yellow-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Maintenance Items Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getPurchasedValueByStatus("Maintenance").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-gray-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Retired Items Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getPurchasedValueByStatus("Retired").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-red-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Lost Items Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getPurchasedValueByStatus("Lost").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-orange-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Damaged Items Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getPurchasedValueByStatus("Damaged").toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Values by Status - Book Value */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">
          Asset Value By Status According to Book Value
        </h3>
        <div className="grid grid-cols-7 gap-2">
          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-gray-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-gray-600"
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
              <p className="text-xs font-medium text-gray-600 mb-1">
                Active Items Book Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {activeItemsValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-blue-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-blue-600"
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
              <p className="text-xs font-medium text-gray-600 mb-1">
                Assigned Items Book Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getBookValueByStatus("Assigned").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-green-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Available Items Book Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getBookValueByStatus("Available").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-yellow-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Maintenance Items Book Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getBookValueByStatus("Maintenance").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-gray-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Retired Items Book Value
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getBookValueByStatus("Retired").toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-red-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Loss on Lost Asset
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getLossOnLostAssets().toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-2">
            <div className="flex flex-col items-center text-center">
              <div className="p-1 bg-orange-100 rounded mb-1">
                <svg
                  className="w-3 h-3 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <p className="text-xs font-medium text-gray-600 mb-1">
                Loss on Damaged Asset
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {getLossOnDamagedAssets().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Assets
            </label>
            <input
              type="text"
              placeholder="Search by name, ID, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="all">All Departments</option>
              {departmentsLoading ? (
                <option value="" disabled>
                  Loading departments...
                </option>
              ) : departments.length > 0 ? (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No departments available
                </option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned To
            </label>
            <input
              type="text"
              placeholder="Search by assigned person name or ID..."
              value={assignedPersonSearch}
              onChange={(e) => setAssignedPersonSearch(e.target.value)}
              className="w-full h-10 rounded border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleAddAsset}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors">
              Add New Asset
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white py-2 px-4 rounded hover:from-orange-500 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Asset List</h3>
            <p className="text-sm text-gray-500">
              Showing {filteredAssets.length} of {pagination.totalCount} assets
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchased Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchased Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Depreciation Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Disposal Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {asset.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {asset.name}
                      </div>
                      {asset.model && (
                        <div className="text-xs text-gray-500">
                          {asset.model}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {asset.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {asset.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {asset.assigned_to === "Unassigned" ? (
                      <span className="text-sm text-gray-500">-</span>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asset.assigned_to}
                        </div>
                        <div className="text-xs text-gray-500">
                          {asset.assigned_to_id}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {asset.value}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {(() => {
                        const purchaseValue = parseInt(
                          asset.value.replace(/[^\d]/g, "")
                        );
                        const quantity = asset.quantity || 1;
                        return `${(purchaseValue * quantity).toLocaleString()}`;
                      })()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {asset.purchase_date || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {calculateAssetAge(
                        asset.purchase_date,
                        asset.status,
                        asset.disposal_date
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {asset.depreciation_rate || 20}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {(() => {
                        const purchaseValue = parseInt(
                          asset.value.replace(/[^\d]/g, "")
                        );
                        const quantity = asset.quantity || 1;
                        const amount = purchaseValue * quantity;
                        const depreciationRate = asset.depreciation_rate || 20;
                        const depreciation = calculateDepreciation(
                          asset.purchase_date,
                          amount,
                          depreciationRate,
                          asset.status,
                          asset.disposal_date
                        );
                        return (
                          <div>
                            <div className="font-semibold">
                              {["Lost", "Damaged"].includes(asset.status)
                                ? "Loss on Asset"
                                : depreciation.depreciatedValue.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {["Lost", "Damaged"].includes(asset.status)
                                ? "Asset disposed"
                                : depreciation.depreciation > 0
                                ? `${depreciation.depreciation}% depreciated`
                                : "No depreciation"}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {asset.status === "Retired" || asset.status === "Lost" ? (
                      editingDisposalDate === asset.id ? (
                        <div className="flex items-center gap-2">
                          <CustomDateInput
                            value={disposalDateValue}
                            onChange={(value) => setDisposalDateValue(value)}
                            className="w-32 h-8 text-xs border border-gray-300 rounded px-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <button
                            onClick={() => handleSaveDisposalDate(asset.id)}
                            className="text-green-600 hover:text-green-800 text-xs"
                            title="Save">
                            <svg
                              className="w-4 h-4"
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
                          </button>
                          <button
                            onClick={handleCancelDisposalDate}
                            className="text-red-600 hover:text-red-800 text-xs"
                            title="Cancel">
                            <svg
                              className="w-4 h-4"
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
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-900">
                            {asset.disposal_date &&
                            typeof asset.disposal_date === "string"
                              ? formatDateToDDMMYYYY(asset.disposal_date)
                              : "-"}
                          </span>
                          <button
                            onClick={() => handleEditDisposalDate(asset)}
                            className="text-orange-600 hover:text-orange-800 transition-colors"
                            title="Edit disposal date">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </div>
                      )
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditAsset(asset)}
                        className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Showing {(pagination.currentPage - 1) * pagination.pageSize + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalCount
                )}{" "}
                of {pagination.totalCount} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add New Asset
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset ID
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, id: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Auto-generated if left empty"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for auto-generation
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., HP Laptop EliteBook 840"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          model: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., EliteBook 840 G8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select Category</option>
                      {categories
                        .filter((cat) => cat !== "all")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select Department</option>
                      {departmentsLoading ? (
                        <option value="" disabled>
                          Loading departments...
                        </option>
                      ) : departments.length > 0 ? (
                        departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No departments available
                        </option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      {statuses
                        .filter((status) => status !== "all")
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchased Value *
                    </label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 85,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchased Date
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          purchaseDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Depreciation Rate (%)
                    </label>
                    <input
                      type="number"
                      value={formData.depreciationRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          depreciationRate:
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="20"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Rate per year (e.g., 20% = 20% depreciation per year)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vendor: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ABC Electronics Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ACC Voucher
                    </label>
                    <input
                      type="text"
                      value={formData.accVoucher}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accVoucher: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., VCH-2024-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty Period
                    </label>
                    <div className="space-y-3">
                      {/* Structured Input Fields */}
                      <div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={formData.warrantyYears}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  warrantyYears: e.target.value,
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Years"
                            />
                            <label className="block text-xs text-gray-500 mt-1 text-center">
                              Years
                            </label>
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="11"
                              value={formData.warrantyMonths}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  warrantyMonths: e.target.value,
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Months"
                            />
                            <label className="block text-xs text-gray-500 mt-1 text-center">
                              Months
                            </label>
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={formData.warrantyDays}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  warrantyDays: e.target.value,
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Days"
                            />
                            <label className="block text-xs text-gray-500 mt-1 text-center">
                              Days
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      {calculateWarrantyPeriod() && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                          <label className="block text-xs font-medium text-blue-800 mb-1">
                            Warranty Period Preview:
                          </label>
                          <p className="text-sm text-blue-700 font-medium">
                            {calculateWarrantyPeriod()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSaveAsset}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors">
                  Add Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Asset
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset ID
                    </label>
                    <input
                      type="text"
                      value={formData.id}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, id: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Auto-generated if left empty"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty for auto-generation
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., HP Laptop EliteBook 840"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Asset Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          model: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., EliteBook 840 G8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select Category</option>
                      {categories
                        .filter((cat) => cat !== "all")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select Department</option>
                      {departmentsLoading ? (
                        <option value="" disabled>
                          Loading departments...
                        </option>
                      ) : departments.length > 0 ? (
                        departments.map((dept) => (
                          <option key={dept.id} value={dept.name}>
                            {dept.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No departments available
                        </option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      {statuses
                        .filter((status) => status !== "all")
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchased Value *
                    </label>
                    <input
                      type="text"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., 85,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchased Date
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          purchaseDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Annual Depreciation Rate (%)
                    </label>
                    <input
                      type="number"
                      value={formData.depreciationRate}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          depreciationRate:
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="20"
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Rate per year (e.g., 20% = 20% depreciation per year)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vendor: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., ABC Electronics Ltd."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ACC Voucher
                    </label>
                    <input
                      type="text"
                      value={formData.accVoucher}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accVoucher: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="e.g., VCH-2024-001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Warranty Period
                    </label>
                    <div className="space-y-3">
                      {/* Structured Input Fields */}
                      <div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="99"
                              value={formData.warrantyYears}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  warrantyYears: e.target.value,
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Years"
                            />
                            <label className="block text-xs text-gray-500 mt-1 text-center">
                              Years
                            </label>
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="11"
                              value={formData.warrantyMonths}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  warrantyMonths: e.target.value,
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Months"
                            />
                            <label className="block text-xs text-gray-500 mt-1 text-center">
                              Months
                            </label>
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={formData.warrantyDays}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  warrantyDays: e.target.value,
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                              placeholder="Days"
                            />
                            <label className="block text-xs text-gray-500 mt-1 text-center">
                              Days
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      {calculateWarrantyPeriod() && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
                          <label className="block text-xs font-medium text-blue-800 mb-1">
                            Warranty Period Preview:
                          </label>
                          <p className="text-sm text-blue-700 font-medium">
                            {calculateWarrantyPeriod()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelAdd}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSaveAsset}
                  className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700 transition-colors">
                  Update Asset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Value Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-medium text-gray-900 mb-3">
          Search Value
        </h3>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <svg
                className="w-4 h-4 text-blue-600"
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
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {selectedCategory === "all"
                  ? "Total Value (All Categories)"
                  : `${selectedCategory} Category Value`}
              </h4>
              <p className="text-xs text-gray-600">
                {selectedCategory === "all"
                  ? "Total value of all assets based on current filters"
                  : `Total value of assets in ${selectedCategory} category based on current filters`}
              </p>
            </div>
          </div>

          {/* 3 Column Value Display */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
              <div className="text-lg font-bold text-purple-600 mb-1">
                {getSearchValues().amount.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-gray-700">Amount</div>
            </div>

            <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
              <div className="text-lg font-bold text-orange-600 mb-1">
                {getSearchValues().bookValue.toLocaleString()}
              </div>
              <div className="text-xs font-medium text-gray-700">
                Book Value
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Light Orange Done Animation Overlay */}
      {showDoneAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center animate-bounce">
            <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Done!</h3>
            <p className="text-sm text-gray-600 text-center">
              {animationMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetInventory;
