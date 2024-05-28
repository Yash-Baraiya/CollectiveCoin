import { IncomeResponse } from './income.interface';
import { ExpenseResponse } from './expense.interface';
interface transactionResponse {
  incomes: Array<IncomeResponse>;
  expenses: Array<ExpenseResponse>;
}

export default transactionResponse;
