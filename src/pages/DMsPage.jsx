import { useOutletContext } from 'react-router-dom';
import { PageContainer } from '../components/ui';

const DMsPage = () => {
  const { selectedItem } = useOutletContext();

  return (
    <PageContainer title="Direct Messages">
      {selectedItem && <p className="text-gray-700 drop-shadow-sm">Viewing conversation: {selectedItem}</p>}
    </PageContainer>
  );
};

export default DMsPage;
