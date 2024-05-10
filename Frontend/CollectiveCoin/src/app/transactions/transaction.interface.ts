import { ExpenseResponse } from '../shared/interfaces/expense.interface';
import { IncomeResponse } from '../shared/interfaces/income.interface';

interface transactionResponse {
  incomes: Array<IncomeResponse>;
  expenses: Array<ExpenseResponse>;
}

export default transactionResponse;
