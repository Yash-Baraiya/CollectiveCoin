const authController = require("./../controller/authController");
const transactionController = require("./../controller/transactionController");
const express = require("express");

const Router = express.Router();

Router.get(
  "/all-transactions",
  authController.protect,
  transactionController.getalltransactions
);

Router.delete(
  "/delete-transaction/:id",
  authController.protect,
  transactionController.deleteTransaction
);

module.exports = Router;
