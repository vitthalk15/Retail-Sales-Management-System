import { getSalesData, getFilterOptions } from '../services/salesService.js';

/**
 * Get sales data with search, filters, sorting, and pagination
 */
export const getSales = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      pageSize = 10,
      sortBy,
      sortOrder = 'asc',
      regions,
      genders,
      ageMin,
      ageMax,
      categories,
      tags,
      paymentMethods,
      dateFrom,
      dateTo
    } = req.query;

    // Build filters object
    const filters = {};
    if (regions) {
      filters.regions = Array.isArray(regions) ? regions : [regions];
    }
    if (genders) {
      filters.genders = Array.isArray(genders) ? genders : [genders];
    }
    if (ageMin !== undefined && ageMin !== null && ageMin !== '') {
      filters.ageMin = ageMin;
    }
    if (ageMax !== undefined && ageMax !== null && ageMax !== '') {
      filters.ageMax = ageMax;
    }
    if (categories) {
      filters.categories = Array.isArray(categories) ? categories : [categories];
    }
    if (tags) {
      filters.tags = Array.isArray(tags) ? tags : [tags];
    }
    if (paymentMethods) {
      filters.paymentMethods = Array.isArray(paymentMethods) ? paymentMethods : [paymentMethods];
    }
    if (dateFrom) {
      filters.dateFrom = dateFrom;
    }
    if (dateTo) {
      filters.dateTo = dateTo;
    }

    const result = await getSalesData({
      search,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      sortBy,
      sortOrder,
      filters
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get available filter options
 */
export const getFilters = async (req, res) => {
  try {
    const options = await getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

