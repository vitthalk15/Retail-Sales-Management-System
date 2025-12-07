import { getDataCount, Sales } from './dataService.js';
import mongoose from 'mongoose';

const processSearchQuery = (searchText) => {
  if (!searchText || !searchText.trim()) return null;
  const cleaned = searchText.trim();
  const isDigitsOnly = /^\d+$/.test(cleaned);
  return { term: cleaned, isNumeric: isDigitsOnly };
};

const buildMongoQuery = (searchInfo, filters) => {
  const query = {};
  
  if (searchInfo && !searchInfo.isNumeric) {
    const escaped = searchInfo.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query['Customer Name'] = new RegExp(escaped, 'i');
  }
  
  if (filters) {
    if (filters.regions?.length > 0) {
      query['Customer Region'] = { $in: filters.regions };
    }
    if (filters.genders?.length > 0) {
      query['Gender'] = { $in: filters.genders };
    }
    if (filters.categories?.length > 0) {
      query['Product Category'] = { $in: filters.categories };
    }
    if (filters.paymentMethods?.length > 0) {
      query['Payment Method'] = { $in: filters.paymentMethods };
    }
    if (filters.tags?.length > 0) {
      query['Tags'] = { $regex: filters.tags.join('|'), $options: 'i' };
    }
    if (filters.ageMin !== undefined && filters.ageMin !== null && filters.ageMin !== '') {
      query['Age'] = { ...query['Age'], $gte: parseInt(filters.ageMin) };
    }
    if (filters.ageMax !== undefined && filters.ageMax !== null && filters.ageMax !== '') {
      query['Age'] = { ...query['Age'], $lte: parseInt(filters.ageMax) };
    }
    if (filters.dateFrom) {
      query['Date'] = { ...query['Date'], $gte: new Date(filters.dateFrom) };
    }
    if (filters.dateTo) {
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      query['Date'] = { ...query['Date'], $lte: endDate };
    }
  }
  
  return query;
};

const buildSortCriteria = (sortField, sortDirection) => {
  const sortMap = {
    date: 'Date',
    quantity: 'Quantity',
    customerName: 'Customer Name'
  };
  
  const field = sortMap[sortField];
  if (!field) return {};
  
  return { [field]: sortDirection === 'desc' ? -1 : 1 };
};

const filterBySearchTerm = (records, searchInfo) => {
  if (!searchInfo) return records;
  
  const { term, isNumeric } = searchInfo;
  const termLower = term.toLowerCase();
  
  return records.filter(record => {
    const name = String(record['Customer Name'] || '').toLowerCase();
    const phone = String(record['Phone Number'] || '');
    
    if (isNumeric) {
      return name.includes(termLower) || phone.includes(term);
    }
    return name.includes(termLower) || phone.toLowerCase().includes(termLower);
  });
};

const filterByTags = (records, tagFilters) => {
  if (!tagFilters || tagFilters.length === 0) return records;
  
  return records.filter(record => {
    const recordTags = record['Tags'] || '';
    const tagList = Array.isArray(recordTags) 
      ? recordTags 
      : String(recordTags).split(',').map(t => t.trim()).filter(t => t);
    return tagFilters.some(filterTag => tagList.includes(filterTag));
  });
};

const calculateTotals = (records) => {
  let units = 0;
  let amount = 0;
  let discount = 0;
  
  records.forEach(record => {
    units += parseInt(record['Quantity'] || 0);
    amount += parseFloat(record['Total Amount'] || 0);
    const discountPct = parseFloat(record['Discount Percentage'] || 0);
    const total = parseFloat(record['Total Amount'] || 0);
    discount += total * discountPct / 100;
  });
  
  return {
    totalUnits: units,
    totalAmount: Math.round(amount * 100) / 100,
    totalDiscount: Math.round(discount * 100) / 100,
    salesRecords: records.length
  };
};

const paginateResults = (records, pageNum, pageSize) => {
  const page = Math.max(1, parseInt(pageNum) || 1);
  const size = Math.max(1, parseInt(pageSize) || 10);
  const start = (page - 1) * size;
  const end = start + size;
  
  return {
    data: records.slice(start, end),
    pagination: {
      currentPage: page,
      pageSize: size,
      totalItems: records.length,
      totalPages: Math.ceil(records.length / size),
      hasNextPage: end < records.length,
      hasPreviousPage: page > 1
    }
  };
};

export const getFilterOptions = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return {
        regions: [],
        genders: [],
        categories: [],
        tags: [],
        paymentMethods: []
      };
    }

    const [regions, genders, categories, paymentMethods, tagRecords] = await Promise.all([
      Sales.distinct('Customer Region').then(vals => vals.filter(v => v != null && v !== '').sort()),
      Sales.distinct('Gender').then(vals => vals.filter(v => v != null && v !== '').sort()),
      Sales.distinct('Product Category').then(vals => vals.filter(v => v != null && v !== '').sort()),
      Sales.distinct('Payment Method').then(vals => vals.filter(v => v != null && v !== '').sort()),
      Sales.find({ 'Tags': { $exists: true, $ne: '' } }, { 'Tags': 1, '_id': 0 }).limit(10000).lean()
    ]);

    const uniqueTags = new Set();
    tagRecords.forEach(record => {
      const tags = record['Tags'] || '';
      if (tags) {
        const tagArray = Array.isArray(tags) 
          ? tags 
          : String(tags).split(',').map(t => t.trim()).filter(t => t);
        tagArray.forEach(tag => uniqueTags.add(tag));
      }
    });

    return {
      regions,
      genders,
      categories,
      tags: Array.from(uniqueTags).sort(),
      paymentMethods
    };
  } catch (error) {
    console.error('Error getting filter options:', error);
    return {
      regions: [],
      genders: [],
      categories: [],
      tags: [],
      paymentMethods: []
    };
  }
};

export const getSalesData = async (params) => {
  try {
    const searchInfo = processSearchQuery(params.search);
    const mongoQuery = buildMongoQuery(searchInfo, params.filters);
    const sortCriteria = buildSortCriteria(params.sortBy, params.sortOrder);
    
    const pageNum = params.page || 1;
    const pageSize = params.pageSize || 10;
    
    const needsClientFiltering = searchInfo?.isNumeric || (params.filters?.tags?.length > 0);
    const fetchLimit = needsClientFiltering ? 50000 : pageSize;
    const skip = needsClientFiltering ? 0 : (pageNum - 1) * pageSize;

    let query = Sales.find(mongoQuery);
    
    if (Object.keys(sortCriteria).length > 0) {
      query = query.sort(sortCriteria);
    }
    
    if (needsClientFiltering) {
      query = query.limit(fetchLimit);
    } else {
      query = query.skip(skip).limit(pageSize);
    }
    
    let results = await query.lean();
    
    if (searchInfo?.isNumeric) {
      results = filterBySearchTerm(results, searchInfo);
    }
    
    if (params.filters?.tags?.length > 0) {
      results = filterByTags(results, params.filters.tags);
    }

    const summary = calculateTotals(results);
    const { data, pagination } = paginateResults(results, pageNum, pageSize);

    return { data, pagination, summary };
  } catch (error) {
    console.error('Error in getSalesData:', error);
    throw error;
  }
};
