import asyncHandler from "express-async-handler";
import CafeSettings from "../models/CafeSettings.js";

const getOrCreateSettings = () => CafeSettings.findOneAndUpdate(
  {},
  { $setOnInsert: { acceptingOrders: true, customerCareNumber: "" } },
  { new: true, upsert: true, setDefaultsOnInsert: true }
);

export const getCafeSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({
    success: true,
    data: {
      acceptingOrders: settings.acceptingOrders,
      customerCareNumber: settings.customerCareNumber,
    },
  });
});

export const updateCafeSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  if (typeof req.body.acceptingOrders === "boolean") {
    settings.acceptingOrders = req.body.acceptingOrders;
  }

  if (req.body.customerCareNumber !== undefined) {
    settings.customerCareNumber = String(req.body.customerCareNumber).trim().slice(0, 30);
  }

  await settings.save();
  res.json({
    success: true,
    data: {
      acceptingOrders: settings.acceptingOrders,
      customerCareNumber: settings.customerCareNumber,
    },
  });
});

export const ensureOrdersAreOpen = async () => {
  const settings = await getOrCreateSettings();
  return settings.acceptingOrders;
};
