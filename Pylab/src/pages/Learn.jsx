import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Learn = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedLesson, setExpandedLesson] = useState(null);

  useEffect(() => {
    const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:4000';
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [lvRes, lsRes] = await Promise.all([
          fetch(`${API_BASE}/api/levels`),
          fetch(`${API_BASE}/api/lessons`),
        ]);
        if (!lvRes.ok) throw new Error('Failed to load levels');
        if (!lsRes.ok) throw new Error('Failed to load lessons');
        const lvJson = await lvRes.json();
        const lsJson = await lsRes.json();
        setLevels(lvJson || []);
        const normalized = (lsJson || []).map((l) => ({ 
          id: l.id, 
          title: l.title, 
          level: l.level_id, 
          lesson_number: l.lesson_number, 
          content: l.content 
        }));
        setLessons(normalized);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading content');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredLessons = selectedLevel
    ? lessons.filter((l) => Number(l.level) === Number(selectedLevel))
    : lessons;

  const getLevelIcon = (levelNumber) => {
    const icons = ['🌱', '🌿', '🌳', '🚀', '⭐', '💎'];
    return icons[levelNumber - 1] || '📚';
  };

  const getLevelColor = (levelNumber) => {
    const colors = [
      'from-green-600 to-emerald-600',
      'from-blue-600 to-cyan-600',
      'from-purple-600 to-pink-600',
      'from-orange-600 to-red-600',
      'from-yellow-600 to-orange-600',
      'from-indigo-600 to-purple-600'
    ];
    return colors[levelNumber - 1] || 'from-gray-600 to-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px),
                           linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'gridMove 30s linear infinite'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        
        {/* Hero Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-mono animate-fade-in">
            {'>>> python_learning_path = True'}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
            <span className="text-gray-400 font-mono">&gt;&gt;&gt; </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Learn Python
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-up-delayed">
            Structured lessons and hands-on exercises to help you master Python programming
          </p>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-8 mt-8 animate-fade-in-delayed">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{levels.length}</div>
              <div className="text-sm text-gray-400 font-mono">Levels</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{lessons.length}</div>
              <div className="text-sm text-gray-400 font-mono">Lessons</div>
            </div>
            <div className="w-px h-8 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">100+</div>
              <div className="text-sm text-gray-400 font-mono">Exercises</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-center font-mono">
            ⚠️ {error}
          </div>
        )}

        {/* Level Selection */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold font-mono">
              <span className="text-green-400"># </span>
              Choose Your Level
            </h2>
            {selectedLevel && (
              <button
                onClick={() => setSelectedLevel(null)}
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg font-mono text-sm hover:bg-gray-700 transition-all duration-300"
              >
                Clear Filter ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {levels.map((lvl, index) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(selectedLevel === lvl.id ? null : lvl.id)}
                className={`group relative overflow-hidden text-left p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  selectedLevel === lvl.id 
                    ? `bg-gradient-to-br ${getLevelColor(lvl.level_number || index + 1)} border-transparent shadow-lg` 
                    : 'bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-gray-600'
                }`}
              >
                {/* Background Gradient Effect */}
                {selectedLevel !== lvl.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${getLevelColor(lvl.level_number || index + 1)} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`text-4xl ${selectedLevel === lvl.id ? '' : 'group-hover:scale-110 transition-transform'}`}>
                      {getLevelIcon(lvl.level_number || index + 1)}
                    </div>
                    {selectedLevel === lvl.id && (
                      <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-mono">
                        Selected ✓
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold font-mono mb-2">{lvl.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {lvl.description || `Level ${lvl.level_number || lvl.id}`}
                  </p>

                  {/* Lesson Count */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-xs font-mono text-gray-300">
                      {lessons.filter(l => Number(l.level) === Number(lvl.id)).length} lessons
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Lessons Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold font-mono">
              <span className="text-blue-400"># </span>
              {selectedLevel ? 'Filtered Lessons' : 'All Lessons'}
            </h2>
            <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 font-mono text-sm text-gray-400">
              Showing {filteredLessons.length} lesson{filteredLessons.length !== 1 ? 's' : ''}
            </div>
          </div>

          {filteredLessons.length === 0 ? (
            <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-400 font-mono">No lessons available yet</p>
              <p className="text-sm text-gray-500 font-mono mt-2">Check back soon for new content!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLessons.map((ls, index) => (
                <div 
                  key={ls.id} 
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all duration-300"
                >
                  {/* Lesson Header */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-mono font-bold text-lg">
                          {ls.lesson_number || index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold font-mono group-hover:text-blue-400 transition-colors">
                            {ls.title}
                          </h3>
                          <div className="text-xs text-gray-400 font-mono mt-1">
                            Level {ls.level} • Lesson {ls.lesson_number || index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setExpandedLesson(expandedLesson === ls.id ? null : ls.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <span className={`transform transition-transform ${expandedLesson === ls.id ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                    </div>

                    {/* Content Preview */}
                    {ls.content && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        {ls.content}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <Link
                          to={`/learn/${ls.id}`}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-mono text-sm font-semibold text-center hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                        >
                          Start Learning →
                        </Link>
                      <Link
                        to="/solve-problem"
                        className="px-4 py-2 bg-gray-700 rounded-lg font-mono text-sm font-semibold hover:bg-gray-600 transition-all duration-300"
                      >
                        Practice ⚡
                      </Link>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedLesson === ls.id && ls.content && (
                    <div className="px-5 pb-5 border-t border-gray-700 pt-4 animate-slideDown">
                      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-mono text-sm text-gray-400 mb-2">Lesson Overview:</h4>
                        <p className="text-sm text-gray-300 font-mono leading-relaxed">
                          {ls.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Feature Cards */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold font-mono mb-6">
            <span className="text-purple-400"># </span>
            Learning Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h4 className="text-xl font-bold font-mono mb-2">Interactive Exercises</h4>
              <p className="text-sm text-gray-300">
                Practice labs and quizzes to test your knowledge with instant feedback
              </p>
            </div>

            <div className="group p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📖</div>
              <h4 className="text-xl font-bold font-mono mb-2">Step-by-Step Guides</h4>
              <p className="text-sm text-gray-300">
                Comprehensive tutorials from beginner to advanced concepts
              </p>
            </div>

            <div className="group p-6 bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg backdrop-blur-sm hover:scale-105 transition-all duration-300">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">👥</div>
              <h4 className="text-xl font-bold font-mono mb-2">Community Support</h4>
              <p className="text-sm text-gray-300">
                Discuss problems, share solutions and get help from peers
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8 text-center backdrop-blur-sm">
          <h3 className="text-3xl font-bold mb-3">Ready to Start Coding?</h3>
          <p className="text-gray-300 mb-6 font-mono max-w-2xl mx-auto">
            Jump into our interactive coding environment and start building real projects
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="/solve-problem"
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-mono font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105"
            >
              Start Practicing ⚡
            </a>
            <a
              href="/dashboard"
              className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-lg font-mono font-semibold hover:bg-gray-700 transition-all duration-300"
            >
              View Dashboard
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-800">
          <p className="text-sm text-gray-500 font-mono">
            © {new Date().getFullYear()} PythonLearn — Happy coding! 🐍
          </p>
        </footer>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-slide-up-delayed {
          animation: slideUp 0.8s ease-out 0.2s backwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-fade-in-delayed {
          animation: fadeIn 1s ease-out 0.4s backwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Learn;