// function to check availability of selected seats. 

import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const checkSeatsAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId);
        if (!showData) {
            return false;
        }
        const occupiedSeats = showData.occupiedSeats;
        
        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
        
    } catch (error) {
        console.error(error);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;

        const {origin} = req.headers;
        // check if the seat is available for the selected show

        const isAvailable = await checkSeatsAvailability(showId, selectedSeats);
        if (!isAvailable) {
            return res.json({
                success: false,
                message: 'One or more selected seats are already booked. Please choose different seats.'
            })
        }
        // get show details
        const showData = await Show.findById(showId).populate('movie');

        const booking = await Booking.create({
            user : userId, 
            show : showId, 
            amount : selectedSeats.length * showData.showPrice,
            bookedSeats : selectedSeats, 
            isPaid : false, 
            
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })
        showData.markModified('occupiedSeats');
        await showData.save();

        // stripe gateway 

        res.json({
            success : true, 
            message : 'Booking created successfully',
            bookingId : booking._id
        })

    } catch (error) {
        console.error(error);
        res.json({
            success : false, 
            message : error.message
        })
    }
}

export const getOccupiedSeats = async (req, res) => {
    try {
        
        const {showId} = req.params;
        const showData = await Show.findById(showId);
        if (!showData) {
            return res.status(404).json({
                success : false, 
                message : 'Show not found'
            })
        }

        const occupiedSeats = Object.keys(showData.occupiedSeats);
        res.json({
            success : true, 
            occupiedSeats
        })

    } catch (error) {
        res.json({
            success : false, 
            message : error.message
        })
    }
}