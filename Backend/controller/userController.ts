import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import sendEmail from "../email";

import Income from "../models/incomeModel";
import Expense from "../models/expenseModel";
import Budget from "../models/budgetModel";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryconfig } from "../cloudinary";

export const addUser = async (req: Request, res: Response) => {
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

    const message = `your admin is requesting to join with them on our Collective app family please join using following url ${loginURL}
    please login with this family code : ${familycode}`;

    try {
      await sendEmail({
        from: Admin.email,
        to: email1,
        subject: "login request to Collective Coin",
        text: message,
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
    const signupURL = `${req.protocol}:/
    /${req.get("host")}/api/v1/CollectiveCoin/user/signup`;

    const message = `your admin is requesting to join with them on out Collective Coin family please join using following url
    ${signupURL}
    
    please sign up with this family code:${familycode} `;

    try {
      await sendEmail({
        from: Admin.email,
        to: email1,
        subject: "sign up request to Collective Coin",
        text: message,
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
  }
};

export const getMembers = async (req: Request, res: Response) => {
  try {
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

    res.status(200).json({
      status: "success",
      members,
      firstadmin,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      error,
    });
  }
};

export const deleteuser = async (req: Request, res: Response) => {
  try {
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
      throw new Error("user not  found");
    }
    if (user.role !== "admin") {
      throw new Error("You are not allowed to remove anyone");
    }

    const memberId = req.params.id;
    const member = await User.findById(memberId);
    if (AdminId === memberId) {
      throw new Error("you can not delete yourself");
    }
    if (member?.priority) {
      if (member?.priority < user.priority && member.role === "admin") {
        throw new Error(
          " you can not delete an admin who join the family before you"
        );
      }
    }
    await User.findByIdAndUpdate(memberId, { familycode: null, priority: 0 });
    await User.findByIdAndUpdate(AdminId, { $push: { deleteduser: memberId } });

    res.status(200).json({
      status: "success",
      message: "user removed successfully",
      member,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const deletefamily = async (req: Request, res: Response) => {
  try {
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
  } catch (error: any) {
    res.status(400).json({
      status: "faied",
      message: error.message,
    });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) throw new Error("not Authorized");

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) throw new Error("token not found");

    const userId = decodedtoken.id;

    const user = await User.findById(userId);
    if (!user) throw new Error("user not found");

    let file = req.file;

    if (!file) throw new Error("please upload file");

    console.log(file);

    const photo = `${file.filename}`;

    const cloudinaryUpload = new Promise((resolve, reject) => {
      4;
      cloudinaryconfig();
      cloudinary.uploader.upload(file.path, (error: any, result: any) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });

    const result = await cloudinaryUpload;

    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { photo: photo },
      { new: true }
    );

    // Send the response
    res.status(200).json({
      status: "success",
      message: "image uploaded successfully",
      updatedUser,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const sendmailAdmin = async (req: Request, res: Response) => {
  try {
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
        subject: "email request to email",
        text: req.body.message,
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
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const makeAdmin = async (req: Request, res: Response) => {
  try {
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
      const updateduser = await User.findByIdAndUpdate(
        { _id: req.params.id },
        { role: "admin" }
      );
      res.status(200).json({
        status: "success",
        updateduser,
      });
    } else {
      if (user.priority > admin.priority) {
        const updateduser = await User.findByIdAndUpdate(
          { _id: req.params.id },
          { role: "user" }
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

export const toggleEarningState = async (req: Request, res: Response) => {
  try {
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
        const updateduser = await User.findByIdAndUpdate(
          { _id: req.params.id },
          { isEarning: true }
        );
        res.status(200).json({
          status: "success",
          updateduser,
        });
      } else {
        const updateduser = await User.findByIdAndUpdate(
          { _id: req.params.id },
          { isEarning: false }
        );
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
