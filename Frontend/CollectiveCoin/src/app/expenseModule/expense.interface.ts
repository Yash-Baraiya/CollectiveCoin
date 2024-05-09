interface ExpenseResponse {
  status: string;
  expenses: Array<any>;
  totalexpense: number;
  monthlyexpense: Array<any>;
  yearlyTotalExpense: any;
}

export default ExpenseResponse;
