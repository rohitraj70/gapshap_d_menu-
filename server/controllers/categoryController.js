import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 });
  res.json({ success: true, count: categories.length, data: categories });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
  const { name, order } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.create({ name, order });
  res.status(201).json({ success: true, data: category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = req.body.name ?? category.name;
  category.order = req.body.order ?? category.order;

  const updated = await category.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const itemCount = await MenuItem.countDocuments({ category: category._id });
  if (itemCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete category: ${itemCount} menu item(s) still reference it. Reassign or delete them first.`
    );
  }

  await category.deleteOne();
  res.json({ success: true, data: {} });
});
