import { useState, useEffect, useRef } from 'react';
import { useRooms } from '../../context/RoomsContext';
import { useMessages } from '../../context/MessagesContext';
import { Card, Button } from '../ui';
import { Send, ChevronUp, Users, Hash, Info } from 'lucide-react';
import RoomInfo from './RoomInfo';
import MessageContextMenu from './MessageContextMenu';
import PinnedMessagesDrawer from './PinnedMessagesDrawer';

const ChannelView = () => {
  const { currentRoom, showRoomInfo, toggleRoomInfo, closeRoomInfo } = useRooms();
  const { messages, pinnedMessages, isLoading, sendMessage, loadMoreMessages, isPolling, pinMessage, unpinMessage } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [isPinnedDrawerExpanded, setIsPinnedDrawerExpanded] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
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

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);

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

  // Handle right-click on message
  const handleMessageRightClick = (e, message) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      message,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Toggle pinned messages drawer
  const togglePinnedDrawer = () => {
    setIsPinnedDrawerExpanded(!isPinnedDrawerExpanded);
  };

  // Handle clicking on a pinned message
  const handlePinnedMessageClick = (pinnedMessage) => {
    // Close the drawer
    setIsPinnedDrawerExpanded(false);
    
    // Find the message in the messages array
    const messageElement = document.querySelector(`[data-message-id="${pinnedMessage._id}"]`);
    
    if (messageElement) {
      // Scroll to the message
      messageElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Highlight the message briefly
      setHighlightedMessageId(pinnedMessage._id);
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        setHighlightedMessageId(null);
      }, 2000);
    }
  };

  // Handle reply to message
  const handleReply = (message) => {
    setNewMessage(`@${message.u?.username || message.u?.name || 'Unknown'} `);
    closeContextMenu();
    // Focus on input field
    setTimeout(() => {
      const input = document.querySelector('input[type="text"]');
      if (input) input.focus();
    }, 100);
  };

  // Handle pin message
  const handlePin = async (message) => {
    try {
      const result = await pinMessage(message._id);
      if (result.success) {
        console.log('Pinned message:', message);
      } else {
        console.error('Failed to pin message:', result.error);
      }
    } catch (error) {
      console.error('Error pinning message:', error);
    }
    closeContextMenu();
  };

  // Handle unpin message
  const handleUnpin = async (message) => {
    try {
      const result = await unpinMessage(message._id);
      if (result.success) {
        console.log('Unpinned message:', message);
      } else {
        console.error('Failed to unpin message:', result.error);
      }
    } catch (error) {
      console.error('Error unpinning message:', error);
    }
    closeContextMenu();
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
        <div className="flex-shrink-0 flex items-center justify-between p-4 rounded-lg btn-glass mb-0.5">
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

        {/* Pinned Messages Drawer */}
        <PinnedMessagesDrawer
          pinnedMessages={pinnedMessages}
          onMessageClick={handlePinnedMessageClick}
          isExpanded={isPinnedDrawerExpanded}
          onToggle={togglePinnedDrawer}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide" ref={messagesContainerRef}>
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
                // Check if message is from current user
                const isOwnMessage = message.u?._id === currentRoom.currentUserId || 
                                   message.u?.username === localStorage.getItem('username');
                const isPinned = pinnedMessages.some(pinnedMsg => pinnedMsg._id === message._id);
                
                const isHighlighted = highlightedMessageId === message._id;
                
                return (
                  <div 
                    key={message._id || index} 
                    className={`flex mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    data-message-id={message._id}
                  >
                    <div 
                      className={`max-w-[75%] rounded-2xl px-4 py-2 backdrop-blur-md cursor-pointer hover:shadow-lg transition-all duration-200 ${
                        isOwnMessage 
                          ? 'bg-blue-500/25 border border-blue-400/30 text-gray-800 shadow-lg' 
                          : 'bg-white/30 border border-white/30 text-gray-900 shadow-md'
                      } ${isPinned ? 'ring-2 ring-yellow-400/50 bg-yellow-50/30' : ''} ${
                        isHighlighted ? 'ring-4 ring-blue-500/70 bg-blue-100/50 animate-pulse' : ''
                      }`}
                      style={{
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      }}
                      onContextMenu={(e) => handleMessageRightClick(e, message)}
                    >
                      <div className="flex items-baseline space-x-2 mb-0.5">
                        <span className="text-xs font-medium opacity-90">
                          {isOwnMessage ? 'You' : (message.u?.name || message.u?.username || 'Unknown')}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTime(message.ts)}
                        </span>
                        {isPinned && (
                          <span className="text-xs text-yellow-600 font-medium">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-sm break-words">{message.msg}</p>
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
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder={`Message #${currentRoom.name}`}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none transition-all"
              disabled={isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              variant="primary"
              size="md"
              className="flex items-center space-x-2 px-6"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isSending ? 'Sending...' : 'Send'}</span>
            </Button>
          </div>
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

      {/* Context Menu */}
      {contextMenu && (
          <MessageContextMenu
            message={contextMenu.message}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
            onReply={handleReply}
            onPin={handlePin}
            onUnpin={handleUnpin}
            isPinned={pinnedMessages.some(pinnedMsg => pinnedMsg._id === contextMenu.message._id)}
          />
      )}
    </div>
  );
};

export default ChannelView;