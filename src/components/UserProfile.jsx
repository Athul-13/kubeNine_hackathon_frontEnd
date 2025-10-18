import { useAuth } from '../context/AuthContext';
import { 
  getUserDisplayName, 
  getUserEmail, 
  isAdmin, 
  isOnline, 
  getUserStatus,
  formatTimezoneOffset 
} from '../utils/userUtils';
import { Card } from './ui';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
          {getUserDisplayName(user).charAt(0).toUpperCase()}
        </div>
        
        {/* User Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">
            {getUserDisplayName(user)}
          </h3>
          <p className="text-gray-600">@{user.username}</p>
          
          {/* Status */}
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${
              isOnline(user) ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              {getUserStatus(user)}
            </span>
          </div>
          
          {/* Email */}
          {getUserEmail(user) && (
            <p className="text-sm text-gray-500 mt-1">
              {getUserEmail(user)}
            </p>
          )}
          
          {/* Admin Badge */}
          {isAdmin(user) && (
            <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full mt-2">
              Admin
            </span>
          )}
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Timezone:</span>
            <span className="ml-2 text-gray-700">
              {formatTimezoneOffset(user)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">User ID:</span>
            <span className="ml-2 text-gray-700 font-mono text-xs">
              {user._id}
            </span>
          </div>
        </div>
        
        {/* Roles */}
        {user.roles && user.roles.length > 0 && (
          <div className="mt-2">
            <span className="text-gray-500 text-sm">Roles:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.roles.map((role, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default UserProfile;
