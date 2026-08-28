import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, trim: true, default: "" },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0, default: null },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    available: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

menuItemSchema.index({ name: "text", description: "text" });

export default mongoose.model("MenuItem", menuItemSchema);
