import { Request, Response, NextFunction } from "express";
import Expense from "../models/expenseModel";
import User from "../models/userModel";
import jwt, { JwtPayload } from "jsonwebtoken";
import Income from "../models/incomeModel";
import PDFDocument from "pdfkit";

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

export const downloadTransactionsPDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { incomes, expenses } = await getalltransactions(req, res);

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set font size and line height
    doc.fontSize(12);
    doc.lineGap(10);

    // Add incomes heading
    doc
      .font("Helvetica-Bold")
      .text("Incomes", { align: "center" })
      .font("Helvetica");

    // Add incomes data to the PDF
    incomes.forEach((income: any) => {
      doc.text(
        `Title: ${income.title}, Amount: ${income.amount}, Date: ${new Date(
          income.date
        ).toLocaleDateString()}`
      );
      doc.moveDown();
    });

    // Add expenses heading
    doc
      .addPage()
      .font("Helvetica-Bold")
      .text("Expenses", { align: "center" })
      .font("Helvetica");

    // Add expenses data to the PDF
    expenses.forEach((expense: any) => {
      doc.text(
        `Title: ${expense.title}, Amount: ${expense.amount}, Date: ${new Date(
          expense.date
        ).toLocaleDateString()}`
      );
      doc.moveDown();
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transactions.pdf"'
    );
    doc.pipe(res);
    doc.end(); // End the PDF document
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    // Add type condition if it's provided
    if (type && type !== "null") {
      if (type !== "income" && type !== "expense") {
        throw new Error(
          "Invalid 'type' parameter. It should be 'income' or 'expense'."
        );
      }
      query.type = type;
    }

    // Add date conditions only if both startDate and endDate are provided
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

    // Fetch transactions based on the constructed query
    let transactions;

    // Determine which model to use based on the presence of type in the query
    if (query.type) {
      if (query.type === "income") {
        transactions = await Income.find(query);
      } else {
        transactions = await Expense.find(query);
      }
    } else {
      // If type is not specified, fetch both income and expense transactions
      transactions = await Promise.all([
        Income.find(query.date ? { ...query, date: query.date } : query),
        Expense.find(query.date ? { ...query, date: query.date } : query),
      ]);
    }

    console.log("transactions :", transactions);
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
