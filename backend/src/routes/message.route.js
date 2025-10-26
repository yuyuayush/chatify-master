import express from "express";
import {
  createPaymentIntent,
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
  stripeWebhook,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);
router.post("/stripe", createPaymentIntent);
router.post("/webhook/stripe", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
