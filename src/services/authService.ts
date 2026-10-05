import { accounts, createUser } from '../domain/store';

// Logica de autenticacion centralizada. Por ahora trabaja sobre `accounts` en
// memoria; despues se reemplaza el contenido por llamadas al backend.

// Devuelve true si el correo y la contraseña coinciden, y guarda la sesion.
export function login(email: string, password: string): boolean {
  const account = accounts.find((a) => a.email === email && a.password === password);
  if (!account) return false;

  localStorage.setItem('user', String(account.id));
  return true;
}

export function signup(name: string, email: string, password: string) {
  createUser(name, email, password);
}

export function logout() {
  localStorage.removeItem('user');
}
