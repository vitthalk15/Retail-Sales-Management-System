import React, { useState, useEffect, useCallback } from 'react';
import { useSalesData } from '../hooks/useSalesData';
import { useToast } from '../hooks/useToast';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import SummaryCards from '../components/SummaryCards';
import SalesTable from '../components/SalesTable';
import Pagination from '../components/Pagination';
import ToastContainer from '../components/ToastContainer';

const SalesManagement = () => {
  const { data, loading, error, pagination, summary, filterOptions, fetchSalesData } = useSalesData();
  const { toasts, showError, removeToast } = useToast();

  // Show error toast when API error occurs
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    ageMin: '',
    ageMax: '',
    categories: [],
    tags: [],
    paymentMethods: [],
    dateFrom: '',
    dateTo: ''
  });
  const [sortBy, setSortBy] = useState('customerName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Build query params
  const buildQueryParams = useCallback(() => {
    const params = {
      page: currentPage,
      pageSize: 10,
      sortBy,
      sortOrder
    };

    if (debouncedSearchQuery.trim()) {
      params.search = debouncedSearchQuery.trim();
    }

    // Add filters
    if (filters.regions.length > 0) {
      params.regions = filters.regions;
    }
    if (filters.genders.length > 0) {
      params.genders = filters.genders;
    }
    if (filters.ageMin) {
      params.ageMin = filters.ageMin;
    }
    if (filters.ageMax) {
      params.ageMax = filters.ageMax;
    }
    if (filters.categories.length > 0) {
      params.categories = filters.categories;
    }
    if (filters.tags.length > 0) {
      params.tags = filters.tags;
    }
    if (filters.paymentMethods.length > 0) {
      params.paymentMethods = filters.paymentMethods;
    }
    if (filters.dateFrom) {
      params.dateFrom = filters.dateFrom;
    }
    if (filters.dateTo) {
      params.dateTo = filters.dateTo;
    }

    return params;
  }, [debouncedSearchQuery, filters, sortBy, sortOrder, currentPage]);

  // Fetch data when params change
  useEffect(() => {
    const params = buildQueryParams();
    fetchSalesData(params);
  }, [buildQueryParams, fetchSalesData]);

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      regions: [],
      genders: [],
      ageMin: '',
      ageMax: '',
      categories: [],
      tags: [],
      paymentMethods: [],
      dateFrom: '',
      dateTo: ''
    });
    setSortBy('customerName');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      searchQuery.trim() !== '' ||
      filters.regions.length > 0 ||
      filters.genders.length > 0 ||
      filters.ageMin !== '' ||
      filters.ageMax !== '' ||
      filters.categories.length > 0 ||
      filters.tags.length > 0 ||
      filters.paymentMethods.length > 0 ||
      filters.dateFrom !== '' ||
      filters.dateTo !== ''
    );
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
      
        <div className="flex-1 ml-[280px] min-h-screen">
          {/* Header with Search Bar */}
          <div className="bg-white px-8 py-5 border-b border-gray-200 shadow-sm flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Sales Management System</h1>
            <div className="w-[300px]">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                onClear={handleClearSearch}
                placeholder="Name, Phone no."
              />
            </div>
          </div>

          <div className="p-8">
            {/* Filters Row - All filters in one row, fitting on screen */}
            <div className="mb-5 relative z-10" style={{ overflow: 'visible' }}>
              <div className="flex items-start gap-2 bg-white p-4 rounded-lg shadow-sm overflow-x-auto scrollbar-hide" style={{ overflowY: 'visible', position: 'relative' }}>
                {hasActiveFilters() && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleResetFilters();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-red-50 border border-red-200 rounded transition-colors flex-shrink-0 bg-white shadow-sm"
                    title="Reset all filters"
                    aria-label="Reset all filters"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-red-600 font-semibold">Reset</span>
                  </button>
                )}
                {filterOptions && (
                  <>
                    <FilterDropdown
                      label="Customer Region"
                      options={filterOptions.regions}
                      selectedValues={filters.regions}
                      onSelect={(values) => handleFilterChange('regions', values)}
                    />
                    <FilterDropdown
                      label="Gender"
                      options={filterOptions.genders}
                      selectedValues={filters.genders}
                      onSelect={(values) => handleFilterChange('genders', values)}
                    />
                    <FilterDropdown
                      label="Age Range"
                      type="range"
                      selectedValues={{ min: filters.ageMin, max: filters.ageMax }}
                      onSelect={(values) => {
                        setFilters(prev => ({
                          ...prev,
                          ageMin: values.min || '',
                          ageMax: values.max || ''
                        }));
                        setCurrentPage(1);
                      }}
                      placeholder="Age Range"
                    />
                    <FilterDropdown
                      label="Product Category"
                      options={filterOptions.categories}
                      selectedValues={filters.categories}
                      onSelect={(values) => handleFilterChange('categories', values)}
                    />
                    <FilterDropdown
                      label="Tags"
                      options={filterOptions.tags}
                      selectedValues={filters.tags}
                      onSelect={(values) => handleFilterChange('tags', values)}
                    />
                    <FilterDropdown
                      label="Payment Method"
                      options={filterOptions.paymentMethods}
                      selectedValues={filters.paymentMethods}
                      onSelect={(values) => handleFilterChange('paymentMethods', values)}
                    />
                    <FilterDropdown
                      label="Date"
                      type="date-range"
                      selectedValues={{ from: filters.dateFrom, to: filters.dateTo }}
                      onSelect={(values) => {
                        setFilters(prev => ({
                          ...prev,
                          dateFrom: values.from || '',
                          dateTo: values.to || ''
                        }));
                        setCurrentPage(1);
                      }}
                      placeholder="Date Range"
                    />
                  </>
                )}
                <div className="flex items-center gap-2 ml-auto flex-shrink-0 pl-2 border-l border-gray-200">
                  <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Sort by:</label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [newSortBy, newSortOrder] = e.target.value.split('-');
                      setSortBy(newSortBy);
                      setSortOrder(newSortOrder);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded text-sm bg-white cursor-pointer min-w-[180px] focus:outline-none focus:border-blue-500"
                  >
                    <option value="customerName-asc">Customer Name (A-Z)</option>
                    <option value="customerName-desc">Customer Name (Z-A)</option>
                    <option value="date-desc">Date (Newest First)</option>
                    <option value="date-asc">Date (Oldest First)</option>
                    <option value="quantity-desc">Quantity (High to Low)</option>
                    <option value="quantity-asc">Quantity (Low to High)</option>
                  </select>
                </div>
              </div>
            </div>

            {summary && <div className="relative z-0"><SummaryCards summary={summary} /></div>}

            {loading ? (
              <div className="text-center py-10 bg-white rounded-lg mt-5">Loading...</div>
            ) : error ? (
              <div className="text-center py-10 bg-white rounded-lg mt-5 text-red-600">Error: {error}</div>
            ) : (
              <>
                <SalesTable data={data} />
                {pagination && (
                  <Pagination
                    pagination={pagination}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesManagement;
