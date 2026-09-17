import type { Category } from './models';

export const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export const fecha = new Date();

export const expenseCategories: Category[] = [
  { value: 'transport', label: 'Transporte' },
  { value: 'shop', label: 'Compras' },
  { value: 'enter', label: 'Entretenimiento' },
  { value: 'food', label: 'Alimento' },
  { value: 'health', label: 'Salud' },
  { value: 'saving', label: 'Ahorros' },
  { value: 'bill', label: 'Servicios' },
  { value: 'other', label: 'Otro' },
];

export const expenseMonths: Category[] = meses.map((label, value) => ({ value: String(value), label }));

export const expenseFilters: Category[] = [
  { value: 'exp', label: 'Costoso' },
  { value: 'cheap', label: 'Barato' },
  { value: 'cat', label: 'Categoria' },
  { value: 'date', label: 'Fecha' },
  { value: 'alf', label: 'Alfabeticamente' },
];
