import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  wbApiKey?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateApiKey: (apiKey: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохранённую сессию
    const savedUser = localStorage.getItem('wb_analytics_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('wb_analytics_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // В реальном приложении здесь будет запрос к Supabase/Firebase
    // Для демо имитируем задержку
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Имитация успешного входа
    const mockUser: User = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('wb_analytics_user', JSON.stringify(mockUser));
    return true;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'user_' + Date.now(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('wb_analytics_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wb_analytics_user');
  };

  const updateApiKey = async (apiKey: string): Promise<boolean> => {
    if (!user) return false;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, wbApiKey: apiKey };
    setUser(updatedUser);
    localStorage.setItem('wb_analytics_user', JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateApiKey,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
