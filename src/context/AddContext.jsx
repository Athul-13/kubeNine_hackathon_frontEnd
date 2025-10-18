import { createContext, useContext, useState } from 'react';

const AddContext = createContext(null);

export const AddProvider = ({ children }) => {
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [selectedAddOption, setSelectedAddOption] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Show add options in secondary sidebar
  const showAddMenu = () => {
    setShowAddOptions(true);
    setSelectedAddOption(null);
    setShowForm(false);
  };

  // Hide add options
  const hideAddMenu = () => {
    setShowAddOptions(false);
    setSelectedAddOption(null);
    setShowForm(false);
  };

  // Select an add option (Create Channel or Direct Message)
  const selectAddOption = (option) => {
    setSelectedAddOption(option);
    setShowForm(true);
    setShowAddOptions(false);
  };

  // Close form and return to normal state
  const closeForm = () => {
    setShowForm(false);
    setSelectedAddOption(null);
    setShowAddOptions(false);
  };

  const value = {
    showAddOptions,
    selectedAddOption,
    showForm,
    showAddMenu,
    hideAddMenu,
    selectAddOption,
    closeForm,
  };

  return (
    <AddContext.Provider value={value}>
      {children}
    </AddContext.Provider>
  );
};

export const useAdd = () => {
  const context = useContext(AddContext);
  if (!context) {
    throw new Error('useAdd must be used within an AddProvider');
  }
  return context;
};
