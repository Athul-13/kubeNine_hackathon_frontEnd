import { useState } from 'react';
import { Pin, ChevronDown, ChevronUp, Clock, User } from 'lucide-react';

const PinnedMessagesDrawer = ({ 
  pinnedMessages, 
  onMessageClick, 
  isExpanded, 
  onToggle 
}) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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

  const truncateMessage = (message, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (pinnedMessages.length === 0) return null;

  return (
    <div className="rounded-lg btn-glass">
      {/* Header - Always visible */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/20 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-2">
          <Pin className="w-4 h-4 text-yellow-600" />
          <span className="font-medium text-gray-800">
            Pinned Messages ({pinnedMessages.length})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </div>

      {/* Drawer Content - Expandable */}
      {isExpanded && (
        <div className="max-h-64 overflow-y-auto border-t border-white/20">
          {pinnedMessages.map((message, index) => (
            <div
              key={message._id || index}
              className="p-3 hover:bg-white/30 transition-colors cursor-pointer border-b border-white/10 last:border-b-0"
              onClick={() => onMessageClick(message)}
            >
              <div className="flex items-start space-x-3">
                {/* Message content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <User className="w-3 h-3 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {message.u?.name || message.u?.username || 'Unknown'}
                    </span>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(message.ts)}</span>
                      <span>•</span>
                      <span>{formatDate(message.ts)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 break-words">
                    {truncateMessage(message.msg)}
                  </p>
                </div>
                
                {/* Pin indicator */}
                <div className="flex-shrink-0">
                  <Pin className="w-3 h-3 text-yellow-600" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PinnedMessagesDrawer;
