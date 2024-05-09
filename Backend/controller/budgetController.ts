import Expense from "../models/expenseModel";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import Budget from "../models/budgetModel";
import { BudgetIn } from "../interface/budgetInterface";
import { Request, Response, NextFunction } from "express";

//method for adding the budget
export const addBudget = async (req: Request, res: Response) => {
  try {
    console.log("add budget called");
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
    const cat = await Budget.findOne({ category: req.body.category });

    if (cat) {
      throw new Error("budget with this category already exist");
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

    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    console.log("add budget api ended");
    res.status(200).json({
      status: "success",
      message: "Budget Added",
      budget,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for getting the budget
export const getBudget = async (req: Request, res: Response) => {
  try {
    console.log("get budget api called");
    let monthlybudget: Array<BudgetIn> = [];
    let expcategoryAmounts: { [key: string]: number } = {};
    let budgetcategoryamounts: { [key: string]: number } = {};
    let overbudget: Array<object> = [];
    let underbudget: Array<object> = [];
    let monthlyexpense: Array<any> = [];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

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

    for (let expense of expenses) {
      let expMonth = expense.date.getMonth() + 1;
      let expyear = expense.date.getFullYear();
      if (expMonth === currentMonth && expyear === currentYear) {
        monthlyexpense.push(expense);
      }
    }
    // iterating through the expenses array
    monthlyexpense.forEach((expense) => {
      let category = expense.category;
      let amount = expense.amount;

      // igcategory already exists in the categoryAmounts object then add the amount
      if (expcategoryAmounts[category]) {
        expcategoryAmounts[category] += amount;
      } else {
        // else create a new entry for the category
        expcategoryAmounts[category] = amount;
      }
    });

    const budgets = await Budget.find({ familycode: familycode }).sort({
      createdAt: -1,
    });

    for (let budget of budgets) {
      let budMonth = budget.date.getMonth() + 1;
      let budYear = budget.date.getFullYear();
      if (budMonth === currentMonth && budYear === currentYear) {
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
    console.log("get budgets api ended");
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

//method for deleting the budget
export const deleteBudget = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("delete budget api called");
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

    if (!user || !budget) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or budget not found" });
    }

    if (user.name !== budget.CreatedBy) {
      return res.status(403).json({
        status: "failed",
        message: `This budget is added by ${budget.CreatedBy}. You are not allowed to delete it`,
      });
    }

    await Budget.deleteOne({ _id: req.params.budgetId });

    console.log("delete budget api eded");
    res.status(200).json({ status: "success", message: "budget Deleted" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }

  next();
};

//method for updating the budget
export const updateBudget = async (req: Request, res: Response) => {
  try {
    console.log("update budget api called");
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

    const user = await User.findById({ _id: userId });
    if (!user) {
      throw new Error("user not found");
    }
    console.log(req.params.budgetId);
    let budget = await Budget.findById({ _id: req.params.budgetId });
    if (!budget) {
      throw new Error("budget not found");
    }

    console.log(budget.CreatedBy);
    console.log(user.name);
    if (
      budget?.CreatedBy.trim().toLowerCase() !== user.name.trim().toLowerCase()
    ) {
      throw new Error(
        `This budget is added by ${budget.CreatedBy}. You are not allowed to update it`
      );
    }
    budget = await Budget.findByIdAndUpdate(
      { _id: req.params.budgetId },
      {
        title: title,
        amount: amount,
        category: category,
        description: description,
        date: date,
      },
      { new: true }
    );

    console.log("update budget api ended");
    res.status(200).json({
      status: "success",
      messasge: "budget updated successfully",
      budget,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
