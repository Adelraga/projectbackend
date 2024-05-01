const express = require("express");

const router = express.Router();
const verifyToken = require("../middlewares/verfiyToken");
const allowedTo = require("../middlewares/allowedTo");

const multer = require("multer");

const diskStorage = multer.diskStorage({
  // to store the image in the local storage
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // to handel the image that has the same name.
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  // to handle if the user enter any type different of image
  const imageType = file.mimetype.split("/")[0];

  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
});

const orderController = require("../controller/orderController");
// get all users

// register

// login

// router.post(
//   "/placeOrder",
//   upload.single("profile"),
//   orderController.placeOrder
// );

router.post("/placeOrder", verifyToken, orderController.placeOrder);
router.post("/:orderId", verifyToken, orderController.getOrderDetails);
router.get("/getUserOrders", verifyToken, orderController.getUserOrders);
router.patch("/:orderId", verifyToken, orderController.rateOrders);
router.patch("/:orderId", verifyToken, orderController.updateOrderStatus);
router.patch("/:orderId", verifyToken, orderController.updatePaymentStatus);
router.patch(
  "/uploadImages/:orderId",
  upload.array("orderImages", 12),
  verifyToken,
  orderController.uploadOrderImages
);

module.exports = router;
