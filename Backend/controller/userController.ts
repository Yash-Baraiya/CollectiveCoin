import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import sendEmail from "./../utils/email";
import Income from "../models/incomeModel";
import Expense from "../models/expenseModel";
import Budget from "../models/budgetModel";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryconfig } from "./../utils/cloudinary";
import { createSendToken } from "./authController";

//method for adding the user
export const addUser = async (req: Request, res: Response) => {
  console.log("add user api called");
  const email1 = req.body.email;
  const auth = req.headers.authorization;
  if (!auth) {
    throw new Error("Not Authorized");
  }

  const token = auth.split(" ")[1];
  const decodedtoken = jwt.decode(token) as JwtPayload;
  if (!decodedtoken) {
    throw new Error("token not found");
  }
  const userId = decodedtoken.id;

  const Admin = await User.findOne({ _id: userId });

  if (!Admin) {
    throw new Error("user not found");
  }
  const familycode = Admin.familycode;

  if (!req.body.email) {
    throw new Error("please enter valid email address");
  }
  const user = await User.findOne({ email: email1 });

  if (user) {
    const loginURL = `localhost:4200/login`;

    try {
      await sendEmail({
        from: Admin.email,
        to: email1,
        subject: "login request to Collective Coin",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to CollectiveCoin!</h2>
        <p>Hi there,</p>
        <p>I'm delighted to welcome you to our family budget management community! I've been using our website for a while now, and it has made managing our family finances so much easier.</p>
        <p>To join our family and start managing your finances with us, please click the link below:</p>
        <p><a href="${loginURL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Our Family</a></p>
        <p>During the registration process, you'll be asked to enter a Family Code. Here's the code you need to join our family: <strong>${familycode}</strong></p>
        <p>I'm excited to have you onboard, and I'm looking forward to us achieving our financial goals together!</p>
        <p>Warm regards,<br>Your Name</p></div>`,
      });

      res.status(200).json({
        status: "success",
        messege: "your request sent via email",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "failed",
        messege: error.message,
      });
    }
  } else {
    console.log(Admin);
    const signupURL = `localhost:4200/signup`;

    try {
      await sendEmail({
        from: Admin.email,
        to: email1,
        subject: "sign up request to Collective Coin",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to CollectiveCoin!</h2>
        <p>Hi there,</p>
        <p>I'm delighted to welcome you to our family budget management community! I've been using our website for a while now, and it has made managing our family finances so much easier.</p>
        <p>To join our family and start managing your finances with us, please click the link below:</p>
        <p><a href="${signupURL}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Our Family</a></p>
        <p>During the registration process, you'll be asked to enter a Family Code. Here's the code you need to join our family: <strong>${familycode}</strong></p>
        <p>I'm excited to have you onboard, and I'm looking forward to us achieving our financial goals together!</p>
        <p>Warm regards,<br>Your Name</p></div>`,
      });

      console.log("add user api ended");
      res.status(200).json({
        status: "success",
        messege: "your request sent via email",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "failed",
        messege: error.message,
      });
    }
  }
};

//method for getting all the members of family
export const getMembers = async (req: Request, res: Response) => {
  try {
    console.log("get member api called");

    let firstadmin: any = "";
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not Authorized");
    }

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const userId = decodedtoken.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const familycode = user.familycode;

    const members = await User.find({ familycode: familycode });

    members.forEach((member) => {
      if (!member.priority) {
        throw new Error("loggedinAt not found");
      } else if (firstadmin === "") {
        firstadmin = member;
      } else if (member.priority < firstadmin.priority) {
        firstadmin = member;
      }
    });

    members.sort((a, b) => {
      return a.priority - b.priority;
    });

    res.status(200).json({
      status: "success",
      members,
      firstadmin,
    });
    console.log("get members api ended");
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for removing the user from the family. user will not be removed from database
export const deleteuser = async (req: Request, res: Response) => {
  try {
    console.log("delete user api called");
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not Authorized");
    }

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const AdminId = decodedtoken.id;

    const user = await User.findById(AdminId);
    if (!user) {
      throw new Error("user not found");
    }
    if (user.role !== "admin") {
      throw new Error("You are not allowed to remove anyone");
    }
    const memberId = req.params.id;
    console.log(req.params);
    const member = await User.findById(memberId);
    if (AdminId === memberId) {
      throw new Error("you can not delete yourself");
    }
    if (member?.priority) {
      if (member?.priority < user.priority && member.role === "admin") {
        throw new Error(
          "you can not delete an admin who joined the family before you"
        );
      }
    }
    await User.findByIdAndUpdate(memberId, {
      familycode: null,
      priority: 0,
    });
    await User.findByIdAndUpdate(AdminId, {
      $push: { deleteduser: memberId },
    });

    res.status(200).json({
      status: "success",
      message: "user removed successfully",
      member,
    });
    console.log("delete member api ended");
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for deleting the whole family from the database
export const deletefamily = async (req: Request, res: Response) => {
  try {
    console.log("delete family api called");
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("Not Authorized");
    }
    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const AdminId = decodedtoken.id;

    const user = await User.findById(AdminId);
    if (!user) {
      throw new Error("user not found");
    }

    const familyCode = user.familycode;
    if (user.role !== "admin") {
      throw new Error("You are not allowed to remove anyone");
    }

    if (user.priority !== 1) {
      throw new Error(
        "you can not delete whole family because you are not first admin"
      );
    }

    await User.deleteMany({ familycode: familyCode });
    await Income.deleteMany({ familycode: familyCode });
    await Expense.deleteMany({ familycode: familyCode });
    await Budget.deleteMany({ familycode: familyCode });
    res.status(200).json({
      status: "success",
      messege: "family deleted succesfully",
    });
    console.log("delete family api ended");
  } catch (error: any) {
    res.status(400).json({
      status: "faied",
      message: error.message,
    });
  }
};

//method for uploading the image to cloudinary storage
export const uploadImage = async (req: Request, res: Response) => {
  try {
    console.log("upload image api called");
    const auth = req.headers.authorization;
    if (!auth) throw new Error("not Authorized");

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) throw new Error("token not found");

    const userId = decodedtoken.id;

    let user = await User.findById(userId);
    if (!user) throw new Error("user not found");

    let file = req.file;

    if (!file) throw new Error("please upload file");

    console.log(file);

    let photo = `${file.filename}`;

    const cloudinaryUpload = new Promise((resolve, reject) => {
      4;
      cloudinaryconfig();
      cloudinary.uploader.upload(file.path, (error: any, result: any) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          photo = result.url;
          resolve(result);
        }
      });
    });

    const result = await cloudinaryUpload;

    user = await User.findByIdAndUpdate(
      { _id: userId },
      { photo: photo },
      { new: true }
    );
    console.log("upload image api ended");
    createSendToken(user, 200, res);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for communicating with your admin
export const sendmailAdmin = async (req: Request, res: Response) => {
  try {
    console.log("send admin email api called");
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not Authorized");
    }
    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const userId = decodedtoken.id;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const email = req.body.email;
    const admin = await User.findOne({ email: email });
    console.log(admin);
    if (!admin) {
      throw new Error("admin with that email address in your family not found");
    }

    if (admin.role !== "admin") {
      throw new Error("email you provided is not of admin");
    }
    try {
      await sendEmail({
        from: user.email,
        to: email,
        subject: ` request by ${user.name}`,
        html: req.body.message,
      });

      res.status(200).json({
        status: "success",
        messege: "your request sent via email",
      });
    } catch (error: any) {
      res.status(400).json({
        status: "failed",
        messege: error.message,
      });
    }
    console.log("send email admin api ended");
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for changing  user's role
export const makeAdmin = async (req: Request, res: Response) => {
  try {
    console.log("make admin api called");
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not Authorized");
    }
    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const adminId = decodedtoken.id;

    const admin = await User.findById(adminId);
    if (!admin) {
      throw new Error("admin not found");
    }

    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      throw new Error("user not found");
    }

    if (user.role === "user") {
      const updateduser = await User.findOneAndUpdate(
        { _id: req.params.id },
        { role: "admin" },
        { new: true }
      );
      res.status(200).json({
        status: "success",
        updateduser,
      });
    } else {
      if (user.priority > admin.priority) {
        const updateduser = await User.findOneAndUpdate(
          { _id: req.params.id },
          { role: "user" },
          { new: true }
        );
        res.status(200).json({
          status: "success",
          updateduser,
        });
      } else {
        throw new Error(
          "you can not change the role of admin who joined the family before you "
        );
      }
    }
  } catch (error: any) {
    console.log(error);
    res.status(200).json({
      status: "failed",
      message: error.message,
    });
  }
};

//for chaging the user's earning status
export const toggleEarningState = async (req: Request, res: Response) => {
  try {
    console.log("toggle earning state api called");
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not Authorized");
    }
    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const adminId = decodedtoken.id;

    const admin = await User.findById(adminId);
    if (!admin) {
      throw new Error("admin not found");
    }

    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      throw new Error("user not found");
    }

    if (
      user.role === "user" ||
      (user.role === "admin" && user.priority > admin.priority)
    ) {
      if (user?.isEarning === false) {
        const updateduser = await User.findOneAndUpdate(
          { _id: req.params.id },
          { isEarning: true },
          { new: true }
        );
        console.log(updateduser);
        res.status(200).json({
          status: "success",
          updateduser,
        });
      } else {
        const updateduser = await User.findOneAndUpdate(
          { _id: req.params.id },
          { isEarning: false },
          { new: true }
        );
        console.log("toggle earning state api ended");
        console.log("updated user", updateduser);
        res.status(200).json({
          status: "success",
          updateduser,
        });
      }
    } else {
      throw new Error(
        "you can not change the earining state of admin join the family before you"
      );
    }
  } catch (error: any) {
    console.log(error);
    res.status(200).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const ExicutiveOfficerInfo = async (req: Request, res: Response) => {
  try {
    // const auth = req.headers.authorization;
    // if (!auth) {
    //   return res.status(401).json({ message: "Not authorized" });
    // }

    // const token = auth.split(" ")[1];
    // const decodedtoken = jwt.decode(token) as JwtPayload;
    // if (!decodedtoken) {
    //   return res.status(401).json({ message: "Token not found" });
    // }

    // const adminId = decodedtoken.id;

    // const EO = await User.findById(adminId);
    // if (!EO) {
    //   return res.status(404).json({ message: "Executive Officer not found" });
    // }

    const families = await User.aggregate([
      {
        $group: {
          _id: "$familycode",
          users: { $push: "$$ROOT" },
        },
      },
    ]);

    const transactions = await Expense.aggregate([
      {
        $match: {
          category: "monthlybills",
          markAspaid: true,
          paidBy: { $exists: true },
        },
      },
      {
        $group: {
          _id: "$familycode",
          bills: { $push: "$$ROOT" },
        },
      },
    ]);

    return res.status(200).json({ families, transactions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
