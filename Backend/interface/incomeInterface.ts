export interface IncomeIn extends Document {
  title: string;
  amount: number;
  type: string;
  date: Date;
  category: string;
  description: string;
  addedBy?: string;
  familycode?: string;
}
