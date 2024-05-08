// uploadMiddleware.js

const multer = require("multer");

const diskStorage = multer.diskStorage({
  // to store the image in the local storage
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // to handle the image that has the same name.
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
    return cb(new Error("File must be an image"), false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter,
});

module.exports = upload;
