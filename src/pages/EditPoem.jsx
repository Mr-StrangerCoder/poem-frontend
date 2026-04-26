import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPoem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    dedicate: ''
  });

  const fetchPoem = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/poem/${id}`);
      setFormData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
    await axios.put(`${import.meta.env.VITE_API_URL}/update-poem/${id}`, formData);
      navigate(`/poem/${id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoem();
  }, [id]);

  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-purple-700 text-2xl font-semibold">Loading poem...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          ✏️ Edit Poem
        </h1>

        {/* Form */}
        <div className="flex flex-col gap-3">

          {/* Title & Author in one row */}
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Poem Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          {/* Dedicate */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Dedicate To <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              type="text"
              name="dedicate"
              value={formData.dedicate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/poem/${id}`)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
              ← Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition duration-200 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Changes ✅'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditPoem;