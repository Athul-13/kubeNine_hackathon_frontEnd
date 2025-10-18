import { useState, useEffect, useRef } from 'react';
import { X, Search, User } from 'lucide-react';
import { usersService } from '../../api/users/usersService';

const UserSearchDropdown = ({ selectedUsers, onUsersChange, placeholder = "Search users..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Search users with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery);
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchUsers = async (query) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await usersService.getUsers(20, 0, query);
      
      if (result.success) {
        // Filter out already selected users
        const filteredUsers = result.users.filter(
          user => !selectedUsers.some(selected => selected._id === user._id)
        );
        setUsers(filteredUsers);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    onUsersChange([...selectedUsers, user]);
    setSearchQuery('');
    setUsers([]);
    setIsOpen(false);
  };

  const handleUserRemove = (userId) => {
    onUsersChange(selectedUsers.filter(user => user._id !== userId));
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchQuery.trim()) {
      searchUsers(searchQuery);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <User className="w-3 h-3" />
              <span>{user.name || user.username}</span>
              <button
                onClick={() => handleUserRemove(user._id)}
                className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none transition-all"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-sm text-gray-600">Searching...</span>
            </div>
          ) : error ? (
            <div className="px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : users.length > 0 ? (
            users.map((user) => (
              <button
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center space-x-3 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {(user.name || user.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.username || 'Unknown User'}
                  </div>
                  {user.username && user.name && (
                    <div className="text-xs text-gray-500 truncate">
                      @{user.username}
                    </div>
                  )}
                </div>
              </button>
            ))
          ) : searchQuery.trim() ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No users found for "{searchQuery}"
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              Start typing to search users...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearchDropdown;
