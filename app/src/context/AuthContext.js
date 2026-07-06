import { createContext, useContext, useState } from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

// Estado global de autenticacao (Context API).
// Nesta etapa o token vive apenas em memoria; a persistencia no dispositivo
// e o auto-login entram no Commit 03.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  async function login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register({ username, email, password }) {
    await api.post('/auth/register', { username, email, password });
    // Apos cadastrar, ja autentica o usuario.
    return login({ email, password });
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return ctx;
}
