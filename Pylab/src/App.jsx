import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Learn from "./pages/Learn.jsx";
import SolveProblem from "./pages/SolveProblem.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Lesson from "./pages/Lesson.jsx";

function App() {
  return (
    <BrowserRouter>
      <nav className="fixed w-full top-0 left-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">PythonLearn</Link>
              <Link to="/" className="text-sm text-gray-300 hover:text-white transition">Home</Link>
              <Link to="/learn" className="text-sm text-gray-300 hover:text-white transition">Learn</Link>
              <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition">Dashboard</Link>
              <Link to="/solve-problem" className="text-sm text-gray-300 hover:text-white transition">Solve Problem</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-3 py-2 rounded-md text-sm bg-gray-800/50 hover:bg-gray-700 transition">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded-md text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-95 text-white transition">Register</Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="pt-16">
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learn/:id" element={<Lesson />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/solve-problem" element={<SolveProblem />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
