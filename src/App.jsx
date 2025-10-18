import { NavigationProvider } from './context/NavigationContext';
import Outlet from './components/Outlet';

function App() {
  return (
    <NavigationProvider>
      <Outlet />
    </NavigationProvider>
  )
}

export default App
