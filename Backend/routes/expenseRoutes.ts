import express from "express";
import { protect } from "../controller/authController";
import {
  addExpense,
  getExpense,
  deleteExpense,
  updateExpense,
} from "../controller/expenseController";
import { createCheckOutSession, handleStripeEvent } from "./../stripe";

const router = express.Router();

router
  .post("/add-expense", protect, addExpense)
  .get("/get-expenses", protect, getExpense);

router
  .delete("/delete-expense/:expenseId", protect, deleteExpense)
  .patch("/update-expense/:expenseId", protect, updateExpense)
  .post("/billpayment/:expenseId", protect, createCheckOutSession);

router.post("/stripe-webhook", handleStripeEvent);
export default router;
