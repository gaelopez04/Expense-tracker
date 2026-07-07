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

accounts.push({id: Date.now(), name: "Gael Lopez", email: "gael.lopez@prueba.com", password: "simonwe", created_at: new Date().toISOString()});

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
    console.log("Entro");
    let exist: boolean = false;
    let isCorrectPass: boolean = false;

    if (testEmail(queryEmail)) {
      for (const account of accounts) {
        if (account.email == queryEmail) {
          exist = true;
          if (account.password == queryPass) {
            isCorrectPass = true;
          }
        }
      }

      if (exist && isCorrectPass) {
        localStorage.setItem("user", queryEmail);
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


  function handleSignup() {
    console.log(queryEmail);
    if (!testEmail(queryEmail) || !parsingPassword(queryPass) || !testName(queryName)) {
      setValid(false);
    } else {
      createUser(queryName, queryEmail, queryPass);
      console.log("Account created:");
      console.log(accounts[accounts.length - 1]);
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

function Dashboard() {
  const [profile, setProfile] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, []);

  function handleProfile() {
    setProfile(!profile);
    console.log(profile);
  }

  return(
    <div className="wholeDash1">
      <SideBar onProfile={handleProfile}/>
      <div className="wholeDash">
        <div className="wholeDashTop">
          <HeaderDash/>
        </div>

          <div className="wholeDashMedium">
            {profile && <div className="profileContainer">
              <div className="profile">
                <img src="public\user_icon.png" className="profileUser"/>
                <label className="profileName"> Nombresdsssssssssssssssssssss </label>
                <img src="public\log_out_icon.png" className="profileLogout"/>
              </div>

              <div className="profileDatos">
                <label> Datos generales </label>
                
                <label> ID de usuario </label>
                <label> ID </label>

                <label> Nombre completo</label>
                <input/>

                <label> Correo </label>
                <label> Correo </label>
                
                <label> Contrasenia </label>
                <input/>

                <label> Creado en </label>
                <label> fecha </label>
              </div>
            </div>}
        
          </div>  
      </div>
    </div>
  );
}

function HeaderDash() {
  const user = localStorage.getItem("user");
  const name: string = getNameUserByEmail(user ?? "");
  
  return(
    <div className="headerDash">
      <label className="greeting"> Bienvenido, {name} </label>
    </div>
  );
}

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

function getNameUserByEmail(email: string): string {

  for (const account of accounts) {
    if (email == account.email) {
      return account.name;
    }
  }

  return "Not found";
}

export default App