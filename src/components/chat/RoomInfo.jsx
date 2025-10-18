import { useState, useEffect } from 'react';
import { Card, Button } from '../ui';
import { useRooms } from '../../context/RoomsContext';
import { X, Users, Hash, MessageSquare, Calendar, Shield } from 'lucide-react';

const RoomInfo = ({ roomId, onClose }) => {
  const { getRoomInfo, getChannelMembers } = useRooms();
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomInfo = async () => {
      if (!roomId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching room info for:', roomId);
        
        // Fetch room info and members in parallel
        const [roomResult, membersResult] = await Promise.all([
          getRoomInfo(roomId),
          getChannelMembers(roomId)
        ]);
        
        if (roomResult.success) {
          setRoomInfo(roomResult.room);
        } else {
          console.error('Failed to load room info:', roomResult.error);
          setError(roomResult.error);
        }

        if (membersResult.success) {
          setMembers(membersResult.members);
        } else {
          console.error('Failed to load members:', membersResult.error);
          // Don't set error for members failure, just log it
        }
      } catch (err) {
        console.error('Error loading room info:', err);
        setError('Failed to load room information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomInfo();
  }, [roomId, getRoomInfo, getChannelMembers]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-l border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Room Information</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-l border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Room Information</h2>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="text-center py-8">
            <div className="text-red-500 mb-2 text-2xl">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!roomInfo) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-l border-gray-200">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Room Information</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Room Name */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-gray-800 truncate">#{roomInfo.name}</h3>
            <p className="text-sm text-gray-500 capitalize">
              {roomInfo.t === 'c' ? 'Channel' : roomInfo.t === 'p' ? 'Private Group' : 'Direct Message'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Topic */}
        {roomInfo.topic && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Topic
            </h4>
            <p className="text-gray-600 bg-gray-50 rounded-lg p-3 text-sm break-words">
              {roomInfo.topic}
            </p>
          </div>
        )}

        {/* Description */}
        {roomInfo.description && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Description</h4>
            <p className="text-gray-600 bg-gray-50 rounded-lg p-3 text-sm break-words">
              {roomInfo.description}
            </p>
          </div>
        )}

        {/* Members */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Members ({members.length})
          </h4>
          <div className="space-y-2">
            {members.length > 0 ? (
              members.map((member) => (
                <div key={member._id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {(member.name || member.username || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-700 font-medium truncate">
                        {member.name || member.username || 'Unknown'}
                      </span>
                      {member.status && (
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          member.status === 'online' ? 'bg-green-500' :
                          member.status === 'away' ? 'bg-yellow-500' :
                          member.status === 'busy' ? 'bg-red-500' :
                          member.status === 'dnd' ? 'bg-red-600' : 'bg-gray-400'
                        }`}></div>
                      )}
                    </div>
                    {member.username && member.name && (
                      <span className="text-xs text-gray-500 truncate block">@{member.username}</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">
                No members found
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{roomInfo.msgs || 0}</div>
            <div className="text-xs text-gray-600 mt-1">Messages</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{members.length}</div>
            <div className="text-xs text-gray-600 mt-1">Members</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;