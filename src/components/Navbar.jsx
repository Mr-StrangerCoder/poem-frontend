import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-purple-700 text-white px-6 py-4 flex items-center justify-between shadow-lg">
      
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold tracking-wide">
        🎭 Poem Store
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-6">
        <Link 
          to="/" 
          className="hover:text-purple-200 transition duration-200 font-medium">
          Home
        </Link>
        <Link 
          to="/create-poem" 
          className="bg-white text-purple-700 px-4 py-2 rounded-full font-semibold hover:bg-purple-100 transition duration-200">
          + Add Poem
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;