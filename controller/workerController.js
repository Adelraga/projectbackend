const Worker = require("../models/worker");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");


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
      } = workerBody;

      const profileImageFilename = req.files && req.files.profileImage ? req.files.profileImage[0].path : null;
      const idImageFilename = req.files && req.files.Id_Image ? req.files.Id_Image[0].path : null;

      if (!profileImageFilename || !idImageFilename) {
        return res.status(400).json({ success: false, error: "Profile image and ID image are required" });
      }

      const profileImageResult = await cloudinary.uploader.upload(profileImageFilename);
      const idImageResult = await cloudinary.uploader.upload(idImageFilename);
      

      const newWorker = new Worker({
        isAvailable: isAvailable ?? true,
        rating: rating ?? 5,
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
        message: "Worker Register Successfully",
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
      const workers = await Worker.find();

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

  getWorkerDetails: async (req, res) => {
    const workerId = req.params.workerId;
    try {
      const worker = await Worker.findById({workerId})
        .populate({
          path: "worker",
          select: "firstName email",
        })
        .populate({
          path: "orderItems",
          select: "rating",
        });
  
      if (worker.length === 0) { // Check if orders array is empty
        return res.status(400).json({
          success: false,
          message: "No worker found ",
        });
      } else {
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





};
