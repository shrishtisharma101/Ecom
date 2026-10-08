const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["registration", "contact"],
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

adminNotificationSchema.index({ type: 1, referenceId: 1 }, { unique: true });

module.exports = mongoose.model("AdminNotification", adminNotificationSchema);
