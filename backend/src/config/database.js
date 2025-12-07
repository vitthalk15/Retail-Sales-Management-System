import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/retail-sales';
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    console.warn('⚠️  Server will continue without MongoDB. Authentication features will not work.');
    console.warn('💡 To enable authentication, please:');
    console.warn('   1. Install MongoDB locally, OR');
    console.warn('   2. Use MongoDB Atlas (free): https://www.mongodb.com/cloud/atlas');
    console.warn('   3. Set MONGODB_URI in backend/.env file');
    // Don't exit - allow server to run without MongoDB for testing
  }
};

export default connectDB;

