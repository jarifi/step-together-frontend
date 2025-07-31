import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken as loadToken, getUserId as loadUserId } from '../lib/auth';

interface UserContextProps {
  user: any;
  setUser: (user: any) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  userId: string | null;
  setUserId: (id: string | null) => void;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  userId: null,
  setUserId: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const restoreAuth = async () => {
      const storedToken = await loadToken();
      const storedUserId = await loadUserId();
      if (storedToken) setToken(storedToken);
      if (storedUserId) setUserId(storedUserId);
    };
    restoreAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
