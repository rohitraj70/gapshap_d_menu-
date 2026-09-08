import express from "express";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
import { orderRateLimit } from "../middleware/orderRateLimit.js";

const router = express.Router();

router.post("/", orderRateLimit, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", protect, updateOrderStatus);

export default router;
