export interface User {
  createdAt: string;
  username: string;
  password?: string;
  id: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: string;
  description?: string;
  category: string;
  date: string;
  title?: string;
  note?: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateExpenseData {
  name: string;
  amount: string;
  description?: string;
  category: string;
  date: string;
  title?: string;
  note?: string;
  userId?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export type LoginCredentials = Pick<User, "username" | "password">;
