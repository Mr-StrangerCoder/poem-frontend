import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePoem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    dedicate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5010/create-poem', formData);
      navigate('/');
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">

    
        <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          ✍️ Write a New Poem
        </h1>

    
        <div className="flex flex-col gap-3">

        
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
                placeholder="Enter poem title"
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
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              placeholder="Write your poem here..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

        
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Dedicate To <span className="text-gray-400 text-sm">(optional)</span>
            </label>
            <input
              type="text"
              name="dedicate"
              value={formData.dedicate}
              onChange={handleChange}
              placeholder="Dedicate this poem to someone..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

        
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-700 text-white py-2 rounded-lg font-semibold hover:bg-purple-800 transition duration-200 disabled:opacity-50">
            {loading ? 'Publishing...' : 'Publish Poem 🎭'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default CreatePoem;