const express = require("express");

const router = express.Router();

const {
  getOrders,
  getAdminNotifications,
  markAdminNotificationsSeen,
  createOrder,
  completeDemoPayment,
  deleteOrder,
} = require("../controllers/orderController");

// GET /api/orders
router.get("/", getOrders);

// Admin order notifications
router.get("/admin-notifications", getAdminNotifications);
router.post("/admin-notifications/seen", markAdminNotificationsSeen);

// POST /api/orders
router.post("/", createOrder);

// POST /api/orders/:id/simulate-payment
router.post("/:id/simulate-payment", completeDemoPayment);

// DELETE /api/orders/:id
router.delete("/:id", deleteOrder);

module.exports = router;
