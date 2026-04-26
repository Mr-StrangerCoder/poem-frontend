import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePoem from './pages/CreatePoem';
import EditPoem from './pages/EditPoem';
import PoemDetail from './pages/PoemDetails';
import Navbar  from './components/Navbar';


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-poem" element={<CreatePoem />} />
        <Route path="/edit-poem/:id" element={<EditPoem />} />
        <Route path="/poem/:id" element={<PoemDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;