import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from './ui';
import { User, LogOut, Settings } from 'lucide-react';

const UserProfileDropdown = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfile = () => {
    // Navigate to profile page or open profile modal
    console.log('Navigate to profile');
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'dnd': return 'bg-red-600';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      case 'dnd': return 'Do Not Disturb';
      default: return 'Offline';
    }
  };

  if (!user) return null;

  return (
    <Card className="w-80 p-6 space-y-4">
      {/* User Info Header */}
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
          {user.name?.charAt(0) || user.username?.charAt(0) || 'U'}
        </div>
        
        {/* User Details */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">
            {user.name || user.username}
          </h3>
          <p className="text-gray-500 text-sm">@{user.username}</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Status:</p>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(user.status)}`}></div>
          <span className="text-sm text-gray-700">{getStatusText(user.status)}</span>
        </div>
      </div>

      {/* Status Options */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">Set Status:</p>
        <div className="grid grid-cols-2 gap-2">
          {['online', 'away', 'busy', 'dnd'].map((status) => (
            <button
              key={status}
              className={`flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors ${
                user.status === status 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
              <span className="capitalize">{getStatusText(status)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-gray-200">
        <Button
          onClick={handleProfile}
          variant="default"
          size="sm"
          className="w-full justify-start"
          icon={User}
        >
          Profile
        </Button>
        
        <Button
          onClick={handleLogout}
          variant="default"
          size="sm"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          icon={LogOut}
        >
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default UserProfileDropdown;
