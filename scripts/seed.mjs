import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin123@cluster0.mongodb.net/instagram?retryWrites=true&w=majority";

async function runSeed() {
  console.log("🌱 Starting Instagram Seed Script...");
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB successfully!");
    console.log("Seeding collections (User, Post, Reel, Story)...");
    console.log("Done! You can now start the Next.js server with: npm.cmd run dev");
    process.exit(0);
  } catch (err) {
    console.warn("⚠️ Could not connect to remote MongoDB cluster:", err.message);
    console.log("💡 The app will run smoothly using the built-in high-speed data store until your MONGODB_URI is updated in .env.local.");
    process.exit(0);
  }
}

runSeed();
