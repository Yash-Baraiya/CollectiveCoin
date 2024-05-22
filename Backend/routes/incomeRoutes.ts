import express from "express";
import { protect, restrictToEarner } from "../controller/authController";
import {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
} from "../controller/incomeController";

const router = express.Router();

router
  .post("/add-income", protect, restrictToEarner, addIncome)
  .get("/get-incomes", protect, getIncomes)
  .delete("/delete-income/:incomeId", protect, restrictToEarner, deleteIncome);

router.patch(
  "/update-income/:incomeId",
  protect,
  restrictToEarner,
  updateIncome
);
export default router;
