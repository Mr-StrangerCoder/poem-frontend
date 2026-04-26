import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [poems, setPoems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dragStart, setDragStart] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [animating, setAnimating] = useState(false);

    const fetchMyPoems = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/my-poems`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPoems(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (poemId) => {
        if (!window.confirm('Delete this poem?')) return;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/delete-poem/${poemId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updated = poems.filter(p => p._id !== poemId);
            setPoems(updated);
            if (currentIndex >= updated.length) {
                setCurrentIndex(Math.max(0, updated.length - 1));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const goNext = () => {
        if (currentIndex < poems.length - 1 && !animating) {
            setAnimating(true);
            setTimeout(() => {
                setCurrentIndex(i => i + 1);
                setAnimating(false);
            }, 200);
        }
    };

    const goPrev = () => {
        if (currentIndex > 0 && !animating) {
            setAnimating(true);
            setTimeout(() => {
                setCurrentIndex(i => i - 1);
                setAnimating(false);
            }, 200);
        }
    };

    const handleDragStart = (e) => {
        setDragStart(e.clientX || e.touches?.[0]?.clientX);
        setIsSwiping(true);
    };

    const handleDragMove = (e) => {
        if (!dragStart) return;
        const currentX = e.clientX || e.touches?.[0]?.clientX;
        setDragOffset(currentX - dragStart);
    };

    const handleDragEnd = () => {
        if (dragOffset < -80) goNext();
        if (dragOffset > 80) goPrev();
        setDragStart(null);
        setDragOffset(0);
        setIsSwiping(false);
    };

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        fetchMyPoems();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                    <p className="text-5xl mb-4">🎭</p>
                    <p className="text-purple-600 font-semibold animate-pulse">
                        Loading your poems...
                    </p>
                </div>
            </div>
        );
    }

    if (poems.length === 0) {
        return (
            <div className="h-screen flex bg-gradient-to-br from-purple-50 to-pink-50">
                {/* Sidebar */}
                <div className="w-72 h-full bg-gradient-to-b from-purple-700 via-purple-600 to-pink-500 flex flex-col hidden md:flex">
                    <div className="px-5 py-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">{user?.name}</p>
                                <p className="text-purple-200 text-xs">✍️ Poet</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1 bg-white/15 rounded-2xl px-3 py-3 text-center">
                                <p className="text-white font-bold text-2xl">0</p>
                                <p className="text-purple-200 text-xs mt-0.5">My Poems</p>
                            </div>
                            <div className="flex-1 bg-white/15 rounded-2xl px-3 py-3 text-center">
                                <p className="text-white font-bold text-2xl">0</p>
                                <p className="text-purple-200 text-xs mt-0.5">Total Likes</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 mt-2">
                        <button
                            onClick={() => navigate('/create-poem')}
                            className="w-full bg-white text-purple-700 py-3 rounded-2xl font-bold text-sm hover:bg-purple-50 transition shadow-lg">
                            + Write New Poem
                        </button>
                        <button
                            onClick={() => navigate('/reels')}
                            className="w-full mt-3 bg-white/15 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-white/25 transition">
                            🌐 Explore All Poems
                        </button>
                    </div>
                </div>
                {/* Empty State */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <p className="text-7xl mb-4">✍️</p>
                    <p className="text-2xl font-bold text-gray-700 mb-2">No poems yet</p>
                    <p className="text-gray-400 mb-8 text-sm">Start writing your first poem!</p>
                    <button
                        onClick={() => navigate('/create-poem')}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition shadow-lg">
                        Write First Poem
                    </button>
                </div>
            </div>
        );
    }

    const poem = poems[currentIndex];

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">

            {/* Left Sidebar - Full gradient */}
            <div className="w-72 h-full bg-gradient-to-b from-purple-500 via-purple-600 to-pink-500 flex-col hidden md:flex shadow-2xl">

                {/* User Profile */}
                <div className="px-5 py-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-bold text-lg leading-tight">
                                {user?.name}
                            </p>
                            <p className="text-purple-200 text-xs">✍️ Poet</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3">
                        <div className="flex-1 bg-white/15 rounded-2xl px-3 py-3 text-center backdrop-blur-sm">
                            <p className="text-white font-bold text-2xl">{poems.length}</p>
                            <p className="text-purple-200 text-xs mt-0.5">My Poems</p>
                        </div>
                        <div className="flex-1 bg-white/15 rounded-2xl px-3 py-3 text-center backdrop-blur-sm">
                            <p className="text-white font-bold text-2xl">
                                {poems.reduce((acc, p) => acc + p.likes, 0)}
                            </p>
                            <p className="text-purple-200 text-xs mt-0.5">Total Likes</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="px-4">
                    <button
                        onClick={() => navigate('/create-poem')}
                        className="w-full bg-white text-purple-700 py-3 rounded-2xl font-bold text-sm hover:bg-purple-50 transition shadow-lg">
                        + Write New Poem
                    </button>
                    <button
                        onClick={() => navigate('/reels')}
                        className="w-full mt-3 bg-white/15 text-white py-3 rounded-2xl font-semibold text-sm hover:bg-white/25 transition">
                        🌐 Explore All Poems
                    </button>
                </div>

                {/* Divider */}
                <div className="mx-4 my-4 border-t border-white/20" />

                {/* Poem List Label */}
                <p className="px-5 text-purple-200 text-xs font-semibold uppercase tracking-widest mb-2">
                    My Poems
                </p>

                {/* Poem List */}
                <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
                    {poems.map((p, index) => (
                        <div
                            key={p._id}
                            onClick={() => setCurrentIndex(index)}
                            className={`px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${index === currentIndex
                                    ? 'bg-white/25 shadow-inner'
                                    : 'hover:bg-white/10'
                                }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${index === currentIndex
                                        ? 'bg-white text-purple-700'
                                        : 'bg-white/20 text-white'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">
                                        {p.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-pink-200 text-xs">❤️ {p.likes}</span>
                                        <span className="text-purple-300 text-xs">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {index === currentIndex && (
                                    <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">

                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full opacity-20 -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 translate-y-24 -translate-x-24" />

                {/* Progress Dots */}
                <div className="flex gap-1.5 mb-6 z-10">
                    {poems.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${i === currentIndex
                                    ? 'w-8 bg-purple-600'
                                    : 'w-2 bg-purple-200'
                                }`}
                        />
                    ))}
                </div>

                {/* Poem Card */}
                <div
                    onMouseDown={handleDragStart}
                    onMouseMove={handleDragMove}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={handleDragStart}
                    onTouchMove={handleDragMove}
                    onTouchEnd={handleDragEnd}
                    style={{
                        transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.02}deg)`,
                        transition: isSwiping ? 'none' : 'all 0.3s ease',
                        opacity: animating ? 0 : 1,
                        cursor: 'grab',
                    }}
                    className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden select-none z-10">


                    <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

                    <div className="p-2 bg-pink">

                        {/* Author Row */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(poem.createdAt).toDateString()}
                                    </p>
                                </div>
                            </div>


                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/edit-poem/${poem._id}`)}
                                    className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-amber-100 transition">
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(poem._id)}
                                    className="bg-red-50 text-red-500 border border-red-200 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-red-100 transition">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>


                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {poem.title}
                        </h2>

                        <div className="w-10 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-5" />


                        <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm max-h-44 overflow-y-auto">
                                {poem.content}
                            </p>
                        </div>


                        {poem.dedicate && (
                            <div className="bg-pink-50 border border-pink-100 rounded-2xl px-4 py-3 mb-4">
                                <p className="text-pink-500 text-xs font-semibold">
                                    💝 Dedicated to {poem.dedicate}
                                </p>
                            </div>
                        )}


                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-xl">
                                <span className="text-pink-500 text-sm font-bold">
                                    ❤️ {poem.likes}
                                </span>
                                <span className="text-pink-300 text-xs">likes</span>
                            </div>


                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goPrev}
                                    disabled={currentIndex === 0}
                                    className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition disabled:opacity-30 font-bold">
                                    ←
                                </button>
                                <span className="text-xs text-gray-400 font-semibold px-2">
                                    {currentIndex + 1} / {poems.length}
                                </span>
                                <button
                                    onClick={goNext}
                                    disabled={currentIndex === poems.length - 1}
                                    className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition disabled:opacity-30 font-bold">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Swipe hint */}
                <p className="text-purple-300 text-xs mt-5 z-10">
                    ← swipe left or right to navigate →
                </p>
            </div>
        </div>
    );
};

export default Home;