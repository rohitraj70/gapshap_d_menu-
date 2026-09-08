import rateLimit from "express-rate-limit";

export const orderRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many order attempts. Please wait a few minutes and try again.",
  },
});