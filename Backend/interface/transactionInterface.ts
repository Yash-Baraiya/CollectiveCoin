import { Document } from "mongoose";
export interface TransactionIn extends Document {
  title: string;
  amount: number;
  type: string;
  date: Date;
  category: string;
  description: string;
  addedBy?: string;
  familycode?: string;
  markAspaid?: boolean;
  duedate?: Date;
  paidBy?: string;
  recurrence: string;
}
