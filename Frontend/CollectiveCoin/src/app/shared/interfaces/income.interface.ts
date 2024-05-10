interface IncomeResponse {
  status: string;
  incomes: Array<income>;
  totalincome: number;
  monthlyincome: Array<income>;
  yearlyTotalincome: number;
}
interface income {
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
}

export { IncomeResponse, income };
