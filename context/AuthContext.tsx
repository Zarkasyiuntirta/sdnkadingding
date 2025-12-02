
import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { studentCredentials } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => string | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((username: string, pass: string): string | null => {
    if (username.toLowerCase() === 'admin' && pass === '54321') {
      setUser({ name: 'Admin', role: 'admin' });
      return null;
    }

    const student = studentCredentials.find(cred => cred.username === username && cred.password === pass);
    if (student) {
      setUser({ name: student.username, role: 'student' });
      return null;
    }

    return 'Invalid username or password';
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
