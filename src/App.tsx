import { useState } from 'react'
import { useNavigate, Link, BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
};

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={ <AuthLog/> }/>
        <Route path="/signup" element={ <AuthSign/> }/>
        <Route path="/dashboard" element={ <Dashboard/> }/>
      </Routes>
    </BrowserRouter>
  );
  
}



function AuthLog() {
  const navigate = useNavigate();
  const [forgot, setForgot] = useState<boolean>(false);

  function handleClick() {
    setForgot(!forgot);
  }

  if (forgot) {
    return(
      <>
        <HeaderSide/>
        <div className="whole2">
          <div className="authDiv1">
            <div className="authContainer">
              <div className="auth">
                <label className="startLabel">Recuperacion</label>
                <label className="signLab"> Correo electronico </label>
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
                <input className="authLog" placeholder="Ingresa tu correo"/>
                <input className="authLog" placeholder="Ingresa tu contraseña"/>
                <label className="authLab" onClick={handleClick}>¿Olvidaste tu contraseña? Click aqui.</label>
                <button className="authBut"> Iniciar sesión </button>
                <label className="authLab" onClick={() => navigate("/signup", {replace: true})}> ¿No tienes cuenta? Registrate aqui. </label>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  
}

function AuthSign() {
  const navigate = useNavigate();
  return(
    <>
      <HeaderSide/>
      <div className="whole2">
        <div className="authDiv2">
          <div className="authContainer">
            <div className="auth">
              <label className="startLabel">Registrate en Expense Tracker</label>
              
              <label className="signLab">Ingresa tu nombre completo</label>
              <input className="authLog" placeholder="Ingresa tu nombre completo"/>

              <label className="signLab">Ingresa tu correo</label>
              <input className="authLog" placeholder="Ingresa tu correo eletronico"/>

              <label className="signLab">Ingresa tu contraseña</label>
              <input className="authLog" placeholder="Ingresa tu contraseña"/>

              <button className="authBut"> Registrarse </button>

              <label className="authLab" onClick={() => navigate("/login", {replace: true})}> ¿Tienes cuenta? Inicia sesion aqui. </label>
            </div>
          </div>
        </div>
      </div>
    </>
      
  );
}

function Dashboard() {

  return(
    <div>
    </div>
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

export default App