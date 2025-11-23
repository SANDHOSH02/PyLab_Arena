import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Learn from "./pages/Learn.jsx";
import SolveProblem from "./pages/SolveProblem.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Lesson from "./pages/Lesson.jsx";
import Certificate from "./pages/Certificate.jsx";

function App() {
  return (
    <BrowserRouter>
     <nav className="fixed w-full top-0 left-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/50 text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo & Links */}
      <div className="flex items-center gap-8">
        <Link 
          to="/" 
          className="relative text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 
                     hover:from-blue-300 hover:via-purple-400 hover:to-pink-400 transition-all duration-300"
        >
          PyLearn
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 hover:w-full"></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/learn", label: "Learn" },
            { to: "/dashboard", label: "Dashboard" },
            { to: "/solve-problem", label: "Solve Problem" },
            { to: "/certificate", label: "Certificate" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="relative px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200 
                         before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-0.5 
                         before:bg-gradient-to-r before:from-purple-400 before:to-pink-400 before:transition-all before:duration-300
                         hover:before:w-3/4"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-5 py-2.5 text-sm font-medium text-gray-200 bg-white/5 border border-gray-700/50 rounded-xl 
                     hover:bg-white/10 hover:border-purple-500/50 hover:text-white transition-all duration-300 backdrop-blur-sm"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="relative px-6 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden
                     bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500
                     shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30
                     transition-all duration-300 transform hover:scale-105"
        >
          <span className="relative z-10">Get Started</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
        </Link>
      </div>
    </div>
  </div>

  {/* Optional: Subtle glow line at bottom */}
  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
</nav>
      <div className="pt-16">
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/certificate" element={<Certificate />} />
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
