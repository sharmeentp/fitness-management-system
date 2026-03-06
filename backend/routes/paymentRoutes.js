const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const protect = require("../middlewares/authMiddleware");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// CREATE CHECKOUT SESSION
router.post("/create-checkout-session", protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Monthly Fitness Subscription",
            },
            unit_amount: 49900, // 499 INR in paisa
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: req.user.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;