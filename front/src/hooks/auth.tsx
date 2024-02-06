import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  username: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  username: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@ChatFormare:token');
    const user = localStorage.getItem('@ChatFormare:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ username, password }) => {
    const response = await api.post('sessions', {
      username,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem('@ChatFormare:token', token);
    localStorage.setItem('@ChatFormare:user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await api.put('status', {
      newStatus: 'offline',
    });

    localStorage.removeItem('@ChatFormare:token');
    localStorage.removeItem('@ChatFormare:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}
