import express from "express";
import { getFeedback, submitFeedback } from "../controllers/feedbackController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/", protect, getFeedback);

export default router;
