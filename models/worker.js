const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const workerSchema = new Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // orderItems: [orderItemsSchema],

    isAvailable: {
      type: Boolean,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    reviews: [reviewSchema],
    reviews_numbers: {
      type: Number,
      default: "",
    },

    specialization: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 50,
    },
    totalOrders: {
      type: Number,
      required: true,
      min: 0,
    },
    profileImage: {
      type: String,
      default: "http://localhost:3000/uploads/60111.jpg",
    },
    Id_Image: {
      type: String,
      default: "http://localhost:3000/uploads/60111.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);
