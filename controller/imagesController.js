const Images = require("../models/Images");
const cloudinary = require("../utils/cloudinary");

module.exports = {
  createImage: async (req, res) => {
    const profileImageFilename =
        req.files && req.files.profileImage ? req.files.profileImage[0].path : null;
    const idImageFilename =
        req.files && req.files.imageUrl ? req.files.imageUrl[0].path : null;

    try {
        let profileImageResult = { secure_url: "https://res.cloudinary.com/dvmoqvter/image/upload/v1715170700/maemjvn361ga3cxiqjcr.jpg" };
        let idImageResult = { secure_url: "https://res.cloudinary.com/dvmoqvter/image/upload/v1715170700/maemjvn361ga3cxiqjcr.jpg" };

        if (profileImageFilename) {
            profileImageResult = await cloudinary.uploader.upload(profileImageFilename);
        }

        if (idImageFilename) {
            idImageResult = await cloudinary.uploader.upload(idImageFilename);
        }

        // Creating a new Image document
        const newImage = new Images({
            profileImage: profileImageResult.secure_url,
            imageUrl: idImageResult.secure_url,
        });

        await newImage.save();

        return res.status(201).json({
            success: true,
            message: "Images Uploaded Successfully",
            data: newImage,
        });
    } catch (error) {
        console.error("Error uploading images:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
},


  deleteImage: async (req, res) => {
    const imageId = req.params.imageId;
    try {
      const image = await Images.findById(imageId);
      if (!image) {
        return res
          .status(403)
          .json({ status: "failed", message: "image not found" });
      } else {
        const deletedimage = await Images.findByIdAndDelete(imageId);
        if (!deletedimage) {
          return res.status(500).json({
            status: "failure",
            message: "Delete failed",
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: "Deleted Successfully",
            data: deletedimage,
          });
        }
      }
    } catch (e) {
      return res.status(500).json({
        status: "failure",
        message: "Failed to Delete category",
      });
    }
  },
  getAllImages: async (req, res) => {
    const query = req.query; //  {{BASE_URL}}/api/users/getAllUsers?page=2 to controll the limit and the number of page in postman for pagination

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    try {
      const images = await Images.find({}, {}).limit(limit).skip(skip);
      if (!images) {
        return res.status(500).json({
          status: "Failed",
          message: "No images",
          error: err.message,
        });
      } else {
        return res.status(200).json({ status: "Success", data: images });
      }
    } catch (error) {
      return res.status(404).json({ status: "Failed", msg: error.message });
    }
  },

};
