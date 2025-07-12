import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGIN_FAILURE':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'LOGOUT':
      return { user: null, isAuthenticated: false, isLoading: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for stored authentication on app load
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate API call to verify token and get user data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data - replace with actual API call
          const mockUser: User = {
            id: '1',
            email: 'demo@notebookllm.com',
            name: 'Demo User',
            avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
            preferences: {
              theme: 'light',
              language: 'en',
              notifications: true,
            },
          };
          
          dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
        } else {
          dispatch({ type: 'LOGIN_FAILURE' });
        }
      } catch {
        dispatch({ type: 'LOGIN_FAILURE' });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - replace with actual API call
      const mockUser: User = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
        },
      };
      
      localStorage.setItem('authToken', 'mock-jwt-token');
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (name: string, email: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration - replace with actual API call
      const mockUser: User = {
        id: '1',
        email: email,
        name: name,
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
        },
      };
      
      localStorage.setItem('authToken', 'mock-jwt-token');
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) return;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...state.user, ...updates };
    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 