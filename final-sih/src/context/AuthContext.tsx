import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, role?: UserRole) => Promise<User>;
  signup: (name: string, email: string, role: UserRole, department: string) => Promise<User>;
  switchRole: (role: UserRole) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const active = authService.getCurrentUser();
    setUser(active);
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string, role: UserRole = 'Administrator'): Promise<User> => {
    const loggedUser = authService.login(email, pass, role);
    setUser(loggedUser);
    return loggedUser;
  };

  const signup = async (name: string, email: string, role: UserRole, department: string): Promise<User> => {
    const newUser = authService.signup(name, email, role, department);
    setUser(newUser);
    return newUser;
  };

  const switchRole = (role: UserRole) => {
    const updated = authService.switchRole(role);
    if (updated) setUser(updated);
  };

  const logout = async () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
