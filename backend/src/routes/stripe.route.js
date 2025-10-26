import express from "express";
import { createPaymentIntent } from "../controllers/stripe.controller.js";

const stripeRoute = express.Router();

stripeRoute.post("/stripe", createPaymentIntent);

export default stripeRoute;