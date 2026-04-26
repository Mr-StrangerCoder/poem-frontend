import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-purple-700 to-pink-600 text-white px-6 py-4 flex items-center justify-between shadow-lg">

            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-wide">
                🎭 Poem Store
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        {/* Explore Reels - visible to all logged in users */}
                        <Link
                            to="/reels"
                            className={`font-medium transition px-3 py-1.5 rounded-full text-sm ${
                                location.pathname === '/reels'
                                    ? 'bg-white/20 text-white'
                                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                            }`}>
                            🌐 Explore Poems
                        </Link>

                        {/* My Dashboard */}
                        <Link
                            to="/"
                            className={`font-medium transition px-3 py-1.5 rounded-full text-sm ${
                                location.pathname === '/'
                                    ? 'bg-white/20 text-white'
                                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                            }`}>
                            📖 My Poems
                        </Link>

                        {/* User info */}
                        <span className="text-purple-200 text-sm hidden md:block">
                            Hi, {user.name} {user.role === 'admin' ? '👑' : '✍️'}
                        </span>

                        {/* Admin only */}
                        {user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className={`font-medium transition px-3 py-1.5 rounded-full text-sm ${
                                    location.pathname === '/admin'
                                        ? 'bg-white/20 text-white'
                                        : 'text-purple-100 hover:text-white hover:bg-white/10'
                                }`}>
                                👑 Admin
                            </Link>
                        )}

                        {/* Add Poem - only for non admin */}
                        {user.role !== 'admin' && (
                            <Link
                                to="/create-poem"
                                className="bg-white text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-purple-100 transition duration-200 text-sm">
                                + Add Poem
                            </Link>
                        )}

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="bg-white/20 text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition duration-200 text-sm">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="bg-white text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-purple-100 transition duration-200">
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;