import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                formData
            );
            login(res.data.user, res.data.token);
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-purple-700">
                        🎭 Poem Store
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Welcome back, poet!
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Login
                    </h2>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col gap-4">

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50 mt-2">
                            {loading ? 'Logging in...' : 'Login →'}
                        </button>

                    </div>

                    {/* Register Link */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-purple-600 font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>

                </div>

                {/* Support Section */}
                <div className="mt-6 bg-white rounded-2xl shadow-sm p-5 text-center border border-gray-100">
                    <p className="text-gray-500 text-sm font-medium mb-1">
                        🛟 Need Help?
                    </p>
                    <p className="text-gray-400 text-xs mb-3">
                        Having trouble logging in or any issue?
                        Feel free to reach out to our support team.
                    </p>
                    <a 
                        href="mailto:aadeshsonawane307@gmail.com"
                        className="inline-flex items-center gap-2 bg-purple-50 text-purple-600 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-purple-100 transition">
                        📧 Contact Support
                    </a>
                    <p className="text-gray-300 text-xs mt-3">
                        aadeshsonawane307@gmail.com
                    </p>
                    
                </div>

                {/* Footer */}
                <p className="text-center text-gray-300 text-xs mt-6">
                    © 2025 Poem Store · Made with ❤️ by Aadesh
                </p>

            </div>
        </div>
    );
};

export default Login;