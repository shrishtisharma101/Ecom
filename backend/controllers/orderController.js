const Order = require("../models/Order");
const AdminNotification = require("../models/AdminNotification");
const mongoose = require("mongoose");
const crypto = require("crypto");

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const query = req.query.userId
      ? { "customer.userId": String(req.query.userId) }
      : {};
    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get Orders Error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// GET /api/orders/admin-notifications
const getAdminNotifications = async (req, res) => {
  try {
    const unreadFilter = {
      $or: [
        { adminNotificationSeen: false },
        { adminNotificationSeen: { $exists: false } },
      ],
    };
    const [unreadOrders, orders, unreadEvents, events] = await Promise.all([
      Order.countDocuments(unreadFilter),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(100)
        .select("orderNumber customer items totalAmount paymentStatus status createdAt adminNotificationSeen"),
      AdminNotification.countDocuments({ seen: false }),
      AdminNotification.find()
        .sort({ createdAt: -1 })
        .limit(200),
    ]);

    const orderNotifications = orders.map((order) => ({
      ...order.toObject(),
      _id: String(order._id),
      type: "order",
      adminNotificationSeen: order.adminNotificationSeen ?? false,
    }));
    const eventNotifications = events.map((event) => ({
      _id: `event:${event._id}`,
      type: event.type,
      createdAt: event.createdAt,
      adminNotificationSeen: event.seen,
      ...event.data,
    }));
    const notifications = [...orderNotifications, ...eventNotifications]
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
      .slice(0, 200);

    res.status(200).json({
      success: true,
      unreadCount: unreadOrders + unreadEvents,
      notifications,
    });
  } catch (error) {
    console.error("Get admin notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin notifications",
    });
  }
};

// POST /api/orders/admin-notifications/seen
const markAdminNotificationsSeen = async (req, res) => {
  try {
    const { notificationIds } = req.body || {};
    if (
      notificationIds !== undefined &&
      (!Array.isArray(notificationIds) ||
        notificationIds.some((id) => {
          if (typeof id !== "string") return true;
          const eventId = id.startsWith("event:") ? id.slice(6) : null;
          return eventId
            ? !mongoose.Types.ObjectId.isValid(eventId)
            : !mongoose.Types.ObjectId.isValid(id);
        }))
    ) {
      return res.status(400).json({
        success: false,
        message: "Notification IDs must contain valid notification IDs",
      });
    }

    const unreadFilter = {
      $or: [
        { adminNotificationSeen: false },
        { adminNotificationSeen: { $exists: false } },
      ],
    };
    const eventIds = notificationIds
      ?.filter((id) => id.startsWith("event:"))
      .map((id) => id.slice(6));
    const orderIds = notificationIds?.filter((id) => !id.startsWith("event:"));
    const orderQuery = notificationIds === undefined
      ? unreadFilter
      : { _id: { $in: orderIds }, ...unreadFilter };
    const eventQuery = notificationIds === undefined
      ? { seen: false }
      : { _id: { $in: eventIds }, seen: false };
    const [orderResult, eventResult] = await Promise.all([
      Order.updateMany(orderQuery, { $set: { adminNotificationSeen: true } }),
      AdminNotification.updateMany(eventQuery, { $set: { seen: true } }),
    ]);
    const [unreadOrders, unreadEvents] = await Promise.all([
      Order.countDocuments(unreadFilter),
      AdminNotification.countDocuments({ seen: false }),
    ]);

    res.status(200).json({
      success: true,
      markedSeen: orderResult.modifiedCount + eventResult.modifiedCount,
      unreadCount: unreadOrders + unreadEvents,
      markedIds: notificationIds || [],
    });
  } catch (error) {
    console.error("Mark admin notifications seen error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark admin notifications as seen",
    });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { customer, items, paymentMethod } = req.body;
    const allowedPaymentMethods = ["UPI", "Netbanking", "Card"];

    if (
      typeof customer?.name !== "string" ||
      !customer.name.trim() ||
      typeof customer?.email !== "string" ||
      !customer.email.trim() ||
      !Array.isArray(items) ||
      items.length === 0 ||
      items.some((item) => !item || typeof item !== "object") ||
      !allowedPaymentMethods.includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer details, order items, and a valid payment method are required",
      });
    }

    const orderItems = items.map((item) => ({
      productId: String(item.productId || ""),
      name: String(item?.name || "").trim(),
      image: typeof item?.image === "string" ? item.image : "",
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    if (orderItems.some((item) =>
      !item.name ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    )) {
      return res.status(400).json({
        success: false,
        message: "Order contains an invalid product, price, or quantity",
      });
    }

    const totalAmount = Number(
      orderItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
    );
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const demoPaymentToken = crypto.randomBytes(32).toString("hex");

    const order = await Order.create({
      orderNumber,
      customer: {
        userId: customer.userId ? String(customer.userId) : null,
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: String(customer.phone || "").trim(),
      },
      items: orderItems,
      paymentMethod,
      paymentStatus: "Pending",
      isDemoPayment: false,
      demoPaymentTokenHash: crypto.createHash("sha256").update(demoPaymentToken).digest("hex"),
      adminNotificationSeen: false,
      amountPaid: 0,
      totalAmount,
      status: "Pending",
    });

    const publicOrder = order.toObject();
    delete publicOrder.demoPaymentTokenHash;
    res.status(201).json({ success: true, order: publicOrder, demoPaymentToken });
  } catch (error) {
    console.error("Create Order Error:", error);

    res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message: "Failed to create order",
      ...(error.code === 11000 ? {} : { error: error.message }),
    });
  }
};

// POST /api/orders/:id/simulate-payment
const completeDemoPayment = async (req, res) => {
  try {
    const suppliedToken = req.body?.paymentToken;
    if (typeof suppliedToken !== "string" || suppliedToken.length !== 64) {
      return res.status(400).json({
        success: false,
        message: "A valid demo payment link is required",
      });
    }

    const order = await Order.findById(req.params.id).select("+demoPaymentTokenHash");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const suppliedHash = crypto.createHash("sha256").update(suppliedToken).digest("hex");
    const expectedHash = order.demoPaymentTokenHash || "";
    const tokenMatches =
      expectedHash.length === suppliedHash.length &&
      crypto.timingSafeEqual(Buffer.from(expectedHash), Buffer.from(suppliedHash));

    if (!tokenMatches) {
      return res.status(403).json({ success: false, message: "Invalid or expired demo payment link" });
    }

    if (order.paymentStatus === "Demo Paid") {
      return res.status(200).json({
        success: true,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          paymentStatus: order.paymentStatus,
          status: order.status,
          amountPaid: order.amountPaid,
        },
      });
    }

    if (order.paymentStatus !== "Pending") {
      return res.status(409).json({ success: false, message: "This order cannot be paid" });
    }

    order.paymentStatus = "Demo Paid";
    order.isDemoPayment = true;
    order.amountPaid = order.totalAmount;
    order.status = "Processing";
    await order.save();

    return res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status,
        amountPaid: order.amountPaid,
      },
    });
  } catch (error) {
    console.error("Complete demo payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not confirm the demo payment",
    });
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Order Error:", error);

    res.status(500).json({
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

// IMPORTANT: export all controller functions
module.exports = {
  getOrders,
  getAdminNotifications,
  markAdminNotificationsSeen,
  createOrder,
  completeDemoPayment,
  deleteOrder,
};
