const Order = require("../models/Order");
const cloudinary = require("../utils/cloudinary");

module.exports = {
  placeOrder: async (req, res) => {
    const userId = req.cookies.user_id;

    try {
      // Extract order data from request body
      const {
        workerId,
        orderPrice,
        address,
        paymentMethod,
        paymentStatus,
        orderStatus,
        rating,
        feedBack,
        orderImages: orderImagesFromBody, // Rename to avoid naming conflict
      } = req.body;

      // Extract order images from req.files and upload to Cloudinary
      const uploadPromises = req.files.map((file) => cloudinary.uploader.upload(file.path));

      // Await all Cloudinary upload promises
      const cloudinaryResults = await Promise.all(uploadPromises);

      // Extract URLs from Cloudinary results
      const orderImages = cloudinaryResults.map((result) => result.secure_url);

      let finalOrderImages = [];

      // Concatenate both sets of order images if orderImagesFromBody is an array
      if (Array.isArray(orderImagesFromBody)) {
        finalOrderImages = orderImages.concat(
          orderImagesFromBody.filter((image) => !orderImages.includes(image))
        );
      } else {
        // If orderImagesFromBody is not an array or not present, use only req.files images
        finalOrderImages = orderImages;
      }

      // Create new order instance
      const order = new Order({
        userId,
        workerId,
        orderPrice,
        address,
        paymentMethod,
        paymentStatus,
        orderStatus,
        rating,
        feedBack,
        orderImages: finalOrderImages, // Use the concatenated order images
      });

      // Save the order
      await order.save();

      // Send success response
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      // Send error response if there's any error
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
          select: "firstName secondName email Phone", // Corrected to match the User schema
        })
        .populate({
          path: "workerId",
          select:
            " firstName secondName specialization description experience totalOrders ", // Adding fields you might want from the Worker
          // if you also need the worker's names (assuming they have a User account as well), add a new path for that
        });

      if (!order) {
        return res.status(400).json({
          success: false,
          message: "No such order found",
        });
      } else {
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

  getUserOrders: async (req, res) => {
    const userId = req.userId;
    try {
      const orders = await Order.find({ userId })
        .populate({
          path: "userId",
          select: "name email phone",
        })
        .populate({
          path: "workerId",
          select: "name phone",
        });
  
      if (orders.length === 0) { // Check if orders array is empty
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
      const orders = await Order.find();

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
  }

};
