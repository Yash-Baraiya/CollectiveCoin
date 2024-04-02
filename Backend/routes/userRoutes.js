const express = require("express");
const authController = require("./../controller/authController");
const userController = require("./../controller/userController");
const multer = require("multer");

var path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads");
  },

  filename: function (req, file, callback) {
    var fname = "user" + path.extname(file.originalname);

    callback(null, fname);
  },
});
const upload = multer({ storage: storage });
const Router = express.Router();

Router.post("/signup", authController.signUp);
Router.post("/login", authController.signIn);
Router.post(
  "/add-member",
  authController.protect,
  authController.restrictToAdd,
  userController.addUser
);
Router.get("/getmembers", authController.protect, userController.getMembers);
Router.patch(
  "/delete-member/:id",
  authController.protect,
  authController.restrictTo,
  userController.deleteuser
);
Router.delete(
  "/deletefamily",
  authController.protect,
  userController.deletefamily
);
Router.post("/forgotpassword", authController.forgotPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);

Router.patch(
  "/uploadimage",
  authController.protect,
  upload.single("photo"),
  userController.uploadImage
);

module.exports = Router;
