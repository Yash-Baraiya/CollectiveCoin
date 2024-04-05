const Expense = require("../models/expenseModel");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const auth = req.headers.authorization;

  const token = auth.split(" ")[1];
  const decodedtoken = jwt.decode(token);

  const userId = decodedtoken.id;

  const user = await User.findById(userId);

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
    if (amount <= 0 || !amount === "number") {
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

exports.getExpense = async (req, res) => {
  try {
    let totalexpense = 0;
    let monthlyexpense = [];
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;

    const Admin = await User.findOne({ _id: userId });
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

exports.deleteExpense = async (req, res, next) => {
  try {
    // Find user and expense based on their IDs
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;
    const user = await User.findById(userId);
    console.log(user.name);
    const expense = await Expense.findById(req.params.expenseId);
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
