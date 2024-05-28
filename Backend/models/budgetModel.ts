import { Schema, model } from "mongoose";
import { BudgetIn } from "../interface/budgetInterface";
const budgetSchema = new Schema<BudgetIn>(
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
    type: {
      type: String,
      default: "budget",
    },
    description: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    CreatedBy: {
      type: String,
    },
    familycode: {
      type: String,
    },
  },
  { timestamps: true }
);

const Budget = model<BudgetIn>("Budget", budgetSchema);
export default Budget;
