import mongoose from "mongoose";
import { DATABASE_ALREADY_CONNECTED, DB_CONNECTION_FAILURE, DB_CONNECTION_SUCESSS, MONGO_URI_ERROR } from "../utils/debug.js";

const uri = process.env.MONGO_URI;

const connectDB = async () => {

  if (!uri) {
    console.log('uri_is_present : ', !!process.env.MONGO_URI)
    console.error(DB_CONNECTION_FAILURE, MONGO_URI_ERROR);
    process.exit(1);
  }

  if (mongoose.connection.readyState === 1) {
    console.log(DATABASE_ALREADY_CONNECTED);
    return mongoose.connection;
  }
  try {
    await mongoose.connect(uri);
    console.log(DB_CONNECTION_SUCESSS);
    return mongoose.connection;
  } catch (error) {
    console.error(DB_CONNECTION_FAILURE, error);
    process.exit(1);
  }
};
export default connectDB;