// One-time script to create the first admin user.
// Run with: node seed/createAdmin.js
import dotenv from "dotenv";
import readline from "readline";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const run = async () => {
  await connectDB();

  const username = (await ask("Admin username: ")).trim();
  const password = (await ask("Admin password (min 6 chars): ")).trim();

  rl.close();

  const existing = await User.findOne({ username });
  if (existing) {
    console.log("An admin with this username already exists.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = await User.create({ username, password });
  console.log(`Admin created: ${admin.username}`);
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
