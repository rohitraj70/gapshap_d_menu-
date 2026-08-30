import express from "express";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", protect, getOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", protect, updateOrderStatus);

export default router;
