import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Hide navbar on login and register pages
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
                        <span className="text-purple-200 text-sm">
                            Hi, {user.name} {user.role === 'admin' ? '👑' : '✍️'}
                        </span>
                        {user.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="text-white hover:text-purple-200 font-medium transition">
                                Admin
                            </Link>
                        )}
                        <Link
                            to="/create-poem"
                            className="bg-white text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-purple-100 transition duration-200">
                            + Add Poem
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="bg-white/20 text-white px-4 py-2 rounded-full font-semibold hover:bg-white/30 transition duration-200">
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