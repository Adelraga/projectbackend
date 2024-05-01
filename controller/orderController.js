const Order = require("../models/Order");

module.exports = {
  placeOrder: async (req, res) => {
    // create order
    const order = new Order(req.body);
    try {
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
          populate: "name phone",
        });

      if (!orders) {
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
      const imageUrls = req.files.map(
        (file) => `http://localhost:3000/uploads/${file.filename}`
      );

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
};
