import { Document, Schema, model } from "mongoose";
import { IncomeIn } from "../interface/incomeInterface";

const IncomeSchema = new Schema<IncomeIn>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    amount: {
      type: [Number],
      required: true,
      maxLength: 20,
      trim: true,
    },
    type: {
      type: String,
      default: "income",
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
      maxLength: 20,
      trim: true,
    },
    addedBy: {
      type: String,
    },
    familycode: {
      type: String,
    },
  },
  { timestamps: true }
);

const Income = model<IncomeIn>("Income", IncomeSchema);
export default Income;
