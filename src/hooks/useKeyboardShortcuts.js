import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRooms } from '../context/RoomsContext';
import { useMessages } from '../context/MessagesContext';
import { useAdd } from '../context/AddContext';
import { useKeyboardShortcutsContext } from '../context/KeyboardShortcutsContext';

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { rooms, currentRoom, setCurrentRoom } = useRooms();
  const { dms, currentDM, setCurrentDM } = useMessages();
  const { showAddMenu, hideAddMenu } = useAdd();
  const { toggleHelp } = useKeyboardShortcutsContext();

  const navigateToPreviousRoom = useCallback(() => {
    if (location.pathname === '/home' && rooms.length > 0) {
      const currentIndex = currentRoom ? rooms.findIndex(room => room._id === currentRoom._id) : -1;
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : rooms.length - 1;
      setCurrentRoom(rooms[prevIndex]);
    } else if (location.pathname === '/dms' && dms.length > 0) {
      const currentIndex = currentDM ? dms.findIndex(dm => dm._id === currentDM._id) : -1;
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : dms.length - 1;
      setCurrentDM(dms[prevIndex]);
    }
  }, [location.pathname, rooms, dms, currentRoom, currentDM, setCurrentRoom, setCurrentDM]);

  const navigateToNextRoom = useCallback(() => {
    if (location.pathname === '/home' && rooms.length > 0) {
      const currentIndex = currentRoom ? rooms.findIndex(room => room._id === currentRoom._id) : -1;
      const nextIndex = currentIndex < rooms.length - 1 ? currentIndex + 1 : 0;
      setCurrentRoom(rooms[nextIndex]);
    } else if (location.pathname === '/dms' && dms.length > 0) {
      const currentIndex = currentDM ? dms.findIndex(dm => dm._id === currentDM._id) : -1;
      const nextIndex = currentIndex < dms.length - 1 ? currentIndex + 1 : 0;
      setCurrentDM(dms[nextIndex]);
    }
  }, [location.pathname, rooms, dms, currentRoom, currentDM, setCurrentRoom, setCurrentDM]);

  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      event.target.tagName === 'INPUT' ||
      event.target.tagName === 'TEXTAREA' ||
      event.target.contentEditable === 'true'
    ) {
      return;
    }

    // Check for modifier keys
    const isCtrl = event.ctrlKey || event.metaKey; // Support both Ctrl and Cmd
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    // Navigation shortcuts
    if (isCtrl) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          navigate('/home');
          break;
        case '2':
          event.preventDefault();
          navigate('/dms');
          break;
        case '3':
          event.preventDefault();
          navigate('/pinned');
          break;
        case '4':
          event.preventDefault();
          navigate('/search');
          break;
        case 'k':
          event.preventDefault();
          navigate('/search');
          break;
        case 'n':
          event.preventDefault();
          showAddMenu();
          break;
        case 'l':
          event.preventDefault();
          logout();
          break;
        case '?':
          event.preventDefault();
          toggleHelp();
          break;
        case 'ArrowUp':
          event.preventDefault();
          navigateToPreviousRoom();
          break;
        case 'ArrowDown':
          event.preventDefault();
          navigateToNextRoom();
          break;
        default:
          break;
      }
    }

    // Quick actions
    if (isAlt) {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          navigate(-1); // Go back in history
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigate(1); // Go forward in history
          break;
        default:
          break;
      }
    }

    // Escape key actions
    if (event.key === 'Escape') {
      event.preventDefault();
      hideAddMenu();
    }

    // Space bar for quick actions
    if (event.key === ' ' && !isCtrl && !isShift && !isAlt) {
      event.preventDefault();
      // Toggle between current room/DM and home
      if (location.pathname === '/home' && currentRoom) {
        navigate('/home');
      } else if (location.pathname === '/dms' && currentDM) {
        navigate('/dms');
      }
    }
  }, [navigate, location, logout, showAddMenu, hideAddMenu, currentRoom, currentDM, navigateToPreviousRoom, navigateToNextRoom, toggleHelp]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, navigateToNextRoom, navigateToPreviousRoom, toggleHelp]);

  return {
    // Expose some functions for manual triggering if needed
    navigateToPreviousRoom,
    navigateToNextRoom,
  };
};

export default useKeyboardShortcuts;
