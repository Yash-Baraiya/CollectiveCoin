import express from "express";
import { protect, restrictToEarner } from "../controller/authController";
import {
  addBudget,
  getBudget,
  deleteBudget,
  updateBudget,
} from "./../controller/budgetController";

const router = express.Router();
router
  .post("/add-budget", protect, restrictToEarner, addBudget)
  .get("/get-budgets", protect, getBudget)
  .delete("/delete-budget/:budgetId", protect, deleteBudget);

router.patch(
  "/update-budget/:budgetId",
  protect,
  restrictToEarner,
  updateBudget
);
export default router;
