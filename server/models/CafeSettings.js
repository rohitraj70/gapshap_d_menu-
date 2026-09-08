import mongoose from "mongoose";

const cafeSettingsSchema = new mongoose.Schema(
  {
    acceptingOrders: { type: Boolean, default: true },
    customerCareNumber: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("CafeSettings", cafeSettingsSchema);
