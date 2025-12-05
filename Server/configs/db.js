import mongoose from "mongoose";
import { DB_CONNECTION_FAILURE, DB_CONNECTION_SUCESSS } from "../utils/debug.js";
import { configDotenv } from "dotenv";
configDotenv();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(DB_CONNECTION_SUCESSS, '\nhost:', mongoose.connection.host);
  } catch (error) {
    console.error(DB_CONNECTION_FAILURE, error);
    process.exit(1);
  }
};
export default connectDB;