interface ExpenseResponse {
  status: string;
  expenses: Array<any>;
  totalexpense: number;
  monthlyexpense: Array<any>;
}

export default ExpenseResponse;
