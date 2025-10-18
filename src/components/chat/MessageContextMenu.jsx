import { useState, useEffect, useRef } from 'react';
import { Reply, Pin, PinOff } from 'lucide-react';

const MessageContextMenu = ({ 
  message, 
  x, 
  y, 
  onClose, 
  onReply, 
  onPin, 
  onUnpin, 
  isPinned = false 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleReply = () => {
    onReply(message);
    onClose();
  };

  const handlePin = () => {
    if (isPinned) {
      onUnpin(message);
    } else {
      onPin(message);
    }
    onClose();
  };

  // Use provided coordinates
  const position = { top: y, left: x };

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white/90 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg py-2 min-w-[160px]"
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      <button
        onClick={handleReply}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
      >
        <Reply className="w-4 h-4" />
        <span>Reply</span>
      </button>
      
      <button
        onClick={handlePin}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors"
      >
        {isPinned ? (
          <>
            <PinOff className="w-4 h-4" />
            <span>Unpin</span>
          </>
        ) : (
          <>
            <Pin className="w-4 h-4" />
            <span>Pin</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MessageContextMenu;
