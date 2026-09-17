import { useState, type MouseEvent } from 'react';
import type { Category, Budget, Expense } from '../../domain/models';

type SelectProps = {
  options: Category[];
  value: Category | null;
  onChange: (value: Category | null) => void;
  enun: string;
};

export function CustomSelect({ options, value, onChange, enun }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="customSelect">
      <button type="button" className="selectButton" onClick={() => setIsOpen(!isOpen)}>
        {value?.label ?? enun}
        <span className={isOpen ? 'arrow open' : 'arrow'}>▼</span>
      </button>
      {isOpen && (
        <ul className="selectMenu">
          {options.map((category) => (
            <li key={category.value} onClick={() => { onChange(category); setIsOpen(false); }}>
              {category.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type DotCheckProps = {
  value?: boolean[];
  onChange?: (value: boolean[]) => void;
  index?: number;
  checked?: boolean;
  onClick?: () => void;
};

export function DotCheck({ value, onChange, index, checked, onClick }: DotCheckProps) {
  function handleChange(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    if (onClick) { onClick(); return; }
    if (!value || typeof index !== 'number' || !onChange) return;
    const nextValue = [...value];
    nextValue[index] = !nextValue[index];
    onChange(nextValue);
  }

  const isSelected = checked ?? (typeof index === 'number' && Array.isArray(value) ? value[index] : false);
  return <div className={isSelected ? 'checkBox sel' : 'checkBox'} onClick={handleChange} />;
}

type TableExpProps = {
  budRest: Budget;
  exps: Expense[];
};

export function TableExp({ budRest, exps }: TableExpProps) {
  return (
    <div className="STContainer">
      <table className="infoTable">
        <thead><tr><th>Presupuesto del mes</th><th>Restante del mes</th><th>Gastos del dia</th></tr></thead>
        <tbody><tr><td>$ {budRest.amount}</td><td>$ {budRest.rest}</td><td>$ {exps.reduce((total, expense) => total + expense.amount, 0)}</td></tr></tbody>
      </table>
    </div>
  );
}
