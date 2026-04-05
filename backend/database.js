// Conexión a MongoDB con Mongoose
// MongoDB connection with Mongoose

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("✅ MongoDB conectado / MongoDB connected");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;