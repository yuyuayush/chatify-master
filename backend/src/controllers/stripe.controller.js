import stripe from "../config/stripe";
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // store in .env

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, productName } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName || "Sample Product", // required field
            },
            unit_amount: Math.round(amount * 100), // convert to smallest unit
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.status(200).json({
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
};


// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error("Webhook Error:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle event types
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log("PaymentIntent was successful!", paymentIntent.id);
//       break;

//     case 'checkout.session.completed':
//       const session = event.data.object;
//       console.log("Checkout session completed!", session.id);
//       break;

//     default:
//       console.log(`Unhandled event type: ${event.type}`);
//   }

//   // Acknowledge receipt
//   res.status(200).send({ received: true });
// };
