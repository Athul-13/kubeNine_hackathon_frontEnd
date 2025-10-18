import { Card, Button } from '../ui';

const SecondarySidebar = ({ activeNav, selectedItem, onSelect }) => {
  const getSecondaryContent = () => {
    switch (activeNav) {
      case 'home':
        return {
          title: 'Home',
          items: ['Trending', 'Following', 'For You']
        };
      case 'dms':
        return {
          title: 'Direct Messages',
          items: ['Alice', 'Bob', 'Charlie', 'Diana']
        };
      case 'search':
        return {
          title: 'Search',
          items: ['Recent', 'Users', 'Posts', 'Hashtags']
        };
      default:
        return { title: '', items: [] };
    }
  };

  const { title, items } = getSecondaryContent();

  return (
    <>
      {/* Desktop Secondary Sidebar - Floating */}
      <Card className="hidden md:flex w-64 overflow-y-auto flex-col" padding="none">
        <div className="border-b border-white/20 p-4">
          <h2 className="font-bold text-gray-800 drop-shadow-sm">{title}</h2>
        </div>
        <div className="p-4 space-y-2 flex-1">
          {items.map((item) => (
            <Button
              key={item}
              onClick={() => onSelect(item)}
              variant={selectedItem === item ? 'primary' : 'default'}
              className="w-full justify-start"
            >
              {item}
            </Button>
          ))}
        </div>
      </Card>

      {/* Mobile Secondary Sidebar - Floating Horizontal scroll */}
      <Card className="md:hidden overflow-x-auto" padding="none">
        <div className="flex items-center space-x-2 p-4 min-w-max">
          <h2 className="font-bold text-gray-800 text-sm whitespace-nowrap mr-4 drop-shadow-sm">{title}</h2>
          {items.map((item) => (
            <Button
              key={item}
              onClick={() => onSelect(item)}
              variant={selectedItem === item ? 'primary' : 'secondary'}
              size="sm"
              className="whitespace-nowrap rounded-full"
            >
              {item}
            </Button>
          ))}
        </div>
      </Card>
    </>
  );
};

export default SecondarySidebar;
