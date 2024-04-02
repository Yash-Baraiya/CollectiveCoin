const Expense = require("../models/expenseModel");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const Budget = require("./../models/budgetModel");
const Income = require("./../models/incomeModel");

exports.addBudget = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const auth = req.headers.authorization;

  const token = auth.split(" ")[1];
  const decodedtoken = jwt.decode(token);

  const userId = decodedtoken.id;

  const user = await User.findById(userId);

  const budget = await Expense.create({
    title,
    amount,
    category,
    description,
    date,
    createdBy: user.name,
    familycode: user.familycode,
  });

  try {
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }

    res.status(200).json({
      status: "success",
      message: "Budget Added",
      budget,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;

    const Admin = await User.findOne({ _id: userId });
    const familycode = Admin.familycode;
    const budgets = await Budget.find({ familycode: familycode }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      status: "success",
      budgets,
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.deleteBudget = async (req, res, next) => {
  try {
    // Find user and expense based on their IDs
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;
    const user = await User.findById(userId);
    console.log(user.name);
    const budget = await Expense.findById(req.params.budgetId);
    //console.log(expense.addedBy);

    // Check if both user and expense exist
    if (!user || !budget) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or budget not found" });
    }

    // Check if the user is the one who added the expense
    if (user.name !== budget.createdBy) {
      return res.status(403).json({
        status: "failed",
        message: `This budget is added by ${budget.createdBy}. You are not allowed to delete it`,
      });
    }

    // Delete the expense
    await Budget.deleteOne({ _id: req.params.expenseId });

    // Send success response
    res.status(200).json({ status: "success", message: "budget Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }

  next();
};
