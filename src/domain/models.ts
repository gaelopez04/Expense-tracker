export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
};

export type Expense = {
  id: number;
  id_user: number;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
};

export type Budget = {
  id: number;
  id_user: number;
  amount: number;
  month: number;
  rest: number;
};

export type Category = {
  value: string;
  label: string;
};
