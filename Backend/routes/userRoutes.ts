import express from "express";
import {
  protect,
  signIn,
  signUp,
  resetPassword,
  restrictTo,
  forgotPassword,
  restrictToAdd,
} from "../controller/authController";
import {
  uploadImage,
  getMembers,
  addUser,
  deletefamily,
  deleteuser,
} from "../controller/userController";

import multer from "multer";
import { v4 as uuidv4 } from "uuid";

var path = require("path");
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(
      null,
      "C:/Users/AM/Desktop/CollectiveCoin/Frontend/CollectiveCoin/src/assets"
    );
  },

  filename: function (req, file, callback) {
    var fname = "user" + uuidv4() + path.extname(file.originalname);

    callback(null, fname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/signup", upload.single("photo"), signUp);
router.post("/login", signIn);
router.post("/add-member", protect, restrictToAdd, addUser);
router.get("/getmembers", protect, getMembers);
router.patch("/delete-member/:id", protect, restrictTo, deleteuser);
router.delete("/deletefamily", protect, deletefamily);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/uploadimage", protect, upload.single("photo"), uploadImage);

export default router;
