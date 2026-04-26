import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PoemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPoem = async () => {
    try {
      const res = await axios.get(`http://localhost:5010/poem/${id}`);
      setPoem(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5010/delete-poem/${id}`);
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPoem();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-purple-700 text-2xl font-semibold">Loading poem...</p>
      </div>
    );
  }

  if (!poem) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-red-500 text-2xl font-semibold">Poem not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center">
          {poem.title}
        </h1>

        {/* Author & Dedicate */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">
            ✍️ <span className="font-medium">{poem.author}</span>
          </p>
          {poem.dedicate && (
            <p className="text-pink-500 text-sm mt-1">
              💝 Dedicated to {poem.dedicate}
            </p>
          )}
        </div>

        {/* Divider */}
        <hr className="border-purple-200 mb-6" />

        {/* Poem Content */}
        <p className="text-gray-700 text-lg whitespace-pre-line leading-relaxed text-center">
          {poem.content}
        </p>

        {/* Divider */}
        <hr className="border-purple-200 mt-6 mb-4" />

        {/* Date */}
        <p className="text-gray-400 text-xs text-center mb-6">
          Published on {new Date(poem.createdAt).toDateString()}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
            ← Back
          </button>
          <button
            onClick={() => navigate(`/edit-poem/${poem._id}`)}
            className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-lg font-medium hover:bg-yellow-200 transition">
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition">
            Delete
          </button>
        </div>

      </div>
    </div>
  );
};

export default PoemDetail;