import express from "express";
import {
  protect,
  signIn,
  signUp,
  resetPassword,
  restrictToEarner,
  forgotPassword,
  restrictToAdmin,
  updateUser,
  updatePassword,
  isLoggedin,
} from "../controller/authController";
import {
  uploadImage,
  getMembers,
  addUser,
  deletefamily,
  deleteuser,
  sendmailAdmin,
  makeAdmin,
  toggleEarningState,
} from "../controller/userController";

import multer from "multer";
import { v4 as uuidv4 } from "uuid";

var path = require("path");

//configuring the multer middleware to store the data with specific name
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    var fname = "user" + uuidv4() + path.extname(file.originalname);

    callback(null, fname);
  },
});
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/signup", upload.single("photo"), signUp);
router.post("/login", signIn);
router.post("/add-member", protect, restrictToAdmin, addUser);
router.get("/getmembers", protect, getMembers);
router.patch("/delete-member/:id", protect, deleteuser);
router.delete("/deletefamily", protect, deletefamily);
router.post("/forgotpassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updateprofile", protect, updateUser);
router.patch("/updatepassword", protect, updatePassword);

router.patch("/uploadimage", protect, upload.single("photo"), uploadImage);
router.post("/sendmail", protect, sendmailAdmin);
router.patch("/makeadmin/:id", protect, restrictToAdmin, makeAdmin);
router.patch("/makeearner/:id", protect, restrictToAdmin, toggleEarningState);
router.get("/isloggedin", protect, isLoggedin);
//router.get("/EOInfo", ExicutiveOfficerInfo);

export default router;
