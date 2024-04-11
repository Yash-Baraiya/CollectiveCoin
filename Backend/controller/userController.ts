import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import sendEmail from "../email";

import Income from "../models/incomeModel";
import Expense from "../models/expenseModel";
import Budget from "../models/budgetModel";
import { Request, Response } from "express";

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

    await User.findByIdAndUpdate(memberId, { familycode: null });
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
    await findmember(user);
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
    let file = req.file;

    if (!file) {
      res.status(400).json({
        status: "failed",
        message: "please upload file",
      });
      throw new Error("please upload file");
    }
    console.log(file);
    let filetype = file.mimetype.split("/")[1];

    const photo = `${file.filename}`;
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
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

const findmember = async function (user: any) {
  const familyCode = user.familycode;
  const members = await User.find({ familycode: familyCode });
  members.forEach((member) => {
    if (member.loggedInAt && user.loggedInAt) {
      console.log(member, member.loggedInAt.getTime());
      if (member.loggedInAt?.getTime() < user.loggedInAt?.getTime()) {
        throw new Error(
          " you are not the first admin you can not delete whole family"
        );
      }
    }
  });
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
