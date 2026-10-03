import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";
import incomeRouter from "./routes/incomeRoutes";
import expenseRouter from "./routes/expenseRoutes";
import budgetRouter from "./routes/budgetRoutes";
import transactionRouter from "./routes/transactionsRoute";
import * as stripe from "./utils/stripe";
import cors from "cors";
dotenv.config({ path: "" });

const app: Application = express();

app.use(express.static("frontend/dist"));

app.use(
  cors({
    origin: ["http://localhost:4200", "https://collectivecoin-frontend-163934403637.europe-west1.run.app" ]
  })
);

// for passing the json data with request body and raw data for handling webhook
app.use(
  express.json({
    verify: (req: Request, res: Response, buf: Buffer) => {
      (req as any).rawBody = buf;
    },
  })
);

//connecting to localhost
app.listen(8000, () => {
  console.log("hello from server side");
});

//connecting to database
const DB = process.env.DATABASE!.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD!
);
console.log("=> Connecting to DB:", DB.replace(/:[^:@]+@/, ":****@"));
mongoose.connect(DB).then(() => {
  console.log("db connected successfully !");
});

//base routes for all the functionalities
app.use("/api/v1/CollectiveCoin/user", userRouter);
app.use("/api/v1/CollectiveCoin/user/incomes", incomeRouter);
app.use("/api/v1/CollectiveCoin/user/expenses", expenseRouter);
app.use("/api/v1/CollectiveCoin/user/budget", budgetRouter);
app.use("/api/v1/CollectiveCoin/user/transactions", transactionRouter);
