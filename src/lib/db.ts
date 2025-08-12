import mongoose from 'mongoose';

let MONGODB_URI = "mongodb+srv://shaheer9x:5MVchuNTmFk4oko6@cluster0.k6iw7y9.mongodb.net/Test?retryWrites=true&w=majority&appName=Cluster0/test1";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Fix potential typo in write concern option
if (MONGODB_URI.includes('w=majoritys')) {
  MONGODB_URI = MONGODB_URI.replace('w=majoritys', 'w=majority');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
