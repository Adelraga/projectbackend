const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imagesSchema = new Schema(
  {
    imageUrl: {
      type: String,

      default:
        "https://res.cloudinary.com/dvmoqvter/image/upload/v1715170700/maemjvn361ga3cxiqjcr.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Images", imagesSchema);
