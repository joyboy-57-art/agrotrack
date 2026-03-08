import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
dotenv.config();

let mongoServer: MongoMemoryServer;

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    
    // Fallback to in-memory db if no URI provided
    if (!mongoUri) {
      console.log('No MONGO_URI found in .env, using mongodb-memory-server...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
