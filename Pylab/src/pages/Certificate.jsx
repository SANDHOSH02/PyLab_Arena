import { useEffect, useState, useRef } from 'react';

export default function Certificate() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setUser(JSON.parse(raw));
    } catch (e) { setUser(null); }
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!user || !user.id) { setLoading(false); return; }
      setLoading(true);
      const API_BASE = 'http://localhost:4000';
      try {
        const res = await fetch(`${API_BASE}/api/users/${user.id}/stats`);
        if (!res.ok) throw new Error('failed');
        const json = await res.json();
        setStats(json || { problemsSolved: 0, lessonsCompleted: 0, hoursLearned: 0 });
      } catch (e) {
        console.error(e);
        setStats({ problemsSolved: 0, lessonsCompleted: 0, hoursLearned: 0 });
      } finally { setLoading(false); }
    };
    load();
  }, [user]);

  const eligible = stats && (stats.problemsSolved >= threshold);

  const drawCertificate = () => {
    const width = 1600, height = 1120;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Tech gradient background
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, '#0a0e27');
    grd.addColorStop(0.5, '#1a1147');
    grd.addColorStop(1, '#0a0e27');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // Grid pattern
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Circuit board lines (decorative)
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(300, 100);
    ctx.lineTo(300, 200);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width - 100, 100);
    ctx.lineTo(width - 300, 100);
    ctx.lineTo(width - 300, 200);
    ctx.stroke();

    // Glowing border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 20;
    ctx.strokeRect(60, 60, width - 120, height - 120);
    ctx.shadowBlur = 0;

    // Corner decorations
    const cornerSize = 60;
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 3;
    
    // Top left
    ctx.beginPath();
    ctx.moveTo(80, 100);
    ctx.lineTo(80, 80);
    ctx.lineTo(100, 80);
    ctx.stroke();
    
    // Top right
    ctx.beginPath();
    ctx.moveTo(width - 80, 100);
    ctx.lineTo(width - 80, 80);
    ctx.lineTo(width - 100, 80);
    ctx.stroke();
    
    // Bottom left
    ctx.beginPath();
    ctx.moveTo(80, height - 100);
    ctx.lineTo(80, height - 80);
    ctx.lineTo(100, height - 80);
    ctx.stroke();
    
    // Bottom right
    ctx.beginPath();
    ctx.moveTo(width - 80, height - 100);
    ctx.lineTo(width - 80, height - 80);
    ctx.lineTo(width - 100, height - 80);
    ctx.stroke();

    // Python logo colors accent
    ctx.fillStyle = '#3776ab';
    ctx.fillRect(width/2 - 100, 160, 80, 8);
    ctx.fillStyle = '#ffd343';
    ctx.fillRect(width/2 + 20, 160, 80, 8);

    // Header ">>> " like Python prompt
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 40px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('>>>', width/2 - 220, 230);

    // Title
    const titleGradient = ctx.createLinearGradient(width/2 - 400, 0, width/2 + 400, 0);
    titleGradient.addColorStop(0, '#3b82f6');
    titleGradient.addColorStop(0.5, '#8b5cf6');
    titleGradient.addColorStop(1, '#ec4899');
    ctx.fillStyle = titleGradient;
    ctx.font = 'bold 56px monospace';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', width/2, 230);

    // Subheader
    ctx.fillStyle = '#94a3b8';
    ctx.font = '28px monospace';
    ctx.fillText('// Python Programming Mastery', width/2, 280);

    // Divider line
    const lineGradient = ctx.createLinearGradient(width/2 - 400, 0, width/2 + 400, 0);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.5, '#3b82f6');
    lineGradient.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 320);
    ctx.lineTo(width - 200, 320);
    ctx.stroke();

    // "Awarded to" label
    ctx.fillStyle = '#64748b';
    ctx.font = '24px monospace';
    ctx.fillText('# Awarded to:', width/2, 400);

    // Name with glow effect
    ctx.shadowColor = '#3b82f6';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px monospace';
    const name = (user && user.name) ? user.name : 'Learner';
    ctx.fillText(name.toUpperCase(), width/2, 480);
    ctx.shadowBlur = 0;

    // Achievement details box
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fillRect(300, 540, width - 600, 280);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(300, 540, width - 600, 280);

    // Stats
    ctx.textAlign = 'left';
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('def achievements():', 350, 600);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '24px monospace';
    const problems = stats ? stats.problemsSolved : 0;
    const lessons = stats ? stats.lessonsCompleted : 0;
    const hours = stats ? stats.hoursLearned : 0;
    
    ctx.fillText(`    problems_solved = ${problems}`, 380, 650);
    ctx.fillText(`    lessons_completed = ${lessons}`, 380, 690);
    ctx.fillText(`    hours_learned = ${hours}`, 380, 730);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText('    return "Master Programmer"', 380, 770);

    // Date and signature section
    ctx.textAlign = 'center';
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    ctx.fillStyle = '#64748b';
    ctx.font = '20px monospace';
    ctx.fillText(`print("Issued: ${date}")`, width/2, 920);

    // Verification code (fake but looks official)
    const verificationCode = `PY${Date.now().toString(36).toUpperCase().slice(-8)}`;
    ctx.fillStyle = '#475569';
    ctx.font = '16px monospace';
    ctx.fillText(`Verification: ${verificationCode}`, width/2, 960);

    // Tech badge/seal
    ctx.beginPath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.arc(width - 200, height - 200, 100, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('🐍', width - 200, height - 210);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('PYTHON', width - 200, height - 175);
    
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText('CERTIFIED', width - 200, height - 155);

    // Footer tech elements
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, height - 60, width, 60);
    ctx.fillStyle = '#334155';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PythonLearn.io • Master the Art of Programming', width/2, height - 25);

    return canvas;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    // Simulate generation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const canvas = drawCertificate();
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    
    setPreviewUrl(dataUrl);
    setGenerating(false);
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    
    const a = document.createElement('a');
    a.href = previewUrl;
    const filename = `PythonLearn_Certificate_${(user && user.name) ? user.name.replace(/\s+/g, '_') : 'learner'}_${new Date().toISOString().slice(0, 10)}.png`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono">Loading your progress...</p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-mono">
            {'>>> certificate_generator.py'}
          </div>
          
          <h1 className="text-5xl font-bold mb-4 font-mono">
            <span className="text-gray-400">&gt;&gt;&gt; </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Certificate Generator
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Generate your official Python programming completion certificate
          </p>
        </div>

        {!user ? (
          <div className="max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-2xl font-bold mb-4 font-mono">Authentication Required</h2>
            <p className="text-gray-400 mb-6">Please log in to generate your certificate</p>
            <a href="/login" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-mono font-semibold hover:from-blue-500 hover:to-purple-500 transition-all">
              Login Now →
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Panel - User Stats */}
            <div className="space-y-6">
              
              {/* User Profile */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  <span>Your Profile</span>
                </h3>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-lg">{user.name || 'Learner'}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700 space-y-2 text-sm font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-gray-300">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Achievement Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span>Your Achievements</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400 font-mono">Problems Solved</span>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div className="text-3xl font-bold text-blue-400 font-mono">
                      {stats ? stats.problemsSolved : 0}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400 font-mono">Lessons Completed</span>
                      <span className="text-2xl">📚</span>
                    </div>
                    <div className="text-3xl font-bold text-green-400 font-mono">
                      {stats ? stats.lessonsCompleted : 0}
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400 font-mono">Hours Learned</span>
                      <span className="text-2xl">⏱️</span>
                    </div>
                    <div className="text-3xl font-bold text-purple-400 font-mono">
                      {stats ? stats.hoursLearned : 0}h
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility Settings */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  <span>Settings</span>
                </h3>
                
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-sm text-gray-400 font-mono mb-2 block">Minimum Problems Threshold</span>
                    <input 
                      type="number" 
                      value={threshold} 
                      min={1} 
                      onChange={(e) => setThreshold(Number(e.target.value))} 
                      className="w-full bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg font-mono outline-none focus:border-blue-500 transition-all"
                    />
                  </label>

                  <div className={`p-4 rounded-lg border ${
                    eligible 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-orange-500/10 border-orange-500/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{eligible ? '✅' : '⏳'}</span>
                      <div>
                        <div className="font-mono font-bold text-sm">
                          {eligible ? 'Eligible!' : 'Keep Learning'}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          {eligible 
                            ? 'You can generate your certificate' 
                            : `Solve ${threshold - (stats?.problemsSolved || 0)} more problems`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Certificate Preview & Actions */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Actions */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="font-mono font-bold text-xl mb-2">Generate Certificate</h3>
                    <p className="text-sm text-gray-400 font-mono">
                      Create your personalized completion certificate
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleGenerate}
                      disabled={!eligible || generating}
                      className={`px-6 py-3 rounded-lg font-mono font-semibold transition-all flex items-center gap-2 ${
                        !eligible || generating
                          ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transform hover:scale-105'
                      }`}
                    >
                      {generating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <span>🎓</span>
                          <span>Generate</span>
                        </>
                      )}
                    </button>

                    {previewUrl && (
                      <button 
                        onClick={handleDownload}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-mono font-semibold transition-all transform hover:scale-105 flex items-center gap-2"
                      >
                        <span>💾</span>
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">🖼️</span>
                  <span>Certificate Preview</span>
                </h3>
                
                {!previewUrl ? (
                  <div className="aspect-[16/11] bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎓</div>
                      <p className="text-gray-400 font-mono mb-2">No preview yet</p>
                      <p className="text-sm text-gray-500 font-mono">Click "Generate" to create your certificate</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <img 
                      src={previewUrl} 
                      alt="Certificate Preview" 
                      className="w-full rounded-lg border border-gray-700 shadow-2xl transition-all duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all rounded-lg flex items-end justify-center p-6">
                      <button 
                        onClick={handleDownload}
                        className="px-6 py-3 bg-white text-gray-900 rounded-lg font-mono font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all"
                      >
                        Download High Quality PNG
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💡</span>
                  <div>
                    <h4 className="font-mono font-bold mb-2">About Certificates</h4>
                    <ul className="text-sm text-gray-300 space-y-1 font-mono">
                      <li>• High-quality PNG format (1600x1120px)</li>
                      <li>• Professional tech-themed design</li>
                      <li>• Includes your personal achievements</li>
                      <li>• Verification code for authenticity</li>
                      <li>• Perfect for LinkedIn, portfolio, or resume</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}