const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      default:"anonymous",
      
      required: false,
    },
    secondName: {
      type: String,
      default:"anonymous",

      required: false,
    },
    // orders: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Order",
    // },
    email: {
      type: String,
      required: false,
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
      enum: ["Admin", "Worker", "Client","admain","worker","client"],
      default: "Client",
    },
    profile: {
      type: String,
      require: false,
      // default: "https://projectbackend-1-74b9.onrender.com/uploads/60111.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
