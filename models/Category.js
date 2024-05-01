const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      default: "https://projectbackend-1-74b9.onrender.com/uploads/60111.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
