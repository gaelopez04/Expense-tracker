import { useState, type ReactNode } from 'react'
import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'
import type { Budget, Category, Expense, User } from './domain/models'
import { expenseCategories, expenseFilters, expenseMonths, fecha, meses } from './domain/constants'
import { expenses, containsMonth, createBudget, createExpense, getBudget, getUserByID, isPasswordCorrect, modifyBudget, modifyName, modifyPass, sumAllExpenses, deleteExpense } from './domain/store'
import { verifyBudget } from './utils/validation'
import { AuthLog as AuthLogPage, AuthSign as AuthSignPage } from './features/auth/AuthPages'
import {Home} from './features/home'
import type { CalendarProps as calProp, DateProps as DateProp, HeaderDashProps, HideProps as hideProp, PopOverProps as popOverProp, ProfileProps as profileProp, StatusHideProps as statusHideProp } from './types/componentProps'

function App() {

  function verifyEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  } 

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <AuthLogPage testEmail={verifyEmail}/> }/>
        <Route path="/signup" element={ <AuthSignPage testEmail={verifyEmail}/> }/>
        <Route path="/dashboard" element={ <Dashboard/> }/>
      </Routes>
    </BrowserRouter>
  );
  
}



//DASHBOARD============================================================================================================
function Dashboard() {
  const [profile, setProfile] = useState<boolean>(false);
  const [userTemp, setUserTemp] = useState<User>({id: -1, name: "No encontrado", email: "No encontrado", password: "No encontrado", created_at: "No encontrado"});
  const [query, setQuery] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [passwordChang, setPasswordChang] = useState<boolean>(false);
  const [typeEdit, setTypeEdit] = useState<string>("");
  const [disabledName, setDisabledName] = useState<boolean>(true);
  const [success, setSuccess] = useState<string>("profileContainer");
  const [errorPass, setErrorPass] = useState<boolean>(false);
  const navigate = useNavigate();
  const [dateSel, setDateSel] = useState<Date | null>(null);
  const [onSight, setOnSight] = useState<boolean>(false);

  const [selected, setSelected] = useState<boolean[]>(Array(4).fill(false));


  //BUDGET AND REST
  const id = localStorage.getItem("user");

  const [budRest, setBudRest] = useState<Budget>(getBudget(Number(id), fecha.getMonth()));
  const [rest, setRest] = useState<number[]>(() => Array(meses.length).fill(0));

  const [exps, setExps] = useState<Expense[]>(() => {
    const currentUser = Number(localStorage.getItem("user") ?? -1);
    return sumAllExpenses(currentUser, -1);
  });

  const [anyElement, setAnyElement] = useState<boolean>(() => {
    const currentUser = Number(localStorage.getItem("user") ?? -1);
    return sumAllExpenses(currentUser, -1).length > 0;
  });

  useEffect(() => {
    const id = localStorage.getItem("user");
    if (!id) {
      navigate("/login");
    } else {
      const found = getUserByID(Number(id));
      if (found) setUserTemp(found);
    }
  }, []);

  function handleProfile() {
    const nextProfile = !profile;
    setProfile(nextProfile);
    setSuccess("profileContainer");

    if (nextProfile) {
      const id = localStorage.getItem('user');
      const found = getUserByID(Number(id));
      if (found) {
        setUserTemp(found);
      }
    } else {
      setDisabled(true);
      setDisabledName(true);
      setPasswordChang(false);
    }
  }

  function handleChangingPassword() {
    if (passwordChang && typeEdit == "pass") {
      setPasswordChang(!passwordChang);
    } else if (passwordChang && typeEdit == "name") {
      setTypeEdit("pass");
      console.log("AHORA CMBIARA CONTRA");
    } else {
      setPasswordChang(!passwordChang);
      setTypeEdit("pass");
    }
  }

  function handleConfiContra() {
    const id = localStorage.getItem("user");
    
    if (isPasswordCorrect(Number(id), query)) {
      setErrorPass(false);
      if (typeEdit == "name") {
        setDisabledName(false);
        setPasswordChang(false);

      } else {
        setDisabled(false);
        setPasswordChang(false);
        setQuery(""); 
      }
       
    } else {
      setErrorPass(true);
    }
  }

  function handleRegresar() {
     setPasswordChang(false);
  }


  return(
    <div className="wholeDash1">
      <SideBar onProfile={handleProfile} selected={selected} setSelected={setSelected} setDateSel={setDateSel} onSight={onSight} setOnSight={setOnSight}/>
      <div className="wholeDash">
        <div className="wholeDashTop">
          <HeaderDash setDateSel={setDateSel} setOnSight={setOnSight} setBudRest={setBudRest} rest={rest} setRest={setRest} exps={exps}/>
        </div>

          <div className="wholeDashMedium">

            <ProfilePopOver profile={profile} disabled={disabled} passwordChang={passwordChang} 
            handleRegresar={handleRegresar} handleChangingPassword={handleChangingPassword} 
            handleConfiContra={handleConfiContra} query={query} setQuery={setQuery} userTemp={userTemp}
            typeEdit={typeEdit} setTypeEdit={setTypeEdit} setPasswordChang={setPasswordChang} disabledName={disabledName}
            handleProfile={handleProfile} success={success} setSuccess={setSuccess} errorPass={errorPass} setErrorPass={setErrorPass}/>

            {selected[0] && <Home/>}
            {onSight && <ExpenseDate onSight={onSight} dateSel={dateSel} setOnSight={setOnSight} setDateSel={setDateSel} budRest={budRest} setBudRest={setBudRest} setSelected={setSelected} selected={selected} exps={exps} setExps={setExps} anyElement={anyElement} rest={rest} setRest={setRest}/>}
            {selected[1] && <AddExpense budRest={budRest} setBudRest={setBudRest} rest={rest} setRest={setRest} exps={exps} setExps={setExps} setAnyElement={setAnyElement}/>}
            {selected[3] && <ExpenseHistory exps={exps} setExps={setExps}/>}
          </div>  
      </div>
    </div>
  );
}

function HeaderDash({setDateSel, setOnSight, setBudRest, rest, setRest, exps}: HeaderDashProps) {
  const currentMonth = new Date().getMonth();
  const [onClickCal, setOnClickCal] = useState<string>("calendarBudget");
  const [queryBud, setQueryBud] = useState<string>("");
  const [disabledIn, setDisabledIn] = useState<boolean>(false);

  const [budget, setBudget] = useState<number[]>(() => Array(meses.length).fill(0));

  const [selectedMonth, setSelectedMonth] = useState<number>(fecha.getMonth());

  const user = localStorage.getItem("user");
  const account: User | null = getUserByID(Number(user));
  let name: string = "desconocido";

  useEffect(() => {
    //Iniciar budget de todos los meses anteriores
    const newBud: number[] = [...budget];
    const newRest: number[] = [...rest];

    for (let i = 0; i < budget.length; ++i) {
      const bud: Budget = getBudget(Number(user), i);
      
      const amounTemp: number = bud.amount;
      const resTemp: number = bud.rest;

      newBud[i] = amounTemp;
      newRest[i] = resTemp;
    }

    setBudget(newBud);
    setRest(newRest);
  }, []);

 


  if (account != null) {
    name = account.name;
  }

  function handleClick() {
    if (onClickCal == "calendarBudget" || onClickCal == "calendarBudget close") {
      setOnClickCal("calendarBudget open");
    } else if (onClickCal == "calendarBudget open") {
      setOnClickCal("calendarBudget close");
    } 
  }

  function handleBudget() {
    if (verifyBudget(queryBud)) {
      const amount: number = Number(queryBud);
      
      if (containsMonth(Number(user), selectedMonth)) {
        const tempRest: number = modifyBudget(Number(user), selectedMonth, amount);

        const newRest = [...rest];
        newRest[selectedMonth] = tempRest;
        setRest(newRest);
      } else {
        createBudget(Number(user), amount, selectedMonth, amount);

        const newRest = [...rest];
        newRest[selectedMonth] = amount;
        setRest(newRest);
      }

      const newBud = [...budget];
      newBud[selectedMonth] = amount;
      setBudget(newBud);
      setQueryBud("");

      if (fecha.getMonth() == selectedMonth) {
        
        const id = localStorage.getItem("user");

        const tempBud: Budget = getBudget(Number(id), selectedMonth);
        const newBud: Budget = {id: tempBud.id, id_user: tempBud.id_user, amount: tempBud.amount, month: tempBud.month, rest: tempBud.rest};

        setBudRest(newBud);
      }
    }
  }

  const month: string = meses[currentMonth];
  
  return(
    <div className="headerDash">
      <label className="greeting"> Bienvenido, {name} </label>

      <div className="budgetHeadContainer">
        <div className="budgetHead">
          <label className="budgetlabel1"> Presupuesto del mes </label>
          <label className="budgetlabel2"> {month} </label>
          <input className="budgetInput" placeholder="Presupuesto" value={queryBud} onKeyDown={e =>{
                    if (e.key === "Enter") handleBudget();
                  }} onChange={(e) => setQueryBud(e.target.value)} disabled={disabledIn} type="number"/>
        </div>

        <div className="budgetCalendar">
          <button className="bcBut" onClick={handleClick}> v </button>
        </div>

        <BudgetDate onClickCal={onClickCal} setDisabledIn={setDisabledIn} budget={budget} onMonthSelect={setSelectedMonth} setDateSel={setDateSel} setOnSight={setOnSight} rest={rest} exps={exps}/>
      </div>
      
    </div>
  );
}

type BudPass = {
  budRest: Budget,
  setBudRest: (value: Budget) => void,
  rest: number[],
  setRest: (value: number[]) => void,
  exps: Expense[],
  setExps: (value: Expense[]) => void,
  setAnyElement: (value: boolean) => void
}

type TableExpp = {
  budRest: Budget,
  exps: Expense[]
}

function AddExpense({budRest, setBudRest, rest, setRest, exps, setExps, setAnyElement}: BudPass) {
  const [daysMonth, setDaysMonth] = useState<Category[]>(Array());

  const [queryTitle, setQueryTitle] = useState<string>("");
  const [queryAmount, setQueryAmount] = useState<number | undefined>(0);
  const [queryDes, setQueryDes] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<Category | null>(null);
  const [selectedDay, setSelectedDay] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const categories = expenseCategories;
  const months = expenseMonths;

  function handleMonthDays(category: Category | null) {
    setSelectedMonth(category);
    setDaysMonth([]);
    let newDaysMonth: Category[] = [];
    const num: number = Number(category?.value ?? 0);
    const days: number = new Date(fecha.getFullYear(), num + 1, 0).getDate();

    for (let i = 1; i <= days; ++i) {
      const cat: Category = {value: String(i) + "_", label: String(i)};
      newDaysMonth.push(cat);
    }

    setDaysMonth(newDaysMonth);
  }
  

  //Funcion a aniadir, para agreagr gastos ya
  function handleAdd() {
    const date: Date = new Date(fecha.getFullYear(), Number(selectedMonth?.value), Number(selectedDay?.label));
    const id = Number(localStorage.getItem("user"));
    const resTemp: number = createExpense(id,queryTitle, queryAmount ?? 0, queryDes, (selectedCategory ?? {value: "0", label: "Error"}), date);
    
    if (date.getMonth() == fecha.getMonth()) {
      const newBudRest = getBudget(Number(id), date.getMonth());
      const tempBud = {id: newBudRest.id, id_user: newBudRest.id_user, amount: newBudRest.amount, month: newBudRest.month, rest: newBudRest.rest};
      setBudRest(tempBud);
    }

    setExps(sumAllExpenses(id, -1));
    setAnyElement(sumAllExpenses(id, -1).length > 0);

    const newRest: number[] = [...rest];
    newRest[date.getMonth()] = resTemp;
    setRest(newRest);
    
    setQueryTitle("");
    setQueryDes("");
    setQueryAmount(0);
    setSelectedCategory(null);
    setSelectedMonth(null);
    setSelectedDay(null);

    console.log(expenses);
  }

  return(
    <div className="expenseTag">
      <div className="dayTag">
        <label className="dayLabel"> Agregar gasto </label>
      </div>

      <div className="stateTag">
        <TableExp budRest={budRest} exps={exps}/>
      </div>

      <div className="statsTag">
        <div className="statsTCont">
          <div className="divTitleBills">
            <label className="billsLabel"> Ingresa el gasto </label>
          </div>
          
        </div>

        <div className="contentBills">

          <div className="informationBill">
            <label className="addTitle"> Ingresa el titulo * </label>
            <input placeholder="ingresa el titulo" className="searchInput" value={queryTitle} onChange={(e) => setQueryTitle(e.target.value)}/>

            <label className="addTitle"> Ingresa la cantidad * </label>
            <input placeholder="ingresa la cantidad" className="searchInput" type="number" value={queryAmount} onChange={(e) => setQueryAmount(Number(e.target.value))}/>

            <label className="addTitle"> Selecciona una categoria * </label>
            <CustomSelect options={categories} value={selectedCategory} onChange={setSelectedCategory} enun={"Selecciona una categoria"}/>
            
            
            <label className="addTitle"> Ingresa la descripción </label>
            <textarea className="searchInput" value={queryDes} onChange={(e) => setQueryDes(e.target.value)}/>

            <label className="addTitle"> Ingresa la fecha * </label>
            <div className="dateContainer">
              <CustomSelect options={months} value={selectedMonth} onChange={handleMonthDays} enun={"Mes"}/>
              <CustomSelect options={daysMonth} value={selectedDay} onChange={setSelectedDay} enun={"Dia"}/>
            </div>
            

            <div className="buttonContainer">
              <button className="addButton" onClick={handleAdd}> Agregar </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ExpenseFilterPanelProps = {
  queryTitle: string,
  setQueryTitle: (value: string) => void,
  selectedCatt: Category | null,
  setSelectedCatt: (value: Category | null) => void,
  selectedBool: boolean[],
  selectedCat: Category | null,
  setSelectedCat: (value: Category | null) => void,
  selectedMonth: Category | null,
  selectedDay: Category | null,
  setSelectedDay: (value: Category | null) => void,
  handleMonthDays: (category: Category | null) => void,
  months: Category[],
  categories: Category[],
  daysMonth: Category[],
  filters: Category[],
  check: boolean[],
};

function ExpenseFilterPanel({
  queryTitle,
  setQueryTitle,
  selectedCatt,
  setSelectedCatt,
  selectedBool,
  selectedCat,
  setSelectedCat,
  selectedMonth,
  selectedDay,
  setSelectedDay,
  handleMonthDays,
  months,
  categories,
  daysMonth,
  filters,
  check,
}: ExpenseFilterPanelProps) {
  return (
    <div className="contentBills">
      <div className="searchBar">
        <input placeholder="Realiza una busqueda" className='searchInput' type="text" value={queryTitle} onChange={(e) => setQueryTitle(e.target.value)}/>
        <div className='selectFilter'>
          <CustomSelect options={filters} value={selectedCatt} onChange={setSelectedCatt} enun='Filtrar'/>
          {selectedBool[0] && <CustomSelect options={categories} value={selectedCat} onChange={setSelectedCat} enun='Categoria'/>}
          {selectedBool[1] &&
          <div className='filterDate'>
            <CustomSelect options={months} value={selectedMonth} onChange={handleMonthDays} enun='Mes'/>
            <CustomSelect options={daysMonth} value={selectedDay} onChange={setSelectedDay} enun='Dia'/>
          </div>  
          }
        </div>
        
        {check.includes(true) && <div className='editDelContainer'>
          <img className='delImg' src='public\borrar.png' alt='Borrar gasto' />
        </div>}
      </div>
    </div>
  );
}

type SelectProps = {
  options: Category[];
  value: Category | null;
  onChange: (value: Category | null) => void;
  enun: string
};

function CustomSelect({ options, value, onChange, enun}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="customSelect">
      <button
        type="button"
        className="selectButton"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value?.label ?? enun}
        <span  className={isOpen ? "arrow open" : "arrow"}>▼</span>
      </button>

      {isOpen && (
        <ul className="selectMenu">
          {options.map((category) => (
            <li
              key={category.value}
              onClick={() => {
                onChange(category);
                setIsOpen(false);
              }}
            >
              {category.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type check = {
  value?: boolean[],
  onChange?: (value: boolean[]) => void,
  index?: number,
  checked?: boolean,
  onClick?: () => void,
}

function DotCheck({ value, onChange, index, checked, onClick }: check) {
  function handleChange(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();

    if (onClick) {
      onClick();
      return;
    }

    if (!value || typeof index !== 'number' || !onChange) return;

    const newValue = [...value];
    newValue[index] = !newValue[index];
    onChange(newValue);
  }

  const isSelected = checked ?? (typeof index === 'number' && Array.isArray(value) ? value[index] : false);

  return(
    <div
      className={isSelected ? 'checkBox sel' : 'checkBox'}
      onClick={(event) => {
        event.stopPropagation();
        handleChange(event);
      }}
    >
    </div>
  );
}

type ExpenseListItemProps = {
  expense: Expense,
  checked: boolean,
  expanded: boolean,
  onToggleSelect: () => void,
  onToggleExpand: () => void,
  months: Category[],
  editDraft: Expense | null,
  onDraftChange: <K extends keyof Expense>(key: K, value: Expense[K]) => void,
  onSaveEdit: () => void,
  onCancelEdit: () => void,
};

function ExpenseListItem({
  expense,
  checked,
  expanded,
  onToggleSelect,
  onToggleExpand,
  months,
  editDraft,
  onDraftChange,
  onSaveEdit,
  onCancelEdit,
}: ExpenseListItemProps) {

  return (
    <div className="expenseWrapper" key={expense.id ?? `${expense.title}-${expense.date.toISOString()}`}>
      <div className="expenseDiv" onClick={onToggleExpand}>
        <DotCheck checked={checked} onClick={onToggleSelect} />
        <label className="titleExpense"> {expense.title} </label>
        <label className="dateExpense"> {meses[expense.date.getMonth()]}, {expense.date.getDate()}  </label>
        <label className="amountExpense">
          <span className="amountPill">$ {expense.amount}</span>
        </label>
        <label className="arrowLabel">
          <span className={expanded ? "arrowPill open" : "arrowPill"}> ▼ </span>
        </label>
      </div>

      <div className={expanded ? "expenseDetail open" : "expenseDetail"}>
        <div className="expenseDetailRow">
          <span className="expenseDetailLabel">Categoría</span>
          <span>{expense.category}</span>
        </div>
        <div className="expenseDetailRow">
          <span className="expenseDetailLabel">Descripción</span>
          <span>{expense.description}</span>
        </div>
        <div className="expenseDetailRow">
          <span className="expenseDetailLabel">Monto</span>
          <span className="amountPill">$ {expense.amount}</span>
        </div>
      </div>

      {editDraft && (
        <div className="expenseEdit">
          <div className="expenseEditRow">
            <span className="expenseDetailLabel">Título</span>
            <input
              className="searchInput expenseEditInput"
              value={editDraft.title}
              onChange={(event) => onDraftChange("title", event.target.value)}
            />
          </div>

          <div className="expenseEditRow">
            <span className="expenseDetailLabel">Categoría</span>
            <input
              className="searchInput expenseEditInput"
              value={editDraft.category}
              onChange={(event) => onDraftChange("category", event.target.value)}
            />
          </div>

          <div className="expenseEditRow">
            <span className="expenseDetailLabel">Descripción</span>
            <input
              className="searchInput expenseEditInput"
              value={editDraft.description}
              onChange={(event) => onDraftChange("description", event.target.value)}
            />
          </div>

          <div className="expenseEditRow">
            <span className="expenseDetailLabel">Fecha</span>
            <div className="expenseEditDate">
              <CustomSelect
                options={months}
                value={months.find((monthOption) => Number(monthOption.value) === editDraft.date.getMonth()) ?? null}
                onChange={(selectedMonthOption) => {
                  if (!selectedMonthOption) return;
                  const nextDate = new Date(editDraft.date);
                  nextDate.setMonth(Number(selectedMonthOption.value));
                  onDraftChange("date", nextDate);
                }}
                enun="Mes"
              />
              <CustomSelect
                options={Array.from({ length: new Date(editDraft.date.getFullYear(), editDraft.date.getMonth() + 1, 0).getDate() }, (_, index) => ({
                  value: String(index + 1) + "_",
                  label: String(index + 1)
                }))}
                value={Array.from({ length: new Date(editDraft.date.getFullYear(), editDraft.date.getMonth() + 1, 0).getDate() }, (_, index) => ({
                  value: String(index + 1) + "_",
                  label: String(index + 1)
                })).find((dayOption) => Number(dayOption.label) === editDraft.date.getDate()) ?? null}
                onChange={(selectedDayOption) => {
                  if (!selectedDayOption) return;
                  const nextDate = new Date(editDraft.date);
                  nextDate.setDate(Number(selectedDayOption.label));
                  onDraftChange("date", nextDate);
                }}
                enun="Dia"
              />
            </div>
          </div>

          <div className="expenseEditRow">
            <span className="expenseDetailLabel">Monto</span>
            <div className="expenseEditAmount">
              <span className="amountPill">$</span>
              <input
                className="searchInput expenseEditInput moneyInput"
                type="number"
                value={editDraft.amount}
                onChange={(event) => onDraftChange("amount", Number(event.target.value) || 0)}
              />
            </div>
          </div>

          <div className="expenseEditActions">
            <button type="button" className="expenseEditButton save" onClick={onSaveEdit}>Guardar</button>
            <button type="button" className="expenseEditButton cancel" onClick={onCancelEdit}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

type expsHistoryProp = {
  exps: Expense[],
  setExps: (value: Expense[]) => void
}

function ExpenseHistory({exps, setExps}: expsHistoryProp) {
  const [queryTitle, setQueryTitle] = useState<string>("");
  const [selectedCatt, setSelectedCatt] = useState<Category | null>(null);
  const [selectedBool, setSelectedBool] = useState<boolean[]>(Array(2).fill(false));
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Category | null>(null);
  const [selectedDay, setSelectedDay] = useState<Category | null>(null);
  const [daysMonth, setDaysMonth] = useState<Category[]>([]);

  const categories = expenseCategories;
  const months = expenseMonths;
  const [selectedMonths, setSelectedMonths] = useState<boolean[]>(Array(months.length).fill(false));
  const [selectedExpensesByMonth, setSelectedExpensesByMonth] = useState<Record<number, boolean[]>>({});
  const [expandedExpensesByMonth, setExpandedExpensesByMonth] = useState<Record<number, boolean[]>>({});
  const [editIndexByMonth, setEditIndexByMonth] = useState<Record<number, number | null>>({});
  const [editDraftByMonth, setEditDraftByMonth] = useState<Record<number, Expense | null>>({});
  const filters = expenseFilters;

  const currentUserId = Number(localStorage.getItem("user") ?? -1);
  const expensesByMonth = months.map((_, monthIndex) =>
    exps.filter((expense) => expense.id_user === currentUserId && expense.date.getMonth() === monthIndex)
  );

  useEffect(() => {
    setExps(exps);
  }, [exps]);

  const filteredExpensesByMonth = months.map((_, monthIndex) => {
    const monthExpenses = expensesByMonth[monthIndex] ?? [];

    const result = monthExpenses.filter((expense) => {
      if (queryTitle !== "" && !expense.title.toLowerCase().startsWith(queryTitle.toLowerCase())) {
        return false;
      }

      if (selectedBool[0] && selectedCat && expense.category !== selectedCat.label) {
        return false;
      }

      if (selectedBool[1] && selectedMonth && selectedDay) {
        const monthMatches = expense.date.getMonth() === Number(selectedMonth.value);
        const dayMatches = expense.date.getDate() === Number(selectedDay.label);
        if (!monthMatches || !dayMatches) {
          return false;
        }
      }

      return true;
    });

    if (selectedCatt?.value === "exp") {
      return [...result].sort((a, b) => b.amount - a.amount);
    }

    if (selectedCatt?.value === "cheap") {
      return [...result].sort((a, b) => a.amount - b.amount);
    }

    if (selectedCatt?.value === "alf") {
      return [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  });

  useEffect(() => {
    const nextSelectedBool: boolean[] = Array(2).fill(false);

    if (selectedCatt?.value === "cat") {
      nextSelectedBool[0] = true;
    } else if (selectedCatt?.value === "date") {
      nextSelectedBool[1] = true;
    }

    setSelectedBool(nextSelectedBool);
  }, [selectedCatt]);

  function handleMonthDays(category: Category | null) {
    setSelectedMonth(category);
    setDaysMonth([]);

    const num = Number(category?.value ?? 0);
    const days = new Date(fecha.getFullYear(), num + 1, 0).getDate();
    const newDaysMonth: Category[] = [];

    for (let i = 1; i <= days; ++i) {
      newDaysMonth.push({ value: String(i) + "_", label: String(i) });
    }

    setDaysMonth(newDaysMonth);
  }

  function handleMonthSelected(index: number) {
    const nextSelected = [...selectedMonths];
    const isNowSelected = !nextSelected[index];
    nextSelected[index] = isNowSelected;
    setSelectedMonths(nextSelected);

    const monthExpenses = expensesByMonth[index] ?? [];
    setSelectedExpensesByMonth((prev) => ({
      ...prev,
      [index]: Array(monthExpenses.length).fill(isNowSelected),
    }));
  }

  function handleExpenseSelected(monthIndex: number, expenseIndex: number) {
    const currentSelection = selectedExpensesByMonth[monthIndex] ?? Array(expensesByMonth[monthIndex]?.length ?? 0).fill(false);
    const nextSelection = [...currentSelection];
    nextSelection[expenseIndex] = !nextSelection[expenseIndex];

    setSelectedExpensesByMonth((prev) => ({
      ...prev,
      [monthIndex]: nextSelection,
    }));
  }

  function handleExpenseExpand(monthIndex: number, expenseIndex: number) {
    const currentExpanded = expandedExpensesByMonth[monthIndex] ?? Array(expensesByMonth[monthIndex]?.length ?? 0).fill(false);
    const nextExpanded = [...currentExpanded];
    nextExpanded[expenseIndex] = !nextExpanded[expenseIndex];

    setExpandedExpensesByMonth((prev) => ({
      ...prev,
      [monthIndex]: nextExpanded,
    }));
  }

  function handleExpenseEdit(monthIndex: number, expenseIndex: number) {
    const expense = expensesByMonth[monthIndex]?.[expenseIndex];
    if (!expense) return;

    setEditIndexByMonth((prev) => ({
      ...prev,
      [monthIndex]: expenseIndex,
    }));

    setEditDraftByMonth((prev) => ({
      ...prev,
      [monthIndex]: { ...expense, date: new Date(expense.date) },
    }));
  }

  function handleExpenseDelete(monthIndex: number, expenseIndex: number) {
    console.log("Entre a borrar")
    const expense = expensesByMonth[monthIndex]?.[expenseIndex];
    
    if (!expense) return;
    deleteExpense(expense.id);
    const updatedExpenses = exps.filter((item) => item.id !== expense.id);
    setExps(updatedExpenses);
  }

  function handleDraftChange(monthIndex: number, key: keyof Expense, value: Expense[keyof Expense]) {
    setEditDraftByMonth((prev) => {
      const currentDraft = prev[monthIndex];
      if (!currentDraft) return prev;

      return {
        ...prev,
        [monthIndex]: {
          ...currentDraft,
          [key]: value,
        },
      };
    });
  }

  function handleSaveEdit(monthIndex: number) {
    const editingIndex = editIndexByMonth[monthIndex];
    const draft = editDraftByMonth[monthIndex];

    if (editingIndex === undefined || editingIndex === null || !draft) return;

    const selectedExpense = expensesByMonth[monthIndex]?.[editingIndex];
    if (!selectedExpense) return;

    const expenseToUpdate = exps.find((expense) => expense.id === selectedExpense.id);
    if (expenseToUpdate) {
      Object.assign(expenseToUpdate, {
        ...expenseToUpdate,
        ...draft,
        amount: Number(draft.amount),
        date: new Date(draft.date),
      });
    }

    setEditIndexByMonth((prev) => ({
      ...prev,
      [monthIndex]: null,
    }));

    setEditDraftByMonth((prev) => ({
      ...prev,
      [monthIndex]: null,
    }));
  }

  function handleCancelEdit(monthIndex: number) {
    setEditIndexByMonth((prev) => ({
      ...prev,
      [monthIndex]: null,
    }));

    setEditDraftByMonth((prev) => ({
      ...prev,
      [monthIndex]: null,
    }));
  }

  return(
    <div className="expenseTag">
      <div className ="dayTag">
        <label className="dayLabel"> Historial </label>

        <div className="statsTag">
          <div className="statsTCont">
            <div className="divTitleBills">
              <label className="billsLabel"> Año {fecha.getFullYear()}</label>
            </div>
          </div>

          

          <div className="contentBills">
            <ExpenseFilterPanel
              queryTitle={queryTitle}
              setQueryTitle={setQueryTitle}
              selectedCatt={selectedCatt}
              setSelectedCatt={setSelectedCatt}
              selectedBool={selectedBool}
              selectedCat={selectedCat}
              setSelectedCat={setSelectedCat}
              selectedMonth={selectedMonth}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              handleMonthDays={handleMonthDays}
              months={months}
              categories={categories}
              daysMonth={daysMonth}
              filters={filters}
              check={selectedMonths}
            />

            <div className="historyMonthsSection">
              <div className="historyMonthsList">
                {months.map((month, index) => {
                  const monthExpenses = filteredExpensesByMonth[index] ?? [];
                  const monthSelectedExpenses = selectedExpensesByMonth[index] ?? Array(expensesByMonth[index]?.length ?? 0).fill(false);
                  const monthExpanded = expandedExpensesByMonth[index] ?? Array(monthExpenses.length).fill(false);
                  const monthEditingIndex = editIndexByMonth[index] ?? null;
                  const monthEditDraft = editDraftByMonth[index] ?? null;
                  const selectedExpenseIndex = monthExpenses.findIndex((_, expenseIndex) => monthSelectedExpenses[expenseIndex]);
                  const hasExpenseSelection = selectedExpenseIndex >= 0 && !selectedMonths[index];

                  return (
                    <div key={month.value} className="historyMonthGroup">
                      <div
                        className="historyMonthItem historyMonthHeader"
                        onClick={() => handleMonthSelected(index)}
                      >
                        <DotCheck checked={selectedMonths[index] ?? false} onClick={() => handleMonthSelected(index)} />
                        <span className="historyMonthLabel">{month.label}</span>

                        {selectedMonths[index] && (
                          <div
                            className="editDelContainer historyMonthActions"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <img
                              className="delImg"
                              src='public\borrar.png'
                              alt='Borrar mes'
                              onClick={(event) => {
                                event.stopPropagation();
                                handleExpenseDelete(index, selectedExpenseIndex);
                              }}
                            />
                          </div>
                        )}

                        {!selectedMonths[index] && hasExpenseSelection && (
                          <div
                            className="editDelContainer historyMonthActions"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <img
                              className="delImg"
                              src='public\editar.png'
                              alt='Editar gasto'
                              onClick={(event) => {
                                event.stopPropagation();
                                handleExpenseEdit(index, selectedExpenseIndex);
                              }}
                            />
                            <img
                              className="delImg"
                              src='public\borrar.png'
                              alt='Borrar gasto'
                              onClick={(event) => {
                                event.stopPropagation();
                                handleExpenseDelete(index, selectedExpenseIndex);
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="historyMonthExpenses">
                        {monthExpenses.length === 0 ? (
                          <span className="exisLabel">Sin gastos</span>
                        ) : (
                          monthExpenses.map((expense, expenseIndex) => (
                            <ExpenseListItem
                              key={expense.id ?? `${expense.title}-${expense.date.toISOString()}`}
                              expense={expense}
                              checked={selectedMonths[index] || (monthSelectedExpenses[expenseIndex] ?? false)}
                              expanded={monthExpanded[expenseIndex] ?? false}
                              onToggleSelect={() => handleExpenseSelected(index, expenseIndex)}
                              onToggleExpand={() => handleExpenseExpand(index, expenseIndex)}
                              months={months}
                              editDraft={monthEditingIndex === expenseIndex ? monthEditDraft : null}
                              onDraftChange={(key, value) => handleDraftChange(index, key, value)}
                              onSaveEdit={() => handleSaveEdit(index)}
                              onCancelEdit={() => handleCancelEdit(index)}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpenseDate({dateSel, budRest, setBudRest, setSelected, setOnSight, onSight, exps, setExps, anyElement}: DateProp) {

  const [selectedCatt, setSelectedCatt] = useState<Category | null>(null);
  const [check, setCheck] = useState<boolean[]>(Array(exps.length).fill(false));
  const [selectedBool, setSelectedBool] = useState<boolean[]>(Array(2).fill(false));

  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Category | null>(null);
  const [selectedDay, setSelectedDay] = useState<Category | null>(null);
  const [daysMonth, setDaysMonth] = useState<Category[]>([]);
  const [isSelectedExp, setIsSelectedExp] = useState<boolean[]>(Array(exps.length).fill(false));
  // const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const [queryTitle, setQueryTitle] = useState<string>("");
  const [localExps, setLocalExps] = useState<Expense[]>(exps);
  const [filteredExps, setFilteredExps] = useState<Expense[]>(exps);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Expense | null>(null);

  const userId = Number(localStorage.getItem("user") ?? -1);

  useEffect(() => {
    setLocalExps(expenses.filter((expense) => expense.id_user === userId));
  }, [userId, exps]);

  useEffect(() => {
    const newSelectedBool: boolean[] = Array(2).fill(false);

    if (selectedCatt?.value === "cat") {
      newSelectedBool[0] = true;
    } else if (selectedCatt?.value === "date") {
      newSelectedBool[1] = true;
    }
    setSelectedBool(newSelectedBool);
  }, [selectedCatt]);

  const categories = expenseCategories;
  const months = expenseMonths;
  const filters = expenseFilters;

  const viewDate = dateSel ?? new Date();

  let month: number | string = "Error";
  let dayName: string = "Error";
  let day: number | string = "Error";
  const daysOfWeek: string[] = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado"
  ];

  month = meses[viewDate.getMonth()];
  dayName = daysOfWeek[viewDate.getDay()];
  day = viewDate.getDate();

  function handleMonthDays(category: Category | null) {
    setSelectedMonth(category);
    setDaysMonth([]);
    let newDaysMonth: Category[] = [];
    const num: number = Number(category?.value ?? 0);
    const days: number = new Date(fecha.getFullYear(), num + 1, 0).getDate();

    for (let i = 1; i <= days; ++i) {
      const cat: Category = {value: String(i) + "_", label: String(i)};
      newDaysMonth.push(cat);
    }

    setDaysMonth(newDaysMonth);
  }

  function handleAdd() {
    const newSelected: boolean[] = Array(3).fill(false);
    newSelected[1] = true;

    if (onSight) {
      setOnSight(false);
    }

    setSelected(newSelected);

  }

  function handleIsSelected(id: number) {
    const newSelectedExp: boolean[] = Array(exps.length).fill(false);
    newSelectedExp[id] = !isSelectedExp[id];
    setIsSelectedExp(newSelectedExp);
  }

  useEffect(() => {
    let result = [...localExps].filter((e) => {
      return e.date.getFullYear() === viewDate.getFullYear()
        && e.date.getMonth() === viewDate.getMonth()
        && e.date.getDate() === viewDate.getDate();
    });

    if (queryTitle !== "") {
      result = result.filter((e) => e.title.toLocaleLowerCase().startsWith(queryTitle));
    }

    if (selectedBool[0] && selectedCat) {
      result = result.filter((e) => e.category === selectedCat.label);
    }

    if (selectedBool[1] && selectedMonth && selectedDay) {
      result = result.filter((e) => e.date.getMonth() === Number(selectedMonth.value) && e.date.getDate() === Number(selectedDay.label));
    }

    if (selectedCatt?.value === "exp") {
      result = [...result].sort((a,b) => b.amount - a.amount);
    } else if (selectedCatt?.value === "cheap") {
      result = [...result].sort((a,b) => a.amount - b.amount);
    } else if (selectedCatt?.value === "alf") {
      result = [...result].sort((a,b) => a.title.localeCompare(b.title));
    }
    setFilteredExps(result);
  }, [localExps, queryTitle, selectedCatt, selectedMonth, selectedDay, selectedCat, selectedBool, viewDate]);

  useEffect(() => {
    setCheck(Array(localExps.length).fill(false));
    setIsSelectedExp(Array(localExps.length).fill(false));
  }, [localExps.length]);

  function handleEditDraftChange<K extends keyof Expense>(key: K, value: Expense[K]) {
    setEditDraft((current) => {
      if (!current) return current;
      return { ...current, [key]: value };
    });
  }

  function handleSaveEdit() {
    if (editIndex === null || !editDraft) return;

    const oldExpense = localExps[editIndex];
    const amountDifference = oldExpense.amount - Number(editDraft.amount);

    const updatedExps = localExps.map((expense, index) => {
      if (index !== editIndex) return expense;

      return {
        ...expense,
        ...editDraft,
        amount: Number(editDraft.amount),
        date: new Date(editDraft.date),
      };
    });

    // Update the global expenses array
    const expenseToUpdate = expenses.find((exp) => exp.id === oldExpense.id);
    if (expenseToUpdate) {
      expenseToUpdate.title = editDraft.title;
      expenseToUpdate.category = editDraft.category;
      expenseToUpdate.description = editDraft.description;
      expenseToUpdate.amount = Number(editDraft.amount);
      expenseToUpdate.date = new Date(editDraft.date);
    }

    setLocalExps(updatedExps);
    setExps(updatedExps);
    
    // Update the remaining budget if the amount changed and it's in the current month
    if (amountDifference !== 0 && editDraft.date.getMonth() === budRest.month) {
      const newBudRest = { ...budRest, rest: budRest.rest + amountDifference };
      setBudRest(newBudRest);
    }
    
    setEditIndex(null);
    setEditDraft(null);
    setCheck(Array(updatedExps.length).fill(false));

    console.log(expenses);
  }

  function handleCancelEdit() {
    setEditIndex(null);
    setEditDraft(null);
  }

  const expss = filteredExps.map((e, i) => {
    const expenseIndex = localExps.findIndex((expense) => expense.id === e.id);
    const actualIndex = expenseIndex >= 0 ? expenseIndex : i;
    const editingThisExpense = editIndex === actualIndex;

    return (
      <ExpenseListItem
        key={e.id ?? `${e.title}-${actualIndex}`}
        expense={e}
        checked={check[actualIndex] ?? false}
        expanded={isSelectedExp[actualIndex] ?? false}
        onToggleSelect={() => {
          const newSelectedExp: boolean[] = Array(exps.length).fill(false);
          newSelectedExp[actualIndex] = !check[actualIndex];
          setCheck(newSelectedExp);
        }}
        onToggleExpand={() => handleIsSelected(actualIndex)}
        months={months}
        editDraft={editingThisExpense ? editDraft : null}
        onDraftChange={handleEditDraftChange}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
      />
    );
  });

  return(
    <div className="expenseTag">
      <div className ="dayTag">
        <label className="dayLabel"> {dayName}, {day} de {month} </label>
      </div>

      <div className="stateTag">
        <TableExp budRest={budRest} exps={exps}/>
      </div>

      <div className="statsTag">
        <div className="statsTCont">
          <div className="divTitleBills">
            <label className="billsLabel"> Gastos del dia </label>
            <label className="add" onClick={handleAdd}> + </label>
          </div>
          
        </div>

        <div className="contentBills">
          <ExpenseFilterPanel
            queryTitle={queryTitle}
            setQueryTitle={setQueryTitle}
            selectedCatt={selectedCatt}
            setSelectedCatt={setSelectedCatt}
            selectedBool={selectedBool}
            selectedCat={selectedCat}
            setSelectedCat={setSelectedCat}
            selectedMonth={selectedMonth}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            handleMonthDays={handleMonthDays}
            months={months}
            categories={categories}
            daysMonth={daysMonth}
            filters={filters}
            check={check}
          />
          {anyElement ? expss : <label className="exisLabel"> Enhorabuena, no hay gastos! </label>}
        </div>
      </div>
    </div>
  );
}

function TableExp({budRest, exps}: TableExpp) {
  return(
    <div className="STContainer">
          <table className="infoTable">
            <thead>
              <tr>
                <th> 
                  Presupuesto del mes 
                </th>
                <th> Restante del mes </th>
                <th> Gastos del dia </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td> $ {budRest.amount} </td>
                <td> $ {budRest.rest} </td>
                <td> $ {exps.reduce((a, b) => a + b.amount, 0)} </td>
              </tr>
            </tbody>
          </table>
        </div>
  );
}

function BudgetDate({onClickCal, setDisabledIn, budget, onMonthSelect, setDateSel, setOnSight, rest, exps}: calProp) {
  const [divClick, setDivClick] = useState<boolean[]>(() => Array(meses.length).fill(false));
  const [daysMonth, setDaysMonth] = useState<ReactNode[]>([]);

  const disabledMonth = meses.map((_, i) => i < fecha.getMonth());

  const userExpenses = exps;

  function hasExpenseOnDay(monthIndex: number, dayNumber: number): boolean {
    return userExpenses.some((exp) => {
      return exp.date.getFullYear() === fecha.getFullYear()
        && exp.date.getMonth() === monthIndex
        && exp.date.getDate() === dayNumber;
    });
  }

  function handleClick(key: number) {
    setDisabledIn(disabledMonth[key]);
    onMonthSelect(key);

    const daysNumber: number = new Date(fecha.getFullYear(), key + 1, 0).getDate();
    const days: number[] = Array.from({ length: daysNumber }, (_, index) => index + 1);
    const newDivClick = [...divClick];

    for (let i = 0; i < newDivClick.length; ++i) {
      if (newDivClick[i] == true && i == key) {
        newDivClick[i] = !newDivClick[i];
      } else if (newDivClick[i] == false && i == key) {
        newDivClick[i] = !newDivClick[i];
      } else {
        newDivClick[i] = false;
      }
    }

    setDivClick(newDivClick);

    if (newDivClick[key]) {
      setDaysMonth(days.map((d) => {
        const expenseDay = hasExpenseOnDay(key, d);
        return (
          <label
            className={expenseDay ? "day hasExpense" : "day"}
            key={d}
            onClick={() => handleDay(key, d)}
          >
            {d}
          </label>
        );
      }));
    } else {
      setDaysMonth([]);
    }
  }

  function handleDay(month: number, day: number) {
    const date: Date | null = new Date(fecha.getFullYear(), month, day);
    setDateSel(date);
    setOnSight(true);
  }

  const divMonths = meses.map((m, i) => {
    return (
      <div className="monthDiv" key={m}>
        <div className={disabledMonth[i] ? "monthDivCont disabled" : "monthDivCont"} onClick={() => handleClick(i)}>
          <label className="monthLabel"> {m} </label>
          <label className="monthBudget"> Pres: $ {budget[i]} </label>
          <label className="monthMon"> Res: $ {rest[i]} </label>
          <button className="monthButton"> v </button>
        </div>

        {divClick[i] && (
          <div className="monthCal">
            {daysMonth}
          </div>
        )}
      </div>
    );
  });

  return (
    <div className={onClickCal}>
      {divMonths}
    </div>
  );
}

//DASHBOARD: POPOVER
function ProfilePopOver({profile, disabled, passwordChang, handleRegresar, handleConfiContra, query, setQuery, userTemp, typeEdit, setTypeEdit, setPasswordChang, disabledName, handleProfile, success, setSuccess, errorPass, setErrorPass}: popOverProp) {
  const [queryPass, setQueryPass] = useState<string>("");
  const [queryName, setQueryName] = useState<string>("");
  const [popoverClassName, setPopoverClassName] = useState<string>("popoverPass");

  useEffect(() => {
    if (!errorPass) return;

    setPopoverClassName("popoverPass shake");

    const timer = window.setTimeout(() => {
      setErrorPass(false);
      setPopoverClassName("popoverPass");
    }, 400);

    return () => window.clearTimeout(timer);
  }, [errorPass, setErrorPass]);

  function handleNameEdit() {
    if (passwordChang && typeEdit === "name") {
      setPasswordChang(false);
      setPopoverClassName("popoverPass");
      return;
    }

    if (passwordChang && typeEdit === "pass") {
      setTypeEdit("name");
      setPopoverClassName("popoverPass name");
      return;
    }

    setPopoverClassName("popoverPass name");
    setPasswordChang(true);
    setTypeEdit("name");
  }

  function handlePasswordEdit() {
    if (passwordChang && typeEdit === "pass") {
      setPasswordChang(false);
      setPopoverClassName("popoverPass");
      return;
    }

    if (passwordChang && typeEdit === "name") {
      setTypeEdit("pass");
      setPopoverClassName("popoverPass pass");
      return;
    }

    setPopoverClassName("popoverPass pass");
    setPasswordChang(true);
    setTypeEdit("pass");
  }

  function handleGuardar() {
    const id = localStorage.getItem('user');
    let isSuccess: boolean = false;
    if (typeEdit == "name") {
      isSuccess = modifyName(Number(id), queryName);
    } else {
      isSuccess = modifyPass(Number(id), queryPass); 
    }
    setSuccess(isSuccess ? "profileContainer success" : "profileContainer wrong");
  } 

  return(
    <>
      {profile && <div className={success}>
              <div className="profile">
                <img src="public\user_icon.png" className="profileUser"/>
                <label className="profileName"> {userTemp.name} </label>
              </div>

              <div className="profileDatos">
                <label id="titleProfile"> Datos generales </label>
                
                <label className="signLab1"> ID de usuario </label>
                <input disabled placeholder={String(userTemp.id)} className="infoProfile"/>

                <label className="signLab1"> Nombre completo</label>
                <div className="IBContainer">
                  <input disabled={disabledName} value={disabledName ? userTemp.name : queryName} className={!disabledName ? "infoProfile dis" : "infoProfile"} onChange={(e) => setQueryName(e.target.value)}/>
                  <button className="buttonEdit" onClick={handleNameEdit}> Edit </button>
                </div>
                

                <label className="signLab1"> Correo </label>
                <input disabled placeholder={userTemp.email} className="infoProfile"/>
                
                <label className="signLab1"> Contraseña </label>
                <div className="IBContainer">
                  <input disabled={disabled} value={disabled ? userTemp.password : queryPass} className={!disabled ? "infoProfile dis" : "infoProfile"} type="password" onChange={(e) => setQueryPass(e.target.value)}/>
                  <button className="buttonEdit" onClick={handlePasswordEdit}> Edit </button>
                </div>
                

                <label className="signLab1"> Creado en </label>
                <input disabled placeholder={userTemp.created_at} className="infoProfile"/>
              </div>

              <div className="canGuar">
                <button className="buttonCanGuar" onClick={handleProfile}> Cancelar </button>
                <button className="buttonCanGuar" onClick={handleGuardar}> Guardar </button>
              </div>
            </div>}

            {passwordChang && <div className={popoverClassName}>
              <div className="popPassContainer">
                <label className="signLabPass"> Ingresa tu contraseña </label>
                <div className="inputContraContainer">
                  <input placeholder="Ingresa tu contraseña" className="authLogPass" value={query} onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={e =>{
                    if (e.key === "Enter") handleConfiContra();
                  }} type="password"/>
                  <button className="buttonCanGuar" onClick={handleRegresar}> Regresar </button>
                </div>
                
              </div>
            </div>}
    </>
  );
}


//SIDEBAR===========================================================================================
function SideBar({onProfile, selected, setSelected, setDateSel, onSight, setOnSight}: profileProp) {
  const [hideClicked, setHideClicked] = useState<boolean>(false);

  function handleClick() {
    setHideClicked(!hideClicked);
  }

  return(
    <>
      
      <aside className={hideClicked ? "sideBar hide" : "sideBar"}>
        <HeaderSideBar onHide={handleClick}/>
        <OptionsSideDash selected={selected} setSelected={setSelected} setDateSel={setDateSel} onSight={onSight} setOnSight={setOnSight}/>
        <BottomSideDash hideStatus={hideClicked} onProfile={onProfile}/>
      </aside>
    </>
  );
}

function HeaderSideBar({onHide}: hideProp) {
  return(
    <div className="headerSide">
      <label className="titleSide"> ET </label>
      <img className="hideSide" src="public\hide_sidebar_icon.png" onClick={onHide}/>
    </div>
  );
}

type optionsProp = {
  selected: boolean[],
  setSelected: (value: boolean[]) => void,
  setDateSel: (value: Date | null) => void,
  onSight?: boolean,
  setOnSight: (value: boolean) => void
};

function OptionsSideDash({setSelected, setDateSel, onSight, setOnSight}: optionsProp) {
  const [isHover, setIsHover] = useState<boolean[]>(Array(4).fill(false));

  function handleHover(numberOp: number, hover: boolean) {
    const newHover: boolean[] = [...isHover];
    newHover[numberOp] = hover;
    setIsHover(newHover);
  }

  function handleSelected(sel: number) {
    const newSelected: boolean[] = Array(4).fill(false);
    newSelected[sel] = true;

    if (sel == 2) {
        if (!onSight) {
          setOnSight(true);
        } 
        
        const dateToday: Date | null = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
        setDateSel(dateToday);
    } else {
      setOnSight(false);
    } 

    setSelected(newSelected);
  }

  return(
    <div className="optionSide">

      <div className="optionDiv" onMouseEnter={() => handleHover(0, true)} onMouseLeave={() => handleHover(0, false)} onClick={() => handleSelected(0)}>
        <img className="homeIcon" src="public\inicio.png"/>
        <label className="optionLabel"> Inicio </label>
      </div>

      <div className="optionContainer">
        <div className="optionDiv" onMouseEnter={() => handleHover(1, true)} onMouseLeave={() => handleHover(1, false)} onClick={() => handleSelected(1)}>
          <img className="expenseIcon" src="public\crear_gasto.png"/>
          <label className="optionLabel"> Agregar gasto </label>
        </div>
        <div className="optionDiv" onMouseEnter={() => handleHover(2, true)} onMouseLeave={() => handleHover(2, false)} onClick={() => handleSelected(2)}>
          <img className="dayIcon" src="public\dia.png"/>
          <label className="optionLabel"> Dia </label>
        </div>
        <div className="optionDiv" onMouseEnter={() => handleHover(3, true)} onMouseLeave={() => handleHover(3, false)} onClick={() => handleSelected(3)}>
          <img className="dayIcon" src="public\historial.png"/>
          <label className="optionLabel"> Historial </label>
        </div>
        
        
        
      </div>
      
    </div>
  );
}

function BottomSideDash({hideStatus, onProfile}: statusHideProp) {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState<boolean>(false);

  function handleClickIcon() {
    setClicked(!clicked);
  }

  function handleClick() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return(
    <>
      <div className="bottomSide">
        {clicked && !hideStatus && <div className="popover">
          <div className="optionpop" onClick={onProfile}>
            <label className="labelpop"> Perfil </label>
            <img className="userpop" src="public\user_icon.png"/>
            </div>

          <div className="optionpop">
            <label className="labelpop"> Cerrar sesión </label>
            <img className="logpop" src="public\log_out_icon.png"/>
          </div>
        </div>}          

        <img className="userIcon" src="public\user_icon.png" onClick={handleClickIcon} />
        <img className={hideStatus ? "darkTheme hide" : "darkTheme"} src="public\darkmode.png"/>
        <img className="hideSide1" src="public\log_out_icon.png" onClick={handleClick}/>
      </div>
      {hideStatus && <div className="hideDarkTheme"> 
        <img className="userIconHide" src="public\user_icon.png"/>
      </div>}
    </>
    
  );
}

export default App