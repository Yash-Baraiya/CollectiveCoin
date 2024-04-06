import { Request, Response, NextFunction } from "express";
import Expense from "../models/expenseModel";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import Income from "../models/incomeModel";

export const getalltransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not authorized");
    }

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token) as JwtPayload;
    if (!decodedtoken) {
      throw new Error("token not found");
    }
    const userid = decodedtoken.id;

    const user = await User.findOne({ _id: userid });
    if (!user) {
      throw new Error("user not found");
    }
    const familycode = await user.familycode;

    const incomes = await Income.find({ familycode: familycode });
    const expenses = await Expense.find({ familycode: familycode });

    res.status(200).json({
      status: "success",
      incomes,
      expenses,
    });
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Find user and expense based on their IDs
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

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    console.log(user.name);
    const income = await Income.findById(req.params.id);
    const expense = await Expense.findById(req.params.id);

    // Check if both user and expense exist
    if (!user || (!expense && !income)) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or transaction not found" });
    }

    // Check if the user is the one who added the expense
    if (expense) {
      if (user.name !== expense.addedBy) {
        return res.status(403).json({
          status: "failed",
          message: `This expense is added by ${expense.addedBy}. You are not allowed to delete it`,
        });
      }

      // Delete the expense
      await Expense.deleteOne({ _id: req.params.id });

      // Send success response
      res.status(200).json({ status: "success", message: "Expense Deleted" });
    }
    if (income) {
      if (user.name !== income.addedBy) {
        return res.status(403).json({
          status: "failed",
          message: `This income is added by ${income.addedBy}. You are not allowed to delete it`,
        });
      }

      // Delete the expense
      await Income.deleteOne({ _id: req.params.id });

      // Send success response
      res.status(200).json({ status: "success", message: "Income Deleted" });
    }
  } catch (error: any) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

  // Call next middleware
  next();
};
