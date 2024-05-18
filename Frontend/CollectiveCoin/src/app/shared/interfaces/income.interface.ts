interface IncomeResponse {
  totalincome: number;
  monthlyincome: Array<income>;
  yearlyTotalincome: number;
  minAmountincome: number;
  maxAmountincome: number;
}
interface income {
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
}

export { IncomeResponse, income };
