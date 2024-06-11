const Worker = require("../models/worker");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const User = require("../models/User");
const CryptoJS = require("crypto-js"); // Ensure you have required CryptoJS at the top

module.exports = {
  registerWorker: async (req, res) => {
    try {
      const workerBody = req.body;
      const {
        isAvailable,
        rating,
        reviews,
        reviews_numbers,
        specialization,
        description,
        experience,
        totalOrders,
        firstName,
        secondName,
        email,
        password,
        address,
        Phone,
        gender,
      } = workerBody;
  
      const profileImageFilename =
        req.files && req.files.profileImage
          ? req.files.profileImage[0].path
          : null;
      const idImageFilename =
        req.files && req.files.Id_Image ? req.files.Id_Image[0].path : null;
  
      if (!profileImageFilename || !idImageFilename) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Profile image and ID image are required",
          });
      }
  
      const profileImageResult = await cloudinary.uploader.upload(
        profileImageFilename
      );
      const idImageResult = await cloudinary.uploader.upload(idImageFilename);
  
      // Encrypt the password before saving
      const encryptedPassword = CryptoJS.AES.encrypt(
        password,
        process.env.SECRET
      ).toString();
  
      // Creating a new User
      const newUser = new User({
        firstName,
        secondName,
        email,
        password: encryptedPassword,
        address,
        Phone,
        gender,
        userType: "worker",
      });
      await newUser.save();
  
      // Creating a new Worker linked to the User
      const newWorker = new Worker({
        worker: newUser._id,
        orderItems: null, // Set orderItems as per your requirement
        isAvailable: isAvailable ?? true,
        rating: rating ?? 2,
        reviews: reviews ?? [],
        reviews_numbers: reviews_numbers ?? 0,
        specialization,
        description,
        experience,
        totalOrders,
        profileImage: profileImageResult.secure_url,
        Id_Image: idImageResult.secure_url,
      });
  
      await newWorker.save();
  
      return res.status(201).json({
        success: true,
        message: "Worker Registered Successfully",
        data: newWorker,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  setWorkerAvailability: async (req, res) => {
    try {
      // Check if the Authorization header is present in the request

      // Use the extracted user ID to find the worker
      const workerId = req.params.workerId;
      const worker = await Worker.findById(workerId);

      if (!worker) {
        return res.status(404).json({
          success: false,
          error: "Worker not found",
        });
      }

      // Toggle worker availability
      worker.isAvailable = !worker.isAvailable;

      // Save the updated worker information
      await worker.save();

      res.status(200).json({
        success: true,
        message: "Worker availability updated",
        data: worker,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  getAllWorkers: async (req, res) => {
    try {
      // Query all workers from the database
      const workers = await Worker.find().populate({
        path: "worker",
        select: "firstName email",
      });

      if (!workers || workers.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No workers found",
        });
      }

      res.status(200).json({
        success: true,
        data: workers,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },

  // getWorkerDetails: async (req, res) => {
  //   const workerId = req.params.workerId;
  //   try {
  //     const worker = await Worker.find({workerId})
  //       .populate({
  //         path: "worker",
  //         select: "firstName email",
  //       })
  //       .populate({
  //         path: "orderItems",
  //         select: "rating",
  //       });

  //     if (worker.length === 0) { // Check if orders array is empty
  //       return res.status(400).json({
  //         success: false,
  //         message: "No worker found ",
  //       });
  //     } else {
  //       res.status(200).json({
  //         success: true,
  //         data: worker,
  //       });
  //     }
  //   } catch (error) {
  //     res.status(400).json({
  //       success: false,
  //       error: error.message,
  //     });
  //   }
  // },

  rateWorker: async (req, res) => {
    const workerId = req.params.workerId;

    try {
      const worker = await Worker.findByIdAndUpdate(
        { _id: workerId },
        { ...req.body },
        { new: true }
      );
      if (!worker) {
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
          data: worker,
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  updateWorkerReviews: async (req, res) => {
    const { reviews } = req.body;
    const workerId = req.params.workerId;
    const userId = req.cookies.user_id;

    try {
        // Find the worker by ID
        const worker = await Worker.findById(workerId);
        if (!worker) {
            return res.status(400).json({
                success: false,
                message: "Worker not found",
            });
        }

        // Set the reviewer ID for each review
        const updatedReviews = reviews.map(review => ({
            ...review,
            reviewer: userId
        }));

        // Append new reviews to existing ones
        worker.reviews = worker.reviews.concat(updatedReviews);

        // Update reviews_numbers with the new count of reviews
        worker.reviews_numbers = worker.reviews.length;

        // Save the updated worker
        const updatedWorker = await worker.save();

        // Respond with success message and updated data
        res.status(200).json({
            success: true,
            message: "Reviews Updated Successfully",
            data: updatedWorker,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
}


};
