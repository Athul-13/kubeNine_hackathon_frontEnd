import { Home, MessageCircle, Search, User, Plus } from 'lucide-react';

const PrimarySidebar = ({ activeNav, onNavChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dms', label: 'DMs', icon: MessageCircle },
    { id: 'search', label: 'Search', icon: Search },
  ];

  const bottomItems = [
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'user', label: 'User', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar - Left side */}
      <aside className="hidden md:flex w-20 bg-white border-r border-gray-200 flex-col items-center py-4 space-y-6">
        {/* Top Navigation Items */}
        <nav className="flex-1 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`p-3 rounded-lg transition-colors ${
                activeNav === item.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={item.label}
            >
              <item.icon size={24} />
            </button>
          ))}
        </nav>

        {/* Bottom Navigation Items */}
        <nav className="flex flex-col gap-4 border-t border-gray-200 pt-4">
          {bottomItems.reverse().map((item) => (
            <button
              key={item.id}
              className="p-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              title={item.label}
            >
              <item.icon size={24} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeNav === item.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={item.label}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title={item.label}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default PrimarySidebar;
