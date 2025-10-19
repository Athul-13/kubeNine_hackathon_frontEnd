import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useStatus } from '../../context/StatusContext';
import { useRooms } from '../../context/RoomsContext';
import { useMessages } from '../../context/MessagesContext';
import { useAdd } from '../../context/AddContext';
import { Hash, MessageCircle } from 'lucide-react';

const SecondarySidebar = ({ activeNav, selectedItem, onSelect, showUserProfile, onCloseUserProfile }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userStatus, setCustomStatus, isUpdatingStatus } = useStatus();
  const { rooms, selectRoom, isLoading: roomsLoading } = useRooms();
  const { selectRoomForMessages, getAllPinnedMessages } = useMessages();
  const { showAddOptions, selectAddOption } = useAdd();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [pinnedByChannel, setPinnedByChannel] = useState([]);
  const [isLoadingPinned, setIsLoadingPinned] = useState(false);

  const loadPinnedMessages = useCallback(async () => {
    if (isLoadingPinned) return;
    
    try {
      setIsLoadingPinned(true);
      const result = await getAllPinnedMessages(rooms);
      if (result.success) {
        setPinnedByChannel(result.pinnedByChannel);
      } else {
        console.error('Failed to load pinned messages:', result.error);
        setPinnedByChannel([]);
      }
    } catch (error) {
      console.error('Error loading pinned messages:', error);
      setPinnedByChannel([]);
    } finally {
      setIsLoadingPinned(false);
    }
  }, [isLoadingPinned, getAllPinnedMessages, rooms]);

  // Load pinned messages when pinned nav is active
  useEffect(() => {
    if (activeNav === 'pinned' && rooms.length > 0) {
      loadPinnedMessages();
    }
  }, [activeNav, rooms]);

  // Handle clicking on a pinned message
  const handlePinnedMessageClick = async (message, channelId) => {
    try {
      // Find the room by channelId
      const room = rooms.find(r => r._id === channelId);
      if (!room) {
        console.error('Room not found for channelId:', channelId);
        return;
      }

      // Select the room and load messages
      selectRoom(room);
      selectRoomForMessages();
      setSelectedRoomId(channelId);
      
      // Navigate to home to show the channel
      navigate('/home');
      
      // Wait a bit for the room to load, then scroll to the message
      setTimeout(() => {
        const messageElement = document.querySelector(`[data-message-id="${message._id}"]`);
        if (messageElement) {
          messageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Highlight the message briefly
          messageElement.style.animation = 'pulse 2s ease-in-out';
          setTimeout(() => {
            messageElement.style.animation = '';
          }, 2000);
        }
      }, 1000);
    } catch (error) {
      console.error('Error navigating to pinned message:', error);
    }
  };

  const getSecondaryContent = () => {
    // Show Add options if Add button was clicked
    if (showAddOptions) {
      return {
        title: 'Add New',
        items: [
          {
            id: 'channel',
            name: 'Create New Channel',
            icon: Hash,
            onClick: () => {
              selectAddOption('channel');
              navigate('/add');
            }
          },
          {
            id: 'dm',
            name: 'Direct Message',
            icon: MessageCircle,
            onClick: () => {
              selectAddOption('dm');
              navigate('/add');
            }
          }
        ]
      };
    }

    switch (activeNav) {
      case 'home':
        return {
          title: 'Home',
          items: rooms.map(room => ({
            id: room._id,
            name: room.name,
            type: room.t,
            unread: room.unread || 0,
            isSelected: selectedRoomId === room._id
          }))
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
      case 'pinned':
        return {
          title: 'Pinned Messages',
          items: pinnedByChannel
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
        case 'offline': return 'Offline';
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
      <Card className="hidden md:flex w-72 overflow-y-auto flex-col" padding="none">
        <div className="border-b border-white/20 p-4">
          <h2 className="font-bold text-gray-800 drop-shadow-sm">
            {showUserProfile ? 'User Profile' : title}
          </h2>
        </div>
               <div className="p-4 space-y-2 flex-1">
                 {showUserProfile ? (
                   getUserProfileContent()
                 ) : showAddOptions ? (
                   // Render Add options
                   items.map((item) => (
                     <Button
                       key={item.id}
                       onClick={item.onClick}
                       variant="default"
                       className="w-full justify-start flex items-center space-x-3"
                     >
                       <item.icon className="w-4 h-4" />
                       <span className="flex-1 text-left">{item.name}</span>
                     </Button>
                   ))
                 ) : activeNav === 'home' ? (
                   // Render rooms for home section
                   roomsLoading ? (
                     <div className="flex justify-center py-4">
                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                     </div>
                   ) : items.length > 0 ? (
                     items.map((room) => (
                       <Button
                         key={room.id}
                         onClick={() => {
                           const selectedRoom = rooms.find(r => r._id === room.id);
                           selectRoom(selectedRoom);
                           selectRoomForMessages();
                           setSelectedRoomId(room.id);
                           onSelect(room.name);
                         }}
                         variant={room.isSelected ? 'primary' : 'default'}
                         className="w-full justify-start flex items-center"
                       >
                         <span className="flex-1 text-left">#{room.name}</span>
                         {room.unread > 0 && (
                           <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                             {room.unread}
                           </span>
                         )}
                       </Button>
                     ))
                   ) : (
                     <div className="text-center py-4 text-gray-500">
                       <p>No rooms available</p>
                     </div>
                   )
                 ) : activeNav === 'pinned' ? (
                   // Render pinned messages grouped by channel
                   isLoadingPinned ? (
                     <div className="flex justify-center py-4">
                       <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                       <span className="ml-2 text-gray-600">Loading pinned messages...</span>
                     </div>
                   ) : pinnedByChannel.length > 0 ? (
                     <div className="space-y-4">
                       {pinnedByChannel.map((channelGroup) => (
                         <div key={channelGroup.channelId} className="space-y-2">
                           <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                             #{channelGroup.channelName}
                           </h3>
                           {channelGroup.messages.map((message) => (
                             <div
                               key={message._id}
                               onClick={() => handlePinnedMessageClick(message, channelGroup.channelId)}
                               className="p-3 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30 cursor-pointer hover:bg-white/70 transition-colors"
                             >
                               <div className="flex items-baseline space-x-2 mb-1">
                                 <span className="text-xs font-medium text-gray-600">
                                   {message.u?.name || message.u?.username || 'Unknown'}
                                 </span>
                                 <span className="text-xs text-gray-500">
                                   {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                               </div>
                               <p className="text-sm text-gray-800 line-clamp-2">{message.msg}</p>
                             </div>
                           ))}
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-4 text-gray-500">
                       <p>No pinned messages found</p>
                     </div>
                   )
                 ) : (
                   // Render other sections (DMs, Search)
                   items.map((item) => (
                     <Button
                       key={typeof item === 'string' ? item : item.id || item.name}
                       onClick={() => onSelect(typeof item === 'string' ? item : item.name)}
                       variant={selectedItem === (typeof item === 'string' ? item : item.name) ? 'primary' : 'default'}
                       className="w-full justify-start"
                     >
                       {typeof item === 'string' ? item : item.name}
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
               ) : showAddOptions ? (
                 // Mobile Add options view
                 <div className="flex items-center space-x-2 p-4 min-w-max">
                   <h2 className="font-bold text-gray-800 text-sm whitespace-nowrap mr-4 drop-shadow-sm">{title}</h2>
                   {items.map((item) => (
                     <Button
                       key={item.id}
                       onClick={item.onClick}
                       variant="secondary"
                       size="sm"
                       className="whitespace-nowrap rounded-full flex items-center space-x-2"
                     >
                       <item.icon className="w-3 h-3" />
                       {item.name}
                     </Button>
                   ))}
                 </div>
               ) : activeNav === 'home' ? (
                 // Mobile rooms view
                 <div className="flex items-center space-x-2 p-4 min-w-max">
                   <h2 className="font-bold text-gray-800 text-sm whitespace-nowrap mr-4 drop-shadow-sm">{title}</h2>
                   {roomsLoading ? (
                     <div className="flex items-center space-x-2">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                       <span className="text-sm text-gray-500">Loading...</span>
                     </div>
                   ) : items.length > 0 ? (
                     items.map((room) => (
                       <Button
                         key={room.id}
                         onClick={() => {
                           const selectedRoom = rooms.find(r => r._id === room.id);
                           selectRoom(selectedRoom);
                           selectRoomForMessages();
                           setSelectedRoomId(room.id);
                           onSelect(room.name);
                         }}
                         variant={room.isSelected ? 'primary' : 'secondary'}
                         size="sm"
                         className="whitespace-nowrap rounded-full flex items-center"
                       >
                         #{room.name}
                         {room.unread > 0 && (
                           <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                             {room.unread}
                           </span>
                         )}
                       </Button>
                     ))
                   ) : (
                     <span className="text-sm text-gray-500">No rooms</span>
                   )}
                 </div>
               ) : activeNav === 'pinned' ? (
                 // Mobile pinned messages view
                 <div className="p-4">
                   <h2 className="font-bold text-gray-800 text-sm mb-4 drop-shadow-sm">{title}</h2>
                   {isLoadingPinned ? (
                     <div className="flex items-center space-x-2">
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                       <span className="text-sm text-gray-500">Loading...</span>
                     </div>
                   ) : pinnedByChannel.length > 0 ? (
                     <div className="space-y-3">
                       {pinnedByChannel.map((channelGroup) => (
                         <div key={channelGroup.channelId} className="space-y-2">
                           <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-1">
                             #{channelGroup.channelName}
                           </h3>
                           <div className="space-y-1">
                             {channelGroup.messages.slice(0, 3).map((message) => (
                               <div
                                 key={message._id}
                                 onClick={() => handlePinnedMessageClick(message, channelGroup.channelId)}
                                 className="p-2 bg-white/50 backdrop-blur-sm rounded-lg border border-white/30 cursor-pointer hover:bg-white/70 transition-colors"
                               >
                                 <div className="flex items-baseline space-x-2 mb-1">
                                   <span className="text-xs font-medium text-gray-600">
                                     {message.u?.name || message.u?.username || 'Unknown'}
                                   </span>
                                   <span className="text-xs text-gray-500">
                                     {new Date(message.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                 </div>
                                 <p className="text-xs text-gray-800 line-clamp-1">{message.msg}</p>
                               </div>
                             ))}
                             {channelGroup.messages.length > 3 && (
                               <p className="text-xs text-gray-500 text-center">
                                 +{channelGroup.messages.length - 3} more
                               </p>
                             )}
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <p className="text-sm text-gray-500">No pinned messages found</p>
                   )}
                 </div>
               ) : (
                 // Other sections (DMs, Search)
                 <div className="flex items-center space-x-2 p-4 min-w-max">
                   <h2 className="font-bold text-gray-800 text-sm whitespace-nowrap mr-4 drop-shadow-sm">{title}</h2>
                   {items.map((item) => (
                     <Button
                       key={typeof item === 'string' ? item : item.id || item.name}
                       onClick={() => onSelect(typeof item === 'string' ? item : item.name)}
                       variant={selectedItem === (typeof item === 'string' ? item : item.name) ? 'primary' : 'secondary'}
                       size="sm"
                       className="whitespace-nowrap rounded-full"
                     >
                       {typeof item === 'string' ? item : item.name}
                     </Button>
                   ))}
                 </div>
               )}
             </Card>
    </>
  );
};

export default SecondarySidebar;
