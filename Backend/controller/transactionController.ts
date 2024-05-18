import { Request, Response, NextFunction } from "express";
import Expense from "../models/expenseModel";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import Income from "../models/incomeModel";

//method for getting all the transactions
export const getalltransactions = async (
  req: Request,
  res: Response
): Promise<{ incomes: any[]; expenses: any[] }> => {
  try {
    console.log("get all transaction api called");
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

    const incomes: Array<any> = await Income.find({ familycode: familycode });
    const expenses: Array<any> = await Expense.find({ familycode: familycode });

    const transactions: Array<any> = incomes.concat(expenses).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    console.log("get all transactions api ended");
    res.status(200).json({
      transactions,
    });
    return { incomes, expenses };
  } catch (error: any) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
    return { incomes: [], expenses: [] };
  }
};

//method for deleting the transaction
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("delete transactions api called");
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

    const income = await Income.findById(req.params.id);
    const expense = await Expense.findById(req.params.id);

    if (!user || (!expense && !income)) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or transaction not found" });
    }

    if (expense) {
      console.log(user.name, expense.addedBy);
      if (
        user.name.trim().toLowerCase() !== expense.addedBy?.trim().toLowerCase()
      ) {
        return res.status(403).json({
          status: "failed",
          message: `This expense is added by ${expense.addedBy}. You are not allowed to delete it`,
        });
      }

      await Expense.deleteOne({ _id: req.params.id });

      res.status(200).json({ status: "success", message: "Expense Deleted" });
    }
    if (income) {
      if (
        user.name.trim().toLowerCase() !== income.addedBy?.trim().toLowerCase()
      ) {
        return res.status(403).json({
          status: "failed",
          message: `This income is added by ${income.addedBy}. You are not allowed to delete it`,
        });
      }

      await Income.deleteOne({ _id: req.params.id });

      console.log("delete transactions  api ended");
      res.status(200).json({ status: "success", message: "Income Deleted" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }

  next();
};

//method for filtering the transaactions
export const getFilteredTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("get filtered transactions api called");
    let transactions: Array<any>;
    let incomes: Array<any>, expenses: Array<any>;
    const auth = req.headers.authorization;
    if (!auth) {
      throw new Error("Not authorized");
    }

    const token = auth.split(" ")[1];
    const decodedToken = jwt.decode(token) as JwtPayload;
    if (!decodedToken) {
      throw new Error("Token not found");
    }
    const userId = decodedToken.id;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    const familyCode = user.familycode;

    const { type, startDate, endDate } = req.query;

    if (type === "null" && startDate === "null" && endDate === "null") {
      incomes = await Income.find({ familycode: familyCode });
      expenses = await Expense.find({ familycode: familyCode });
      transactions = incomes.concat(expenses);
      res.status(200).json({
        status: "success",
        transactions,
      });
    } else {
      console.log(req.query);
      let query: any = { familycode: familyCode };

      console.log("type :", type);
      if (type && type !== "null" && type !== null && type !== "") {
        if (type !== "income" && type !== "expense") {
          throw new Error(
            "Invalid 'type' parameter. It should be 'income' or 'expense'."
          );
        }
        query.type = type;
      }

      if (startDate && endDate && startDate !== "null" && endDate !== "null") {
        const StartDateD = new Date(startDate as string);
        const EndDateD = new Date(endDate as string);
        if (isNaN(StartDateD.getTime()) || isNaN(EndDateD.getTime())) {
          throw new Error("Invalid date");
        }

        if (StartDateD.getTime() > EndDateD.getTime()) {
          throw new Error("start date can not be greater then end date");
        }
        query.date = {
          $gte: StartDateD,
          $lte: EndDateD,
        };
      } else if (startDate && endDate === "null") {
        const StartDateD = new Date(startDate as string);
        if (isNaN(StartDateD.getTime())) {
          throw new Error("Invalid date");
        }
        query.date = { $gte: StartDateD };
      } else if (endDate && startDate === "null") {
        const EndDateD = new Date(endDate as string);
        if (isNaN(EndDateD.getTime())) {
          throw new Error("Invalid date");
        }
        query.date = { $lte: EndDateD };
      }

      if (query.type) {
        if (query.type === "income") {
          transactions = await Income.find(query);
        } else {
          transactions = await Expense.find(query);
        }
      } else {
        (incomes = await Income.find(
          query.date ? { ...query, date: query.date } : query
        )),
          (expenses = await Expense.find(
            query.date ? { ...query, date: query.date } : query
          )),
          (transactions = incomes.concat(expenses));
      }

      console.log(req.query);
      console.log("get filtered transactions api finished");
      res.status(200).json({
        transactions,
      });
    }
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
