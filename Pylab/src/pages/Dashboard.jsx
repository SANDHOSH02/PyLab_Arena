import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem('user'); } catch (e) {}
    window.location.href = '/login';
  };

  // progress and stats loaded from backend
  const progressPercentage = stats && stats.nextLevelXP ? ((stats.totalXP / stats.nextLevelXP) * 100).toFixed(1) : 0;

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !user.id) return;
      setLoadingStats(true);
      setStatsError(null);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      try {
        const res = await fetch(`${API_BASE}/api/users/${user.id}/stats`);
        if (!res.ok) throw new Error('Failed to load stats');
        const json = await res.json();
        setStats(json);
      } catch (err) {
        console.error('Fetch stats error', err);
        setStatsError(err.message || 'Failed to load stats');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px),
                           linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/50">
                  {user && user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-3xl font-bold font-mono">
                  <span className="text-gray-400">&gt;&gt;&gt; </span>
                  Welcome, <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                    {user && user.name ? user.name : 'User'}
                  </span>
                </h1>
                <p className="text-gray-400 font-mono text-sm mt-1">
                  {user && user.email ? user.email : 'No email available'}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-mono font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <span>Logout</span>
              <span>🚪</span>
            </button>
          </div>

          {/* Level Progress */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full text-sm font-mono font-bold">
                  Level {stats ? stats.level : '—'}
                </div>
                <span className="font-mono font-bold text-lg">{stats ? stats.totalXP : '—'} XP</span>
              </div>
              <span className="text-sm font-mono text-gray-400">{progressPercentage}% to next level</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs font-mono text-gray-500">
              <span>{stats ? stats.totalXP : '—'} XP</span>
              <span>{stats ? stats.nextLevelXP : '—'} XP</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-5 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400 font-mono">Lessons</div>
              <div className="text-2xl group-hover:scale-110 transition-transform">📚</div>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats ? stats.lessonsCompleted : (loadingStats ? '...' : 0)}</div>
            <div className="text-xs text-gray-500 font-mono mt-1">completed</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-5 hover:border-green-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400 font-mono">Problems</div>
              <div className="text-2xl group-hover:scale-110 transition-transform">⚡</div>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats ? stats.problemsSolved : (loadingStats ? '...' : 0)}</div>
            <div className="text-xs text-gray-500 font-mono mt-1">solved</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-5 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400 font-mono">Hours</div>
              <div className="text-2xl group-hover:scale-110 transition-transform">⏱️</div>
            </div>
            <div className="text-3xl font-bold text-purple-400">{stats ? stats.hoursLearned : (loadingStats ? '...' : 0)}h</div>
            <div className="text-xs text-gray-500 font-mono mt-1">learned</div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-5 hover:border-orange-500/50 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-400 font-mono">Streak</div>
              <div className="text-2xl group-hover:scale-110 transition-transform">🔥</div>
            </div>
            <div className="text-3xl font-bold text-orange-400">{stats ? stats.currentStreak : (loadingStats ? '...' : 0)}</div>
            <div className="text-xs text-gray-500 font-mono mt-1">days</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-800">
          {['overview', 'activity', 'quick-links'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-mono font-semibold capitalize transition-all duration-300 ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {activeTab === 'overview' && (
            <>
              {/* My Progress */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                  <h2 className="text-xl font-bold font-mono mb-4">
                    <span className="text-green-400"># </span>My Progress
                  </h2>
                  
                  {(!stats || (stats.lessonsCompleted === 0 && stats.problemsSolved === 0)) ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🚀</div>
                      <p className="text-gray-400 font-mono mb-4">No progress data yet.</p>
                      <p className="text-gray-500 text-sm font-mono">
                        Start your learning journey by completing lessons and solving problems!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Progress Bars */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-gray-400">Python Basics</span>
                          <span className="text-sm font-mono text-white">75%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-gray-400">Control Flow</span>
                          <span className="text-sm font-mono text-white">50%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" style={{ width: '50%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono text-gray-400">Functions</span>
                          <span className="text-sm font-mono text-white">25%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Continue Learning Card */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-mono font-bold text-lg mb-3">
                    <span className="text-blue-400"># </span>Continue Learning
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300 font-mono">
                      Pick up where you left off
                    </div>
                    <a
                      href="/learn"
                      className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-mono text-sm font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 text-center"
                    >
                      Go to Learn →
                    </a>
                  </div>
                </div>

                {/* Daily Challenge */}
                <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="font-mono font-bold text-lg mb-3">
                    <span className="text-orange-400"># </span>Daily Challenge
                  </h3>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300 font-mono">
                      🎯 Solve today's problem
                    </div>
                    <a
                      href="/solve-problem"
                      className="block w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg font-mono text-sm font-semibold hover:from-orange-500 hover:to-red-500 transition-all duration-300 text-center"
                    >
                      Start Challenge ⚡
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="lg:col-span-3">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold font-mono mb-4">
                  <span className="text-green-400"># </span>Recent Activity
                </h2>
                
                {(!stats || (stats.recentActivity && stats.recentActivity.length === 0)) ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-gray-400 font-mono">No activity yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(stats.recentActivity || []).map((activity) => (
                      <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          activity.type === 'mcq' ? 'bg-blue-500/20' : 'bg-green-500/20'
                        }`}>
                          {activity.type === 'mcq' ? '📚' : '⚡'}
                        </div>
                        <div className="flex-1">
                          <div className="font-mono font-semibold">{activity.title}</div>
                          <div className="text-sm text-gray-400 font-mono mt-1">{new Date(activity.time).toLocaleString()}</div>
                        </div>
                        <div className="text-sm font-mono text-gray-400">{activity.score} pts</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'quick-links' && (
            <div className="lg:col-span-3">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold font-mono mb-4">
                  <span className="text-purple-400"># </span>Quick Links
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/"
                    className="group p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🏠</div>
                    <h3 className="font-mono font-bold text-lg mb-2 group-hover:text-blue-400 transition-colors">Home</h3>
                    <p className="text-sm text-gray-400 font-mono">Return to homepage</p>
                  </a>

                  <a
                    href="/learn"
                    className="group p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
                    <h3 className="font-mono font-bold text-lg mb-2 group-hover:text-green-400 transition-colors">Learn</h3>
                    <p className="text-sm text-gray-400 font-mono">Explore Python lessons</p>
                  </a>

                  <a
                    href="/solve-problem"
                    className="group p-6 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
                    <h3 className="font-mono font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors">Solve Problems</h3>
                    <p className="text-sm text-gray-400 font-mono">Practice coding challenges</p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}