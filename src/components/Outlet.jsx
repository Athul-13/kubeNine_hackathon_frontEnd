import PrimarySidebar from './layout/PrimarySidebar';
import SecondarySidebar from './layout/SecondarySidebar';
import MainContent from './layout/MainContent';
import { useNavigation } from '../context/NavigationContext';

const Outlet = () => {
  const { activeNav, selectedItem, setActiveNav, setSelectedItem } = useNavigation();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1">
        <PrimarySidebar activeNav={activeNav} onNavChange={setActiveNav} />
        <SecondarySidebar 
          activeNav={activeNav} 
          selectedItem={selectedItem} 
          onSelect={setSelectedItem} 
        />
        <MainContent activeNav={activeNav} selectedItem={selectedItem} />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col flex-1">
        <SecondarySidebar 
          activeNav={activeNav} 
          selectedItem={selectedItem} 
          onSelect={setSelectedItem} 
        />
        <MainContent activeNav={activeNav} selectedItem={selectedItem} />
        <PrimarySidebar activeNav={activeNav} onNavChange={setActiveNav} />
      </div>
    </div>
  );
};

export default Outlet;
