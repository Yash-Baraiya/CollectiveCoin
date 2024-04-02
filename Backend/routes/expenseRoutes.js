const express = require("express");
const authController = require("../controller/authController");
const expenseController = require("../controller/expenseController");

const Router = express.Router();

Router.post(
  "/add-expense",
  authController.protect,
  expenseController.addExpense
)
  .get("/get-expenses", authController.protect, expenseController.getExpense)
  .delete(
    "/delete-expense/:expenseId",
    authController.protect,
    expenseController.deleteExpense
  );
module.exports = Router;
