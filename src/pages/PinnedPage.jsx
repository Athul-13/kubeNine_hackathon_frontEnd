import { useOutletContext } from 'react-router-dom';
import { Card } from '../components/ui';

const PinnedPage = () => {
  const { selectedItem } = useOutletContext();

  return (
    <div className="flex-1 flex flex-col">
      {selectedItem ? (
        <Card className="flex-1 overflow-y-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm mb-4">
              Pinned Message: {selectedItem}
            </h2>
            <p className="text-gray-600">
              This is where the pinned message content would be displayed.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 overflow-y-auto p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 drop-shadow-sm mb-4">
              Pinned Messages
            </h2>
            <p className="text-gray-600">
              Select a pinned message from the sidebar to view it in context.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PinnedPage;
