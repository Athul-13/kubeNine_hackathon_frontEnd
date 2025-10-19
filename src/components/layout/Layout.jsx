import { Outlet, useLocation } from 'react-router-dom';
import PrimarySidebar from './PrimarySidebar';
import SecondarySidebar from './SecondarySidebar';
import { Card, KeyboardShortcutsHelp } from '../ui';
import { useState, useEffect } from 'react';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import { useKeyboardShortcutsContext } from '../../context/KeyboardShortcutsContext';

const Layout = () => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  const { showHelp, hideHelp } = useKeyboardShortcutsContext();

  // Get current navigation based on pathname
  const getCurrentNav = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 'home';
    if (path === '/dms') return 'dms';
    if (path === '/search') return 'search';
    if (path === '/pinned') return 'pinned';
    return 'home';
  };

  const activeNav = getCurrentNav();

  // Handle auto-selection from navigation state
  useEffect(() => {
    if (location.state?.autoSelectDM) {
      const { autoSelectDM } = location.state;
      setSelectedItem(autoSelectDM.name);
      // Clear the state to prevent re-selection on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Handle pinned message navigation
  useEffect(() => {
    if (location.state?.fromPinnedMessage) {
      // Clear the state to prevent re-selection on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Clear selected item when switching between different tab types
  useEffect(() => {
    // Clear selectedItem when switching tabs (except for auto-selection and pinned message navigation)
    if (!location.state?.autoSelectDM && !location.state?.fromPinnedMessage) {
      setSelectedItem(null);
    }
  }, [activeNav, location.state]);


  const handleUserProfileToggle = () => {
    setShowUserProfile(!showUserProfile);
    setSelectedItem(null); // Clear any selected item when showing user profile
  };

  const handleCloseUserProfile = () => {
    setShowUserProfile(false);
  };

  return (
    <div className="h-screen bg-gray-400 p-4 md:p-6 no-select relative overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-[calc(100vh-3rem)] gap-4">
        <PrimarySidebar 
          activeNav={activeNav} 
          onUserClick={handleUserProfileToggle}
          showUserProfile={showUserProfile}
        />
        <SecondarySidebar 
          activeNav={activeNav} 
          selectedItem={selectedItem} 
          onSelect={setSelectedItem}
          showUserProfile={showUserProfile}
          onCloseUserProfile={handleCloseUserProfile}
        />
        <Card className="flex-1 overflow-y-auto">
          <Outlet context={{ selectedItem }} />
        </Card>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-[calc(100vh-2rem)] gap-3">
        {/* For DMs tab, SecondarySidebar takes full space when no item selected */}
        {['pinned', 'dms', 'search'].includes(activeNav) && !selectedItem ? (
          <div className="flex-1">
            <SecondarySidebar 
              activeNav={activeNav} 
              selectedItem={selectedItem} 
              onSelect={setSelectedItem}
              showUserProfile={showUserProfile}
              onCloseUserProfile={handleCloseUserProfile}
              isMobileFullScreen={true}
            />
          </div>
        ) : (
          <>
            <SecondarySidebar 
              activeNav={activeNav} 
              selectedItem={selectedItem} 
              onSelect={setSelectedItem}
              showUserProfile={showUserProfile}
              onCloseUserProfile={handleCloseUserProfile}
              isMobileFullScreen={false}
            />
            {/* Main Content - Only show when an item is selected or on home */}
            {(selectedItem || activeNav === 'home') && (
              <Card className="flex-1 overflow-y-auto animate-slide-up">
                <Outlet context={{ selectedItem }} />
              </Card>
            )}
          </>
        )}
        <PrimarySidebar 
          activeNav={activeNav} 
          onUserClick={handleUserProfileToggle}
          showUserProfile={showUserProfile}
        />
      </div>
      
      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp 
        isOpen={showHelp} 
        onClose={hideHelp} 
      />
    </div>
  );
};

export default Layout;
