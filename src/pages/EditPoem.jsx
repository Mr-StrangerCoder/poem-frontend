import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const EditPoem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: '',
        dedicate: ''
    });

    const fetchPoem = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/poem/${id}`
            );
            const poem = res.data.data;
            setFormData({
                title: poem.title,
                content: poem.content,
                author: poem.author,
                dedicate: poem.dedicate || ''
            });
        } catch (err) {
            console.log(err);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/update-poem/${id}`,
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

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchPoem();
    }, [id]);

    if (fetching) {
        return (
            <div className="h-screen flex items-center justify-center">
                <p className="text-purple-700 text-2xl font-semibold animate-pulse">
                    Loading poem...
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-2xl font-bold text-purple-700 mb-1 text-center">
                    ✏️ Edit Poem
                </h1>
                <p className="text-center text-gray-400 text-sm mb-6">
                    Update your poem
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
                                Poem Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-1 text-sm">
                                Author
                            </label>
                            <input
                                type="text"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                            />
                        </div>
                    </div>

        
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">
                            Poem Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
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
                            {loading ? 'Saving...' : 'Save Changes ✅'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EditPoem;