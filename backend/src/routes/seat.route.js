import { Router } from 'express'
import { createSeat, getSeatById, getSeatByMovieId, lockSeats, unlockSeats } from '../controllers/seat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { toggleSeat } from '../controllers/auth.controller.js';

const seatRoute = Router();

seatRoute.get("/:id", getSeatByMovieId);
seatRoute.get("/seatData/:id", getSeatById);
seatRoute.post("/data", createSeat);
seatRoute.post("/lock/", protectRoute, lockSeats);
seatRoute.post("/unlock/", protectRoute, unlockSeats);

export default seatRoute;