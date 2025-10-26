import redisClient from "../config/redis.js";
import Seat from "../models/Seat.js";
import {SEAT_LOCK_DURATION, SEAT_STATUS} from "../utils/index.js";
import redisHandler from "../utils/redisHandler.js";
import {responseError, responseSuccess} from "../utils/responseHandler.js";


export const getSeatById = async (req, res) => {

    const {id} = req.params;

    try {
        const cachedKey = `seat-by-id:${id}`;
        const cachedSeat = await redisHandler.get(cachedKey);
        if (cachedSeat) {
            return responseSuccess(res, cachedSeat, "Seat details fetched from cache", 200);
        }
        const data = await Seat.findById(id);
        redisHandler.set(cachedKey, data, 600);
        responseSuccess(res, data, "Seat details fetched successfully", 200);
    } catch (error) {
        responseError(res, "Failed to get seat details", 500);
    }


}

export const createSeat = async (req, res) => {
    try {
        const {showId} = req.body;

        if (!showId) {
            return responseError(res, "Show ID is required", 400);
        }

        const rows = ["A", "B", "C", "D", "E"];
        const seatsPerRow = 10;
        const seatTypes = {
            A: {type: "platinum", price: 500},
            B: {type: "gold", price: 400},
            C: {type: "gold", price: 400},
            D: {type: "silver", price: 300},
            E: {type: "silver", price: 300},
        };

        const seats = [];

        for (const row of rows) {
            for (let col = 1; col <= seatsPerRow; col++) {
                seats.push({
                    show: showId,
                    seatNumber: `${row}${col}`,
                    row,
                    column: col,
                    seatType: seatTypes[row].type,
                    price: seatTypes[row].price,
                    status: SEAT_STATUS.AVAILABLE,
                });
            }
        }

        await Seat.insertMany(seats);

        return responseSuccess(res, seats, `${seats.length} seats generated successfully`, 201);
    } catch (error) {
        console.error("Seat generation error:", error);
        return responseError(res, "Failed to generate seats", 500);
    }
};

export const getSeatByMovieId = async (req, res) => {

    const showId = req.params.id;
    console.log("showId is movie id api seats", showId);

    try {
        const cachedKey = `show-seats-by:${showId}`;
        const cachedSeat = await redisHandler.get(cachedKey);
        if (cachedSeat) {
            console.log('fetched from cached for get seat by movie id');
            return responseSuccess(res, cachedSeat, "Seat details fetched from cache", 200);
        }
        const data = await Seat.find({show: showId});
        redisHandler.set(cachedKey, data, 600);
        responseSuccess(res, data, "Seat details fetched successfully", 200);
    } catch (error) {
        responseError(res, "Failed to get seat details", 500);
    }


}

export const lockSeats = async (req, res, next) => {
    try {
        const {showId, seatIds} = req.body;
        const userId = req.user.id;
        const now = new Date();

        const redisKey = `show-seats-by:${showId}`;
        const cachedData = await redisHandler.get(redisKey);
        let updatedCachedData = [];

        if (cachedData) {
            // Update redis data for reserved seats
            updatedCachedData = cachedData.map((seat) => {
                if (seatIds.includes(seat._id.toString())) {
                    if (seat.status === SEAT_STATUS.RESERVED && seat.status === SEAT_STATUS.BOOKED) {
                        return errorResponse(res, 400, `Seat ${seat.seatNumber} is already booked or reserved`);
                    }
                    seat.status = SEAT_STATUS.RESERVED;
                    seat.lockedBy = userId;
                    seat.lockedAt = now;
                }
                return seat;
            });

            // Save updated cache with expiry (10 min)
            await redisHandler.set(redisKey, updatedCachedData, 600);

            // Broadcast updated seat info to all connected clients for that show
            const io = req.app.get('io');
            io.emit(`show-${showId}`, {seats: updatedCachedData});
        }

        // Fetch seat data from DB
        const seats = await Seat.find({_id: {$in: seatIds}});

        // Check for any conflicting seats
        const conflictingSeat = seats.find((seat) => seat.status === SEAT_STATUS.BOOKED || seat.status === SEAT_STATUS.RESERVED);

        if (conflictingSeat) {
            return responseError(res, `Seat ${conflictingSeat.seatNumber} is already booked or reserved`, 400);
        }

        // Store temporary lock info in Redis for each seat (with expiry)
        await Promise.all(seatIds.map((id) => redisHandler.set(`seat_lock:${id}`, userId, SEAT_LOCK_DURATION / 1000)));

        // Update seats in MongoDB
        await Seat.updateMany({_id: {$in: seatIds}}, {
            status: SEAT_STATUS.RESERVED, lockedBy: userId, lockedAt: now,
        });

        const updatedSeats = await Seat.find({_id: {$in: seatIds}});
        return responseSuccess(res, "Seats locked successfully", {seats: updatedSeats}, 200);
    } catch (error) {
        next(error);
    }
};

export const unlockSeats = async (req, res, next) => {
    try {
        const {seatIds, showId} = req.body;
        const userId = req.user.id;
        const io = req.app.get("io");


        const cachedKey = `show-seats-by:${showId}`;
        const cachedSeats = await redisHandler.get(cachedKey);
        let updatedCachedData = [];

        // ✅ Update cache if exists
        if (cachedSeats && cachedSeats.length > 0) {
            updatedCachedData = cachedSeats.map((seat) => {
                if (seatIds.includes(seat._id.toString())) {
                    if (seat.status === SEAT_STATUS.RESERVED) {
                        seat.status = SEAT_STATUS.AVAILABLE;
                        seat.lockedBy = null;
                        seat.lockedAt = null;
                    }
                }
                return seat;
            });

            // ✅ Save updated cache
            await redisHandler.set(cachedKey, updatedCachedData, 600);

            io.emit(`show-${showId}`, {seats: updatedCachedData});
            console.log("Updated seat cache successfully");
        } else {
            console.log("No cached seats found, pulling from DB...");
        }

        // ✅ Update DB
        await Seat.updateMany(
            {_id: {$in: seatIds}, lockedBy: userId},
            {
                $set: {
                    status: SEAT_STATUS.AVAILABLE,
                    lockedBy: null,
                    lockedAt: null,
                },
            }
        );

        // ✅ Refresh Redis with fresh data if no cached data
        if (!cachedSeats || cachedSeats.length === 0) {
            const updatedSeats = await Seat.find({show: showId});
            await redisHandler.set(cachedKey, updatedSeats, 600);
            io.emit(`show-${showId}`, {seats: updatedSeats});
            return responseSuccess(res, {seats: updatedSeats}, "Seats unlocked successfully", 200);
        }

        // ✅ Final success response
        responseSuccess(res, {}, "Seats unlocked successfully", 200);
    } catch (error) {
        console.error("Unlock seat error:", error);
        next(error);
    }
};





