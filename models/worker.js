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

    orderItems:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    isAvailable: {
      type: Boolean,

    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default:2,
    },

    reviews: [reviewSchema],
    reviews_numbers: {
      type: Number,
      
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
      min: 0,
    },
    profileImage: {
      type: String,
      default: "https://res.cloudinary.com/dvmoqvter/image/upload/v1715170700/maemjvn361ga3cxiqjcr.jpg",
    },
    Id_Image: {
      type: String,
      default: "https://res.cloudinary.com/dvmoqvter/image/upload/v1715170700/maemjvn361ga3cxiqjcr.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);
