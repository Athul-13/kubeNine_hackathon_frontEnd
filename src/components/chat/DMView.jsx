import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, IconButton, FileUpload } from '../ui';
import { useMessages } from '../../context/MessagesContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Send, 
  Pin, 
  ChevronUp,
  MessageCircle,
  MessageSquare,
  Users,
  File,
  Image,
  Video,
  Music,
  Download
} from 'lucide-react';
import MessageContextMenu from './MessageContextMenu';
import ThreadPanel from './ThreadPanel';
import PinnedMessagesDrawer from './PinnedMessagesDrawer';
import MessageItem from './MessageItem';

const DMView = ({ selectedDM }) => {
  const { 
    dmMessages, 
    isLoading, 
    sendDMMessage, 
    loadDMMessages, 
    loadMoreMessages,
    pinnedMessages,
    loadPinnedMessages,
    getThreadMessages,
    pinMessage,
    unpinMessage,
    pollDMMessages,
    uploadDMFile,
    dms,
    isPolling
  } = useMessages();
  const { user } = useAuth();
  
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [isPinnedDrawerExpanded, setIsPinnedDrawerExpanded] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [showThread, setShowThread] = useState(false);
  const [selectedThreadMessage, setSelectedThreadMessage] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [currentDMId, setCurrentDMId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const pollingIntervalRef = useRef(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Start polling for new DM messages
  const startDMPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    if (currentDMId) {
      pollingIntervalRef.current = setInterval(async () => {
        await pollDMMessages(currentDMId);
      }, 3000); // Poll every 3 seconds
    }
  }, [currentDMId, pollDMMessages]);

  // Stop polling
  const stopDMPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Find DM by name and load messages when DM changes
  useEffect(() => {
    if (selectedDM && dms.length > 0) {
      // Find the DM by matching the display name
      const dm = dms.find(d => {
        const otherUsernames = d.usernames?.filter(username => username !== user?.username) || [];
        const displayName = otherUsernames.length > 0 ? otherUsernames.join(', ') : 'Unknown User';
        return displayName === selectedDM;
      });
      
      if (dm) {
        setCurrentDMId(dm._id);
        loadDMMessages(dm._id);
        loadPinnedMessages();
        startDMPolling();
      }
    } else {
      setCurrentDMId(null);
      stopDMPolling();
    }

    return () => {
      stopDMPolling();
    };
  }, [selectedDM, dms, user?.username, loadDMMessages, loadPinnedMessages, startDMPolling, stopDMPolling]);

  console.log('dmMessages', dmMessages);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dmMessages]);

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
    if (!selectedFile || !currentDMId || isUploading) return;

    try {
      setIsUploading(true);
      const result = await uploadDMFile(currentDMId, selectedFile, newMessage.trim());
      
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

    // Find the DM ID
    const dm = dms.find(d => {
      const otherUsernames = d.usernames?.filter(username => username !== user?.username) || [];
      const displayName = otherUsernames.length > 0 ? otherUsernames.join(', ') : 'Unknown User';
      return displayName === selectedDM;
    });

    if (!dm) return;

    try {
      setIsSending(true);
      await sendDMMessage(dm._id, newMessage.trim());
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

    // Find the DM ID
    const dm = dms.find(d => {
      const otherUsernames = d.usernames?.filter(username => username !== user?.username) || [];
      const displayName = otherUsernames.length > 0 ? otherUsernames.join(', ') : 'Unknown User';
      return displayName === selectedDM;
    });

    if (!dm) return;

    try {
      const result = await sendDMMessage(dm._id, messageText.trim(), selectedThreadMessage._id);
      if (result.success) {
        // Add the message to thread messages optimistically
        setThreadMessages(prev => [...prev, {
          _id: `temp-${Date.now()}`,
          rid: dm._id,
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

    if (!selectedDM) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No DM Selected</h3>
          <p className="text-gray-500">Select a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(dmMessages);

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* DM Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 rounded-lg btn-glass mb-0.5">
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/40 rounded-lg p-2 -m-2 transition-colors min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-gray-800 truncate">{selectedDM}</h2>
              <p className="text-sm text-gray-600 truncate">Direct Message</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">2 members</span>
              {isPolling && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
            <IconButton
              icon={Pin}
              onClick={togglePinnedDrawer}
              variant={isPinnedDrawerExpanded ? 'primary' : 'default'}
              size="sm"
            />
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
          {dmMessages.length > 0 && (
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
                const isOwnMessage = message.u?._id === user?._id || 
                                  message.u?.username === user?.username;
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
          {isLoading && dmMessages.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading messages...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && dmMessages.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Start the conversation!</p>
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
              placeholder={selectedFile ? `Add a description for ${selectedFile.name}...` : `Message ${selectedDM}`}
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

export default DMView;