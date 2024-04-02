const express = require("express");
const User = require("./../models/userModel");
const sendEmail = require("./../email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { error } = require("console");
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const Income = require("./../models/incomeModel");
const Expense = require("./../models/expenseModel");
const Budget = require("./../models/budgetModel");
const sharp = require("sharp");

exports.addUser = async (req, res, next) => {
  const email1 = req.body.email;
  const auth = req.headers.authorization;

  const token = auth.split(" ")[1];
  const decodedtoken = jwt.decode(token);

  const userId = decodedtoken.id;

  const Admin = await User.findOne({ _id: userId });
  const familycode = Admin.familycode;

  console.log(familycode);
  console.log(Admin);

  if (!req.body.email) {
    throw new Error("please enter valid email address");
  }
  const user = await User.findOne({ email: email1 });

  if (user) {
    const loginURL = `localhost:4200/login`;

    const message = `your admin is requesting to join with them on out Collective Coin family please join using following url ${loginURL}
    please login with this family code : ${familycode}`;

    try {
      await sendEmail({
        from: Admin.email,
        to: email1,
        subject: "login request to Collective Coin",
        message,
      });

      res.status(200).json({
        status: "success",
        messege: "your request sent via email",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        messege: error.message,
      });
    }
  } else {
    const signupURL = `${req.protocol}:/
    /${req.get("host")}/api/v1/CollectiveCoin/user/signup`;

    const message = `your admin is requesting to join with them on out Collective Coin family please join using following url
    ${signupURL}
    
    please sign up with this family code:${familycode} `;

    try {
      await sendEmail({
        from: Admin.email,
        email: email1,
        subject: "sign up request to Collective Coin",
        message,
      });

      res.status(200).json({
        status: "success",
        messege: "your request sent via email",
      });
    } catch (error) {
      res.status(400).json({
        status: "failed",
        messege: error.message,
      });
    }
  }
};

exports.getMembers = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;

    const user = await User.findById(userId);
    const familycode = await user.familycode;

    const members = await User.find({ familycode: familycode });

    res.status(200).json({
      status: "success",
      members,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

exports.deleteuser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const AdminId = decodedtoken.id;

    const user = await User.findById(AdminId);
    if (user.role !== "admin") {
      throw new Error("You are not allowed to remove anyone");
    }

    const memberId = req.params.id;
    const member = await User.findById(memberId);
    if (AdminId == memberId) {
      await User.findByIdAndUpdate(memberId, { role: "user" });
    }

    await User.findByIdAndUpdate(memberId, { familycode: null });
    await User.findByIdAndUpdate(AdminId, { $push: { deleteduser: memberId } });

    res.status(200).json({
      status: "success",
      message: "user removed successfully",
      member,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.deletefamily = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const AdminId = decodedtoken.id;

    const user = await User.findById(AdminId);
    const familyCode = user.familycode;
    if (user.role !== "admin") {
      throw new Error("You are not allowed to remove anyone");
    }
    await User.deleteMany({ familycode: familyCode });
    await Income.deleteMany({ familycode: familyCode });
    await Expense.deleteMany({ familycode: familyCode });
    await Budget.deleteMany({ familycode: familyCode });
    res.status(200).json({
      status: "success",
      messege: "family deleted succesfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "faied",
      message: error.message,
    });
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;

    const user = await User.findById(userId);
    let file = req.file;

    if (!file) {
      res.status(400).json({
        status: "failed",
        message: "please upload file",
      });
    }
    console.log(file);
    let filetype = file.mimetype.split("/")[1];

    const photo = `${user.name}${file.filename}`;
    console.log(photo);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { photo: photo },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "image uploaded successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
