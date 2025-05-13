// Update your app/utils/database.ts to add more logging
import mongoose from "mongoose";

const connectToDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  console.log("Connecting to MongoDB..."); // Add this line

  if (mongoose.connections[0].readyState) {
    console.log("Using existing connection");
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: "techpaper",
    });
    console.log("Connected to MongoDB successfully"); // Add this line
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectToDB;
