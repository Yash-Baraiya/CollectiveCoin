import { Request, Response, NextFunction } from "express";
import Expense from "../models/expenseModel";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import Income from "../models/incomeModel";
import PDFDocument from "pdfkit";

//method for getting all the transactions
export const getalltransactions = async (
  req: Request,
  res: Response
): Promise<{ incomes: any[]; expenses: any[] }> => {
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

    if (!user || (!expense && !income)) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or transaction not found" });
    }

    if (expense) {
      if (user.name !== expense.addedBy) {
        return res.status(403).json({
          status: "failed",
          message: `This expense is added by ${expense.addedBy}. You are not allowed to delete it`,
        });
      }

      await Expense.deleteOne({ _id: req.params.id });

      res.status(200).json({ status: "success", message: "Expense Deleted" });
    }
    if (income) {
      if (user.name !== income.addedBy) {
        return res.status(403).json({
          status: "failed",
          message: `This income is added by ${income.addedBy}. You are not allowed to delete it`,
        });
      }

      await Income.deleteOne({ _id: req.params.id });

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

//method for exporting  transactions as pdf
export const downloadTransactionsPDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { incomes, expenses } = await getalltransactions(req, res);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transactions.pdf"'
    );
    const doc = new PDFDocument();
    doc.fontSize(15);
    doc.lineGap(20);
    doc
      .font("Helvetica-Bold")
      .text("Incomes", { align: "center" })
      .font("Helvetica");

    incomes.forEach((income: any) => {
      doc.text(
        `Title: ${income.title},
              Amount: ${income.amount}, 
              Date: ${new Date(income.date).toLocaleDateString()}`
      );
      doc.moveDown();
    });

    doc
      .addPage()
      .font("Helvetica-Bold")
      .text("Expenses", { align: "center" })
      .font("Helvetica");

    expenses.forEach((expense: any) => {
      doc.text(
        `Title: ${expense.title}, 
              Amount: ${expense.amount}, 
              Date: ${new Date(expense.date).toLocaleDateString()}`
      );
      doc.moveDown();
    });

    doc.pipe(res);
    doc.end();
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

//method for filtering the transaactions
export const getFilteredTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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

    if (startDate && endDate) {
      const parsedStartDate = new Date(startDate as string);
      const parsedEndDate = new Date(endDate as string);
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        throw new Error("Invalid date format");
      }
      query.date = {
        $gte: parsedStartDate,
        $lte: parsedEndDate,
      };
    } else if (startDate) {
      const parsedStartDate = new Date(startDate as string);
      if (isNaN(parsedStartDate.getTime())) {
        throw new Error("Invalid start date format");
      }
      query.date = { $gte: parsedStartDate };
    } else if (endDate) {
      const parsedEndDate = new Date(endDate as string);
      if (isNaN(parsedEndDate.getTime())) {
        throw new Error("Invalid end date format");
      }
      query.date = { $lte: parsedEndDate };
    }

    console.log(query);
    let transactions;

    if (query.type) {
      if (query.type === "income") {
        transactions = await Income.find(query);
      } else {
        transactions = await Expense.find(query);
      }
    } else {
      transactions = await Promise.all([
        Income.find(query.date ? { ...query, date: query.date } : query),
        Expense.find(query.date ? { ...query, date: query.date } : query),
      ]);
    }

    // console.log("transactions :", transactions);
    res.status(200).json({
      status: "success",
      transactions,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
