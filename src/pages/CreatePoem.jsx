import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreatePoem = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: user?.name || '',
        dedicate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.author) {
            setError('Please fill all required fields');
            return;
        }
        setLoading(true);
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/create-poem`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    
    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

        
                <h1 className="text-2xl font-bold text-purple-700 mb-1 text-center">
                    ✍️ Write a New Poem
                </h1>
                <p className="text-center text-gray-400 text-sm mb-6">
                    Share your thoughts with the world
                </p>
                {error && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">

    
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Poem Title <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter poem title"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Author <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                            />
                        </div>
                    </div>

        
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">
                            Poem Content <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your poem here..."
                            rows={5}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 resize-none"
                        />
                    </div>

    
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">
                            Dedicate To{' '}
                            <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="text"
                            name="dedicate"
                            value={formData.dedicate}
                            onChange={handleChange}
                            placeholder="Dedicate this poem to someone..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                        />
                    </div>

            
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition">
                            ← Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                            {loading ? 'Publishing...' : 'Publish Poem 🎭'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreatePoem;