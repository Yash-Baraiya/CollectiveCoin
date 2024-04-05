const Income = require("../models/incomeModel");
const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

exports.addIncome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;

  const auth = req.headers.authorization;

  const token = auth.split(" ")[1];
  const decodedtoken = jwt.decode(token);

  const userId = decodedtoken.id;

  const user = await User.findById(userId);

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
      message: "Income Added",
      income,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }

  //console.log(income);
};

exports.getIncomes = async (req, res) => {
  try {
    let totalincome = 0;
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = auth.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.id;

      let monthlyincome = [];
      const admin = await User.findOne({ _id: userId });
      const familyCode = admin.familycode;
      let incomes = await Income.find({ familycode: familyCode }).sort({
        createdAt: -1,
      });

      const currentMonth = new Date().getMonth() + 1;
      for (let income of incomes) {
        let incMonth = income.date.getMonth() + 1;
        if (incMonth === currentMonth) {
          monthlyincome.push(income);
        }
      }
      for (let i = 0; i < monthlyincome.length; i++) {
        totalincome = totalincome + monthlyincome[i].amount[0];
      }

      return res.status(200).json({
        status: "success",
        incomes,
        monthlyincome,
        totalincome,
      });
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteIncome = async (req, res, next) => {
  try {
    console.log("this router is calling");
    const auth = req.headers.authorization;

    const token = auth.split(" ")[1];
    const decodedtoken = jwt.decode(token);

    const userId = decodedtoken.id;
    console.log(userId);

    // Find user and expense based on their IDs
    const user = await User.findById(userId);
    console.log(user);
    console.log(user.name);
    const income = await Income.findById(req.params.incomeId);
    console.log(income.addedBy);

    // Check if both user and expense exist
    if (!user || !income) {
      return res
        .status(404)
        .json({ status: "failed", message: "User or income not found" });
    }

    // Check if the user is the one who added the expense
    if (user.name !== income.addedBy) {
      return res.status(403).json({
        status: "failed",
        message: `This income is added by ${income.addedBy}. You are not allowed to delete it`,
      });
    }

    // Delete the expense
    await Income.deleteOne({ _id: req.params.incomeId });

    // Send success response
    res.status(200).json({ status: "success", message: "Income Deleted" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

  // Call next middleware
  next();
};
