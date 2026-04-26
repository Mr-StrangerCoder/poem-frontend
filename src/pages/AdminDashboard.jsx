import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [poems, setPoems] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [resetModal, setResetModal] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState('');
    const [resetError, setResetError] = useState('');

    const fetchData = async () => {
        try {
            const [usersRes, poemsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_URL}/admin/poems`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setUsers(usersRes.data.data);
            setPoems(poemsRes.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user and all their poems?')) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/admin/user/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeletePoem = async (id) => {
        if (!window.confirm('Delete this poem?')) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/delete-poem/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
        } catch (err) {
            console.log(err);
        }
    };

    const handleResetPassword = async () => {
        setResetLoading(true);
        setResetError('');
        setResetSuccess('');
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/admin/reset-password/${resetModal._id}`,
                { newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResetSuccess('Password reset successfully!');
            setNewPassword('');
            setTimeout(() => {
                setResetModal(null);
                setResetSuccess('');
            }, 2000);
        } catch (err) {
            setResetError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setResetLoading(false);
        }
    };

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-purple-700 text-2xl font-semibold animate-pulse">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <h1 className="text-3xl font-bold text-purple-700 mb-2">
                    👑 Admin Dashboard
                </h1>
                <p className="text-gray-500 mb-6">
                    Manage all users and poems
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <p className="text-4xl font-bold text-purple-700">
                            {users.length}
                        </p>
                        <p className="text-gray-500 mt-1 text-sm">Total Users</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <p className="text-4xl font-bold text-pink-500">
                            {poems.length}
                        </p>
                        <p className="text-gray-500 mt-1 text-sm">Total Poems</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <p className="text-4xl font-bold text-green-500">
                            {poems.reduce((acc, p) => acc + p.likes, 0)}
                        </p>
                        <p className="text-gray-500 mt-1 text-sm">Total Likes</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow p-6 text-center">
                        <p className="text-4xl font-bold text-blue-500">
                            {users.filter(u => u.role !== 'admin').length}
                        </p>
                        <p className="text-gray-500 mt-1 text-sm">Active Poets</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-full font-semibold transition ${
                            activeTab === 'users'
                                ? 'bg-purple-700 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}>
                        👥 Users ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('poems')}
                        className={`px-6 py-2 rounded-full font-semibold transition ${
                            activeTab === 'poems'
                                ? 'bg-pink-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}>
                        📖 Poems ({poems.length})
                    </button>
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-purple-50">
                                <tr>
                                    <th className="text-left px-6 py-4 text-purple-700 font-semibold text-sm">User</th>
                                    <th className="text-left px-6 py-4 text-purple-700 font-semibold text-sm">Email</th>
                                    <th className="text-left px-6 py-4 text-purple-700 font-semibold text-sm">Role</th>
                                    <th className="text-left px-6 py-4 text-purple-700 font-semibold text-sm">Poems</th>
                                    <th className="text-left px-6 py-4 text-purple-700 font-semibold text-sm">Joined</th>
                                    <th className="text-left px-6 py-4 text-purple-700 font-semibold text-sm">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-sm">
                                                    {u.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                u.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {u.role === 'admin' ? '👑 Admin' : '✍️ Poet'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                {u.poemCount} poems
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(u.createdAt).toDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role !== 'admin' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setResetModal(u);
                                                            setNewPassword('');
                                                            setResetError('');
                                                            setResetSuccess('');
                                                        }}
                                                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                                                        🔑 Reset Password
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(u._id)}
                                                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                                                        🗑️ Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Poems Table */}
                {activeTab === 'poems' && (
                    <div className="bg-white rounded-2xl shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-pink-50">
                                <tr>
                                    <th className="text-left px-6 py-4 text-pink-600 font-semibold text-sm">Title</th>
                                    <th className="text-left px-6 py-4 text-pink-600 font-semibold text-sm">Author</th>
                                    <th className="text-left px-6 py-4 text-pink-600 font-semibold text-sm">Likes</th>
                                    <th className="text-left px-6 py-4 text-pink-600 font-semibold text-sm">Date</th>
                                    <th className="text-left px-6 py-4 text-pink-600 font-semibold text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {poems.map((p) => (
                                    <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-sm">
                                            {p.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                                                    {p.user?.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-gray-500 text-sm">
                                                    {p.user?.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-pink-500 font-semibold text-sm">
                                                ❤️ {p.likes}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">
                                            {new Date(p.createdAt).toDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleDeletePoem(p._id)}
                                                className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reset Password Modal */}
            {resetModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

                        <h2 className="text-xl font-bold text-gray-800 mb-1">
                            🔑 Reset Password
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Reset password for <span className="text-purple-600 font-semibold">{resetModal.name}</span>
                        </p>

                        {/* Success */}
                        {resetSuccess && (
                            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                ✅ {resetSuccess}
                            </div>
                        )}

                        {/* Error */}
                        {resetError && (
                            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                                {resetError}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium mb-1 text-sm">
                                    New Password
                                </label>
                                <input
                                    type="text"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 chars)"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setResetModal(null);
                                        setNewPassword('');
                                        setResetError('');
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={resetLoading || !newPassword}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                                    {resetLoading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;