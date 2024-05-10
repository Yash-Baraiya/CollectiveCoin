import { Schema, model } from "mongoose";
import { ExpenseIn } from "../interface/expenseInterface";

const ExpenseSchema = new Schema<ExpenseIn>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    amount: {
      type: Number,
      required: true,
      maxLength: 20,
      trim: true,
    },
    type: {
      type: String,
      default: "expense",
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    addedBy: {
      type: String,
    },
    familycode: {
      type: String,
    },
    markAspaid: {
      type: Boolean,
      default: true,
    },
    duedate: {
      type: Date,
      trim: true,
    },
    paidBy: {
      type: String,
      trim: true,
    },
    recurrence: {
      type: String,
      enum: ["one-time", "yearly", "quarterly", "monthly"],
      default: "one-time",
    },
  },

  { timestamps: true }
);

const Expense = model<ExpenseIn>("Expense", ExpenseSchema);
export default Expense;
