import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, address, tableNumber, orderType, items, notes } = req.body;

  if (!customerName || !customerName.trim()) {
    res.status(400);
    throw new Error("Customer name is required");
  }

  if (!orderType || !["outside", "in_cafe"].includes(orderType)) {
    res.status(400);
    throw new Error("Order type is required");
  }

  if (orderType === "outside") {
    if (!phone || !phone.trim()) {
      res.status(400);
      throw new Error("Phone number is required for outside delivery");
    }
    if (!address || !address.trim()) {
      res.status(400);
      throw new Error("Address is required for outside delivery");
    }
  }

  if (orderType === "in_cafe") {
    if (!tableNumber || !tableNumber.trim()) {
      res.status(400);
      throw new Error("Table number is required for in-cafe orders");
    }
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("At least one item is required");
  }

  const normalizedItems = items.map((item) => {
    if (!item || !item.menuItemId || !item.name || !Number(item.qty) || Number(item.qty) <= 0 || !Number(item.price) || Number(item.price) < 0) {
      throw new Error("Each order item must include valid menuItemId, name, qty, and price");
    }

    return {
      menuItemId: item.menuItemId,
      name: item.name,
      variantLabel: item.variantLabel || "",
      qty: Number(item.qty),
      price: Number(item.price),
    };
  });

  const totalAmount = normalizedItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  const order = await Order.create({
    customerName: customerName.trim(),
    phone: phone?.trim() || "",
    address: address?.trim() || "",
    tableNumber: tableNumber?.trim() || "",
    orderType,
    items: normalizedItems,
    totalAmount,
    notes: notes?.trim() || "",
  });

  res.status(201).json({ success: true, data: order });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, data: orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status || !["pending", "confirmed", "completed", "declined"].includes(status)) {
    res.status(400);
    throw new Error("Valid order status is required");
  }

  const order = await Order.findById(id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  await order.save();
  res.json({ success: true, data: order });
});
