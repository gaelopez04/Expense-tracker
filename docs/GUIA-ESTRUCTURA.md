# Guia de estructura del proyecto

Este documento explica donde colocar cada tipo de codigo en Expense Tracker y como conectar archivos usando `import`.

## 1. Estructura general

```text
Expense-tracker/
|-- backend/
|   `-- server.ts
|-- public/
|   `-- imagenes y archivos publicos
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- App.css
|   |-- index.css
|   |-- assets/
|   |-- components/
|   |   `-- common/
|   |-- domain/
|   |-- features/
|   |   `-- auth/
|   |-- types/
|   `-- utils/
|-- index.html
|-- package.json
`-- vite.config.ts
```

La regla principal es separar el codigo por responsabilidad. Una carpeta debe responder una pregunta concreta:

- `components`: que piezas visuales reutilizables existen.
- `features`: que pantallas o funcionalidades completas existen.
- `domain`: que datos y reglas de negocio utiliza la aplicacion.
- `types`: que contratos de TypeScript comparten varios archivos.
- `utils`: que funciones pequenas y genericas ayudan a otros modulos.

---

## 2. Carpeta `src`

Aqui vive el codigo de la aplicacion React.

### `src/main.tsx`

Es el punto de entrada. Su trabajo es montar React en el elemento `root` del HTML.

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

No coloques aqui componentes grandes, consultas, formularios ni reglas de negocio.

### `src/App.tsx`

Debe ser el componente raiz y, preferiblemente, el lugar donde se conectan las rutas.

```tsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthLog } from './features/auth/AuthPages';
import { Dashboard } from './features/dashboard/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthLog testEmail={verifyEmail} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
```

En tu proyecto, `App.tsx` ya conecta autenticacion, pero todavia contiene parte del dashboard. La meta es dejarlo principalmente como archivo de rutas y composicion.

### `src/App.css` e `src/index.css`

- `index.css`: estilos globales, `body`, `html`, fuentes y variables globales.
- `App.css`: estilos de los componentes de la aplicacion.

Si un estilo solo pertenece a un componente, puedes mantenerlo en un CSS del componente, por ejemplo `Dashboard.css`. Evita repetir reglas globales en muchos archivos.

---

## 3. `src/domain`

Contiene los datos y las reglas de negocio. No debe renderizar JSX.

### `src/domain/models.ts`

Define los tipos principales del sistema.

```ts
export type Expense = {
  id: number;
  id_user: number;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
};
```

Aqui van tipos como `User`, `Expense`, `Budget` y `Category`.

### `src/domain/constants.ts`

Contiene informacion fija de la aplicacion: meses, categorias y filtros.

```ts
import type { Category } from './models';

export const expenseMonths: Category[] = [
  { value: '0', label: 'Enero' },
  { value: '1', label: 'Febrero' },
];
```

No coloques estados de React ni componentes aqui.

### `src/domain/store.ts`

Contiene el acceso y las operaciones sobre los datos. Actualmente tu aplicacion usa arrays en memoria.

```ts
import { expenses } from './store';

export function sumAllExpenses(userId: number, month: number) {
  return expenses.filter((expense) =>
    expense.id_user === userId &&
    (month < 0 || expense.date.getMonth() === month),
  );
}
```

Aqui deben estar funciones como:

- crear y buscar usuarios;
- crear y modificar presupuestos;
- crear y consultar gastos;
- calcular el presupuesto restante.

Si en el futuro usas una API o una base de datos, este es un buen lugar para crear `api.ts` o separar `userService.ts`, `budgetService.ts` y `expenseService.ts`.

---

## 4. `src/features`

Una feature es una funcionalidad completa del usuario. Puede contener componentes, hooks y estilos relacionados con esa funcionalidad.

### `src/features/auth`

Contiene login, registro y recuperacion de cuenta.

Archivo actual:

```text
src/features/auth/AuthPages.tsx
```

Ejemplo de exportacion:

```tsx
export function AuthLog() {
  return <form>...</form>;
}
```

Y su uso desde otro archivo:

```tsx
import { AuthLog } from './features/auth/AuthPages';

<AuthLog />;
```

### `src/features/dashboard`

Esta carpeta debe contener el dashboard completo y sus partes relacionadas:

```text
src/features/dashboard/
|-- Dashboard.tsx
|-- HeaderDash.tsx
|-- ProfilePopOver.tsx
|-- Sidebar.tsx
|-- OptionsSideDash.tsx
`-- dashboard.css
```

`Dashboard.tsx` coordina el estado principal. Los componentes hijos reciben datos mediante props.

```tsx
import { HeaderDash } from './HeaderDash';
import { Sidebar } from './Sidebar';

export function Dashboard() {
  return (
    <div className="wholeDash1">
      <Sidebar />
      <main>
        <HeaderDash />
      </main>
    </div>
  );
}
```

### `src/features/expenses`

Esta carpeta es apropiada para los componentes de gastos:

```text
src/features/expenses/
|-- AddExpense.tsx
|-- ExpenseDate.tsx
|-- ExpenseHistory.tsx
|-- ExpenseListItem.tsx
|-- ExpenseFilterPanel.tsx
`-- expenses.css
```

Regla practica: si un componente solo tiene sentido dentro de gastos, va en `features/expenses`. Si puede usarse en login, dashboard y gastos, probablemente va en `components/common`.

### `src/features/budget`

Aqui puede vivir el calendario y la edicion de presupuestos:

```text
src/features/budget/
|-- BudgetDate.tsx
`-- budget.css
```

---

## 5. `src/components`

Contiene piezas visuales reutilizables y pequenas.

Tu componente [ExpenseControls.tsx](../src/components/common/ExpenseControls.tsx) es un ejemplo correcto porque agrupa controles reutilizables como `CustomSelect`, `DotCheck` y `TableExp`.

Ejemplo de componente comun:

```tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
};

export function PrimaryButton({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

Uso:

```tsx
import { PrimaryButton } from './components/common/PrimaryButton';

<PrimaryButton label="Guardar" onClick={handleSave} />;
```

No metas aqui una pantalla completa como login o dashboard. Esas pertenecen a `features`.

---

## 6. `src/types`

Contiene tipos compartidos entre varios componentes.

Archivo actual:

```text
src/types/componentProps.ts
```

Ejemplo:

```ts
export type HeaderDashProps = {
  setDateSel: (value: Date | null) => void;
  setOnSight: (value: boolean) => void;
};
```

Se importa con `type` porque solo existe durante la comprobacion de TypeScript:

```tsx
import type { HeaderDashProps } from './types/componentProps';
```

No coloques aqui funciones que ejecutan logica ni componentes React.

---

## 7. `src/utils`

Contiene funciones genericas que no dependen de React ni de un componente concreto.

Archivo actual:

```text
src/utils/validation.ts
```

Ejemplo:

```ts
export function verifyBudget(amount: string): boolean {
  return amount.trim() !== '' && Number.isFinite(Number(amount));
}
```

Otros ejemplos posibles:

```text
src/utils/date.ts
src/utils/formatCurrency.ts
src/utils/formatDate.ts
```

Una funcion debe ir en `utils` si puede probarse y reutilizarse sin renderizar una interfaz.

---

## 8. Como conectar un archivo con otro

La conexion se hace con `export` en el archivo que ofrece algo e `import` en el archivo que lo necesita.

### Exportacion nombrada

Archivo `src/utils/validation.ts`:

```ts
export function testName(name: string): boolean {
  return name.trim().split(/\s+/).length > 1;
}
```

Otro archivo:

```ts
import { testName } from './utils/validation';

const valid = testName('Gael Lopez');
```

La ruta se calcula desde el archivo que hace el import:

- desde `src/App.tsx` hacia `src/utils/validation.ts`: `./utils/validation`;
- desde `src/features/auth/AuthPages.tsx` hacia `src/utils/validation.ts`: `../../utils/validation`;
- desde `src/components/common/ExpenseControls.tsx` hacia `src/domain/models.ts`: `../../domain/models`.

Cada `..` sube una carpeta. Cada `.` significa la carpeta actual.

### Exportacion por defecto

Archivo `src/features/dashboard/Dashboard.tsx`:

```tsx
export default function Dashboard() {
  return <main>Dashboard</main>;
}
```

Importacion:

```tsx
import Dashboard from './features/dashboard/Dashboard';
```

Con `default` puedes escoger el nombre al importar. Solo debe existir un export default por archivo.

### Varios exports

Archivo:

```ts
export const APP_NAME = 'Expense Tracker';
export function getCurrencySymbol() {
  return '$';
}
```

Importacion:

```ts
import { APP_NAME, getCurrencySymbol } from './constants';
```

### Alias de nombres

Sirve cuando dos archivos exportan nombres iguales:

```tsx
import { AuthLog as AuthLogPage } from './features/auth/AuthPages';
```

Ahora el componente se usa como `<AuthLogPage />`.

### Importar tipos

Usa `import type` para tipos:

```ts
import type { Expense } from './domain/models';
```

Usa un import normal para funciones, objetos o componentes que existen durante la ejecucion:

```ts
import { sumAllExpenses } from './domain/store';
```

### Importar CSS

```tsx
import './App.css';
```

La ruta se calcula igual que cualquier otro import relativo.

---

## 9. `public` y `src/assets`

### `public/`

Usa esta carpeta para archivos que quieres servir directamente desde la raiz del sitio.

Si el archivo esta en `public/darkmode.png`, se referencia asi:

```tsx
<img src="/darkmode.png" alt="Cambiar tema" />
```

No uses `public\\darkmode.png` en el navegador.

### `src/assets/`

Usa esta carpeta para imagenes que quieras importar y procesar con Vite.

```tsx
import logo from './assets/logo.png';

<img src={logo} alt="Expense Tracker" />
```

No mezcles las dos formas para el mismo archivo.

---

## 10. Reglas practicas para decidir donde poner codigo

1. Si es una ruta o la composicion principal, va en `App.tsx`.
2. Si es una pantalla completa, va en `features`.
3. Si es un control reutilizable, va en `components`.
4. Si es un tipo de datos, va en `domain/models.ts` o `types`.
5. Si modifica o consulta datos, va en `domain/store.ts` o en un service.
6. Si valida, transforma o formatea datos sin React, va en `utils`.
7. Si solo contiene valores fijos, va en `domain/constants.ts`.
8. Si un archivo empieza a crecer demasiado, divide sus responsabilidades antes de seguir agregando codigo.

## 11. Orden recomendado para terminar la migracion

1. Mover `Dashboard` a `src/features/dashboard/Dashboard.tsx`.
2. Mover `HeaderDash`, `SideBar`, `ProfilePopOver` y sus componentes hijos a esa feature.
3. Mover `AddExpense`, `ExpenseHistory`, `ExpenseDate` y `ExpenseListItem` a `src/features/expenses`.
4. Mover `BudgetDate` a `src/features/budget`.
5. Cambiar `App.tsx` para que solo contenga rutas e imports.
6. Ejecutar `npm.cmd run build` despues de cada grupo de movimientos.

El objetivo final es que cada archivo tenga una responsabilidad clara y que los datos fluyan mediante props o un contexto, en vez de depender de componentes definidos dentro de `App.tsx`.
