import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on first load
  useEffect(() => {
    const token = localStorage.getItem('cc_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem('cc_token'))
      .finally(() => setLoading(false));
  }, []);

  function persist(data) {
    localStorage.setItem('cc_token', data.access_token);
    setUser(data.user);
  }

  async function login(email, password) {
    persist(await api.login(email, password));
  }

  async function register(email, fullName, password) {
    const data = await api.register({ email, full_name: fullName, password });
    persist(data);
    return data;
  }

  function logout() {
    localStorage.removeItem('cc_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
