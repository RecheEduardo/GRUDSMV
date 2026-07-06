import { createContext, useContext, useEffect, useState } from 'react';

import api, { setAuthToken } from '../services/api';
import { clearToken, getToken, saveToken } from '../services/storage';

const AuthContext = createContext(null);

// Estado global de autenticacao (Context API) com sessao persistida.
// Ao abrir o app, tenta restaurar o token do dispositivo e refazer o login
// automaticamente via GET /auth/me.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const stored = await getToken();
        if (stored) {
          setAuthToken(stored);
          const { data } = await api.get('/auth/me');
          if (active) {
            setToken(stored);
            setUser(data.user);
          }
        }
      } catch (err) {
        // Token ausente/invalido/expirado: limpa a sessao.
        await clearToken();
        setAuthToken(null);
      } finally {
        if (active) setInitializing(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    setAuthToken(data.token);
    await saveToken(data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function register({ username, email, password }) {
    await api.post('/auth/register', { username, email, password });
    // Apos cadastrar, ja autentica o usuario.
    return login({ email, password });
  }

  async function logout() {
    await clearToken();
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, token, isAdmin, initializing, login, register, logout }}
    >
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
