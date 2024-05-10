interface ExpenseResponse {
  status: string;
  expenses: Array<expense>;
  totalexpense: number;
  monthlyexpense: Array<expense>;
  yearlyTotalExpense: number;
}

interface expense {
  createdAt: string;
  amount: Array<number>;
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
