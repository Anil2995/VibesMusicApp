import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Search,
    Library,
    Mic2,
    ListMusic,
    Heart,
    Clock,
    Plus,
    Settings,
    LogOut,
    ChevronLeft,
    Music2,
    User,
    TrendingUp,
    Radio
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Close mobile sidebar when route changes
    useEffect(() => {
        onClose?.();
    }, [location.pathname]);

    const mainNavItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/search', icon: Search, label: 'Search' },
        { path: '/library', icon: Library, label: 'Your Library' },
    ];

    const discoverItems = [
        { path: '/podcasts', icon: Mic2, label: 'Podcasts' },
        { path: '/radio', icon: Radio, label: 'Radio', color: 'text-purple-400' },
        { path: '/?genre=trending', icon: TrendingUp, label: 'Trending' },
    ];

    const libraryItems = [
        { path: '/library?tab=liked', icon: Heart, label: 'Liked Songs', color: 'text-pink-400' },
        { path: '/library?tab=recent', icon: Clock, label: 'Recently Played' },
    ];

    const NavItem = ({ item, compact = false }) => {
        const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path.split('?')[0]));

        return (
            <NavLink
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${item.color || ''} ${isActive ? 'text-purple-400' : ''}`} />
                {!compact && (
                    <span className={`font-medium ${isActive ? 'text-white' : ''}`}>
                        {item.label}
                    </span>
                )}
                {isActive && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full"
                    />
                )}
            </NavLink>
        );
    };

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <Music2 className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Vibes
                    </h1>
                    <p className="text-[10px] text-gray-500 -mt-0.5">Music Player</p>
                </div>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 space-y-1">
                {/* Main */}
                <div className="space-y-1 mb-6">
                    {mainNavItems.map(item => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </div>

                {/* Discover */}
                <div className="mb-6">
                    <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Discover
                    </p>
                    <div className="space-y-1">
                        {discoverItems.map(item => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </div>
                </div>

                {/* Library */}
                <div className="mb-6">
                    <div className="flex items-center justify-between px-4 py-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Your Library
                        </p>
                        {user && (
                            <button
                                onClick={() => navigate('/library')}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4 text-gray-400 hover:text-white" />
                            </button>
                        )}
                    </div>
                    <div className="space-y-1">
                        {libraryItems.map(item => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </div>
                </div>

                {/* Playlist Section (if user is logged in) */}
                {user && (
                    <div>
                        <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Playlists
                        </p>
                        <button
                            onClick={() => navigate('/library')}
                            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg flex items-center justify-center">
                                <Plus className="w-4 h-4" />
                            </div>
                            <span className="text-sm">Create Playlist</span>
                        </button>
                    </div>
                )}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-white/5">
                {user ? (
                    <div className="flex items-center gap-3">
                        <img
                            src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=8b5cf6&color=fff`}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-purple-500/50"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user.user_metadata?.username || user.email?.split('@')[0]}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <button
                            onClick={signOut}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-full py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                        >
                            Sign up
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                        >
                            Log in
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        />

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-gray-950/98 backdrop-blur-xl border-r border-white/10 z-50"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
