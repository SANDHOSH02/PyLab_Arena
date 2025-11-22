import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      {/* Main Card */}
      <div className="w-full max-w-2xl">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-12 text-center border border-white/20">
          {/* Logo / Title */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              PyLab Arena
            </h1>
            <p className="mt-4 text-xl text-gray-600 font-medium">
              Master Python. Compete. Dominate.
            </p>
          </div>

          {/* Tagline */}
          <p className="text-lg text-gray-700 mb-12 max-w-md mx-auto">
            Join the ultimate coding battlefield. Solve challenges, climb the leaderboard, and become a Python legend.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              to="/login"
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 bg-white text-indigo-700 font-bold text-lg rounded-xl shadow-lg border-2 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 transform hover:scale-105 transition-all duration-200"
            >
              Register Now
            </Link>
          </div>

          {/* Optional Footer */}
          <div className="mt-16 text-sm text-gray-500">
            <p>Ready to write some Python? 🐍</p>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
}