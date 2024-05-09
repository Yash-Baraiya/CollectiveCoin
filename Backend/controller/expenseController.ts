import Expense from "../models/expenseModel";
import { ExpenseIn } from "../interface/expenseInterface";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import sendEmail from "../utils/email";
import * as cron from "node-cron";

//method for adding the expense
export const addExpense = async (req: Request, res: Response) => {
  console.log("add expense api called");
  const { title, amount, category, description, date, markAspaid, duedate } =
    req.body;
  console.log(category);
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

  try {
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    let currenttime = new Date(date).getTime();
    if (duedate && new Date(duedate).getTime() < currenttime) {
      throw new Error(" you bill is dued please mark it as paid");
    }
    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      date,
      addedBy: user.name,
      familycode: user.familycode,
      markAspaid: markAspaid,
      duedate: duedate,
    });

    if (
      new Date(duedate).getTime() > new Date(date).getTime() &&
      markAspaid === false
    ) {
      setTimeout(async () => {
        const users = await User.find({ familycode: user.familycode });
        for (const u of users) {
          await sendEmail({
            from: "collectivecoin@team.in",
            to: u.email,
            subject: "Bill Due Reminder",
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f7f7f7;">
          <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #333; text-align: center;">Bill Due Reminder</h1>
              <p style="color: #666; text-align: center;">Hello,</p>
              <p style="color: #666; margin-bottom: 20px; text-align: center;">We're writing to remind you that a new bill has been added by ${user.name} in your family, and it's due to be paid soon. Here are the details:</p>
              <div style="padding: 20px; background-color: #f7f7f7; border-radius: 10px;">
                  <h2 style="color: #333; margin-top: 0;">Bill Details:</h2>
                  <p style="margin-bottom: 10px;"><strong>Title:</strong> ${title}</p>
                  <p style="margin-bottom: 10px;"><strong>Amount:</strong> ${amount}</p>
                  <p style="margin-bottom: 10px;"><strong>Due Date:</strong>${duedate}</p>
              </div>
              <p style="color: #666; margin-top: 20px;">Please make sure to take necessary actions to pay the bill on time.</p>
              <p style="color: #666;">Thank you.</p>
          </div>
          </div>`,
          });
        }
      }, 0);
    }
    console.log("add expense api ended")
    res.status(200).json({
      status: "success",
      message: "Expense Added",
      expense,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for geetting all the expenses
export const getExpense = async (req: Request, res: Response) => {
  try {
    console.log("get expense api called");
    let totalexpense: number = 0;
    let monthlyexpense: Array<ExpenseIn> = [];
    let yearlyTotalExpense: number = 0;
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

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    for (let expense of expenses) {
      let expyear = expense.date.getFullYear();

      if (expyear === currentYear) {
        yearlyTotalExpense = yearlyTotalExpense + expense.amount;
      }
    }
    for (let expense of expenses) {
      let expMonth = expense.date.getMonth() + 1;
      let expyear = expense.date.getFullYear();
      if (expMonth === currentMonth && expyear === currentYear) {
        monthlyexpense.push(expense);
      }
    }
    for (let i = 0; i < monthlyexpense.length; i++) {
      totalexpense = totalexpense + monthlyexpense[i].amount;
    }
    console.log("get expense api ended");
    res.status(200).json({
      status: "success",
      expenses,
      totalexpense,
      monthlyexpense,
      yearlyTotalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

//method for deleting the expense
export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("delete expense api called");
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

    if (!user || !expense) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or expense not found" });
    }

    if (
      user.name.trim().toLowerCase() !== expense.addedBy?.trim().toLowerCase()
    ) {
      return res.status(403).json({
        status: "failed",
        message: `This expense is added by ${expense.addedBy}. You are not allowed to delete it`,
      });
    }

    await Expense.deleteOne({ _id: req.params.expenseId });

    console.log("delete expense api ended");
    res.status(200).json({ status: "success", message: "Expense Deleted" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }

  next();
};

//method for updating the expense
export const updateExpense = async (req: Request, res: Response) => {
  try {
    console.log("update expense api called");
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
    if (
      expense?.addedBy?.trim().toLowerCase() !== user.name.trim().toLowerCase()
    ) {
      throw new Error(
        `This expense is added by ${expense.addedBy}. You are not allowed to update it`
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

    console.log("update expese api ended")
    res.status(200).json({
      status: "success",
      messasge: "expense updated successfully",
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

cron.schedule("0 0 1 * *", async () => {
  try {
    const expenses = await Expense.find({ category: "subscriptions" });

    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    expenses.forEach((expense) => {
      Expense.create({
        title: expense.title,
        amount: expense.amount,
        category: "subscriptions",
        description: expense.description,
        date: firstDayOfMonth,
        addedBy: expense.addedBy,
        familycode: expense.familycode,
      });
      console.log("Monthly subscriptions expense added successfully.");
    });
  } catch (error) {
    console.error("Error adding monthly subscriptions expense:", error);
  }
});
