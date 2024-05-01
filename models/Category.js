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
      default: "http://localhost:3000/uploads/60111.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
