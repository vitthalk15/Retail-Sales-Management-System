import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import salesRoutes from './routes/salesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { importCSVToMongoDB } from './utils/importData.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Auto-import CSV data on startup
async function initializeData() {
  // Wait for MongoDB connection
  let retries = 0;
  while (mongoose.connection.readyState !== 1 && retries < 10) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    retries++;
  }
  
  if (mongoose.connection.readyState === 1) {
    // Try full import first, fallback to sample if quota is hit
    const success = await importCSVToMongoDB();
    
    // If import failed due to quota, use existing data
    if (!success) {
      const { Sales } = await import('./services/dataService.js');
      const existingCount = await Sales.countDocuments();
      if (existingCount > 0) {
        console.log(`\n✅ Using existing ${existingCount.toLocaleString()} records in database.`);
      }
    }
  } else {
    console.log('⚠️  MongoDB not connected. Data import skipped.');
    console.log('💡 Data will be imported automatically once MongoDB is connected.');
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Retail Sales API is running' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  // Start data import in background
  initializeData().catch(err => {
    console.error('Error during data import:', err.message);
  });
});

