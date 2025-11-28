// routes/orderRoutes.ts
import express from "express";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";
import { paypalClient } from "../../config/paypalClient";
import Order from "../../models/Order";
import User from "../../models/User";

const router = express.Router();

/* -----------------------------------------------------
   Helper: Execute PayPal Requests with Timeout
----------------------------------------------------- */
async function executeWithTimeout(request: any, timeout = 60000) {
  return Promise.race([
    paypalClient.execute(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("PayPal request timed out")), timeout)
    ),
  ]);
}

/* -----------------------------------------------------
   CREATE PAYPAL ORDER + SAVE PENDING ORDER IN DB
----------------------------------------------------- */
router.post("/create-paypal-order", async (req, res) => {
  const { userId, products, totalAmount, shippingAddress } = req.body;

  // Required fields
  if (!userId)
    return res.status(400).json({ message: "Missing userId" });

  if (!products || !Array.isArray(products) || products.length === 0)
    return res.status(400).json({ message: "Products list is required" });

  if (!totalAmount)
    return res.status(400).json({ message: "Missing totalAmount" });

  if (!shippingAddress)
    return res.status(400).json({ message: "Missing shippingAddress" });

  try {
    // Validate user exists
    const userExists = await User.findByPk(userId);
    if (!userExists) {
      return res.status(404).json({ message: "Invalid userId - User not found" });
    }

    // PAYPAL ORDER REQUEST
    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "AUD",
            value: totalAmount.toFixed(2),
          },
        },
      ],
    });

    console.time("paypalRequest");
    const paypalOrder: any = await executeWithTimeout(request, 60000);
    console.timeEnd("paypalRequest");

    // SAVE PENDING ORDER IN DB
    const newOrder = await Order.create({
      userId,
      products,
      totalAmount,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    res.json({
      message: "PayPal order created successfully",
      paypalOrderId: paypalOrder.result.id,
      orderId: newOrder.id,
    });
  } catch (err: any) {
    console.error("Create PayPal Order Error:", err.message);

    res.status(500).json({
      message: "PayPal order creation failed",
      error: err.message,
    });
  }
});

/* -----------------------------------------------------
   CAPTURE PAYPAL ORDER + UPDATE DB STATUS
----------------------------------------------------- */
router.post("/capture-paypal-order", async (req, res) => {
  const { paypalOrderId, orderId } = req.body;

  if (!paypalOrderId)
    return res.status(400).json({ message: "Missing PayPal order ID" });

  if (!orderId)
    return res.status(400).json({ message: "Missing local order ID" });

  try {
    // CAPTURE PAYPAL PAYMENT
    const request: any = new checkoutNodeJssdk.orders.OrdersCaptureRequest(
      paypalOrderId
    );
    request.requestBody({});

    const capture: any = await executeWithTimeout(request, 60000);

    // UPDATE ORDER IN DATABASE
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Local order not found" });
    }

    order.paymentStatus = "completed";
    order.orderStatus = "processing"; // next step
    await order.save();

    res.json({
      message: "Payment captured & order updated",
      capture: capture.result,
      updatedOrder: order,
    });
  } catch (err: any) {
    console.error("Capture PayPal Order Error:", err.message);

    res.status(500).json({
      message: "Payment capture failed",
      error: err.message,
    });
  }
});

export default router;
