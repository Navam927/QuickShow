import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDB from './configs/db.js';
import { SERVER_BASE_ROUTE } from './utils/debug.js';
import {clerkMiddleware} from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const port = 3000;

connectDB();
// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
app.use('/api/ingest', serve({
  client : inngest, 
  functions
}))


// api routes
app.get('/', (req, res) => {
  res.send(SERVER_BASE_ROUTE);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});