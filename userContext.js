// userContext.js
import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userSession, setUserSession] = useState({
    isLoggedIn: false,
    userType: null, // 'patient' or 'clinician'
    userId: null,   // NHS number or HCP ID
    userProfile: null,
    calculationHistory: []
  });

  return (
    <UserContext.Provider value={{ userSession, setUserSession }}>
      {children}
    </UserContext.Provider>
  );
};