const Order = require("../models/Order");
const Worker = require("../models/worker");
const cloudinary = require("../utils/cloudinary");
const mongoose = require("mongoose"); 

module.exports = {
  placeOrder: async (req, res) => {
    const userId = req.cookies.user_id;

    try {
      const {
        workerId,
        orderPrice,
        address,
        paymentMethod,
        paymentStatus,
        orderStatus,
        rating,
        description,
        orderDate,
        feedBack,
        orderImages,
      } = req.body;

      if (!mongoose.Types.ObjectId.isValid(workerId)) {
        return res.status(400).json({ success: false, error: "Invalid worker ID format" });
      }

      const workerExists = await Worker.findById(workerId);
      if (!workerExists) {
        return res.status(404).json({ success: false, error: "Worker not found" });
      }

      // const uploadPromises = req.files.map(file =>
      //   cloudinary.uploader.upload(file.path)
      // );

      // const cloudinaryResults = await Promise.all(uploadPromises);
      // const orderImages = cloudinaryResults.map(result => result.secure_url);

      // let finalOrderImages = [];
      // if (Array.isArray(orderImagesFromBody)) {
      //   finalOrderImages = orderImages.concat(
      //     orderImagesFromBody.filter(image => !orderImages.includes(image))
      //   );
      // } else {
      //   finalOrderImages = orderImages;
      // }

      const order = new Order({
        userId,
        workerId,
        orderPrice,
        address,
        paymentMethod,
        paymentStatus,
        orderStatus,
        rating,
        description,
        orderDate,
        feedBack,
        orderImages,
      });

      await order.save();

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  
  getOrderDetails: async (req, res) => {
    const orderId = req.params.orderId;
    try {
      const order = await Order.findById(orderId)
        .populate({
          path: "userId",
          select: "firstName secondName profile email",
        })
        .populate({
          path: "workerId",
          select: "profileImage rating",
          populate: {
              path: "worker",  // Change worker to user
              select: "email firstName secondName",
          }
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "No such order found",
        });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
},


  getUserOrders: async (req, res) => {
    const userId = req.cookies.user_id;
    try {
      const orders = await Order.find({ userId })
        .populate({
          path: "userId",
          select: "firstName secondName profile email",
        })
        .populate({
          path: "workerId",
          select: "profileImage rating",
          populate: {
              path: "worker",  // Change worker to user
              select: "email firstName secondName",
          }
      });

      if (orders.length === 0) {
        // Check if orders array is empty
        return res.status(400).json({
          success: false,
          message: "No orders found for this user",
        });
      } else {
        res.status(200).json({
          success: true,
          data: orders,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  rateOrders: async (req, res) => {
    const orderId = req.params.orderId;

    try {
      const order = await Order.findByIdAndUpdate(
        { _id: orderId },
        { ...req.body },
        { new: true }
      );
      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found",
        });
      }
      //order.rating = rating;
      //await order.save();
      else {
        res.status(200).json({
          success: true,
          data: order,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    const { orderStatus } = req.body;
    const orderId = req.params.orderId;

    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        { new: true }
      );
      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found",
        });
      }
      //order.rating = rating;
      //await order.save();
      else {
        res.status(200).json({
          success: true,
          message: "Order Updated Successfully",
          data: order,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
  updatePaymentStatus: async (req, res) => {
    const { paymentStatus } = req.body;
    const orderId = req.params;

    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus },
        { new: true }
      );
      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found",
        });
      }
      //order.rating = rating;
      //await order.save();
      else {
        res.status(200).json({
          success: true,
          message: "Order payment status Updated Successfully",
          data: order,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
  uploadOrderImages: async (req, res) => {
    const orderId = req.params.orderId;

    try {
      const imageUrls = [];

      // Upload each file to Cloudinary and collect the URLs
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }

      // Update the order with the new image URLs
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          $push: { orderImages: { $each: imageUrls } },
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Order images uploaded successfully",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  getAllOrders: async (req, res) => {
    try {
        // Query all orders from the database
        const orders = await Order.find()
            .populate({
                path: "userId",
                select: "firstName secondName profile email",
            })
            .populate({
              path: "workerId",
              select: "profileImage rating",
              populate: {
                  path: "worker",  // Change worker to user
                  select: "email firstName secondName",
              }
          });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No orders found",
            });
        }

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message,
        });
    }
},
};
