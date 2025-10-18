import { Outlet, useLocation } from 'react-router-dom';
import PrimarySidebar from './PrimarySidebar';
import SecondarySidebar from './SecondarySidebar';
import { Card } from '../ui';
import { useState } from 'react';

const Layout = () => {
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);

  // Get current navigation based on pathname
  const getCurrentNav = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/') return 'home';
    if (path === '/dms') return 'dms';
    if (path === '/search') return 'search';
    return 'home';
  };

  const activeNav = getCurrentNav();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-200 via-gray-300 to-slate-400 p-4 md:p-6 no-select relative overflow-hidden">
      {/* Background pattern for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none"></div>
      {/* Desktop Layout */}
      <div className="hidden md:flex h-[calc(100vh-3rem)] gap-4">
        <PrimarySidebar activeNav={activeNav} />
        <SecondarySidebar 
          activeNav={activeNav} 
          selectedItem={selectedItem} 
          onSelect={setSelectedItem} 
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
        />
        <Card className="flex-1 overflow-y-auto pb-16">
          <Outlet context={{ selectedItem }} />
        </Card>
        <PrimarySidebar activeNav={activeNav} />
      </div>
    </div>
  );
};

export default Layout;
