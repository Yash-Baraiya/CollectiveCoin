import express, { Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";
import incomeRouter from "./routes/incomeRoutes";
import expenseRouter from "./routes/expenseRoutes";
import budgetRouter from "./routes/budgetRoutes";
import transactionRouter from "./routes/transactionsRoute";
import cors from "cors";
dotenv.config({ path: "./config.env" });
const app: Application = express();

app.use(express.static("frontend/dist"));

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(express.json());
app.listen(8000, () => {
  console.log("hello from server side");
});

const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);
mongoose.connect(DB).then(() => {
  console.log("db connected successfully !");
});

app.use("/api/v1/CollectiveCoin/user", userRouter);
app.use("/api/v1/CollectiveCoin/user/incomes", incomeRouter);
app.use("/api/v1/CollectiveCoin/user/expenses", expenseRouter);
app.use("/api/v1/CollectiveCoin/user/budget", budgetRouter);
app.use("/api/v1/CollectiveCoin/user/transactions", transactionRouter);
