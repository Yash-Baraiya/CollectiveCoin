interface BudgetResponse {
  status: string;
  budgets: Array<budget>;
  overbudget: Array<budget>;
  underbudget: Array<budget>;
  monthlybudget: Array<budget>;
  expcategoryAmounts: object;
}

interface budget {
  title?: string;
  amount?: number;
  date?: string;
  category?: string;
  CreatedBy?: string;
  description?: string;
  id?: string;
  _id?: string;
}

export { BudgetResponse, budget };
