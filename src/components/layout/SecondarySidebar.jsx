import { Card, Button } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useStatus } from '../../context/StatusContext';

const SecondarySidebar = ({ activeNav, selectedItem, onSelect, showUserProfile, onCloseUserProfile }) => {
  const { user, logout } = useAuth();
  const { userStatus, setCustomStatus, isUpdatingStatus } = useStatus();
  const getSecondaryContent = () => {
    switch (activeNav) {
      case 'home':
        return {
          title: 'Home',
          items: ['Trending', 'Following', 'For You']
        };
      case 'dms':
        return {
          title: 'Direct Messages',
          items: ['Alice', 'Bob', 'Charlie', 'Diana']
        };
      case 'search':
        return {
          title: 'Search',
          items: ['Recent', 'Users', 'Posts', 'Hashtags']
        };
      default:
        return { title: '', items: [] };
    }
  };

  const { title, items } = getSecondaryContent();

  // Get user profile content if user icon was clicked
  const getUserProfileContent = () => {
    if (!showUserProfile || !user) return null;
    
    const getUserStatusColor = (status) => {
      switch (status) {
        case 'online': return 'bg-green-500';
        case 'away': return 'bg-yellow-500';
        case 'busy': return 'bg-red-500';
        case 'dnd': return 'bg-red-600';
        default: return 'bg-gray-400';
      }
    };

    const getUserStatusText = (status) => {
      switch (status) {
        case 'online': return 'Online';
        case 'away': return 'Away';
        case 'busy': return 'Busy';
        case 'dnd': return 'Do Not Disturb';
        default: return 'Offline';
      }
    };

    const handleLogout = async () => {
      try {
        await logout();
        onCloseUserProfile();
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

    const handleStatusChange = async (newStatus) => {
      try {
        await setCustomStatus(newStatus, `Status changed to ${newStatus}`);
        // Status will be updated automatically via callback
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    };
    
    return (
      <div className="space-y-4">
        {/* User Info Header */}
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {(user.name || user.username || 'U').charAt(0).toUpperCase()}
          </div>
          
          {/* User Details */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-base">
              {user.name || user.username || 'User'}
            </h3>
            <p className="text-gray-500 text-sm">@{user.username || 'username'}</p>
          </div>
        </div>

        {/* Current Status */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Status:</p>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getUserStatusColor(userStatus)}`}></div>
            <span className="text-sm text-gray-700">{getUserStatusText(userStatus)}</span>
          </div>
        </div>

        {/* Status Options */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">Set Status:</p>
          <div className="space-y-1">
            {[
              { status: 'online', label: 'Online', color: 'bg-green-500' },
              { status: 'away', label: 'Away', color: 'bg-yellow-500' },
              { status: 'busy', label: 'Busy', color: 'bg-red-500' },
              { status: 'dnd', label: 'Do Not Disturb', color: 'bg-red-600' }
            ].map((item) => (
              <button
                key={item.status}
                onClick={() => handleStatusChange(item.status)}
                disabled={isUpdatingStatus}
                className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors w-full text-left ${
                  userStatus === item.status 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'hover:bg-gray-100 text-gray-700'
                } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                <span>{item.label}</span>
                {isUpdatingStatus && userStatus === item.status && (
                  <span className="ml-auto text-xs">Updating...</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1 pt-2 border-t border-gray-200">
          <button className="flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors hover:bg-gray-100 text-gray-700 w-full text-left">
            <span>👤</span>
            <span>Profile</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors hover:bg-red-50 text-red-600 w-full text-left"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Secondary Sidebar - Floating */}
      <Card className="hidden md:flex w-64 overflow-y-auto flex-col" padding="none">
        <div className="border-b border-white/20 p-4">
          <h2 className="font-bold text-gray-800 drop-shadow-sm">
            {showUserProfile ? 'User Profile' : title}
          </h2>
        </div>
        <div className="p-4 space-y-2 flex-1">
          {showUserProfile ? (
            getUserProfileContent()
          ) : (
            items.map((item) => (
              <Button
                key={item}
                onClick={() => onSelect(item)}
                variant={selectedItem === item ? 'primary' : 'default'}
                className="w-full justify-start"
              >
                {item}
              </Button>
            ))
          )}
        </div>
      </Card>

      {/* Mobile Secondary Sidebar - Floating */}
      <Card className="md:hidden overflow-x-auto" padding="none">
        {showUserProfile ? (
          <div className="p-4">
            <h2 className="font-bold text-gray-800 text-sm mb-4 drop-shadow-sm">User Profile</h2>
            {getUserProfileContent()}
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-4 min-w-max">
            <h2 className="font-bold text-gray-800 text-sm whitespace-nowrap mr-4 drop-shadow-sm">{title}</h2>
            {items.map((item) => (
              <Button
                key={item}
                onClick={() => onSelect(item)}
                variant={selectedItem === item ? 'primary' : 'secondary'}
                size="sm"
                className="whitespace-nowrap rounded-full"
              >
                {item}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default SecondarySidebar;
