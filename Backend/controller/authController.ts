import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
const { promisify } = require("util");
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/userModel";
import sendEmail from "../utils/email";
import otpgenerator from "otp-generator";
import { cloudinaryconfig } from "../utils/cloudinary";
import { v2 as cloudinary } from "cloudinary";

declare global {
  namespace Express {
    interface Request {
      user?: any;
      data?: any;
    }
  }
}

//method for creating and sending signup token to the user
const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "defaultSecret$Yash@123$", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
export const createSendToken = (user: any, statusCode: any, res: Response) => {
  const token = signToken(user._id);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//method for signing the user up
export const signUp = async (req: Request, res: Response) => {
  try {
    console.log("signup api called");
    let priority = 1;
    const existingUser = await User.findOne({ email: req.body.email });
    const existingFamilycode = await User.findOne({
      familycode: req.body.familycode,
    });

    if (existingUser) {
      throw new Error(
        "User with this email already exists. Please use another email."
      );
    }

    const members: any = await User.find({ familycode: req.body.familycode });
    if (members) {
      priority = priority + members.length;
    }

    let file = req.file;

    if (!file) throw new Error("please upload file");

    console.log(file);

    let photo = `${file.filename}`;

    const cloudinaryUpload = new Promise((resolve, reject) => {
      const options = {
        public_id: photo,
      };
      cloudinaryconfig();
      cloudinary.uploader.upload(
        file.path,
        options,
        (error: any, result: any) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            photo = result.url;
            resolve(result);
          }
        }
      );
    });

    const result = await cloudinaryUpload;

    if (!existingFamilycode) {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isEarning: true,
        role: "admin",
        familycode: req.body.familycode,
        photo: photo,
        priority: 1,
      });

      await sendEmail({
        to: req.body.email,
        subject: "Welcome to CollectiveCoin",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to CollectiveCoin!</h2>
        <p>Hi there,</p>
        <p>We are thrilled to welcome you to CollectiveCoin, your go-to platform for managing family finances!</p>
        <p>With CollectiveCoin, you can easily track your family's income, expenses, and budgets, helping you to achieve your financial goals together.</p>
        <p>To get started, simply log in to your account and begin exploring the features.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!</p>
        <p>Thank you for choosing CollectiveCoin. We're excited to have you as part of our community!</p>
        <p>Best regards,<br>The CollectiveCoin Team</p>
    </div>`,
      });
      // Create and send JWT token
      createSendToken(newUser, 201, res);
      console.log("sign up api ended");
    } else {
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isEarning: false,
        role: "user",
        familycode: req.body.familycode,
        photo: photo,
        priority: members.length + 1,
      });
      const message = `Welcome to Collective Coin family! Enjoy your accountings.`;
      await sendEmail({
        to: req.body.email,
        subject: "Welcome to CollectiveCoin",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to CollectiveCoin!</h2>
        <p>Hi there,</p>
        <p>We are thrilled to welcome you to CollectiveCoin, your go-to platform for managing family finances!</p>
        <p>With CollectiveCoin, you can easily track your family's income, expenses, and budgets, helping you to achieve your financial goals together.</p>
        <p>To get started, simply log in to your account and begin exploring the features.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!</p>
        <p>Thank you for choosing CollectiveCoin. We're excited to have you as part of our community!</p>
        <p>Best regards,<br>The CollectiveCoin Team</p>
    </div>`,
      });
      // Create and send JWT token
      createSendToken(newUser, 201, res);
      console.log("sign up api ended");
    }
  } catch (error: any) {
    console.log(error);
    res.status(200).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for logging  user in
export const signIn = async (req: Request, res: Response) => {
  try {
    console.log("singin api called");
    const { email, password, familycode } = req.body;
    if (!email || !password || !familycode) {
      throw new Error("Please provide email, password, and family code.");
    }
    const existingFamilycode = await User.findOne({
      familycode: req.body.familycode,
    });

    let admin = await User.find({ familycode: req.body.familycode });
    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error("there is no account with this email.create a new one");
    }
    if (!user || !(await user.correctPassword(password, user.password))) {
      throw new Error("Incorrect email or password.");
    }

    if (admin !== null) {
      admin.forEach((member) => {
        for (let i = 0; i < member.deleteduser.length; i++) {
          if (!user) {
            throw new Error("user not found");
          }
          if (user.id === member.deleteduser[i]) {
            throw new Error(
              "you were removed from this family so you can not login using this family code"
            );
          }
        }
      });
    }

    if (
      user.familycode === null &&
      !existingFamilycode &&
      user.role === "user"
    ) {
      user = await User.findOneAndUpdate(
        { email },
        { role: "admin", priority: 1, familycode: familycode, isEarning: true },
        { new: true }
      );
      createSendToken(user, 200, res);
    } else if (
      user.familycode === null &&
      !existingFamilycode &&
      user.role === "admin"
    ) {
      user = await User.findOneAndUpdate(
        { email },
        { familycode: familycode, priority: 1, isEarning: true },
        { new: true }
      );
      createSendToken(user, 200, res);
    } else if (user.familycode === null && existingFamilycode) {
      user = await User.findOneAndUpdate(
        { email },
        { familycode, role: "user", priority: admin.length + 1 },
        { new: true }
      );
      createSendToken(user, 200, res);
    } else {
      if (user.familycode !== familycode) {
        throw new Error("Incorrect family code.");
      }

      createSendToken(user, 200, res);
    }
    console.log(" singin api ended");
  } catch (error: any) {
    console.error("Error in signIn:", error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for protecting some functionalities from user before logging in
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new Error("The user belonging to this token does not exist.");
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error: any) {
    console.log(error);
    next(
      res.status(401).json({
        status: "failed",
        message: "your session has been expired please login again",
      })
    );
  }
};

//method for restricting the non-earners from using some functionality
export const restrictToEarner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("token not found");
    }
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token) as JwtPayload;
    if (!decodedToken) {
      throw new Error("token not Found");
    }
    const user = await User.findById(decodedToken.id);

    if (!user || user.isEarning === false) {
      return res.status(403).json({
        status: "failed",
        message: "You are not allowed to perform this action.",
      });
    }

    next();
  } catch (error: any) {
    console.log("Error in restrictTo middleware:", error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//forgot password method
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("forgot password api called ");
    const email = req.body.email;
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("There is no user with email address.");
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const otp = otpgenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);

    user.forgotpasswordotp = otp;
    await user.save({ validateBeforeSave: false });

    const resetURL = `localhost:4200/resetpassword/${resetToken}`;

    try {
      await sendEmail({
        from: "collectivecoin@team.in",
        to: email,
        subject: "reset Your password(valid for 10 minutes)",
        html: ` <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Forgot Your Password?</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password. If this was you, please click the link below to reset your password:</p>
        <p><a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
</p>
        <p>If you didn't request to reset your password, please ignore this email. Your account is still safe and no changes have been made.</p>
        <p>Additionally, here is your One-Time Password (OTP) for verification: <strong>${otp}</strong></p>
        <p>Thank you,<br>CollectiveCoin Team</p>
    </div>`,
      });

      res.status(200).json({
        status: "success",
        messege: "OTP sent successfully to your account",
        resetToken,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.forgotpasswordotp = undefined;
      await user.save({ validateBeforeSave: false });

      throw new Error("There was an error sending the email. Try again later!");
    }
    console.log("forgot password api called");
  } catch (error: any) {
    console.log(error);
    res.status(200).json({
      status: "failed",
      messege: error.message,
    });
  }
};

//method for resetting the password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    console.log("reset password api called");
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
      forgotpasswordotp: req.body.otp,
    });

    if (!user) {
      throw new Error("Token is invalid or has expired or incorrect OTP");
    }
    if (req.body.password !== req.body.passwordConfirm) {
      throw new Error("password and confirm password must be same");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.forgotpasswordotp = undefined;
    await user.save();

    createSendToken(user, 200, res);
    console.log("reset password api ended");
  } catch (error: any) {
    console.log(error);
    res.status(200).json({
      status: "failed",
      messege: error.message,
    });
  }
};

//restrincting some functionalities to only admins
export const restrictToAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not authorized");
    }

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("Token not found");
    }

    const userId = decodedtoken.id;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("not authorized");
    }
    if (user.role === "user") {
      res.status(401).json({
        status: "failed",
        message: "you are not admin you are not allowed perform this action",
      });
    }
    next();
  } catch (error: any) {
    console.log(error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    console.log("update user api called");

    const { name, email } = req.body;

    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not authorized");
    }
    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const userId = decodedtoken.id;

    let user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    let updateFields: any = {
      name: name,
      email: email,
    };

    user = await User.findByIdAndUpdate({ _id: userId }, updateFields, {
      new: true,
    });
    console.log(user);
    createSendToken(user, 200, res);
    console.log("update user api ended");
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    console.log("update password api is called");
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not authorized");
    }
    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const userId = decodedtoken.id;
    console.log(userId);

    const user = await User.findById({ _id: userId }).select("+password");
    console.log(user);
    if (!user) {
      throw new Error("user not found");
    }

    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      throw new Error("Your current password is wrong.");
    }
    if (
      req.body.passwordCurrent.toString().trim().toLowerCase() ===
      req.body.password.toString().trim().toLowerCase()
    ) {
      throw new Error("Your Current PassWord And New Password Can Not Be Same");
    }
    if (
      req.body.passwordConfirm.toString().trim().toLowerCase() !==
      req.body.password.toString().trim().toLowerCase()
    ) {
      throw new Error("Your Password and Confirm Password Must Be Same");
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    console.log("user updated successfully", user);
    await sendEmail({
      from: "collectivecoin@team.io",
      to: user.email,
      subject: "Password Updated ",
      html: `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333333;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="margin: 0; color: #007bff;">Password Updated</h1>
          </div>
          <div style="line-height: 1.6; color: #555555;">
              <p style="margin: 10px 0;">Dear ${user.name},</p>
              <p style="margin: 10px 0;">We wanted to let you know that your password was successfully updated.</p>
              <p style="margin: 10px 0;">If you made this change, you can ignore this email.</p>
              <p style="margin: 10px 0; font-weight: bold; color: #d9534f;">If you did not update your password, please contact your administrator immediately to secure your account and request removal from the family.</p>
              <p style="margin: 10px 0;">Thank you for your attention to this important matter.</p>
          </div>
          <div style="text-align: center; padding-top: 20px; font-size: 12px; color: #777777;">
              <p style="margin: 10px 0;">© 2024 CollectiveCoin. All rights reserved.</p>
          </div>
      </div>
  </div>
  `,
    });
    createSendToken(user, 200, res);

    console.log("update password api ended");
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const isLoggedin = async (req: Request, res: Response) => {
  try {
    console.log("is isloggedin api called");
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not authorized");
    }
    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const userId = decodedtoken.id;
    console.log(userId);

    const user = await User.findById({ _id: userId });

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
    console.log("islogged in api ended");
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
