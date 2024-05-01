const router = require("express").Router();
const usersController = require("../controller/userController");
const verifyToken = require("../middlewares/verfiyToken");
const allowedTo = require("../middlewares/allowedTo");

router.get("/getAllUsers", verifyToken, usersController.getAllUsers);
router.patch("/:userId", verifyToken, usersController.update);
router.get("/:userId", verifyToken, usersController.getUser);
router.delete(
  "/:userId",
  verifyToken,
  allowedTo("Client", "Admin"),
  usersController.delete
);

module.exports = router;
