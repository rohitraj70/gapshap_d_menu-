import asyncHandler from "express-async-handler";
import MenuItem from "../models/MenuItem.js";
import { cloudinary } from "../utils/cloudinary.js";

// @desc    Get all menu items (supports ?search=&category=&featured=&available=)
// @route   GET /api/menu
// @access  Public
export const getMenuItems = asyncHandler(async (req, res) => {
  const { search, category, featured, available } = req.query;
  const filter = {};

  if (search) filter.$text = { $search: search };
  if (category) filter.category = category;
  if (featured !== undefined) filter.featured = featured === "true";
  if (available !== undefined) filter.available = available === "true";

  const items = await MenuItem.find(filter).populate("category", "name order").sort({ createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id).populate("category", "name order");

  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  res.json({ success: true, data: item });
});

// @desc    Get menu items by category
// @route   GET /api/menu/category/:categoryId
// @access  Public
export const getMenuItemsByCategory = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ category: req.params.categoryId })
    .populate("category", "name order")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
});

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = asyncHandler(async (req, res) => {
  const { name, category, description, price, available, featured } = req.body;

  if (!name || !category || price === undefined) {
    res.status(400);
    throw new Error("Name, category and price are required");
  }

  const itemData = {
    name,
    category,
    description,
    price,
    available: available ?? true,
    featured: featured ?? false,
  };

  if (req.file) {
    itemData.image = { url: req.file.path, publicId: req.file.filename };
  }

  const item = await MenuItem.create(itemData);
  const populated = await item.populate("category", "name order");
  res.status(201).json({ success: true, data: populated });
});

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  const { name, category, description, price, available, featured } = req.body;

  item.name = name ?? item.name;
  item.category = category ?? item.category;
  item.description = description ?? item.description;
  item.price = price ?? item.price;
  if (available !== undefined) item.available = available;
  if (featured !== undefined) item.featured = featured;

  if (req.file) {
    if (item.image?.publicId) {
      await cloudinary.uploader.destroy(item.image.publicId).catch(() => {});
    }
    item.image = { url: req.file.path, publicId: req.file.filename };
  }

  const updated = await item.save();
  const populated = await updated.populate("category", "name order");
  res.json({ success: true, data: populated });
});

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = asyncHandler(async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  if (item.image?.publicId) {
    await cloudinary.uploader.destroy(item.image.publicId).catch(() => {});
  }

  await item.deleteOne();
  res.json({ success: true, data: {} });
});
