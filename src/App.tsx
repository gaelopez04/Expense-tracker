import { useState } from 'react'
import { useNavigate, BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import './App.css'

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
};

let accounts: User[] = [];

accounts.push({id: 1, name: "Gael Lopez", email: "gael.lopez@prueba.com", password: "simonwe", created_at: new Date().toISOString()});

console.log(accounts[0]);

type emailProp = {
  testEmail: (email: string) => boolean
}

type hideProp = {
  onHide: () => void
}

type statusHideProp = {
  hideStatus: boolean,
  onProfile: () => void
}

type profileProp = {
  onProfile: () => void
}

type popOverProp = {
  profile: boolean,
  disabled: boolean,
  passwordChang: boolean,
  handleChangingPassword: () => void,
  handleConfiContra: () => void,
  handleRegresar: () => void,
  query: string,
  setQuery: (value: string) => void
  userTemp: User,
  typeEdit: string,
  setTypeEdit: (value: string) => void,
  setPasswordChang: (value: boolean) => void,
  disabledName: boolean,
  handleProfile: () => void,
  success: string,
  setSuccess: (value: string) => void,
  errorPass: boolean,
  setErrorPass: (value: boolean) => void
}

type calProp = {
  onClickCal: string
}

const meses: string[] = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const fecha = new Date();

console.log(meses[fecha.getMonth()]); // Julio

function App() {

  function verifyEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  } 

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <AuthLog testEmail={verifyEmail}/> }/>
        <Route path="/signup" element={ <AuthSign testEmail={verifyEmail}/> }/>
        <Route path="/dashboard" element={ <Dashboard/> }/>
      </Routes>
    </BrowserRouter>
  );
  
}



function AuthLog({testEmail}: emailProp) {
  const navigate = useNavigate();
  const [forgot, setForgot] = useState<boolean>(false);
  const [queryEmail, setQueryEmail] = useState<string>("");
  const [queryPass, setQueryPass] = useState<string>("");
  const [dontExist, setDontExist] = useState<boolean>(false);
  const [exist, setExist] = useState<boolean>(false);

  function handleClick() {
    setForgot(!forgot);
  }

  function handleLogin() {
    let exist: boolean = false;
    let isCorrectPass: boolean = false;
    let id: number = 0;

    if (testEmail(queryEmail)) {
      for (const account of accounts) {
        if (account.email == queryEmail) {
          exist = true;
          if (account.password == queryPass) {
            isCorrectPass = true;
            id = account.id;
          }
        }
      }

      if (exist && isCorrectPass) {
        localStorage.setItem("user", String(id));
        setExist(true);
        navigate("/dashboard");
      } else {
        setExist(false);
        setDontExist(true);
      }
    } else {
      setDontExist(true);
    }
  }

  if (forgot) {
    return(
      <>
        <HeaderSide/>
        <div className="whole2">
          <div className="authDiv2">
            <button className="passBack" onClick={() => setForgot(false)}> {`<`} </button>

            <div className="authContainer2">
              <div className="auth">
                <label className="startLabel">Recuperacion</label>
                <label className="signLabb"> Ingresa tu correo electronico para que te enviemos un codigo de seguridad </label>
                <input className="authLog" placeholder="Ingresa tu correo"/>
                <button className="authBut"> Recuperar cuenta </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return(
      <>
        <HeaderSide/>
        <div className="whole2">
          <div className="authDiv1">
            <div className="authContainer">
              <div className="auth">
                <label className="startLabel">Inicia sesion en Expense tracker</label>
                {dontExist && <label className="errorLabel"> Las credenciales son incorrectas o no existen </label>}
                <input className={dontExist ? "authLog dont" : exist ? "authLog exist" : "authLog"} placeholder="Ingresa tu correo" value={queryEmail} onChange={(e) => setQueryEmail(e.target.value)}/>
                <input className={dontExist ? "authLog dont" : exist ? "authLog exist" : "authLog"} placeholder="Ingresa tu contraseña" value={queryPass} onChange={(e) => setQueryPass(e.target.value)} type="password"/>
                <label className="authLab" onClick={handleClick}>¿Olvidaste tu contraseña? Click aqui.</label>
                <button className="authBut" onClick={handleLogin}> Iniciar sesión </button>
                <label className="authLab" onClick={() => navigate("/signup", {replace: true})}> ¿No tienes cuenta? Registrate aqui. </label>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  
}

function AuthSign({testEmail}: emailProp) {
  const navigate = useNavigate();
  const [queryEmail, setQueryEmail] = useState<string>("");
  const [queryPass, setQueryPass] = useState<string>("");
  const [queryName, setQueryName] = useState<string>("");

  const [valid, setValid] = useState<boolean>(true);
  const [created, setCreated] = useState<boolean>(false);


  function handleSignup() {
    if (!testEmail(queryEmail) || !parsingPassword(queryPass) || !testName(queryName)) {
      setValid(false);
      setCreated(false);
    } else {
      createUser(queryName, queryEmail, queryPass);
      console.log("Account created:");
      console.log(accounts[accounts.length - 1]);
      navigate("/login");
      setValid(true);
      setCreated(true);
    }
  }

  return(
    <>
      <HeaderSide/>
      <div className="whole2">
        <div className="authDiv2">
          <div className="authContainer">
            <div className="auth">
              <label className="startLabel">Registrate en Expense Tracker</label>
              
              <label className="signLab">Ingresa tu nombre completo</label>
              {created && <label className="sucLabel"> Cuenta creada satisfactoriamente </label>}
              {!valid && <label className="errorLabel"> Debe ser un nombre valido</label>}
              <input className={testName(queryName) ? "authLog exist" : "authLog"} placeholder="Ingresa tu nombre completo" value={queryName} onChange={(e) => setQueryName(e.target.value)}/>

              <label className="signLab">Ingresa tu correo</label>
              {!valid && <label className="errorLabel"> Debe ser un correo valido</label>}
              <input className={testEmail(queryEmail) ? "authLog exist" : "authLog"} placeholder="Ingresa tu correo eletronico" value={queryEmail} onChange={(e) => setQueryEmail(e.target.value)}/>

              <label className="signLab">Ingresa tu contraseña</label>
              {!valid && <label className="errorLabel"> Debe ser una contraseña igual o mayor a 8 caracteres y al menos una mayuscula</label>}
              <input className={parsingPassword(queryPass) ? "authLog exist" : "authLog"} placeholder="Ingresa tu contraseña" value={queryPass} onChange={(e) => setQueryPass(e.target.value)} type="password"/>

              <button className="authBut" onClick={handleSignup}> Registrarse </button>

              <label className="authLab" onClick={() => navigate("/login", {replace: true})}> ¿Tienes cuenta? Inicia sesion aqui. </label>
            </div>
          </div>
        </div>
      </div>
    </>
      
  );
}

function HeaderSide() {
  
  return(
    <div className="header">
      <img className="themeH" src="public\darkmode.png"/>
      <label className="nameLogoH"> EXPENSE TRACKER </label>
    </div>
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
      <SideBar onProfile={handleProfile}/>
      <div className="wholeDash">
        <div className="wholeDashTop">
          <HeaderDash/>
        </div>

          <div className="wholeDashMedium">
            <ProfilePopOver profile={profile} disabled={disabled} passwordChang={passwordChang} 
            handleRegresar={handleRegresar} handleChangingPassword={handleChangingPassword} 
            handleConfiContra={handleConfiContra} query={query} setQuery={setQuery} userTemp={userTemp}
            typeEdit={typeEdit} setTypeEdit={setTypeEdit} setPasswordChang={setPasswordChang} disabledName={disabledName}
            handleProfile={handleProfile} success={success} setSuccess={setSuccess} errorPass={errorPass} setErrorPass={setErrorPass}/>

          </div>  
      </div>
    </div>
  );
}

function HeaderDash() {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [onClickCal, setOnClickCal] = useState<string>("calendarBudget");

  const user = localStorage.getItem("user");
  const account: User | null = getUserByID(Number(user));
  let name: string = "desconocido";

  if (account != null) {
    name = account.name;
  }

  function handleClick() {
    if (onClickCal == "calendarBudget" || onClickCal == "calendarBudget close") {
      setOnClickCal("calendarBudget open");
    } else if (onClickCal == "calendarBudget open") {
      setOnClickCal("calendarBudget close");
    } else {
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
          <input className="budgetInput" placeholder="Presupuesto"/>
        </div>

        <div className="budgetCalendar">
          <button className="bcBut" onClick={handleClick}> v </button>
        </div>

        <BudgetDate onClickCal={onClickCal}/>
      </div>
      
    </div>
  );
}

function BudgetDate({onClickCal}: calProp) {

  const divMonths = meses.map((m) => {
    return (
      <div className="monthDiv" key={m}>
        <label className="monthLabel"> {m} </label>
      </div>
    );
  });

  return(
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
function SideBar({onProfile}: profileProp) {
  const [hideClicked, setHideClicked] = useState<boolean>(false);

  function handleClick() {
    setHideClicked(!hideClicked);
  }

  return(
    <>
      
      <aside className={hideClicked ? "sideBar hide" : "sideBar"}>
        <HeaderSideBar onHide={handleClick}/>
        <OptionsSideDash/>
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

function OptionsSideDash() {

  return(
    <div className="optionSide">
      <label></label>
      <label></label>
      <label></label>
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

//General functions
function parsingPassword(password: string): boolean {

  if (password.length < 8 || !/[A-Z]/.test(password)) {
    return false;
  }

  return true;
}

function testName(name: string): boolean {
   let nameTemp: string[] = name.split(" ");

   if (nameTemp.length > 1) {
    return true;
   }

   return false;
}


//CRUD functions
function createUser(nameUser: string, emailUser: string, passwordUser: string) {
  const user: User = {id: Date.now(), name: nameUser, email: emailUser, password: passwordUser, created_at: new Date().toISOString()};
  accounts.push(user);
}

function getUserByID(id: number): User | null {

  for (const account of accounts) {
    if (id == account.id) {
      return account;
    }
  }

  return null;
}

function isPasswordCorrect(id: number, password: string): boolean {

  for (const account of accounts) {
    if (account.id == id) {
      if (account.password == password) {
        return true;
      }
    }
  }

  return false;
}

function modifyName(id: number, name: string): boolean {
  for (let account of accounts) {
    if (account.id == id) {
      if (testName(name)) {
        account.name = name;
        return true;
      } else {
        return false
      }
    }
  }

  return false;
}

function modifyPass(id: number, password: string): boolean {
  for (let account of accounts) {
    if (account.id == id) {
      if (parsingPassword(password)) {
        account.password = password;
        return true;
      } else {
        return false
      }
    }
  }

  return false;
}

export default App