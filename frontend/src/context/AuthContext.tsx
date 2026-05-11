import { useState } from 'react';
import { api, setApiToken } from '../api/client';
import type { User } from '../types';
import { AuthContext } from './context';

const loadStoredUser = (): User | null => {
  const raw = localStorage.getItem('churchSongsUser');
  return raw ? (JSON.parse(raw) as User) : null;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(loadStoredUser);
  const [token, setToken] = useState<string | null>(localStorage.getItem('churchSongsToken'));

  const handleAuthSuccess = (nextToken: string, nextUser: User) => {
    setToken(nextToken);
    setUser(nextUser);
    setApiToken(nextToken);
    localStorage.setItem('churchSongsToken', nextToken);
    localStorage.setItem('churchSongsUser', JSON.stringify(nextUser));
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>('/api/auth/login', { email, password });
    handleAuthSuccess(data.token, data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: User }>('/api/auth/register', {
      name,
      email,
      password
    });
    handleAuthSuccess(data.token, data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setApiToken();
    localStorage.removeItem('churchSongsUser');
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
};
