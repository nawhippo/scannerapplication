import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const cookieUserData = Cookies.get('userData');
    if (cookieUserData) {
      setUser(JSON.parse(cookieUserData));
    }
  }, []);

  const updateUser = (newUserData) => {
    setUser(newUserData);
    Cookies.set('userData', JSON.stringify(newUserData));
  };

  const updateBackgroundColor = (color) => {
    const updatedUser = { ...user, backgroundColor: color };
    updateUser(updatedUser);
  };

  const clearUserContext = () => {
    setUser(null);
    Cookies.remove('userData');
    Cookies.set('sessionExpired', 'true');
  };

  return (
      <UserContext.Provider value={{
        user,
        updateUser,
        updateBackgroundColor,
        clearUserContext
      }}>
        {children}
      </UserContext.Provider>
  );
}