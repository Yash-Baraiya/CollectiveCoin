import express from "express";
import { protect } from "../controller/authController";
import {
  getalltransactions,
  deleteTransaction,
} from "../controller/transactionController";

const router = express.Router();

router.get("/all-transactions", protect, getalltransactions);

router.delete("/delete-transaction/:id", protect, deleteTransaction);

export default router;
