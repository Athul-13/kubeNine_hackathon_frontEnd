import { useOutletContext } from 'react-router-dom';
import { PageContainer } from '../components/ui';

const HomePage = () => {
  const { selectedItem } = useOutletContext();

  return (
    <PageContainer title="Home">
      {selectedItem && <p className="text-gray-700 drop-shadow-sm">Selected: {selectedItem}</p>}
    </PageContainer>
  );
};

export default HomePage;
