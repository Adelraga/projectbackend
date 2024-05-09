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

const workerController = require("../controller/workerController");
const upload = require("../middlewares/multer");

// get all users

// register

// login

router.post(
  "/registerWorker",
  //upload.single("profileImage"),
  upload.fields([{ name: "profileImage" }, { name: "Id_Image", maxCount: 8 }]),
  verifyToken,
  workerController.registerWorker
);
router.patch(
  "/setWorkerAvailability/:workerId",
  verifyToken,
  workerController.setWorkerAvailability
);
router.get("/getAllWorkers", verifyToken, workerController.getAllWorkers);
// router.get(
//   "/getWorkerDetails/:workerId",
//   verifyToken,
//   workerController.getWorkerDetails
// );

router.patch("/:workerId", verifyToken, workerController.rateWorker);
router.post("/:workerId", verifyToken, workerController.updateWorkerReviews);

module.exports = router;
