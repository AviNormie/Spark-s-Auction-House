import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://vishurizz01:HwCmM3l7rF7YZkvp@cluster0.7ozbuch.mongodb.net/" as string;
console.log("MONGODB_URI:", process.env.MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("❌ Please define the MONGODB_URI environment variable in .env.local");
}

// Define an interface for cached connection
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Ensure `global` has the correct type
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

// Use global cache or initialize it
const cached: MongooseCache = global._mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "auctionDB",
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log("✅ Successfully connected to MongoDB!");
        return mongooseInstance.connection;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    global._mongoose = cached; // Store in global
    return cached.conn;
  } catch (error) {
    console.error("❌ Failed to establish MongoDB connection:", error);
    throw error;
  }
}
