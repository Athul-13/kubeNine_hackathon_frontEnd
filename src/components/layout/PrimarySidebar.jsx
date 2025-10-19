import { Home, MessageCircle, Search, User, Plus, Pin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStatus } from '../../context/StatusContext';
import { useAdd } from '../../context/AddContext';
import { Card, IconButton, Button } from '../ui';

const PrimarySidebar = ({ activeNav, onUserClick, showUserProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { userStatus } = useStatus();
  const { showAddMenu } = useAdd();
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'dms', label: 'DMs', icon: MessageCircle, path: '/dms' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
    { id: 'pinned', label: 'Pinned', icon: Pin, path: '/pinned' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleUserClick = () => {
    onUserClick();
  };

  const handleAddClick = () => {
    showAddMenu();
  };

  // Get user status color
  const getUserStatusColor = () => {
    if (!user) return 'bg-gray-400';
    
    switch (userStatus) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const bottomItems = [
    { id: 'add', label: 'Add', icon: Plus, onClick: handleAddClick },
    { id: 'user', label: 'User', icon: User, onClick: handleUserClick },
  ];

  return (
    <>
      {/* Desktop Sidebar - Floating */}
      <Card className="hidden md:flex w-20 flex-col items-center py-4 space-y-6">
        {/* Top Navigation Items */}
        <nav className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => (
          <IconButton
            key={item.id}
            icon={item.icon}
            onClick={() => handleNavClick(item.path)}
            variant={activeNav === item.id ? 'primary' : 'default'}
            size="lg"
            title={item.label}
          />
        ))}
        </nav>

               {/* Bottom Navigation Items */}
               <nav className="flex flex-col gap-4 border-t border-gray-200 pt-4">
                 {bottomItems.reverse().map((item) => (
                   <div key={item.id} className="relative">
                     <IconButton
                       icon={item.icon}
                       variant={item.id === 'user' && showUserProfile ? 'primary' : 'default'}
                       size="lg"
                       title={`${item.label}${user ? ` - ${userStatus}` : ''}`}
                       onClick={item.onClick}
                     />
                     {/* Status indicator for user icon */}
                     {item.id === 'user' && user && (
                       <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getUserStatusColor()}`}></div>
                     )}
                   </div>
                 ))}
               </nav>
      </Card>

      {/* Mobile Bottom Navigation - Floating */}
      <Card className="md:hidden rounded-t-2xl border-t border-gray-200 flex justify-around items-center py-3 px-4">
        {navItems.map((item) => (
          <IconButton
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            variant={activeNav === item.id ? 'primary' : 'default'}
            size="lg"
            icon={item.icon}
            title={item.label}
          />
        ))}
        {bottomItems.map((item) => (
          <div key={item.id} className="relative">
            <IconButton
              icon={item.icon}
              variant={item.id === 'user' && showUserProfile ? 'primary' : 'default'}
              size="lg"
              title={`${item.label}${user ? ` - ${userStatus}` : ''}`}
              onClick={item.onClick}
            />
            {/* Status indicator for user icon */}
            {item.id === 'user' && user && (
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getUserStatusColor()}`}></div>
            )}
          </div>
        ))}
      </Card>
    </>
  );
};

export default PrimarySidebar;
