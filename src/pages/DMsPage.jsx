import { useOutletContext } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { MessageCircle, Plus } from 'lucide-react';
import { useAdd } from '../context/AddContext';
import DMView from '../components/chat/DMView';

const DMsPage = () => {
  const { selectedItem } = useOutletContext();
  const { showAddMenu } = useAdd();

  const handleStartDM = () => {
    showAddMenu();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {selectedItem ? (
        <div className="flex-1 h-full">
          <DMView selectedDM={selectedItem} />
        </div>
      ) : (
        <Card className="flex-1 overflow-y-auto p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm mb-4">
              Direct Messages
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Select a conversation from the sidebar to start chatting, or start a new conversation with someone.
            </p>

            <div className="space-y-4">
              <Button
                onClick={handleStartDM}
                variant="primary"
                size="lg"
                className="flex items-center space-x-2 mx-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Start New Conversation</span>
              </Button>
              
              <p className="text-sm text-gray-500">
                Click the Add button in the sidebar to find and message someone
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DMsPage;
