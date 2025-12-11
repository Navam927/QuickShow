import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";


// controller to get user bookings
export const getUserBookings = async (req, res) => {
    try {
        console.log('get user bookings controller running...');

        const user = req.auth().userId;
        console.log('user: ', user);
        const bookings = await Booking.find({ user }).populate({
            path: 'show',
            populate: {
                path: 'movie'
            }
        }).sort({ createdAt: -1 });
        console.log('user bookings: ', bookings);
        res.json({
            success: true,
            bookings
        })
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}

// api controller function to update favourite movie in clerk user metadata
export const updateFavourite = async (req, res) => {
  try {
    console.log('update favorite controller running...');
    const { movieId } = req.body;
    const authData = req.auth ? req.auth() : null;
    const userId = authData?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    console.log('movie id: ', movieId);
    console.log('user id: ', userId);

    const user = await clerkClient.users.getUser(userId);

    // ensure metadata object exists
    user.privateMetadata = user.privateMetadata || {};

    if (!Array.isArray(user.privateMetadata.favorites)) {
      user.privateMetadata.favorites = [];
    }

    const favs = user.privateMetadata.favorites;
    if (!favs.includes(movieId)) {
      favs.push(movieId);
    } else {
      user.privateMetadata.favorites = favs.filter(id => id !== movieId);
    }

    // Use updateUser or updateUserMetadata depending on your SDK version.
    // Example common pattern:
    await clerkClient.users.updateUser({
      userId,
      privateMetadata: user.privateMetadata
    });

    res.json({ success: true, message: 'Movie added to favourites' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


export const getFavorites = async (req, res) => {
    try {
        console.log('get favorites controller running...');
        const authData = req.auth ? req.auth() : null;
        const userId = authData?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const user = await clerkClient.users.getUser(userId);
        const favorites = (user?.privateMetadata?.favorites) || [];

        console.log('user: ', user);
        console.log('favorites:', favorites);

        const movies = await Movie.find({ _id: { $in: favorites } });
        res.json({ success: true, movies });
        console.log('get favorites controller execution finished...');
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
