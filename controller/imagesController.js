const Images = require("../models/Images");
const cloudinary = require("../utils/cloudinary");

module.exports = {
  createImage: async (req, res) => {
    const imge = req.body;
    try {
     
      const result = await cloudinary.uploader.upload(req.file.path);
      const image = new Images({
        imageUrl: result.secure_url,
      });
      await image.save();
      return res
        .status(201)
        .json({ status: "Success", message: "image created Successfully",data:{image} });
    } catch (err) {
      return res.status(500).json({
        status: "Failed",
        message: "an error occured while creating the image",
        error: err.message,
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
