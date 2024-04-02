const express = require("express");
const authController = require("./../controller/authController");
const incomeController = require("./../controller/incomeController");

const Router = express.Router();

Router.post(
  "/add-income",
  authController.protect,
  authController.restrictTo,
  incomeController.addIncome
)
  .get("/get-incomes", authController.protect, incomeController.getIncomes)
  .delete(
    "/delete-income/:incomeId",
    authController.protect,
    authController.restrictTo,
    incomeController.deleteIncome
  );
module.exports = Router;
