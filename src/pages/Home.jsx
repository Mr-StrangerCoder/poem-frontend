import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// require('dotenv').config();

const Home = () => {
    const navigate = useNavigate();
    const [poems, setPoems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPoems = async () => {
        try {
           const res = await axios.get(`${import.meta.env.VITE_API_URL}/poems`);
            setPoems(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
           await axios.delete(`${import.meta.env.VITE_API_URL}/delete-poem/${id}`);
            fetchPoems();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchPoems();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-purple-700 text-2xl font-semibold">Loading poems...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-6">

            {/* Heading */}
            <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
                🎭 All Poems
            </h1>

            {/* No Poems */}
            {poems.length === 0 ? (
                <div className="text-center text-gray-500 mt-20 text-xl">
                    No poems yet. <span className="text-purple-600 cursor-pointer" onClick={() => navigate('/create-poem')}>Write one!</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {poems.map((poem) => (
                        <div
                            key={poem._id}
                            className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition duration-200">

                            {/* Title */}
                            <div>
                                <h2 className="text-xl font-bold text-purple-700 mb-2">
                                    {poem.title}
                                </h2>

                                {/* Content Preview */}
                                <p className="text-gray-600 text-sm whitespace-pre-line line-clamp-3">
                                    {poem.content}
                                </p>
                            </div>

                            {/* Author & Dedicate */}
                            <div className="mt-4">
                                <p className="text-sm text-gray-500">
                                    ✍️ <span className="font-medium">{poem.author}</span>
                                </p>
                                {poem.dedicate && (
                                    <p className="text-sm text-pink-500">
                                        💝 Dedicated to {poem.dedicate}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => navigate(`/poem/${poem._id}`)}
                                    className="flex-1 bg-purple-100 text-purple-700 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-200 transition">
                                    View
                                </button>
                                <button
                                    onClick={() => navigate(`/edit-poem/${poem._id}`)}
                                    className="flex-1 bg-yellow-100 text-yellow-700 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-200 transition">
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(poem._id)}
                                    className="flex-1 bg-red-100 text-red-600 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 transition">
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;