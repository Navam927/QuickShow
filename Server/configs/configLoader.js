import { configDotenv } from "dotenv";

if (process.env.NODE_ENV !== "production") {
    configDotenv();
}
export default process.env;