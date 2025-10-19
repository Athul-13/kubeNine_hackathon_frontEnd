import { Outlet, useLocation } from 'react-router-dom';
import PrimarySidebar from './PrimarySidebar';
import SecondarySidebar from './SecondarySidebar';
import { Card } from '../ui';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);

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
        <PrimarySidebar 
          activeNav={activeNav} 
          onUserClick={handleUserProfileToggle}
          showUserProfile={showUserProfile}
        />
      </div>
    </div>
  );
};

export default Layout;
