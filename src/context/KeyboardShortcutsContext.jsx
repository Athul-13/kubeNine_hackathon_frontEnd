import { createContext, useContext, useState } from 'react';

const KeyboardShortcutsContext = createContext(null);

export const KeyboardShortcutsProvider = ({ children }) => {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(prev => !prev);
  };

  const hideHelp = () => {
    setShowHelp(false);
  };

  const value = {
    showHelp,
    toggleHelp,
    hideHelp,
  };

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};

export const useKeyboardShortcutsContext = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcutsContext must be used within a KeyboardShortcutsProvider');
  }
  return context;
};
