import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models to ensure they are registered
import './models/appointment.model';
import './models/doctor.model';
import './models/hospital.model';
import './models/invoice.model';
import './models/patient.model';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}


async function connectDB() {
  try {
    // Check if there's already a connection
    if (mongoose.connection.readyState >= 1) {
      console.log("Using existing database connection.");
      return;
    }

    const opts = {
      bufferCommands: false,
    };

    console.log("Creating new database connection...");
    await mongoose.connect(MONGODB_URI!, opts);
    console.log("MongoDB connected successfully.");
  } catch (e) {
    console.error("MongoDB connection failed:", e);
    throw e;
  }
}

export default connectDB;
