import express from 'express';
import { getUserBookings, updateFavourite, getFavorites } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.get('/bookings',getUserBookings);
userRouter.post('/update-favourite',updateFavourite);
userRouter.get('/favourite-movies',getFavorites);

export default userRouter;

