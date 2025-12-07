import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sales Schema
const salesSchema = new mongoose.Schema({}, { strict: false, collection: 'sales' });
let Sales;
try {
  Sales = mongoose.model('Sales');
} catch (error) {
  Sales = mongoose.model('Sales', salesSchema);
}

export async function importCSVToMongoDB() {
  const dataDir = path.join(__dirname, '../../data');
  
  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    console.log('📁 Data directory not found. Skipping import.');
    return false;
  }
  
  const csvFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));
  
  if (csvFiles.length === 0) {
    console.log('📄 No CSV files found in backend/data/ folder. Skipping import.');
    return false;
  }
  
  const csvFile = csvFiles[0];
  const csvPath = path.join(dataDir, csvFile);
  
  // Check if MongoDB is connected
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️  MongoDB not connected. Cannot import data.');
    return false;
  }
  
  // Check if data already exists
  const existingCount = await Sales.countDocuments();
  if (existingCount > 0) {
    console.log(`✅ MongoDB already has ${existingCount.toLocaleString()} records. Skipping import.`);
    return true;
  }
  
  console.log(`\n📄 Starting automatic import from: ${csvFile}`);
  console.log('⏳ This may take several minutes for large files...\n');
  
  try {
    let recordCount = 0;
    const batchSize = 1000;
    let batch = [];
    
    const parser = fs
      .createReadStream(csvPath, { encoding: 'utf8' })
      .pipe(parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (value, context) => {
          if (context.header) return value;
          if (value === '' || value === null || value === undefined) return '';
          const num = parseFloat(value);
          if (!isNaN(num) && isFinite(num)) {
            return num;
          }
          return value;
        }
      }));
    
    return new Promise((resolve, reject) => {
      parser.on('data', async (record) => {
        batch.push(record);
        recordCount++;
        
        if (batch.length >= batchSize) {
          parser.pause();
          try {
            await Sales.insertMany(batch, { ordered: false });
            process.stdout.write(`\r✅ Imported ${recordCount.toLocaleString()} records...`);
            batch = [];
          } catch (error) {
            if (error.code !== 11000) { // Ignore duplicate key errors
              // Check if it's a storage quota error
              if (error.message && error.message.includes('space quota')) {
                console.error(`\n\n⚠️  MongoDB Atlas Storage Quota Reached!`);
                console.error(`   You're using the free tier (512 MB limit)`);
                console.error(`   Successfully imported ${recordCount.toLocaleString()} records before hitting the limit.`);
                console.error(`\n💡 Options:`);
                console.error(`   1. Use the ${recordCount.toLocaleString()} records already imported`);
                console.error(`   2. Upgrade MongoDB Atlas to a paid tier for more storage`);
                console.error(`   3. Use a sample of your CSV data (first N records)`);
                console.error(`\n✅ Server will continue with available data.\n`);
                batch = [];
                parser.destroy(); // Stop parsing
                resolve(false);
                return;
              }
              console.error('\n❌ Error inserting batch:', error.message);
            }
            batch = [];
          }
          parser.resume();
        }
      });
      
      parser.on('end', async () => {
        // Insert remaining records
        if (batch.length > 0) {
          try {
            await Sales.insertMany(batch, { ordered: false });
          } catch (error) {
            if (error.code !== 11000) {
              if (error.message && error.message.includes('space quota')) {
                console.error(`\n\n⚠️  MongoDB Atlas Storage Quota Reached!`);
                console.error(`   Successfully imported records before hitting the limit.`);
                const finalCount = await Sales.countDocuments();
                console.error(`   Total records in database: ${finalCount.toLocaleString()}\n`);
                resolve(false);
                return;
              }
              console.error('\n❌ Error inserting final batch:', error.message);
            }
          }
        }
        
        const finalCount = await Sales.countDocuments();
        console.log(`\n\n✅ Successfully imported ${finalCount.toLocaleString()} records to MongoDB`);
        console.log(`📊 Collection: sales\n`);
        resolve(true);
      });
      
      parser.on('error', (error) => {
        console.error('\n❌ Error parsing CSV:', error.message);
        reject(error);
      });
    });
  } catch (error) {
    console.error('\n❌ Error during import:', error.message);
    return false;
  }
}

