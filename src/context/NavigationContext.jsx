import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [activeNav, setActiveNav] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);

  const handleNavChange = (navId) => {
    setActiveNav(navId);
    setSelectedItem(null); // Reset selected item when changing navigation
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const value = {
    activeNav,
    selectedItem,
    setActiveNav: handleNavChange,
    setSelectedItem: handleItemSelect,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
