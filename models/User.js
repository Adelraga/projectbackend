const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
    },
    secondName: {
      type: String,
      required: true,
      unique: true,
    },
    // orders: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Order",
    // },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: Array,
      require: false,
    },
    Phone: {
      type: String,
      require: false,
    },
    gender: {
      type: String,
      require: true,
      enum: ["Male", "Famel", "male", "famel"],
      default: "Male",
    },
    userType: {
      type: String,
      require: true,
      enum: ["Admin", "Worker", "Client"],
      default: "Client",
    },
    profile: {
      type: String,
      require: true,
      default: "http://localhost:3000/uploads/60111.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
