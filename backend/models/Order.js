const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    customer: {
      userId: {
        type: String,
        default: null,
      },

      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },
    },

    items: [
      {
        productId: {
          type: String,
          default: "",
        },

        name: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["UPI", "Netbanking", "Card"],
      default: "UPI",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Demo Paid"],
      default: "Pending",
    },

    isDemoPayment: {
      type: Boolean,
      default: false,
    },

    demoPaymentTokenHash: {
      type: String,
      select: false,
    },

    adminNotificationSeen: {
      type: Boolean,
      default: false,
    },

    amountPaid: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
