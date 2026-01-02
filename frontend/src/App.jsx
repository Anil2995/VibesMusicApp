import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { Menu } from 'lucide-react';

// Lazy load pages for better performance (Day 12)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Podcasts = lazy(() => import('./pages/Podcasts'));
const PodcastDetail = lazy(() => import('./pages/PodcastDetail'));
const Library = lazy(() => import('./pages/Library'));
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail'));
const Search = lazy(() => import('./pages/Search'));
const Radio = lazy(() => import('./pages/Radio'));

// Regular imports for always-visible components
import MusicPlayer from './components/MusicPlayer';
import Sidebar from './components/Sidebar';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-950">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg animate-pulse" />
      </div>
    </div>
  </div>
);

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pages that should show sidebar
  const showSidebar = !['/login', '/signup'].includes(location.pathname);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar - only show on main pages */}
      {showSidebar && (
        <>
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/80 backdrop-blur-xl rounded-xl border border-white/10 text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${showSidebar ? 'lg:ml-0' : ''} overflow-auto`}>
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Main Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />

              {/* Podcast Routes */}
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/podcasts/:id" element={<PodcastDetail />} />

              {/* Radio Route */}
              <Route path="/radio" element={<Radio />} />

              {/* Auth Routes */}
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Music Player - global component */}
      <MusicPlayer />
    </div>
  );
}

export default App;
