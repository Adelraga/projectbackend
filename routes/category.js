const express = require("express");

const router = express.Router();
const verifyToken = require('../middlewares/verfiyToken');
const allowedTo = require('../middlewares/allowedTo');

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

const categoryController = require("../controller/categoryController");
const Verify = require("../middlewares/validateCookie");
// get all users

// register

// login

router.post("/createCategory",upload.single("profile"), categoryController.createCategory);

router.get(
    "/getAllCategories",
    verifyToken,
    Verify,
    categoryController.getAllCategories
  );
  router.patch(
    "/:id",
    verifyToken,
    categoryController.updateCategory
  );
  router.get("/:categoryId", verifyToken, categoryController.getCategory);
  router.get("/getRandomCategory", verifyToken, categoryController.getRandomCategory);
  router.delete(
    "/:categoryId",
    verifyToken,
    allowedTo("Client", "Vendor"),
    categoryController.deleteCategory
  );
  router.get("/:categoryId", verifyToken, categoryController.patchCategoryImage);


module.exports = router;
