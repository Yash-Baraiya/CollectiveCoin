import Expense from "../models/expenseModel";
import { ExpenseIn } from "../interface/expenseInterface";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import Budget from "../models/budgetModel";
import { BudgetIn } from "../interface/budgetInterface";
import { Request, Response, NextFunction } from "express";
import { AnyArray } from "mongoose";

//type RequiredUserFields = Pick<ExpenseIn, 'category' | 'amount' | 'date'>;

export const addBudget = async (req: Request, res: Response) => {
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
  if (!decodedtoken) {
    throw new Error("token not found");
  }

  const user = await User.findById({ _id: userId });
  console.log(user?.name);
  if (!user) {
    throw new Error("user not found");
  }
  const budget = await Budget.create({
    title,
    amount,
    category,
    description,
    date,
    CreatedBy: user.name,
    familycode: user.familycode,
  });

  try {
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
      message: "Budget Added",
      budget,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const getBudget = async (req: Request, res: Response) => {
  try {
    let monthlybudget: Array<BudgetIn> = [];
    let expcategoryAmounts: { [key: string]: number } = {};
    let budgetcategoryamounts: { [key: string]: number } = {};

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
    if (!decodedtoken) {
      throw new Error("token not found");
    }

    const Admin = await User.findOne({ _id: userId });
    if (!Admin) {
      throw new Error("user not found");
    }
    const familycode = Admin.familycode;
    const expenses: Array<any> = (
      await Expense.find({ familycode: familycode })
    ).map((expense) => ({
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
    }));
    let monthlyexpense: Array<any> = [];
    const currentMonth = new Date().getMonth() + 1;
    for (let expense of expenses) {
      let expMonth = expense.date.getMonth() + 1;
      if (expMonth === currentMonth) {
        monthlyexpense.push(expense);
      }
    }
    // Iterate through the expenses array
    monthlyexpense.forEach((expense) => {
      let category = expense.category;
      let amount = expense.amount;

      // If category already exists in the categoryAmounts object, add the amount
      if (expcategoryAmounts[category]) {
        expcategoryAmounts[category] += amount;
      } else {
        // Otherwise, create a new entry for the category
        expcategoryAmounts[category] = amount;
      }
    });

    const budgets = await Budget.find({ familycode: familycode }).sort({
      createdAt: -1,
    });

    for (let budget of budgets) {
      let budMonth = budget.date.getMonth() + 1;
      if (budMonth === currentMonth) {
        monthlybudget.push(budget);
      }
    }

    monthlybudget.forEach((budget) => {
      let category = budget.category;
      let amount = budget.amount;

      if (budgetcategoryamounts[category]) {
        budgetcategoryamounts[category] += amount;
      } else {
        budgetcategoryamounts[category] = amount;
      }
    });

    let overbudget: Array<object> = [];
    let underbudget: Array<object> = [];
    for (let category in budgetcategoryamounts) {
      if (expcategoryAmounts[category] > budgetcategoryamounts[category]) {
        overbudget.push({
          category: category,
          amount:
            expcategoryAmounts[category] - budgetcategoryamounts[category],
        });
      } else {
        underbudget.push({
          category: category,
          amount:
            budgetcategoryamounts[category] - expcategoryAmounts[category],
        });
      }
    }
    console.log(monthlybudget);
    res.status(200).json({
      status: "success",
      budgets,
      overbudget,
      underbudget,
      monthlybudget,
      expcategoryAmounts,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

export const deleteBudget = async (
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
    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new Error("user not found");
    }
    console.log(user.name);
    const budget = await Budget.findById(req.params.budgetId);

    // Check if both user and expense exist
    if (!user || !budget) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or budget not found" });
    }

    // Check if the user is the one who added the expense
    if (user.name !== budget.CreatedBy) {
      return res.status(403).json({
        status: "failed",
        message: `This budget is added by ${budget.CreatedBy}. You are not allowed to delete it`,
      });
    }

    // Delete the expense
    await Budget.deleteOne({ _id: req.params.expenseId });

    // Send success response
    res.status(200).json({ status: "success", message: "budget Deleted" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }

  next();
};
