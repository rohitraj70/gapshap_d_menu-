import asyncHandler from "express-async-handler";
import MenuItem from "../models/MenuItem.js";
import { cloudinary, uploadImage } from "../utils/cloudinary.js";

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
  const { name, category, description, price, salePrice, variants, available, featured } = req.body;

  let parsedVariants = [];
  if (variants) {
    try {
      parsedVariants = JSON.parse(variants);
    } catch {
      res.status(400);
      throw new Error("Invalid size options");
    }
  }

  if (parsedVariants.length > 0) {
    parsedVariants = parsedVariants.map((variant) => ({
      label: String(variant.label || "").trim(),
      price: Number(variant.price),
      salePrice: variant.salePrice === "" || variant.salePrice == null ? null : Number(variant.salePrice),
    }));
    if (parsedVariants.some((variant) => !variant.label || !Number.isFinite(variant.price) || variant.price < 0 ||
      (variant.salePrice !== null && (!Number.isFinite(variant.salePrice) || variant.salePrice < 0 || variant.salePrice >= variant.price)))) {
      res.status(400);
      throw new Error("Each size must have a valid price and sale price must be lower than the price");
    }
  }

  if (!name || !category || price === undefined) {
    res.status(400);
    throw new Error("Name, category and price are required");
  }

  const originalPrice = Number(price);
  const discountedPrice = salePrice === undefined || salePrice === "" ? null : Number(salePrice);
  if (!Number.isFinite(originalPrice) || originalPrice < 0 || (discountedPrice !== null && (!Number.isFinite(discountedPrice) || discountedPrice < 0 || discountedPrice >= originalPrice))) {
    res.status(400);
    throw new Error("Sale price must be lower than the original price");
  }

  const itemData = {
    name,
    category,
    description,
    price: originalPrice,
    salePrice: discountedPrice,
    variants: parsedVariants,
    available: available ?? true,
    featured: featured ?? false,
  };

  if (req.file) {
    const image = await uploadImage(req.file.buffer);
    itemData.image = { url: image.secure_url, publicId: image.public_id };
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

  const { name, category, description, price, salePrice, variants, available, featured } = req.body;

  item.name = name ?? item.name;
  item.category = category ?? item.category;
  item.description = description ?? item.description;
  if (price !== undefined) item.price = Number(price);
  if (salePrice !== undefined) item.salePrice = salePrice === "" ? null : Number(salePrice);
  if (variants !== undefined) {
    let parsedVariants;
    try {
      parsedVariants = JSON.parse(variants);
    } catch {
      res.status(400);
      throw new Error("Invalid size options");
    }
    item.variants = parsedVariants.map((variant) => ({
      label: String(variant.label || "").trim(),
      price: Number(variant.price),
      salePrice: variant.salePrice === "" || variant.salePrice == null ? null : Number(variant.salePrice),
    }));
    if (item.variants.some((variant) => !variant.label || !Number.isFinite(variant.price) || variant.price < 0 ||
      (variant.salePrice !== null && (!Number.isFinite(variant.salePrice) || variant.salePrice < 0 || variant.salePrice >= variant.price)))) {
      res.status(400);
      throw new Error("Each size must have a valid price and sale price must be lower than the price");
    }
  }
  if (!Number.isFinite(item.price) || item.price < 0 || (item.salePrice != null && (!Number.isFinite(item.salePrice) || item.salePrice < 0 || item.salePrice >= item.price))) {
    res.status(400);
    throw new Error("Sale price must be lower than the original price");
  }
  if (available !== undefined) item.available = available === true || available === "true";
  if (featured !== undefined) item.featured = featured === true || featured === "true";

  if (req.file) {
    const image = await uploadImage(req.file.buffer);
    if (item.image?.publicId) {
      await cloudinary.uploader.destroy(item.image.publicId).catch(() => {});
    }
    item.image = { url: image.secure_url, publicId: image.public_id };
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
