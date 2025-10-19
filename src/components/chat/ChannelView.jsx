import { useState, useEffect, useRef, useCallback } from 'react';
import { useRooms } from '../../context/RoomsContext';
import { useMessages } from '../../context/MessagesContext';
import { Card, Button, FileUpload } from '../ui';
import { Send, ChevronUp, Users, Hash, Info, MessageSquare, File, Image, Video, Music, Download } from 'lucide-react';
import RoomInfo from './RoomInfo';
import MessageContextMenu from './MessageContextMenu';
import PinnedMessagesDrawer from './PinnedMessagesDrawer';
import ThreadPanel from './ThreadPanel';
import MessageItem from './MessageItem';

const ChannelView = () => {
  const { currentRoom, showRoomInfo, toggleRoomInfo, closeRoomInfo } = useRooms();
  const { messages, pinnedMessages, isLoading, sendMessage, loadMoreMessages, isPolling, pinMessage, unpinMessage, getThreadMessages, uploadChannelFile } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [isPinnedDrawerExpanded, setIsPinnedDrawerExpanded] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [showThread, setShowThread] = useState(false);
  const [selectedThreadMessage, setSelectedThreadMessage] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log('ChannelView - showRoomInfo changed:', showRoomInfo);
  }, [showRoomInfo]);

  useEffect(() => {
    console.log('ChannelView - currentRoom changed:', currentRoom);
  }, [currentRoom]);

  // Load thread messages for a specific message using API
  const loadThreadMessages = useCallback(async (messageId) => {
    try {
      const result = await getThreadMessages(messageId);
      if (result.success) {
        setThreadMessages(result.messages);
      } else {
        console.error('Failed to load thread messages:', result.error);
        setThreadMessages([]);
      }
    } catch (error) {
      console.error('Error loading thread messages:', error);
      setThreadMessages([]);
    }
  }, [getThreadMessages]);

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

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  // Handle file removal
  const handleFileRemove = () => {
    setSelectedFile(null);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile || !currentRoom || isUploading) return;

    try {
      setIsUploading(true);
      const result = await uploadChannelFile(selectedFile, newMessage.trim());
      
      if (result.success) {
        setSelectedFile(null);
        setNewMessage('');
        console.log('File uploaded successfully:', result.file);
      } else {
        console.error('Failed to upload file:', result.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

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

  // Handle start thread
  const handleStartThread = async (message) => {
    setSelectedThreadMessage(message);
    setThreadMessages([]); // Clear previous thread messages
    setShowThread(true);
    
    // Load existing thread messages using API
    await loadThreadMessages(message._id);
  };

  // Handle close thread
  const handleCloseThread = () => {
    setShowThread(false);
    setSelectedThreadMessage(null);
    setThreadMessages([]);
  };

  // Handle send thread message
  const handleSendThreadMessage = async (messageText) => {
    if (!selectedThreadMessage || !messageText.trim()) return;

    try {
      const result = await sendMessage(messageText.trim(), selectedThreadMessage._id);
      if (result.success) {
        // Add the message to thread messages optimistically
        setThreadMessages(prev => [...prev, {
          _id: `temp-${Date.now()}`,
          rid: currentRoom._id,
          msg: messageText.trim(),
          ts: new Date().toISOString(),
          u: { _id: localStorage.getItem('userId'), username: localStorage.getItem('username') },
          tmid: selectedThreadMessage._id
        }]);
      }
      return result;
    } catch (error) {
      console.error('Failed to send thread message:', error);
      return { success: false, error: 'Failed to send thread message' };
    }
  };

  // Check if a message has thread replies using tcount
  const hasThreadReplies = (message) => {
    return message.tcount && message.tcount > 0;
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

  // Group messages by date (excluding thread messages)
  const groupMessagesByDate = (messages) => {
    const groups = {};
    // Filter out thread messages (messages with tmid)
    const mainMessages = messages.filter(message => !message.tmid);
    mainMessages.forEach((message) => {
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
      <div className="flex flex-col flex-1 min-w-0"
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
                    <div className="flex flex-col max-w-[75%]">
                      <div 
                        className={`rounded-2xl px-4 py-2 backdrop-blur-md cursor-pointer hover:shadow-lg transition-all duration-200 ${
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
                        
                        {/* Message Text */}
                        {message.msg && (
                          <p className="text-sm break-words">{message.msg}</p>
                        )}

                        {/* File Attachments - Only render attachments if they exist, otherwise render file */}
                        {message.attachments && message.attachments.length > 0 ? (
                          <div className="mt-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="p-3 bg-white/20 rounded-lg border border-white/30">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0">
                                    {attachment.type?.startsWith('image/') ? (
                                      <Image className="w-4 h-4" />
                                    ) : attachment.type?.startsWith('video/') ? (
                                      <Video className="w-4 h-4" />
                                    ) : attachment.type?.startsWith('audio/') ? (
                                      <Music className="w-4 h-4" />
                                    ) : (
                                      <File className="w-4 h-4" />
                                    )}
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {attachment.title || 'Unknown file'}
                                      </p>
                                      <button
                                        onClick={() => {
                                          const baseUrl = import.meta.env.VITE_ROCKETCHAT_URL || 'http://localhost:3000';
                                          const url = attachment.image_url || attachment.title_link;
                                          if (url) {
                                            const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
                                            window.open(fullUrl, '_blank');
                                          }
                                        }}
                                        className="ml-2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Download file"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                    
                                    {attachment.image_size && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        {Math.round(attachment.image_size / 1024)} KB
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Image Preview */}
                                {attachment.type?.startsWith('image/') && attachment.image_preview && (
                                  <div className="mt-3">
                                    <img
                                      src={`data:image/png;base64,${attachment.image_preview}`}
                                      alt={attachment.title || 'Image'}
                                      className="max-w-full h-auto rounded-lg shadow-sm"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : message.file ? (
                          <div className="mt-2">
                            <div className="p-3 bg-white/20 rounded-lg border border-white/30">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <File className="w-4 h-4" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {message.file.name || 'Unknown file'}
                                    </p>
                                    <button
                                      onClick={() => {
                                        const baseUrl = import.meta.env.VITE_ROCKETCHAT_URL || 'http://localhost:3000';
                                        const url = message.file.url;
                                        if (url) {
                                          const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
                                          window.open(fullUrl, '_blank');
                                        }
                                      }}
                                      className="ml-2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="Download file"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                  
                                  {message.file.size && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {Math.round(message.file.size / 1024)} KB
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      
                      {/* Thread Button - Always aligned to the left */}
                      {hasThreadReplies(message) && (
                        <div className={`mt-1 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <button
                            onClick={() => handleStartThread(message)}
                            className="text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                          >
                            <MessageSquare className="w-3 h-3 mr-1 inline" />
                            Threads
                          </button>
                        </div>
                      )}
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
        <div className="flex-shrink-0 p-4 bg-transparent">
          {/* File Preview */}
          {selectedFile && (
            <div className="mb-3">
              <FileUpload
                onFileSelect={handleFileSelect}
                onRemove={handleFileRemove}
                selectedFile={selectedFile}
                isUploading={isUploading}
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
            {/* File Upload Button */}
            <FileUpload
              onFileSelect={handleFileSelect}
              onRemove={handleFileRemove}
              selectedFile={selectedFile}
              isUploading={isUploading}
              isCompact={true}
            />
            
            {/* Message Input */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (selectedFile) {
                    handleFileUpload();
                  } else {
                    handleSendMessage(e);
                  }
                }
              }}
              placeholder={selectedFile ? `Add a description for ${selectedFile.name}...` : `Message #${currentRoom.name}`}
              className="flex-1 px-2 py-3 bg-transparent text-gray-800 placeholder-gray-500 outline-none"
              disabled={isSending || isUploading}
            />
            
            {/* Send Button */}
            <button
              onClick={selectedFile ? handleFileUpload : handleSendMessage}
              disabled={(!newMessage.trim() && !selectedFile) || isSending || isUploading}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
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

             {/* Thread Panel - Responsive */}
             {showThread && selectedThreadMessage && (
               <>
                 {/* Mobile: Slide-in Overlay */}
                 <div 
                   className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                   onClick={handleCloseThread}
                 >
                   <div 
                     className="absolute right-0 top-0 bottom-0 w-full max-w-sm h-full"
                     onClick={(e) => e.stopPropagation()}
                   >
                     <ThreadPanel
                       originalMessage={selectedThreadMessage}
                       threadMessages={threadMessages}
                       onSendThreadMessage={handleSendThreadMessage}
                       onClose={handleCloseThread}
                       isLoading={isLoading}
                     />
                   </div>
                 </div>

                 {/* Desktop: Side Panel - Takes full height */}
                 <div className="hidden md:block w-96 flex-shrink-0 h-full">
                   <ThreadPanel
                     originalMessage={selectedThreadMessage}
                     threadMessages={threadMessages}
                     onSendThreadMessage={handleSendThreadMessage}
                     onClose={handleCloseThread}
                     isLoading={isLoading}
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
                   onStartThread={handleStartThread}
                   isPinned={pinnedMessages.some(pinnedMsg => pinnedMsg._id === contextMenu.message._id)}
                 />
             )}
    </div>
  );
};

export default ChannelView;