import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Learn from "./pages/Learn.jsx";
import SolveProblem from "./pages/SolveProblem.jsx";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f5f5f5" }}>
        <div>
          <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
          <Link to="/learn" style={{ marginRight: "1rem" }}>Learn</Link>
          <Link to="/solve-problem" style={{ marginRight: "1rem" }}>Solve Problem</Link>
        </div>
        <div>
          <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/solve-problem" element={<SolveProblem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
