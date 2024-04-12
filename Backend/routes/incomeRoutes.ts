import express from "express";
import { protect, restrictTo } from "../controller/authController";
import {
  addIncome,
  getIncomes,
  deleteIncome,
  updateIncome,
} from "../controller/incomeController";

const router = express.Router();

router
  .post("/add-income", protect, restrictTo, addIncome)
  .get("/get-incomes", protect, getIncomes)
  .delete("/delete-income/:incomeId", protect, restrictTo, deleteIncome);

router.patch("/update-income/:incomeId", protect, restrictTo, updateIncome);
export default router;
