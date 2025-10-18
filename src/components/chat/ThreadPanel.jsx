import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { Button } from '../ui';

const ThreadPanel = ({ 
  originalMessage, 
  threadMessages, 
  onSendThreadMessage, 
  onClose,
  isLoading = false 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  // Handle sending a thread message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSendThreadMessage(newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send thread message:', error);
    } finally {
      setIsSending(false);
    }
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
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-l border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Thread</h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Original Message */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {(originalMessage.u?.name || originalMessage.u?.username || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {originalMessage.u?.name || originalMessage.u?.username || 'Unknown'}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(originalMessage.ts)}
            </span>
          </div>
          <p className="text-sm text-gray-600 break-words">{originalMessage.msg}</p>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={messagesContainerRef}>
        {threadMessages.length > 0 ? (
          threadMessages.map((message, index) => (
            <div key={message._id || index} className="flex space-x-3">
              {/* Avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {(message.u?.name || message.u?.username || 'U').charAt(0).toUpperCase()}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {message.u?.name || message.u?.username || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.ts)}
                  </span>
                </div>
                <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200">
                  <p className="text-sm text-gray-700 break-words">{message.msg}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No replies yet</p>
              <p className="text-xs text-gray-400">Be the first to reply!</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Reply in thread..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-500 outline-none transition-all text-sm"
            disabled={isSending}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            variant="primary"
            size="sm"
            className="flex items-center space-x-1 px-3"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{isSending ? 'Sending...' : 'Send'}</span>
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ThreadPanel;
