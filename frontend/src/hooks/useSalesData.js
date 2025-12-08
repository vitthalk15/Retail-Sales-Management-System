import { useState, useEffect, useCallback } from 'react';
import { salesAPI } from '../services/api';

export const useSalesData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [filterOptions, setFilterOptions] = useState(null);

  // Fetch filter options
  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await salesAPI.getFilters();
      setFilterOptions(response.data);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  // Fetch sales data
  const fetchSalesData = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await salesAPI.getSales(params);
      setData(response.data.data);
      setPagination(response.data.pagination);
      setSummary(response.data.summary);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to fetch sales data';
      setError(errorMessage);
      console.error('Error fetching sales data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return {
    data,
    loading,
    error,
    pagination,
    summary,
    filterOptions,
    fetchSalesData,
    refetchFilters: fetchFilterOptions
  };
};

