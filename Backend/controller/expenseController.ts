import Expense from "../models/expenseModel";
import { ExpenseIn } from "../interface/expenseInterface";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const addExpense = async (req: Request, res: Response) => {
  const { title, amount, category, description, date } = req.body;

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
  const expense = await Expense.create({
    title,
    amount,
    category,
    description,
    date,
    addedBy: user.name,
    familycode: user.familycode,
  });

  try {
    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    res.status(200).json({
      status: "success",
      message: "Expense Added",
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getExpense = async (req: Request, res: Response) => {
  try {
    let totalexpense: number = 0;
    let monthlyexpense: Array<ExpenseIn> = [];
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

    const Admin = await User.findOne({ _id: userId });
    if (!Admin) {
      throw new Error("user not found");
    }
    const familycode = Admin.familycode;
    const expenses = await Expense.find({ familycode: familycode }).sort({
      createdAt: -1,
    });
    console.log(expenses);

    const currentMonth = new Date().getMonth() + 1;
    for (let expense of expenses) {
      let expMonth = expense.date.getMonth() + 1;
      if (expMonth === currentMonth) {
        monthlyexpense.push(expense);
      }
    }
    for (let i = 0; i < monthlyexpense.length; i++) {
      totalexpense = totalexpense + monthlyexpense[i].amount;
    }
    res.status(200).json({
      status: "success",
      expenses,
      totalexpense,
      monthlyexpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteExpense = async (
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
    const expense = await Expense.findById(req.params.expenseId);
    if (!expense) {
      throw new Error("Expense not found");
    }
    console.log(expense.addedBy);

    // Check if both user and expense exist
    if (!user || !expense) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or expense not found" });
    }

    // Check if the user is the one who added the expense
    if (user.name !== expense.addedBy) {
      return res.status(403).json({
        status: "failed",
        message: `This expense is added by ${expense.addedBy}. You are not allowed to delete it`,
      });
    }

    // Delete the expense
    await Expense.deleteOne({ _id: req.params.expenseId });

    // Send success response
    res.status(200).json({ status: "success", message: "Expense Deleted" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

  // Call next middleware
  next();
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { title, amount, category, description, date } = req.body;

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
    if (!user) {
      throw new Error("user not found");
    }
    console.log(req.params.expenseId);
    let expense = await Expense.findById({ _id: req.params.expenseId });
    if (!expense) {
      throw new Error("income not found");
    }
    console.log(expense);
    if (expense?.addedBy !== user.name) {
      throw new Error(
        `This income is added by ${expense.addedBy}. You are not allowed to delete it`
      );
    }
    expense = await Expense.findByIdAndUpdate(
      { _id: req.params.expenseId },
      {
        title: title,
        amount: amount,
        category: category,
        description: description,
        date: date,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      messasge: "income updated successfully",
      expense,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
