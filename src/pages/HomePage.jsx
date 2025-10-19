import { useOutletContext } from 'react-router-dom';
import { PageContainer } from '../components/ui';
import { useRooms } from '../context/RoomsContext';
import { useMessages } from '../context/MessagesContext';
import ChannelView from '../components/chat/ChannelView';

const HomePage = () => {
  const { selectedItem } = useOutletContext();
  const { rooms, isLoading: roomsLoading } = useRooms();
  const { messages, isLoading: messagesLoading } = useMessages();

  // If a room is selected, show the channel view
  if (selectedItem) {
    return <ChannelView />;
  }

  // Otherwise show the dashboard
  return (
    <PageContainer
      title="Home"
      subtitle="Welcome to your collaboration workspace"
    >
      <div className="space-y-6">
        {/* Rooms Overview */}
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <h3 className="font-semibold text-gray-800 mb-3">Rooms Overview</h3>
          {roomsLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-gray-600">Loading rooms...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Total Rooms: <span className="font-medium">{rooms.length}</span>
              </p>
              <p className="text-sm text-gray-500">
                Select a room from the sidebar to start chatting
              </p>
            </div>
          )}
        </div>

        {/* Selected Item Display */}
        {selectedItem && (
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h3 className="font-semibold text-gray-800 mb-2">Selected Item</h3>
            <p className="text-gray-600">{selectedItem}</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
            <div className="text-sm text-gray-600">Total Rooms</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-green-600">{messages.length}</div>
            <div className="text-sm text-gray-600">Messages</div>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {rooms.filter(room => room.unread > 0).length}
            </div>
            <div className="text-sm text-gray-600">Unread Rooms</div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
