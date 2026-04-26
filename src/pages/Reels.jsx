import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reels = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [poems, setPoems] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [likedPoems, setLikedPoems] = useState([]);
    const [dragStart, setDragStart] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [search, setSearch] = useState('');
    const [allPoems, setAllPoems] = useState([]);

    const fetchPoems = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/poems`
            );
            setPoems(res.data.data);
            setAllPoems(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (poemId) => {
        if (!user) { navigate('/login'); return; }
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/like-poem/${poemId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLikedPoems(prev =>
                prev.includes(poemId)
                    ? prev.filter(id => id !== poemId)
                    : [...prev, poemId]
            );
            setPoems(prev =>
                prev.map(p =>
                    p._id === poemId ? { ...p, likes: res.data.likes } : p
                )
            );
            setAllPoems(prev =>
                prev.map(p =>
                    p._id === poemId ? { ...p, likes: res.data.likes } : p
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleSearch = (val) => {
        setSearch(val);
        setCurrentIndex(0);
        if (val === '') {
            setPoems(allPoems);
        } else {
            setPoems(allPoems.filter(p =>
                p.title.toLowerCase().includes(val.toLowerCase()) ||
                p.user?.name.toLowerCase().includes(val.toLowerCase())
            ));
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

    const handleShare = (type) => {
        const text = `🎭 *${poem.title}*\n\n${poem.content}\n\n✍️ By ${poem.user?.name}${poem.dedicate ? `\n💝 Dedicated to ${poem.dedicate}` : ''}\n\n📖 Read more on Poem Store`;
        const subject = `🎭 ${poem.title} - Poem Store`;
        const body = `Hi,\n\nI wanted to share this beautiful poem with you!\n\n📖 ${poem.title}\n\n${poem.content}\n\n✍️ By ${poem.user?.name}${poem.dedicate ? `\n💝 Dedicated to ${poem.dedicate}` : ''}\n\nEnjoy reading!`;

        if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else if (type === 'email') {
            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
        }
    };

    useEffect(() => { fetchPoems(); }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-5xl mb-4">🎭</p>
                    <p className="text-purple-600 font-semibold animate-pulse">
                        Loading poems...
                    </p>
                </div>
            </div>
        );
    }

    if (poems.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <p className="text-6xl mb-4">🎭</p>
                <p className="text-xl font-semibold text-gray-700 mb-2">
                    No poems found
                </p>
                <p className="text-gray-400 text-sm">
                    Try a different search
                </p>
            </div>
        );
    }

    const poem = poems[currentIndex];
    const isLiked = likedPoems.includes(poem._id);

    return (
        <div className="h-screen flex overflow-hidden">


            {/* Left Sidebar */}
            <div className="w-72 h-full bg-gradient-to-b from-purple-700 via-purple-600 to-pink-500 flex-col hidden md:flex shadow-2xl">

                {/* Header */}
                <div className="px-5 py-6">
                    <p className="text-white font-bold text-xl mb-1">🌐 Explore Poems</p>
                    <p className="text-purple-200 text-xs">
                        {allPoems.length} poems from all poets
                    </p>

                    {/* Stats */}
                    <div className="flex gap-3 mt-5">
                        <div className="flex-1 bg-white/15 rounded-2xl px-3 py-3 text-center">
                            <p className="text-white font-bold text-2xl">
                                {allPoems.length}
                            </p>
                            <p className="text-purple-200 text-xs mt-0.5">Poems</p>
                        </div>
                        <div className="flex-1 bg-white/15 rounded-2xl px-3 py-3 text-center">
                            <p className="text-white font-bold text-2xl">
                                {allPoems.reduce((acc, p) => acc + p.likes, 0)}
                            </p>
                            <p className="text-purple-200 text-xs mt-0.5">Total Likes</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="px-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search poems or poets..."
                        className="w-full bg-white/15 text-white placeholder-purple-300 border border-white/20 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                    />
                </div>

                {/* My Dashboard Button */}
                {user && (
                    <div className="px-4 mt-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-white text-purple-700 py-2.5 rounded-2xl font-bold text-sm hover:bg-purple-50 transition shadow-lg">
                            ← My Dashboard
                        </button>
                    </div>
                )}

                {/* Divider */}
                <div className="mx-4 my-4 border-t border-white/20" />

                {/* Label */}
                <p className="px-5 text-purple-200 text-xs font-semibold uppercase tracking-widest mb-2">
                    All Poems
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
                                    {p.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">
                                        {p.title}
                                    </p>
                                    <p className="text-purple-300 text-xs truncate">
                                        {p.user?.name}
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
            <div className="flex-1 flex flex-col items-center justify-center px-4 relative">

                {/* Progress Dots */}
                <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <div className="flex gap-1.5 flex-wrap justify-center px-4">
                        {poems.slice(0, 20).map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-1 rounded-full cursor-pointer transition-all duration-300 ${i === currentIndex
                                        ? 'w-6 bg-purple-600'
                                        : 'w-1.5 bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
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
                    className="w-full max-w-md bg-white rounded-3xl shadow-lg overflow-hidden select-none">

                    {/* Color Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />

                    <div className="p-7">

                        {/* Author Row */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                                    {poem.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {poem.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(poem.createdAt).toDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Counter Badge */}
                            <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium">
                                {currentIndex + 1} / {poems.length}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {poem.title}
                        </h2>

                        {/* Divider */}
                        <div className="w-8 h-0.5 bg-purple-400 rounded mb-4" />

                        {/* Content */}
                        <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm min-h-24 max-h-48 overflow-y-auto">
                            {poem.content}
                        </p>

                        {/* Dedicate */}
                        {poem.dedicate && (
                            <div className="mt-4 bg-pink-50 rounded-xl px-4 py-2.5">
                                <p className="text-pink-500 text-xs font-medium">
                                    💝 Dedicated to {poem.dedicate}
                                </p>
                            </div>
                        )}

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">

                            {/* Like Button */}
                            <button
                                onClick={() => handleLike(poem._id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${isLiked
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                                    }`}>
                                {isLiked ? '❤️' : '🤍'} {poem.likes}
                            </button>

                            {/* Share + Navigation */}
                            <div className="flex items-center gap-2">

                                {/* WhatsApp */}
                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-2 rounded-full text-xs font-semibold hover:bg-green-100 transition">
                                    📱 WhatsApp
                                </button>

                                {/* Email */}
                                <button
                                    onClick={() => handleShare('email')}
                                    className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-2 rounded-full text-xs font-semibold hover:bg-blue-100 transition">
                                    📧 Email
                                </button>

                                {/* Prev */}
                                <button
                                    onClick={goPrev}
                                    disabled={currentIndex === 0}
                                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition disabled:opacity-30 text-sm font-bold">
                                    ←
                                </button>

                                {/* Next */}
                                <button
                                    onClick={goNext}
                                    disabled={currentIndex === poems.length - 1}
                                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition disabled:opacity-30 text-sm font-bold">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Swipe Hint */}
                <p className="text-gray-300 text-xs mt-4">
                    swipe left or right to navigate
                </p>
            </div>
        </div>
    );
};

export default Reels;