import express from "express";

// Import controllers from
import { createOrder, getExchangeRange, getExpectedAmount, getAvaliableToCurrencies, getOrder, getOrders } from "@/controllers/order.controller";

// Setup router
const router = express.Router();

// Create order from request
router.post("/create", createOrder);
router.get("/order/:id", getOrder);
router.get("/search", getOrders);
router.post("/exchange-range", getExchangeRange);
router.post("/expected-amount", getExpectedAmount);
router.get("/currencies-to", getAvaliableToCurrencies)

// Export router; should always export as default
export default router;
