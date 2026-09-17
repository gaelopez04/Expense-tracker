import type { Budget, Category, Expense, User } from './models';
import { parsingPassword, testName } from '../utils/validation';

export const accounts: User[] = [{
  id: 1,
  name: 'Gael Lopez',
  email: 'gael.lopez@prueba.com',
  password: 'simonwe',
  created_at: new Date().toISOString(),
}];

export let budgets: Budget[] = [];
export let expenses: Expense[] = [];

export function createUser(nameUser: string, emailUser: string, passwordUser: string) {
  accounts.push({ id: Date.now(), name: nameUser, email: emailUser, password: passwordUser, created_at: new Date().toISOString() });
}

export function getUserByID(id: number): User | null {
  return accounts.find((account) => account.id === id) ?? null;
}

export function isPasswordCorrect(id: number, password: string): boolean {
  return accounts.some((account) => account.id === id && account.password === password);
}

export function modifyName(id: number, name: string): boolean {
  const account = getUserByID(id);
  if (!account || !testName(name)) return false;
  account.name = name;
  return true;
}

export function modifyPass(id: number, password: string): boolean {
  const account = getUserByID(id);
  if (!account || !parsingPassword(password)) return false;
  account.password = password;
  return true;
}

export function containsMonth(idUser: number, month: number): boolean {
  return budgets.some((budget) => budget.id_user === idUser && budget.month === month);
}

export function getBudget(idUser: number, month: number): Budget {
  return budgets.find((budget) => budget.id_user === idUser && budget.month === month)
    ?? { id: -1, id_user: -1, amount: 0, month: 0, rest: 0 };
}

export function modifyBudget(idUser: number, month: number, amount: number): number {
  const budget = budgets.find((item) => item.id_user === idUser && item.month === month);
  if (!budget) return 0;
  budget.rest += amount - budget.amount;
  budget.amount = amount;
  return budget.rest;
}

export function createBudget(idUser: number, amount: number, month: number, rest: number) {
  budgets.push({ id: budgets.length + 1, id_user: idUser, amount, month, rest });
  budgets.sort((a, b) => a.month - b.month);
}

export function getBudgetsUser(idUser: number): Budget[] {
  return budgets.filter((budget) => budget.id_user === idUser).sort((a, b) => a.month - b.month);
}

export function createExpense(idUser: number, title: string, amount: number, description: string, category: Category, date: Date): number {
  const expense: Expense = { id: expenses.length + 1, id_user: idUser, title, amount, category: category.label, description, date };
  const newRest = differenceAmount(expense);
  expenses.push(expense);
  return newRest;
}

export function sumAllExpenses(idUser: number, month: number): Expense[] {
  return expenses.filter((expense) => expense.id_user === idUser && (month < 0 || expense.date.getMonth() === month));
}

export function differenceAmount(expense: Expense): number {
  const budget = getBudgetsUser(expense.id_user).find((item) => item.month === expense.date.getMonth());
  if (!budget) return -1;
  budget.rest -= expense.amount;
  return budget.rest;
}

export function deleteExpense(id_expense: number) {

    const expense = expenses.find((exp) => exp.id === id_expense);
    console.log(`Expense a eliminar [${expense?.id}]: ${expense}`);
    expenses = expenses.filter((exp) => exp.id != id_expense);
    console.log(`ELIMINADO: [${expense?.id}]`);
}