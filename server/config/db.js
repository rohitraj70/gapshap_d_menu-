import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes("cluster.mongodb.net")) {
    throw new Error("MONGO_URI is missing or still uses the placeholder Atlas host. Set it to a valid MongoDB connection string.");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    throw new Error(`MongoDB connection error: ${error.message}`);
  }
};

export default connectDB;
