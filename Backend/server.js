const { error } = require("console");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const incomeRouter = require("./routes/incomeRoutes");
const expenseRouter = require("./routes/expenseRoutes");
const budgetRouter = require("./routes/budgetRoutes");
const transactionRouter = require("./routes/transactionsRoute");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: "./config.env" });
const app = express();

app.use(express.static("fronend/dist"));

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(express.json());
app.listen(8000, () => {
  console.log("hello from server side");
});
mongoose
  .connect(
    "mongodb+srv://yashbaraiya:wJIOo3aKyRn9ONHz@cluster0.wxpmbr6.mongodb.net/CollectiveCoin?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("db connected succesfully !");
  });

app.use("/api/v1/CollectiveCoin/user", userRouter);
app.use("/api/v1/CollectiveCoin/user/incomes", incomeRouter);
app.use("/api/v1/CollectiveCoin/user/expenses", expenseRouter);
app.use("/api/v1/CollectiveCoin/user/budget", budgetRouter);
app.use("/api/v1/CollectiveCoin/user/transactions", transactionRouter);
//wJIOo3aKyRn9ONHz;
