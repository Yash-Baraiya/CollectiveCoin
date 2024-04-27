import express from "express";
import { protect } from "../controller/authController";
import {
  getalltransactions,
  deleteTransaction,
  downloadTransactionsPDF,
  getFilteredTransactions,
} from "../controller/transactionController";

const router = express.Router();

router.get("/all-transactions", protect, getalltransactions);
router.get("/filter", protect, getFilteredTransactions);
router.get("/all-transactions/downloadpdf", protect, downloadTransactionsPDF);
router.delete("/delete-transaction/:id", protect, deleteTransaction);

export default router;
