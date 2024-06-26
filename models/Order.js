const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
    //   orderItems: [orderItemsSchema],
    orderPrice: {
      type: Number,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit"],
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed", "Failed"],
    },
    orderStatus: {
      type: String,
      default: "Placed",
      enum: ["Pending", "Completed", "Cancelled"],
    },
    orderDate: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedBack: {
      type: String,
    },
    orderImages: [
      {
        type: String,

        required: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
