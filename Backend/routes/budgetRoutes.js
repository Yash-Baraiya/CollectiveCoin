const express = require("express");
const authController = require("../controller/authController");
const budgetController = require("./../controller/budgetController");
const Router = express.Router();

Router.post("/add-budget", authController.protect, budgetController.addBudget)
  .get("/get-budgets", authController.protect, budgetController.getBudget)
  .delete(
    "/delete-budget/:budgetId",
    authController.protect,
    budgetController.deleteBudget
  );

module.exports = Router;
