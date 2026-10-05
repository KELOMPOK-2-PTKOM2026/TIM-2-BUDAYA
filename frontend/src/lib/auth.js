import api from './api';

export async function login(email, password) {
  const { data } = await api.post('/login', { email, password });
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  return data;
}

export async function register(name, email, password, password_confirmation) {
  const { data } = await api.post('/register', {
    name,
    email,
    password,
    password_confirmation,
  });
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('auth_user', JSON.stringify(data.user));
  return data;
}

export async function logout() {
  try {
    await api.post('/logout');
  } catch {
    // Token mungkin sudah expired, tetap lanjut clear localStorage
  }
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getUser() {
  const raw = localStorage.getItem('auth_user');
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function isAuthenticated() {
  return !!getToken();
}
