import mongoose from 'mongoose';

// Sales Schema - flexible schema to handle all fields
const salesSchema = new mongoose.Schema({}, { strict: false, collection: 'sales' });

// Export Sales model - check if already compiled to avoid overwrite error
let Sales;
try {
  Sales = mongoose.model('Sales');
} catch (error) {
  Sales = mongoose.model('Sales', salesSchema);
}

export { Sales };

let dataLoaded = false;

// Load data from MongoDB
export const loadData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  MongoDB not connected. Data will be loaded on first query.');
      dataLoaded = false;
      return;
    }
    
    const count = await Sales.countDocuments();
    dataLoaded = true;
    console.log(`✅ Connected to MongoDB with ${count.toLocaleString()} sales records`);
  } catch (error) {
    console.error('❌ Error checking MongoDB:', error.message);
    dataLoaded = false;
  }
};

// Get all data from MongoDB (with optional query for filtering)
export const getAllData = async (query = {}) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  MongoDB not connected');
      return [];
    }
    
    return await Sales.find(query).lean();
  } catch (error) {
    console.error('Error fetching data from MongoDB:', error);
    return [];
  }
};

// Get count of documents
export const getDataCount = async (query = {}) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return 0;
    }
    return await Sales.countDocuments(query);
  } catch (error) {
    console.error('Error counting documents:', error);
    return 0;
  }
};

// Initialize data check on module load
loadData();
