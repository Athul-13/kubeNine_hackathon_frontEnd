import { useState } from 'react';
import { File, Image, Video, Music, FileText, Download, ExternalLink, MessageSquare } from 'lucide-react';

const MessageItem = ({ message, isOwnMessage, isPinned, isHighlighted, onRightClick, onReply, onPin, onUnpin, onStartThread, hasThreadReplies, formatTime }) => {
  const [imageError, setImageError] = useState(false);

  const getFileIcon = (attachment) => {
    if (!attachment) return <File className="w-4 h-4" />;
    
    const type = attachment.type || attachment.image_type;
    if (type?.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (type?.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (type?.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (type?.includes('pdf') || type?.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileSize = (attachment) => {
    return attachment.image_size || attachment.file?.size || attachment.size || 0;
  };

  const getFileName = (attachment) => {
    return attachment.title || attachment.file?.name || attachment.name || 'Unknown file';
  };

  const getFileUrl = (attachment) => {
    const baseUrl = import.meta.env.VITE_ROCKETCHAT_URL || 'http://localhost:3000';
    const url = attachment.image_url || attachment.title_link || attachment.url;
    
    if (!url) return '#';
    
    // If URL is already absolute, return as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // If URL starts with /, prepend base URL
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }
    
    // Otherwise, prepend base URL with /
    return `${baseUrl}/${url}`;
  };

  const handleFileDownload = (attachment) => {
    const url = getFileUrl(attachment);
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  const renderAttachment = (attachment, index) => {
    const fileType = attachment.type || attachment.image_type;
    const isImage = fileType?.startsWith('image/');
    const fileName = getFileName(attachment);
    const fileSize = getFileSize(attachment);
    const fileUrl = getFileUrl(attachment);

    return (
      <div key={index} className="mt-2 p-3 bg-white/20 rounded-lg border border-white/30">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getFileIcon(attachment)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {fileName}
              </p>
              <button
                onClick={() => handleFileDownload(attachment)}
                className="ml-2 p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Download file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
            
            {fileSize > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(fileSize)}
              </p>
            )}
            
            {attachment.description && (
              <p className="text-sm text-gray-700 mt-1">
                {attachment.description}
              </p>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {isImage && attachment.image_preview && !imageError && (
          <div className="mt-3">
            <img
              src={`data:image/png;base64,${attachment.image_preview}`}
              alt={fileName}
              className="max-w-full h-auto rounded-lg shadow-sm"
              onError={() => setImageError(true)}
            />
          </div>
        )}

        {/* File Link */}
        {fileUrl && fileUrl !== '#' && (
          <div className="mt-2">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Open file
            </a>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
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
          onContextMenu={(e) => onRightClick(e, message)}
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
              {message.attachments.map((attachment, index) => 
                renderAttachment(attachment, index)
              )}
            </div>
          ) : message.file ? (
            <div className="mt-2">
              {renderAttachment(message.file, 0)}
            </div>
          ) : null}
        </div>
        
        {/* Thread Button - Always aligned to the left */}
        {hasThreadReplies && (
          <div className={`mt-1 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <button
              onClick={() => onStartThread(message)}
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
};

export default MessageItem;
