const express = require("express");

const router = express.Router();
const verifyToken = require("../middlewares/verfiyToken");
const allowedTo = require("../middlewares/allowedTo");

// const multer = require("multer");

// const diskStorage = multer.diskStorage({
//   // to store the image in the local storage
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     // to handel the image that has the same name.
//     const ext = file.mimetype.split("/")[1];
//     const fileName = `user-${Date.now()}.${ext}`;
//     cb(null, fileName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // to handle if the user enter any type different of image
//   const imageType = file.mimetype.split("/")[0];

//   if (imageType === "image") {
//     return cb(null, true);
//   } else {
//     return cb(appError.create("file must be an image", 400), false);
//   }
// };

// const upload = multer({
//   storage: diskStorage,
//   fileFilter,
// });

const imageController = require("../controller/imagesController");
const Verify = require("../middlewares/validateCookie");
const upload = require("../middlewares/multer");

// get all users
// register
// login

router.post(
  "/createImage",
  upload.fields([{ name: "profileImage" }, { name: "imageUrl", maxCount: 8 }]),
  imageController.createImage
);
router.delete(
  "/deleteImage/:imageId",
  upload.fields([{ name: "profileImage" }, { name: "imageUrl", maxCount: 8 }]),
  imageController.deleteImage
);

router.get(
  "/getAllImages",

  imageController.getAllImages
);
module.exports = router;
