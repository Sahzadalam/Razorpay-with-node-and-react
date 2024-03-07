const express = require("express");
const Razorpay = require("razorpay");
const router = express.Router();
require('dotenv').config();


router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: 50000,
            currency: "INR",
            receipt: "receipt_order_74394",
        };

        const order = await instance.orders.create(options);

        if (!order) {
            console.error("Error creating Razorpay order");
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(order);
    } catch (error) {
        console.error("Razorpay API error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/success", async (req, res) => {
    try {
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
