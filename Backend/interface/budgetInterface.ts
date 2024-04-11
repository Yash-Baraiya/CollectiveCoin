import { Document } from "mongoose";
export interface BudgetIn extends Document {
  title: string;
  amount: number;
  type: string;
  date: Date;
  category: string;
  description: string;
  CreatedBy: string;
  familycode: string;
}
