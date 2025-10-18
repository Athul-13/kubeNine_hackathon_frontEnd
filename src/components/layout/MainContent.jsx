import { HomeContent, DMsContent, SearchContent } from '../../pages';

const MainContent = ({ activeNav, selectedItem }) => {
  const getContentComponent = () => {
    switch (activeNav) {
      case 'home':
        return <HomeContent selectedItem={selectedItem} />;
      case 'dms':
        return <DMsContent selectedItem={selectedItem} />;
      case 'search':
        return <SearchContent selectedItem={selectedItem} />;
      default:
        return <HomeContent selectedItem={selectedItem} />;
    }
  };

  return (
    <main className="flex-1 overflow-y-auto bg-white md:ml-0 pb-16 md:pb-0">
      {getContentComponent()}
    </main>
  );
};

export default MainContent;
