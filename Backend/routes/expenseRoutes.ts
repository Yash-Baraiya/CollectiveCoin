import express from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  addExpense,
  getExpense,
  deleteExpense,
  updateExpense,
} from "../controller/expenseController";

const router = express.Router();

router
  .post("/add-expense", protect, addExpense)
  .get("/get-expenses", protect, getExpense)
  .delete("/delete-expense/:expenseId", protect, deleteExpense);

router.patch("/update-expense/:expenseId", protect, updateExpense);
export default router;
