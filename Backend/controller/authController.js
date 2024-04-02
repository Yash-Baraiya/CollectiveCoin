const express = require("express");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");
const sendEmail = require("./../email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // Set secure cookie option in production
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  // Remove sensitive data from the user object
  user.password = undefined;
  // Send token and user data in response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = async (req, res, next) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    const existingFamilycode = await User.findOne({
      familycode: req.body.familycode,
    });
    if (existingUser) {
      throw new Error(
        "User with this email already exists. Please use another email."
      );
    }
    if (!existingFamilycode && req.body.role === "user") {
      throw new Error(
        "You are the first one to use that famly code so please login as Admin"
      );
    }
    // Create new user

    if (req.body.role === "admin" && req.body.isEarning === "false") {
      throw new Error(
        "you can not login as admin because  you are not earning"
      );
    }
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isEarning: req.body.isEarning,
      role: req.body.role,
      familycode: req.body.familycode,
    });

    const message = `Welcome to Collective Coin family! Enjoy your accountings.`;
    await sendEmail({
      email: req.body.email,
      subject: "Welcome to CollectiveCoin",
      message,
    });
    // Create and send JWT token
    createSendToken(newUser, 201, res);
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password, familycode } = req.body;
    const existingFamilycode = await User.findOne({
      familycode: req.body.familycode,
    });

    // Check if email, password, and family code are provided
    if (!email || !password || !familycode) {
      throw new Error("Please provide email, password, and family code.");
    }
    let admin = await User.findOne({ familycode });
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("there is no account with this email.create a new one");
    }
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect email or password.");
    }

    if (admin !== null) {
      for (let i = 0; i < admin.deleteduser.length; i++) {
        if (user.id === admin.deleteduser[i]) {
          throw new Error(
            "you were removed from this family so you can not login using this family code"
          );
        }
      }
    }

    if (
      user.familycode === null &&
      !existingFamilycode &&
      user.role === "user"
    ) {
      user = await User.findOneAndUpdate(
        { email },
        { role: "admin" },
        { new: true }
      );
    }
    if (user.familycode === null) {
      user = await User.findOneAndUpdate(
        { email },
        { familycode },
        { new: true }
      );
      createSendToken(user, 200, res);
    } else {
      // Check if family code matches
      if (user.familycode !== familycode) {
        throw new Error("Incorrect family code.");
      }
      // Create and send JWT token
      createSendToken(user, 200, res);
    }
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.protect = async (req, res, next) => {
  try {
    // Check for JWT token in request headers
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      throw new Error("You are not logged in! Please log in to get access.");
    }
    // Verify JWT token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("The user belonging to this token does not exist.");
    }
    // Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new Error("User recently changed password! Please log in again.");
    }
    // Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    console.error("Error in protect middleware:", error);
    next(
      res.status(401).json({
        status: "failed",
        message: error.message,
      })
    );
  }
};

exports.restrictTo = async (req, res, next) => {
  try {
    // Fetch the user by ID
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token);
    const user = await User.findById(decodedToken.id);
    // Check if the user is allowed to perform the action
    if (!user || user.isEarning === false) {
      return res.status(403).json({
        status: "failed",
        message: "You are not allowed to perform this action.",
      });
    }
    // If the user is allowed, continue to the next middleware
    next();
  } catch (error) {
    console.error("Error in restrictTo middleware:", error);
    res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // 1) Get user based on POSTed email
    const email = req.body.email;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("There is no user with email address.");
    }
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `localhost:4200/resetpassword`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
      await sendEmail({
        email: email,
        subject: "reset Your password(valid for 10 minutes)",
        message,
      });

      res.status(200).json({
        status: "success",
        messege: "your request sent via email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new Error("There was an error sending the email. Try again later!");
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "failed",
      messege: error.message,
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      throw new Error("Token is invalid or has expired", 400);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(200).json({
      status: "failed",
      messege: "internal server error",
    });
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    console.log("this route is getting called");
    const user = await User.findById(req.user.id).select("+password");

    console.log(req.data); // 2) Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      throw new Error("Your current password is wrong.", 401);
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(200).json({
      status: "failed",
      messege: "internal server error",
    });
  }
};

exports.restrictToAdd = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;
    const user = await User.findById(userId);

    if (user.role === "user") {
      res.status(401).json({
        status: "failed",
        message: "you are not admin you are not allowed to add members",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
