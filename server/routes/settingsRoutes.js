import express from "express";
import { getCafeSettings, updateCafeSettings } from "../controllers/settingsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCafeSettings);
router.put("/", protect, updateCafeSettings);

export default router;
