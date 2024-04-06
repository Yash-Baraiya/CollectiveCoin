import express from "express";
import { protect } from "../controller/authController";
import {
  addExpense,
  getExpense,
  deleteExpense,
} from "../controller/expenseController";

const router = express.Router();

router
  .post("/add-expense", protect, addExpense)
  .get("/get-expenses", protect, getExpense)
  .delete("/delete-expense/:expenseId", protect, deleteExpense);
export default router;
