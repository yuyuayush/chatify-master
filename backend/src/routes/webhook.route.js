import express from "express";
import Stripe from "stripe";
import { paymentSuccessfulWebhook } from "../utils/paymentWebhook.js";

const webhookRoute = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

webhookRoute.post(
    "/",
    // ⚠️ Use raw body only for Stripe webhooks
    express.raw({ type: "application/json" }),
    (req, res) => {
        const sig = req.headers["stripe-signature"];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error("⚠️ Webhook signature verification failed:", err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log("✅ Webhook event received:", event.type);

        // Handle the event
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                console.log(`💰 Payment succeeded: ₹${paymentIntent.amount / 100}`);
                paymentSuccessfulWebhook(event.data.object);
                break;
            }
            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;
                const failureMessage = paymentIntent.last_payment_error?.message;
                console.log(`❌ Payment failed: ${failureMessage}`);
                break;
            }
            case "charge.refunded": {
                const charge = event.data.object;
                console.log(`↩️ Payment refunded: ₹${charge.amount / 100}`);
                break;
            }
            default:
                console.log(`⚠️ Unhandled event type: ${event.type}`);
        }


        res.sendStatus(200);
    }
);

export default webhookRoute;
