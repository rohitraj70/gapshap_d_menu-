import mongoose from "mongoose";
import Order from "../models/Order.js";
import { getNextMidnight } from "../utils/orderRetention.js";

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes("cluster.mongodb.net")) {
    throw new Error("MONGO_URI is missing or still uses the placeholder Atlas host. Set it to a valid MongoDB connection string.");
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    await Order.syncIndexes();

    const ordersWithoutExpiry = await Order.find({
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }],
    }).select("_id createdAt").lean();

    if (ordersWithoutExpiry.length > 0) {
      await Order.bulkWrite(
        ordersWithoutExpiry.map((order) => ({
          updateOne: {
            filter: { _id: order._id },
            update: { $set: { expiresAt: getNextMidnight(order.createdAt) } },
          },
        }))
      );
      console.log(`Set midnight expiry for ${ordersWithoutExpiry.length} existing order(s)`);
    }

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    throw new Error(`MongoDB connection error: ${error.message}`);
  }
};

export default connectDB;
