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
      default: "https://res.cloudinary.com/dvmoqvter/image/upload/v1715170700/maemjvn361ga3cxiqjcr.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
