// src/pages/Home.jsx

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* HERO */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold md:text-5xl">
          Welcome to PythonLearn
        </h1>

        <p className="mt-4 text-gray-300 max-w-xl">
          Learn Python from scratch, practice coding, solve challenges,
          track your progress & become a master.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/learn"
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Learning
          </Link>

          <Link
            to="/problems"
            className="border border-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Solve Problems
          </Link>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="py-4 text-center text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} PythonLearn
      </footer>

    </div>
  );
};

export default Home;
