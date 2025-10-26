// routes/webhook.js
import express from "express";
import Stripe from "stripe";

const webhookRoute = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const webhookHandlerasync = (req, res) => {
    let event;
    const signature = req.headers["stripe-signature"];
    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                endpointSecret
            );
        } else {
            event = req.body; // fallback (not recommended)
        }
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log(event);

    // ✅ Handle events
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            console.log(
                `✅ PaymentIntent for ₹${paymentIntent.amount / 100} succeeded.`
            );
            break;

        case "payment_method.attached":
            const paymentMethod = event.data.object;
            console.log("💳 PaymentMethod attached:", paymentMethod.id);
            break;

        default:
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).send(); // Acknowledge receipt
}


