import payment from "../models/payment.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto"
import User from "../models/user.model.js";

export const createOrder = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;
    if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid plan data" });
    }

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options)

    await payment.create({
      userId: req.userId,
      planId,
      amount,
      credits,
      razorpayOrderId: order.id,
      status: "created",
    });

    return res.json(order);

  } catch (error) {
    return res.status(500).json({ message: `failed to get razorpay order ${error}` })
  }
}


export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const paymentDOC = await payment.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!paymentDOC) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (paymentDOC.status === "paid") {
      return res.json({ message: "Already processed" });
    }

    // Update payment record
    paymentDOC.status = "paid";
    paymentDOC.razorpayPaymentId = razorpay_payment_id;
    await paymentDOC.save();

    // Add credits to user
    const updatedUser = await User.findByIdAndUpdate(paymentDOC.userId, {
      $inc: { credits: paymentDOC.credits }
    }, { new: true });

    res.json({
      success: true,
      message: "Payment verified and credits added",
      user: updatedUser,
    });
  } catch (error) {
     return res.status(500).json({ message: `failed to verify razorpay payment ${error}` })
  }
}