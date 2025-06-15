import {  BrowserRouter as Router,  Routes,  Route,  Navigate,  useLocation,} from 'react-router-dom';
import {  Home,  Chats,  Geolocation,  Menu,  Profile,  Auth,  CreateProfile,} from './Pages';
import { Navbar } from './Components';
import Header from './Components/Header/Header';
import './App.css';

// Auth utility
const isAuthenticated = () => {
  return !!localStorage.getItem('token')&& localStorage.getItem('userid');
};

// Private route component
function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/auth" replace />;
}

// Public route component that redirects if already authenticated
function PublicRoute({ children }) {
  return isAuthenticated() ? <Navigate to="/home" replace /> : children;
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();

  const hideLayoutPaths = ['/auth', '/create-profile'];
  const isLayoutHidden = hideLayoutPaths.includes(location.pathname);

  return (
    <>
      {!isLayoutHidden && <Header />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Public routes */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />
        <Route
          path="/create-profile"
          element={
            <PublicRoute>
              <CreateProfile />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <Chats />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/geolocation"
          element={
            <PrivateRoute>
              <Geolocation />
            </PrivateRoute>
          }
        />
      </Routes>

      {!isLayoutHidden && <Navbar />}
    </>
  );
}

export default App;
