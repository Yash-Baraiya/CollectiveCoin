import express from "express";
import { protect } from "../controller/authController";
import {
  addBudget,
  getBudget,
  deleteBudget,
} from "./../controller/budgetController";
import exp from "constants";

const router = express.Router();
router
  .post("/add-budget", protect, addBudget)
  .get("/get-budgets", protect, getBudget)
  .delete("/delete-budget/:budgetId", protect, deleteBudget);

export default router;
