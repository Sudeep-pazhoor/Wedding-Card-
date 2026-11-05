import mongoose from "mongoose";

/**
 * Serverless-friendly connection cache. Vercel may reuse a warm function
 * between requests, so the same Mongoose connection is shared.
 */
const globalForMongoose = globalThis;

if (!globalForMongoose.__snMongoose) {
  globalForMongoose.__snMongoose = { conn: null, promise: null };
}

const cached = globalForMongoose.__snMongoose;

export function hasDatabaseConfig() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 8000,
        maxPoolSize: 10,
        family: 4,
      })
      .then((instance) => instance.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
