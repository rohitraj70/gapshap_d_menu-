import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    orderId: { type: String, default: "" },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
