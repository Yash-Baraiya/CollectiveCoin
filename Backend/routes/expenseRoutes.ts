import express from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  addExpense,
  getExpense,
  deleteExpense,
  updateExpense,
} from "../controller/expenseController";
import { createCheckOutSession } from "./../stripe";

const router = express.Router();

router
  .post("/add-expense", protect, addExpense)
  .get("/get-expenses", protect, getExpense);

router
  .delete("/delete-expense/:expenseId", protect, deleteExpense)
  .patch("/update-expense/:expenseId", protect, updateExpense)
  .post("/billpayment/:expenseId", protect, createCheckOutSession);
export default router;
