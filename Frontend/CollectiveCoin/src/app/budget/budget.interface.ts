interface BudgetResponse {
  status: string;
  budgets: Array<any>;
  overbudget: Array<any>;
  underbudget: Array<any>;
}

export default BudgetResponse;
