import { useState, useEffect } from 'react';
import { X, Keyboard, Command, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, Button } from './index';

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Ctrl', '1'], description: 'Go to Home' },
        { keys: ['Ctrl', '2'], description: 'Go to Direct Messages' },
        { keys: ['Ctrl', '3'], description: 'Go to Pinned Messages' },
        { keys: ['Ctrl', '4'], description: 'Go to Search' },
        { keys: ['Ctrl', 'K'], description: 'Quick Search' },
        { keys: ['Space'], description: 'Toggle current view' },
      ]
    },
    {
      category: 'Room Navigation',
      items: [
        { keys: ['Ctrl', '↑'], description: 'Previous room/DM' },
        { keys: ['Ctrl', '↓'], description: 'Next room/DM' },
        { keys: ['Alt', '←'], description: 'Go back in history' },
        { keys: ['Alt', '→'], description: 'Go forward in history' },
      ]
    },
    {
      category: 'Actions',
      items: [
        { keys: ['Ctrl', 'N'], description: 'New channel/DM' },
        { keys: ['Ctrl', 'L'], description: 'Logout' },
        { keys: ['Esc'], description: 'Close modals/menus' },
      ]
    }
  ];

  const Key = ({ children, isModifier = false }) => (
    <kbd className={`inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border border-gray-300 dark:border-gray-600 ${
      isModifier ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' : ''
    }`}>
      {children}
    </kbd>
  );

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto transform transition-transform duration-200 ${
        isOpen ? 'scale-100' : 'scale-95'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Keyboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Keyboard Shortcuts</h2>
              <p className="text-sm text-gray-600">Navigate faster with these shortcuts</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {shortcuts.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <div key={keyIndex} className="flex items-center space-x-1">
                          <Key isModifier={key === 'Ctrl' || key === 'Alt'}>
                            {key === 'Ctrl' ? (
                              <div className="flex items-center space-x-1">
                                <Command className="w-3 h-3" />
                                <span>Ctrl</span>
                              </div>
                            ) : key === '↑' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : key === '↓' ? (
                              <ArrowDown className="w-3 h-3" />
                            ) : key === '←' ? (
                              <ArrowLeft className="w-3 h-3" />
                            ) : key === '→' ? (
                              <ArrowRight className="w-3 h-3" />
                            ) : (
                              key
                            )}
                          </Key>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className="text-gray-400 text-xs">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Press <Key>Esc</Key> to close this help
            </p>
            <Button onClick={onClose} variant="primary" size="sm">
              Got it!
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KeyboardShortcutsHelp;
