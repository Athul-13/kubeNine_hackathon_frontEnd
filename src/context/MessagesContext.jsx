import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { messagesService } from '../api/messages/messagesService';
import { dmsService } from '../api/dms/dmsService';
import { fileService } from '../api/files/fileService';
import { useAuth } from './AuthContext';
import { useRooms } from './RoomsContext';

const MessagesContext = createContext(null);

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [dmMessages, setDmMessages] = useState([]);
  const [pinnedMessages, setPinnedMessages] = useState([]);
  const [dms, setDms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDMs, setIsLoadingDMs] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isRoomExplicitlySelected, setIsRoomExplicitlySelected] = useState(false);
  const pollingIntervalRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const { currentRoom } = useRooms();

  // Load messages for current room
  const loadMessages = useCallback(async (offset = 0) => {
    if (!currentRoom) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await messagesService.getMessages(currentRoom.name, 50, offset, true);
      
      if (result.success) {
        if (offset === 0) {
          // First load - replace all messages
          setMessages(result.messages.reverse());
        } else {
          // Load more - prepend older messages
          setMessages(prev => [...result.messages.reverse(), ...prev]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error loading messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentRoom]);

  // Load DM messages
  const loadDMMessages = useCallback(async (dmId, offset = 0) => {
    if (!dmId) return;

    try {
      setIsLoading(true);
      setError(null);
      const result = await messagesService.getDirectMessages(dmId, 50, offset);
      
      if (result.success) {
        if (offset === 0) {
          // First load - replace all messages
          setDmMessages(result.messages.reverse());
        } else {
          // Load more - prepend older messages
          setDmMessages(prev => [...result.messages.reverse(), ...prev]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load DM messages');
      console.error('Error loading DM messages:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start polling for new messages
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    if (currentRoom && isAuthenticated) {
      setIsPolling(true);
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const result = await messagesService.getMessages(currentRoom.name, 50, 0, true);
          if (result.success) {
            const newMessages = result.messages.reverse();
            setMessages(prevMessages => {
              // Only update if we have new messages
              if (newMessages.length !== prevMessages.length) {
                return newMessages;
              }
              return prevMessages;
            });
          }
        } catch (err) {
          console.error('Error polling messages:', err);
        }
      }, 3000); // Poll every 3 seconds
    }
  }, [currentRoom, isAuthenticated]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  // Load pinned messages for current room
  const loadPinnedMessages = useCallback(async () => {
    if (!currentRoom) return;

    try {
      const result = await messagesService.getPinnedMessages(currentRoom._id);
      if (result.success) {
        setPinnedMessages(result.messages);
      } else {
        console.error('Failed to load pinned messages:', result.error);
      }
    } catch {
      console.error('Error loading pinned messages');
    }
  }, [currentRoom]);

  // Load messages when room changes (only if explicitly selected)
  useEffect(() => {
    if (isAuthenticated && currentRoom && isRoomExplicitlySelected) {
      loadMessages();
      loadPinnedMessages();
      startPolling();
    } else {
      setMessages([]);
      setPinnedMessages([]);
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [currentRoom, isAuthenticated, isRoomExplicitlySelected, loadMessages, loadPinnedMessages, startPolling, stopPolling]);

  // Send a message
  const sendMessage = async (message, tmid = null) => {
    if (!currentRoom) {
      setError('No room selected');
      return { success: false, error: 'No room selected' };
    }

    try {
      setIsLoading(true);
      const result = await messagesService.sendMessage(currentRoom._id, message, tmid);
      
      if (result.success) {
        // Add the new message to the list immediately for better UX
        const newMessage = {
          _id: Date.now().toString(), // Temporary ID
          msg: message,
          ts: new Date().toISOString(),
          u: {
            _id: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
            name: JSON.parse(localStorage.getItem('user') || '{}').name,
          },
        };
        
        // Add tmid if it's a thread message
        if (tmid) {
          newMessage.tmid = tmid;
        }
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMsg = 'Failed to send message';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Send a DM message
  const sendDMMessage = async (dmId, message, tmid = null) => {
    if (!dmId) {
      setError('No DM selected');
      return { success: false, error: 'No DM selected' };
    }

    try {
      setIsLoading(true);
      const result = await messagesService.sendMessage(dmId, message, tmid);
      
      if (result.success) {
        // Add the new message to the DM messages list immediately for better UX
        const newMessage = {
          _id: Date.now().toString(), // Temporary ID
          msg: message,
          ts: new Date().toISOString(),
          u: {
            _id: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
            name: JSON.parse(localStorage.getItem('user') || '{}').name,
          },
        };
        
        // Add tmid if it's a thread message
        if (tmid) {
          newMessage.tmid = tmid;
        }
        
        setDmMessages(prevMessages => [...prevMessages, newMessage]);
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError('Failed to send DM message');
      console.error('Error sending DM message:', err);
      return { success: false, error: 'Failed to send DM message' };
    } finally {
      setIsLoading(false);
    }
  };

  // Poll DM messages for real-time updates
  const pollDMMessages = useCallback(async (dmId) => {
    if (!dmId) return;

    try {
      const result = await messagesService.getDirectMessages(dmId, 50, 0);
      if (result.success) {
        const newMessages = result.messages.reverse();
        setDmMessages(prevMessages => {
          // Only update if we have new messages
          if (newMessages.length !== prevMessages.length) {
            return newMessages;
          }
          return prevMessages;
        });
      }
    } catch (err) {
      console.error('Error polling DM messages:', err);
    }
  }, []);

  // Upload file to channel
  const uploadChannelFile = useCallback(async (file, description = '') => {
    if (!currentRoom) {
      setError('No room selected');
      return { success: false, error: 'No room selected' };
    }

    try {
      setIsLoading(true);
      const result = await fileService.uploadFile(currentRoom._id, file, description);
      
      if (result.success) {
        // Refresh messages to show the uploaded file
        await loadMessages();
        return { success: true, file: result.file };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error('Error uploading file:', err);
      return { success: false, error: 'Failed to upload file' };
    } finally {
      setIsLoading(false);
    }
  }, [currentRoom, loadMessages]);

  // Upload file to DM
  const uploadDMFile = useCallback(async (dmId, file, description = '') => {
    if (!dmId) {
      setError('No DM selected');
      return { success: false, error: 'No DM selected' };
    }

    try {
      setIsLoading(true);
      const result = await fileService.uploadFile(dmId, file, description);
      
      if (result.success) {
        // Refresh DM messages to show the uploaded file
        await loadDMMessages(dmId);
        return { success: true, file: result.file };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError('Failed to upload file');
      console.error('Error uploading file:', err);
      return { success: false, error: 'Failed to upload file' };
    } finally {
      setIsLoading(false);
    }
  }, [loadDMMessages]);

  // Get direct messages
  const getDirectMessages = async (userId) => {
    try {
      setIsLoading(true);
      const result = await messagesService.getDirectMessages(userId);
      
      if (result.success) {
        setMessages(result.messages.reverse());
        return { success: true, messages: result.messages };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMsg = 'Failed to get direct messages';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Load more messages (pagination)
  const loadMoreMessages = async () => {
    if (!currentRoom || isLoading) return;
    
    const offset = messages.length;
    await loadMessages(offset);
  };

  // Get thread messages for a specific message
  const getThreadMessages = async (tmid) => {
    try {
      const result = await messagesService.getThreadMessages(tmid);
      return result;
    } catch {
      return { success: false, error: 'Failed to get thread messages' };
    }
  };

  // Get pinned messages from all channels
  const getAllPinnedMessages = async (channels) => {
    try {
      const result = await messagesService.getAllPinnedMessages(channels);
      return result;
    } catch {
      return { success: false, error: 'Failed to get all pinned messages', pinnedByChannel: [] };
    }
  };

  // Load direct messages
  const loadDMs = useCallback(async () => {
    try {
      setIsLoadingDMs(true);
      const result = await dmsService.getDMs();
      if (result.success) {
        setDms(result.dms);
      } else {
        setError(result.error);
        setDms([]);
      }
    } catch {
      setError('Failed to load direct messages');
      setDms([]);
    } finally {
      setIsLoadingDMs(false);
    }
  }, []);

  // Create a new direct message
  const createDM = useCallback(async (username) => {
    try {
      const result = await dmsService.createDM(username);
      if (result.success) {
        // Refresh DM list
        await loadDMs();
        return result;
      } else {
        return result;
      }
    } catch {
      return { success: false, error: 'Failed to create direct message' };
    }
  }, [loadDMs]);

  // Auto-select a DM by ID
  const autoSelectDM = (dmId) => {
    const dm = dms.find(d => d._id === dmId);
    if (dm) {
      // This will be handled by the parent component
      return dm;
    }
    return null;
  };

  // Pin a message
  const pinMessage = async (messageId) => {
    try {
      const result = await messagesService.pinMessage(messageId);
      if (result.success) {
        // Reload pinned messages to get updated list
        await loadPinnedMessages();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMsg = 'Failed to pin message';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Unpin a message
  const unpinMessage = async (messageId) => {
    try {
      const result = await messagesService.unpinMessage(messageId);
      if (result.success) {
        // Reload pinned messages to get updated list
        await loadPinnedMessages();
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch {
      const errorMsg = 'Failed to unpin message';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Explicitly select a room (called when user clicks a room)
  const selectRoomForMessages = () => {
    setIsRoomExplicitlySelected(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const value = {
    messages,
    dmMessages,
    pinnedMessages,
    dms,
    isLoading,
    isLoadingDMs,
    error,
    isPolling,
    loadMessages,
    loadDMMessages,
    loadMoreMessages,
    loadPinnedMessages,
    loadDMs,
    createDM,
    autoSelectDM,
    sendMessage,
    sendDMMessage,
    pollDMMessages,
    uploadChannelFile,
    uploadDMFile,
    getDirectMessages,
    getThreadMessages,
    getAllPinnedMessages,
    pinMessage,
    unpinMessage,
    clearMessages,
    clearError,
    selectRoomForMessages,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const  useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};
