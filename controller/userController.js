const User = require("../models/User");
const mongoose = require('mongoose');
module.exports = {
  getUser: async (req, res) => {
    try {
      
      const user = await User.findById(req.params.userId);
      // if (!user) {
      //   return res.status(400).json({ msg: "User not found" });
      // } else {
        const { password, __v, updatedAt, createAt, ...userData } = user._doc;
      return res.status(200).json(userData);
      // }
    } catch (error) {
      return res.status(500).json({ status: "failed", msg: error.message });
    }
  },
  

  getAllUsers: async (req, res) => {
    const query = req.query; //  {{BASE_URL}}/api/users/getAllUsers?page=2 to controll the limit and the number of page in postman for pagination

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;

    // get all courses) from DB using Course Model
    const users = await User.find({}, { __v: false, password: false })
      .limit(limit) // pagination session 7
      .skip(skip);
    return res.status(200).json({ status: "success", data: { users } });
  },

  delete: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({status: "failed", msg: "User not found" });
      } else {
        await User.findByIdAndDelete(userId);
        return res
          .status(200)
          .json({ status: "success", msg: "user is deleted" });
      }
    } catch (error) {
      return res.status(500).json({ status: "failed", msg: error.message });
    }
  },


  update: async (req, res) => {
    try {
      const userId = req.params.userId;
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ status: "failed", msg: "Invalid user ID" });
      } else {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: userId },
          {  ...req.body  },
          { new: true },
        );
        return res.status(200).json({
          status: "success",
          msg: "User is updated",
          data: { user: updatedUser },
        });
      }
    } catch (error) {
      return res.status(500).json({ status: "failed", msg: error.message });
    }
  },
};
