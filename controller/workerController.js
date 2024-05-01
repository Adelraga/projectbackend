const Worker = require("../models/worker");
const jwt = require("jsonwebtoken");

module.exports = {
  registerWorker: async (req, res) => {
    // create order
    const workerBody = req.body;
    const {
      worker,
      isAvailable,
      rating,
      reviews,
      reviews_numbers,
      specialization,
      description,
      experience,
      totalOrders,
      profileImage,
      Id_Image,
    } = workerBody;

    // Check if req.files.profileImage and req.files.Id_Image exist before accessing their properties
    const profileImageFilename =
      req.files && req.files.profileImage && req.files.profileImage[0]
        ? req.files.profileImage[0].filename
        : "60111.jpg";
    const idImageFilename =
      req.files && req.files.Id_Image && req.files.Id_Image[0]
        ? req.files.Id_Image[0].filename
        : "60111.jpg";

    // Create a new Worker instance with default values if not provided in req.body
    const newWorker = new Worker({
      worker,
      isAvailable: isAvailable ?? true,
      rating: rating ?? 5,
      reviews: reviews ?? [],
      reviews_numbers: reviews_numbers ?? 0,
      specialization,
      description,
      experience,
      totalOrders,
      profileImage: `https://projectbackend-1-74b9.onrender.com/uploads/${profileImageFilename}`,
      Id_Image: `https://projectbackend-1-74b9.onrender.com/uploads/${idImageFilename}`,
    });

    try {
      await newWorker.save();
      res.status(201).json({
        success: true,
        message: "Worker Register Successfully",
        data: newWorker,
      });
    } catch (err) {
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
      const workerId = req.worker;
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
};
