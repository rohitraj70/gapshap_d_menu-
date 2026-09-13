import asyncHandler from "express-async-handler";
import Feedback from "../models/Feedback.js";

export const submitFeedback = asyncHandler(async (req, res) => {
  const { customerName, orderId, message } = req.body;

  if (!customerName || !customerName.trim()) {
    res.status(400);
    throw new Error("Customer name is required");
  }

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error("Feedback message is required");
  }

  const feedback = await Feedback.create({
    customerName: customerName.trim(),
    orderId: orderId || "",
    message: message.trim(),
  });

  res.status(201).json({ success: true, data: feedback });
});

export const getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({}).sort({ createdAt: -1 });
  res.json({ success: true, count: feedback.length, data: feedback });
});
