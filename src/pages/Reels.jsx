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

    const handleShare = (type) => {
        const poemUrl = `https://poem-frontend-two.vercel.app/poem/${poem._id}`;
        const text = `🎭 *${poem.title}*\n\n${poem.content}\n\n✍️ By ${poem.user?.name}${poem.dedicate ? `\n💝 Dedicated to ${poem.dedicate}` : ''}\n\n📖 Read more poems on Poem Store:\n${poemUrl}`;
        const subject = `🎭 ${poem.title} - Poem Store`;
        const body = `Hi,\n\nI wanted to share this beautiful poem with you!\n\n📖 ${poem.title}\n\n${poem.content}\n\n✍️ By ${poem.user?.name}${poem.dedicate ? `\n💝 Dedicated to ${poem.dedicate}` : ''}\n\n🌐 Read more poems here:\n${poemUrl}\n\nJoin Poem Store and share your own poems!`;

        if (type === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        } else if (type === 'email') {
            window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
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

    useEffect(() => { fetchPoems(); }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
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
            <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
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
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">

    
            <div className="w-72 h-full flex flex-col overflow-hidden bg-gradient-to-b from-purple-700 via-purple-600 to-pink-500 shadow-2xl hidden md:flex">

    
                <div className="shrink-0 px-5 py-6">
                    <p className="text-white font-bold text-xl mb-1">
                        🌐 Explore Poems
                    </p>
                    <p className="text-purple-200 text-xs">
                        {allPoems.length} poems from all poets
                    </p>


                    <div className="flex gap-3 mt-4">
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

    
                <div className="shrink-0 px-4">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search poems or poets..."
                        className="w-full bg-white/15 text-white placeholder-purple-300 border border-white/20 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
                    />
                </div>

    
                {user && (
                    <div className="shrink-0 px-4 mt-3">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-white text-purple-700 py-2.5 rounded-2xl font-bold text-sm hover:bg-purple-50 transition shadow-lg">
                            ← My Dashboard
                        </button>
                    </div>
                )}

    
                <div className="shrink-0 mx-4 my-4 border-t border-white/20" />

    
                <p className="shrink-0 px-5 text-purple-200 text-xs font-semibold uppercase tracking-widest mb-2">
                    All Poems
                </p>

        
                <div className="flex-1 min-h-0 overflow-y-auto px-3 pb-4 space-y-1">
                    {poems.map((p, index) => (
                        <div
                            key={p._id}
                            onClick={() => setCurrentIndex(index)}
                            className={`px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                                index === currentIndex
                                    ? 'bg-white/25 shadow-inner'
                                    : 'hover:bg-white/10'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                                    index === currentIndex
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
                                        <span className="text-pink-200 text-xs">
                                            ❤️ {p.likes}
                                        </span>
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

            <div className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">

        
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full opacity-20 -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-200 rounded-full opacity-20 translate-y-24 -translate-x-24" />

    
                <div className="flex gap-1.5 mb-6 z-10 flex-wrap justify-center px-4">
                    {poems.slice(0, 20).map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                                i === currentIndex
                                    ? 'w-8 bg-purple-600'
                                    : 'w-2 bg-purple-200'
                            }`}
                        />
                    ))}
                </div>

    
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

                    <div className="p-8">

        
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                    {poem.user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm">
                                        {poem.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(poem.createdAt).toDateString()}
                                    </p>
                                </div>
                            </div>

        
                            <span className="text-xs bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full font-medium">
                                {currentIndex + 1} / {poems.length}
                            </span>
                        </div>

    
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">
                            {poem.title}
                        </h2>

    
                        <div className="w-10 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-5" />

            
                        <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm max-h-36 overflow-y-auto">
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

                            <button
                                onClick={() => handleLike(poem._id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                                    isLiked
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500'
                                }`}>
                                {isLiked ? '❤️' : '🤍'} {poem.likes}
                            </button>


                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-full text-xs font-semibold hover:bg-green-100 transition">
                                    📱 WhatsApp
                                </button>

                    
                                <button
                                    onClick={() => handleShare('email')}
                                    className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-full text-xs font-semibold hover:bg-blue-100 transition">
                                    📧 Email
                                </button>

        
                                <button
                                    onClick={goPrev}
                                    disabled={currentIndex === 0}
                                    className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition disabled:opacity-30 font-bold">
                                    ←
                                </button>

        
                                <button
                                    onClick={goNext}
                                    disabled={currentIndex === poems.length - 1}
                                    className="w-9 h-9 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition disabled:opacity-30 font-bold">
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <p className="text-purple-300 text-xs mt-5 z-10">
                    ← swipe left or right to navigate →
                </p>
            </div>
        </div>
    );
};

export default Reels;