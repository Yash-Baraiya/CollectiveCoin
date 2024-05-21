import Income from "../models/incomeModel";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { IncomeIn } from "../interface/incomeInterface";

//method for adding the income
export const addIncome = async (req: Request, res: Response) => {
  console.log("add income api called");
  const { title, amount, category, description } = req.body;

  let date = req.body.date;
  console.log(date);
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
  if (user.isEarning === false) {
    return res.status(403).json({
      status: "failed",
      messege: "You are not Earning so you can not add any income",
    });
  }

  const income = await Income.create({
    title,
    amount,
    category,
    description,
    date,
    addedBy: user.name,
    familycode: user.familycode,
  });
  console.log(income);

  try {
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    console.log("add income api ended");
    res.status(200).json({
      status: "success",
      message: "Income Added",
      income,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for getting all the incomes
export const getIncomes = async (req: Request, res: Response) => {
  try {
    console.log("get income api called");

    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("not authorized");
    }
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = auth.split(" ")[1];

    try {
      const decodedToken = jwt.decode(token) as JwtPayload;
      const userId = decodedToken.id;

      const admin = await User.findOne({ _id: userId });
      if (!admin) {
        throw new Error("user not found");
      }
      const familyCode = admin.familycode;

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      let yearlyTotalincome = await Income.aggregate([
        {
          $match: {
            familycode: familyCode,
            date: {
              $gte: new Date(currentYear, 0, 1),
              $lt: new Date(currentYear + 1, 0, 1),
            },
          },
        },
        {
          $group: {
            _id: null,
            yearlyTotalincome: { $sum: "$amount" },
          },
        },
      ]);
      let totalincome = await Income.aggregate([
        {
          $match: {
            familycode: familyCode,
            date: {
              $gte: new Date(currentYear, currentMonth - 1, 1),
              $lt: new Date(currentYear, currentMonth, 0),
            },
          },
        },

        {
          $group: {
            _id: null,
            totalincome: { $sum: "$amount" },
          },
        },
      ]);
      let monthlyincome = await Income.aggregate([
        {
          $match: {
            familycode: familyCode,
            date: {
              $gte: new Date(currentYear, currentMonth - 1, 1),
              $lt: new Date(currentYear, currentMonth, 0),
            },
          },
        },
        {
          $addFields: {
            covertedDate: {
              $toDate: "$date",
            },
          },
        },
        {
          $sort: {
            covertedDate: -1,
          },
        },
      ]);

      let maxAmountincome = monthlyincome.reduce((max, income) => {
        return income.amount > max.amount ? income : max;
      }, monthlyincome[0]);

      let minAmountincome = monthlyincome.reduce((min, income) => {
        return income.amount < min.amount ? income : min;
      }, monthlyincome[0]);

      maxAmountincome = maxAmountincome.amount;
      minAmountincome = minAmountincome.amount;

      console.log("get income api ended");
      return res.status(200).json({
        status: "success",
        monthlyincome,
        totalincome,
        yearlyTotalincome,
        minAmountincome,
        maxAmountincome,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//method for deleting the income
export const deleteIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("delete income api called");
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

    // Find user and expense based on their IDs
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }

    const income = await Income.findById(req.params.incomeId);
    if (!income) {
      throw new Error("income not found");
    }
    console.log(income.addedBy);

    // Check if the user is the one who added the expense
    if (user.name !== income.addedBy) {
      return res.status(403).json({
        status: "failed",
        message: `This income is added by ${income.addedBy}. You are not allowed to update it`,
      });
    }
    await Income.deleteOne({ _id: req.params.incomeId });

    console.log("delete income api ended");
    res.status(200).json({ status: "success", message: "Income Deleted" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

  next();
};

//method for updating the income
export const updateIncome = async (req: Request, res: Response) => {
  try {
    console.log("update income api called");
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
    console.log(req.params.incomeId);
    let income = await Income.findById({ _id: req.params.incomeId });
    if (!income) {
      throw new Error("income not found");
    }
    console.log(income);
    if (
      income?.addedBy?.trim().toLowerCase() !== user.name.trim().toLowerCase()
    ) {
      throw new Error(
        `This income is added by ${income.addedBy}. You are not allowed to delete it`
      );
    }

    income = await Income.findByIdAndUpdate(
      { _id: req.params.incomeId },
      {
        title: title,
        amount: amount,
        category: category,
        description: description,
        date: date,
      },
      { new: true }
    );
    console.log("update income api ended");
    res.status(200).json({
      status: "success",
      messasge: "income updated successfully",
      income,
    });
  } catch (error: any) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
