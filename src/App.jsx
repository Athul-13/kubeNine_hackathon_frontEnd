import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StatusProvider } from './context/StatusContext';
import { RoomsProvider } from './context/RoomsContext';
import { MessagesProvider } from './context/MessagesContext';
import { AddProvider } from './context/AddContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import DMsPage from './pages/DMsPage';
import SearchPage from './pages/SearchPage';
import PinnedPage from './pages/PinnedPage';
import AddPage from './pages/AddPage';

// Main app content with routing
const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" replace />}
      />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/home" replace />} />
               <Route path="home" element={<HomePage />} />
               <Route path="dms" element={<DMsPage />} />
               <Route path="search" element={<SearchPage />} />
               <Route path="pinned" element={<PinnedPage />} />
               <Route path="add" element={<AddPage />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <StatusProvider>
      <AuthProvider>
        <RoomsProvider>
          <MessagesProvider>
            <AddProvider>
              <Router>
                <AppContent />
              </Router>
            </AddProvider>
          </MessagesProvider>
        </RoomsProvider>
      </AuthProvider>
    </StatusProvider>
  )
}

export default App
