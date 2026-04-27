import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [allPoems, setAllPoems] = useState([]);
    const [users, setUsers] = useState([]);
    const [poems, setPoems] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [resetModal, setResetModal] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState('');
    const [resetError, setResetError] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [poemSearch, setPoemSearch] = useState('');

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
            setAllUsers(usersRes.data.data);
            setUsers(usersRes.data.data);
            setAllPoems(poemsRes.data.data);
            setPoems(poemsRes.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUserSearch = (val) => {
        setUserSearch(val);
        if (val === '') {
            setUsers(allUsers);
        } else {
            setUsers(allUsers.filter(u =>
                u.name.toLowerCase().includes(val.toLowerCase()) ||
                u.email.toLowerCase().includes(val.toLowerCase())
            ));
        }
    };

    const handlePoemSearch = (val) => {
        setPoemSearch(val);
        if (val === '') {
            setPoems(allPoems);
        } else {
            setPoems(allPoems.filter(p =>
                p.title.toLowerCase().includes(val.toLowerCase()) ||
                p.user?.name.toLowerCase().includes(val.toLowerCase())
            ));
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
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-5xl mb-4">👑</p>
                    <p className="text-purple-700 text-xl font-semibold animate-pulse">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden bg-gray-50">
            <div className="max-w-6xl mx-auto h-full flex flex-col px-6 py-6">

                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-purple-700">
                        👨🏻‍💻 Admin Dashboard
                    </h1>
                    <p className="text-gray-400 text-sm">
                        Manage all users and poems
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-purple-700">
                            {allUsers.length}
                        </p>
                        <p className="text-gray-400 mt-1 text-xs">Total Users</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-pink-500">
                            {allPoems.length}
                        </p>
                        <p className="text-gray-400 mt-1 text-xs">Total Poems</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-green-500">
                            {allPoems.reduce((acc, p) => acc + p.likes, 0)}
                        </p>
                        <p className="text-gray-400 mt-1 text-xs">Total Likes</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
                        <p className="text-3xl font-bold text-blue-500">
                            {allUsers.filter(u => u.role !== 'admin').length}
                        </p>
                        <p className="text-gray-400 mt-1 text-xs">Active Poets</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                            activeTab === 'users'
                                ? 'bg-purple-700 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}>
                        👥 Users ({allUsers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('poems')}
                        className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
                            activeTab === 'poems'
                                ? 'bg-pink-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}>
                        📖 Poems ({allPoems.length})
                    </button>
                </div>

                {/* Users Table */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">

                        {/* Search */}
                        <div className="px-6 py-3 border-b border-gray-100">
                            <input
                                type="text"
                                value={userSearch}
                                onChange={(e) => handleUserSearch(e.target.value)}
                                placeholder="🔍 Search users by name or email..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400"
                            />
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-purple-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-purple-700 font-semibold text-sm">User</th>
                                        <th className="text-left px-6 py-3 text-purple-700 font-semibold text-sm">Email</th>
                                        <th className="text-left px-6 py-3 text-purple-700 font-semibold text-sm">Role</th>
                                        <th className="text-left px-6 py-3 text-purple-700 font-semibold text-sm">Poems</th>
                                        <th className="text-left px-6 py-3 text-purple-700 font-semibold text-sm">Joined</th>
                                        <th className="text-left px-6 py-3 text-purple-700 font-semibold text-sm">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {u.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-sm text-gray-800">
                                                        {u.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-gray-500 text-sm">
                                                {u.email}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {u.role === 'admin' ? '👑 Admin' : '✍️ Poet'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {u.poemCount} poems
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-400 text-xs">
                                                {new Date(u.createdAt).toDateString()}
                                            </td>
                                            <td className="px-6 py-3">
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
                                                            🔑 Reset
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

                            {/* Empty State */}
                            {users.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-4xl mb-3">👥</p>
                                    <p className="text-gray-400 text-sm">No users found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Poems Table */}
                {activeTab === 'poems' && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">

                        {/* Search */}
                        <div className="px-6 py-3 border-b border-gray-100">
                            <input
                                type="text"
                                value={poemSearch}
                                onChange={(e) => handlePoemSearch(e.target.value)}
                                placeholder="🔍 Search poems by title or author..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-400"
                            />
                        </div>

                        {/* Scrollable List */}
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full">
                                <thead className="bg-pink-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-pink-600 font-semibold text-sm">Title</th>
                                        <th className="text-left px-6 py-3 text-pink-600 font-semibold text-sm">Author</th>
                                        <th className="text-left px-6 py-3 text-pink-600 font-semibold text-sm">Likes</th>
                                        <th className="text-left px-6 py-3 text-pink-600 font-semibold text-sm">Date</th>
                                        <th className="text-left px-6 py-3 text-pink-600 font-semibold text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {poems.map((p) => (
                                        <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50 transition">
                                            <td className="px-6 py-3 font-medium text-sm text-gray-800">
                                                {p.title}
                                            </td>
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {p.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-gray-500 text-sm">
                                                        {p.user?.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className="bg-pink-50 text-pink-500 px-3 py-1 rounded-full text-xs font-semibold">
                                                    ❤️ {p.likes}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-gray-400 text-xs">
                                                {new Date(p.createdAt).toDateString()}
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => handleDeletePoem(p._id)}
                                                    className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-100 transition">
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Empty State */}
                            {poems.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-4xl mb-3">📖</p>
                                    <p className="text-gray-400 text-sm">No poems found</p>
                                </div>
                            )}
                        </div>
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
                            Reset password for{' '}
                            <span className="text-purple-600 font-semibold">
                                {resetModal.name}
                            </span>
                        </p>

                        {resetSuccess && (
                            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-4 text-sm">
                                ✅ {resetSuccess}
                            </div>
                        )}

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