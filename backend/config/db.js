import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google's DNS to bypass local router SRV issues (ECONNREFUSED)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(`Please make sure your MONGO_URI in .env is correct (e.g. your MongoDB Atlas connection string)`);
    process.exit(1);
  }
};

export default connectDB;
