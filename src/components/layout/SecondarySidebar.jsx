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
      {/* Desktop Secondary Sidebar */}
      <aside className="hidden md:flex w-56 bg-white border-r border-gray-200 overflow-y-auto flex-col">
        <div className="border-b border-gray-200 p-4">
          <h2 className="font-bold text-gray-900">{title}</h2>
        </div>
        <div className="p-4 space-y-2 flex-1">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                selectedItem === item
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      {/* Mobile Secondary Sidebar - Horizontal scroll */}
      <aside className="md:hidden bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex items-center space-x-2 p-4 min-w-max">
          <h2 className="font-bold text-gray-900 text-sm whitespace-nowrap mr-4">{title}</h2>
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onSelect(item)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedItem === item
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default SecondarySidebar;
