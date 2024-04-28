import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load data from local storage on component mount
    const savedData = localStorage.getItem('appData');
    if (savedData) setData(JSON.parse(savedData));
  }, []);

  useEffect(() => {
    // Save data to local storage whenever it changes
    localStorage.setItem('appData', JSON.stringify((data == null) ? {} : data));
  }, [data]);

  return <AppContext.Provider value={{ data, setData }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
