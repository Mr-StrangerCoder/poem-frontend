import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PoemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [poem, setPoem] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPoem = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/poem/${id}`
            );
            setPoem(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPoem();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                    <p className="text-5xl mb-4">🎭</p>
                    <p className="text-purple-600 font-semibold animate-pulse">
                        Loading poem...
                    </p>
                </div>
            </div>
        );
    }

    if (!poem) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                <div className="text-center">
                    <p className="text-5xl mb-4">😕</p>
                    <p className="text-red-500 text-xl font-semibold">
                        Poem not found!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex flex-col items-center justify-center px-4 py-8">

        
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">

    
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />

                <div className="p-8">

            
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                            {poem.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-800">
                                {poem.user?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(poem.createdAt).toDateString()}
                            </p>
                        </div>
                    </div>

    
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">
                        {poem.title}
                    </h1>

    
                    <div className="w-10 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-5" />

    
                    <div className="bg-purple-50 rounded-2xl p-5 mb-4">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {poem.content}
                        </p>
                    </div>

    
                    {poem.dedicate && (
                        <div className="bg-pink-50 border border-pink-100 rounded-2xl px-4 py-3 mb-6">
                            <p className="text-pink-500 text-sm font-semibold">
                                💝 Dedicated to {poem.dedicate}
                            </p>
                        </div>
                    )}

    
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-pink-500 font-bold">❤️ {poem.likes}</span>
                        <span className="text-gray-400 text-sm">people liked this poem</span>
                    </div>

                  
                    {!user ? (
                        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 text-center">
                            <p className="text-white font-bold text-lg mb-1">
                                🎭 Love this poem?
                            </p>
                            <p className="text-purple-100 text-sm mb-4">
                                Join Poem Store to read more poems, like and share your favorites!
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/register')}
                                    className="flex-1 bg-white text-purple-700 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition">
                                    Join Free 🚀
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="flex-1 bg-white/20 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-white/30 transition">
                                    Login
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/reels')}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
                            🎭 Read More Poems
                        </button>
                    )}
                </div>
            </div>

    
            <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                    🎭 <span className="font-semibold text-purple-600">Poem Store</span> — Share your poetry with the world
                </p>
                <p className="text-gray-300 text-xs mt-1">
                    poem-frontend-two.vercel.app
                </p>
            </div>

        </div>
    );
};

export default PoemDetail;