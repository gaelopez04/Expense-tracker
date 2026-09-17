import type { Budget, Expense, User } from '../domain/models';

export type HideProps = {
  onHide: () => void;
};

export type StatusHideProps = {
  hideStatus: boolean;
  onProfile: () => void;
};

export type ProfileProps = {
  onProfile: () => void;
  selected: boolean[];
  setSelected: (value: boolean[]) => void;
  setDateSel: (value: Date | null) => void;
  setOnSight: (value: boolean) => void;
  onSight?: boolean;
};

export type PopOverProps = {
  profile: boolean;
  disabled: boolean;
  passwordChang: boolean;
  handleChangingPassword: () => void;
  handleConfiContra: () => void;
  handleRegresar: () => void;
  query: string;
  setQuery: (value: string) => void;
  userTemp: User;
  typeEdit: string;
  setTypeEdit: (value: string) => void;
  setPasswordChang: (value: boolean) => void;
  disabledName: boolean;
  handleProfile: () => void;
  success: string;
  setSuccess: (value: string) => void;
  errorPass: boolean;
  setErrorPass: (value: boolean) => void;
};

export type CalendarProps = {
  onClickCal: string;
  setDisabledIn: (value: boolean) => void;
  budget: number[];
  onMonthSelect: (monthIndex: number) => void;
  setDateSel: (value: Date | null) => void;
  setOnSight: (value: boolean) => void;
  rest: number[];
  exps: Expense[];
};

export type DateProps = {
  dateSel?: Date | null;
  setOnSight: (value: boolean) => void;
  setDateSel: (value: Date | null) => void;
  onSight?: boolean;
  budRest: Budget;
  setBudRest: (value: Budget) => void;
  setSelected: (value: boolean[]) => void;
  selected: boolean[];
  rest: number[];
  setRest: (value: number[]) => void;
  exps: Expense[];
  setExps: (value: Expense[]) => void;
  anyElement: boolean;
};

export type HeaderDashProps = {
  setDateSel: (value: Date | null) => void;
  setOnSight: (value: boolean) => void;
  setBudRest: (value: Budget) => void;
  rest: number[];
  setRest: (value: number[]) => void;
  exps: Expense[];
};
