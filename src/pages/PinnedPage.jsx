import { Card } from '../components/ui';

const PinnedPage = () => {
  return (
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
  );
};

export default PinnedPage;
