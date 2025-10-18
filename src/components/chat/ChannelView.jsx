import { useState, useEffect, useRef } from 'react';
import { useRooms } from '../../context/RoomsContext';
import { useMessages } from '../../context/MessagesContext';
import { Card, Button } from '../ui';
import { Send, ChevronUp, Users, Hash, Info } from 'lucide-react';
import RoomInfo from './RoomInfo';

const ChannelView = () => {
  const { currentRoom, showRoomInfo, toggleRoomInfo, closeRoomInfo } = useRooms();
  const { messages, isLoading, sendMessage, loadMoreMessages, isPolling } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('ChannelView - showRoomInfo changed:', showRoomInfo);
  }, [showRoomInfo]);

  useEffect(() => {
    console.log('ChannelView - currentRoom changed:', currentRoom);
  }, [currentRoom]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      await sendMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle load more messages
  const handleLoadMore = async () => {
    await loadMoreMessages();
  };

  // Format message timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format message date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((message) => {
      const date = formatDate(message.ts);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  if (!currentRoom) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Channel Selected</h3>
          <p className="text-gray-500">Select a channel from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div 
        className="flex flex-col flex-1 min-w-0"
        onClick={() => {
          if (showRoomInfo) {
            console.log('Click outside detected, closing room info');
            closeRoomInfo();
          }
        }}
      >
        {/* Channel Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 rounded-lg btn-glass">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-white/40 rounded-lg p-2 -m-2 transition-colors min-w-0"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Room header clicked, current state:', showRoomInfo);
              toggleRoomInfo();
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Hash className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-800 truncate">#{currentRoom.name}</h2>
              {currentRoom.topic && (
                <p className="text-sm text-gray-600 truncate">{currentRoom.topic}</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{currentRoom.usersCount || 0} members</span>
              {isPolling && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                console.log('Info button clicked, current state:', showRoomInfo);
                toggleRoomInfo();
              }}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-white/40 rounded-lg"
              title="Room Information"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
          {/* Load More Button */}
          {messages.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                variant="secondary"
                size="sm"
                className="flex items-center space-x-2"
              >
                <ChevronUp className="w-4 h-4" />
                <span>{isLoading ? 'Loading...' : 'Load More'}</span>
              </Button>
            </div>
          )}

          {/* Messages */}
          {Object.entries(messageGroups).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4">
                <div className="bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm text-gray-600 border border-white/30 shadow-sm">
                  {date}
                </div>
              </div>

              {/* Messages for this date */}
              {dateMessages.map((message, index) => {
                const isCurrentUser = message.u?._id === localStorage.getItem('userId');
                
                return (
                  <div key={message._id || index} className={`flex mb-4 px-2 py-1 transition-colors ${
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`flex space-x-3 max-w-[70%] ${
                      isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                    }`}>
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {(message.u?.name || message.u?.username || 'U').charAt(0).toUpperCase()}
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 min-w-0 ${
                        isCurrentUser ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`flex items-baseline space-x-2 mb-1 ${
                          isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="font-semibold text-gray-800 text-sm">
                            {message.u?.name || message.u?.username || 'Unknown User'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.ts)}
                          </span>
                        </div>
                        <div className={`inline-block ${
                          isCurrentUser 
                            ? 'bg-blue-500 text-white rounded-2xl rounded-br-md' 
                            : 'bg-white/70 backdrop-blur-sm text-gray-800 rounded-2xl rounded-bl-md'
                        } px-4 py-2 shadow-sm`}>
                          <p className="text-sm break-words leading-relaxed">{message.msg}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Loading State */}
          {isLoading && messages.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading messages...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && messages.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Hash className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Be the first to send a message!</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="flex-shrink-0 p-4 ">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message #${currentRoom.name}`}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none transition-all"
              disabled={isSending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              variant="primary"
              size="md"
              className="flex items-center space-x-2 px-6"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isSending ? 'Sending...' : 'Send'}</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Room Info Panel - Responsive */}
      {showRoomInfo && (
        <>
          {/* Mobile: Slide-in Overlay */}
          <div 
            className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeRoomInfo}
          >
            <div 
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <RoomInfo 
                roomId={currentRoom._id} 
                onClose={closeRoomInfo} 
              />
            </div>
          </div>

          {/* Desktop: Side Panel - Takes full height */}
          <div className="hidden md:block w-96 flex-shrink-0 h-full">
            <RoomInfo 
              roomId={currentRoom._id} 
              onClose={closeRoomInfo} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChannelView;