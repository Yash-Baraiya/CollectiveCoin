interface ExpenseResponse {
  status: string;
  totalexpense: number;
  monthlyexpense: Array<expense>;
  yearlyTotalExpense: number;
  minAmountexpense: number;
  maxAmountexpense: number;
}

interface expense {
  createdAt: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: string;
  updatedAt: string;
  addedBy: string;
  title: string;
  _id: string;
  familycode: string;
  markAspaid?: boolean;
  duedate?: string;
  paidBy?: string;
}
export { ExpenseResponse, expense };
