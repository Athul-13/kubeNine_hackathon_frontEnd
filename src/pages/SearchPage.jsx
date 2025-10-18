import { useOutletContext } from 'react-router-dom';
import { PageContainer } from '../components/ui';

const SearchPage = () => {
  const { selectedItem } = useOutletContext();

  return (
    <PageContainer title="Search">
      {selectedItem && <p className="text-gray-700 drop-shadow-sm">Showing results for: {selectedItem}</p>}
    </PageContainer>
  );
};

export default SearchPage;
