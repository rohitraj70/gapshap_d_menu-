import express from "express";
import {
  getMenuItems,
  getMenuItem,
  getMenuItemsByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/").get(getMenuItems).post(protect, upload.single("image"), createMenuItem);
router.get("/category/:categoryId", getMenuItemsByCategory);
router
  .route("/:id")
  .get(getMenuItem)
  .put(protect, upload.single("image"), updateMenuItem)
  .delete(protect, deleteMenuItem);

export default router;
