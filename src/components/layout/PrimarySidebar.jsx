import { Home, MessageCircle, Search, User, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, IconButton, Button } from '../ui';

const PrimarySidebar = ({ activeNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'dms', label: 'DMs', icon: MessageCircle, path: '/dms' },
    { id: 'search', label: 'Search', icon: Search, path: '/search' },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  // Get user status color
  const getUserStatusColor = () => {
    if (!user) return 'bg-gray-400';
    
    const isOnline = user.status === 'online' && user.statusConnection === 'online';
    if (isOnline) return 'bg-green-500';
    
    switch (user.status) {
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'invisible': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const bottomItems = [
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'user', label: 'User', icon: User },
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
                variant="default"
                size="lg"
                title={`${item.label}${user ? ` - ${user.status}` : ''}`}
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
          <Button
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            variant={activeNav === item.id ? 'primary' : 'default'}
            size="sm"
            icon={item.icon}
            iconPosition="top"
            className="flex-col"
            title={item.label}
          >
            {item.label}
          </Button>
        ))}
        {bottomItems.map((item) => (
          <div key={item.id} className="relative">
            <Button
              variant="default"
              size="sm"
              icon={item.icon}
              iconPosition="top"
              className="flex-col"
              title={`${item.label}${user ? ` - ${user.status}` : ''}`}
            >
              {item.label}
            </Button>
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
