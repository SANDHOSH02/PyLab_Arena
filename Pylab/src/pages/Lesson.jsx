import { useEffect, useState, useRef } from "react";

export default function Lesson() {
  const id = 1; // In real app, use useParams()
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mcqs, setMcqs] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [videoPreview, setVideoPreview] = useState(false);
  const [violations, setViolations] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [warningMessage, setWarningMessage] = useState(null);
  const quizRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const API_BASE = 'http://localhost:4000';
    const fetchLesson = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/lessons/${id}`);
        if (!res.ok) throw new Error('Lesson not found');
        const json = await res.json();
        setLesson(json);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const fetchMcqs = async () => {
    if (mcqs) { setShowQuiz(true); return; }
    const API_BASE = 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/lessons/${id}/mcq`);
      if (!res.ok) throw new Error('Failed to load MCQs');
      const json = await res.json();
      setMcqs(json || []);
      setShowQuiz(true);
      setScore(null);
      setAnswers({});
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load MCQs');
    }
  };

  const handleAnswer = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const submitQuiz = async () => {
    if (!mcqs) return;
    let correct = 0;
    mcqs.forEach((q) => {
      const given = answers[q.id];
      if (given && given.toUpperCase() === (q.correct_option || '').toUpperCase()) correct++;
    });
    const result = { correct, total: mcqs.length };
    setScore(result);

    const API_BASE = 'http://localhost:4000';
    const rawUser = localStorage.getItem('user');
    let userId = null;
    try { userId = rawUser ? JSON.parse(rawUser).id : null; } catch (e) { userId = null; }

    setSaving(true); setSaveError(null); setSavedId(null);
    try {
      const res = await fetch(`${API_BASE}/api/lessons/${id}/mcq/result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, score: correct })
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to save result');
      }
      const body = await res.json();
      setSavedId(body.id || null);
    } catch (err) {
      console.error('Save result error', err);
      setSaveError(err.message || 'Failed to save result');
    } finally {
      setSaving(false);
    }
  };

  // Anti-cheat: attach listeners while quiz modal is open
  useEffect(() => {
    if (!showQuiz) return;

    const maxViolations = 3;

    const incrementViolation = (reason) => {
      setViolations((v) => {
        const nv = v + 1;
        setWarningMessage(`${reason} — (${nv}/${maxViolations})`);
        if (nv >= maxViolations) {
          setIsLocked(true);
          setWarningMessage('Locked due to multiple violations');
          // auto-submit after brief delay
          setTimeout(() => {
            try { submitQuiz(); } catch (e) { console.error(e); }
            setShowQuiz(false);
          }, 600);
        }
        return nv;
      });
    };

    const handleVisibility = () => {
      if (document.hidden) incrementViolation('Tab switch or window hidden');
    };
    const handleBlur = () => { incrementViolation('Window lost focus'); };
    const handleContext = (e) => { e.preventDefault(); incrementViolation('Right-click/context menu'); };
    const handleCopy = (e) => { e.preventDefault(); incrementViolation('Copy or clipboard attempt'); };
    const handlePaste = (e) => { e.preventDefault(); incrementViolation('Paste attempt'); };
    const handleKeydown = (e) => {
      // Block devtools and common shortcuts
      const k = e.key.toUpperCase();
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (k === 'I' || k === 'J' || k === 'C')) || (e.ctrlKey && k === 'U')) {
        e.preventDefault();
        incrementViolation('DevTools/inspect attempt');
        return;
      }
      if (e.ctrlKey && (k === 'C' || k === 'V' || k === 'X' || k === 'P' || k === 'S' || k === 'A')) {
        e.preventDefault();
        incrementViolation('Clipboard/shortcut blocked');
        return;
      }
    };
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) incrementViolation('Exited fullscreen');
    };

    // add listeners
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContext, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCopy, true);
    document.addEventListener('paste', handlePaste, true);
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // try to request fullscreen for quizRef (may require user gesture)
    (async () => {
      try {
        if (quizRef.current && quizRef.current.requestFullscreen) await quizRef.current.requestFullscreen();
        else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      } catch (e) {
        // ignore — may be blocked by browser
        console.warn('Fullscreen request failed', e);
      }
    })();

    return () => {
      // cleanup
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContext, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCopy, true);
      document.removeEventListener('paste', handlePaste, true);
      document.removeEventListener('keydown', handleKeydown, true);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      setWarningMessage(null);
      setViolations(0);
      setIsLocked(false);
      // exit fullscreen if still active
      try { if (document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
    };
  }, [showQuiz]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-gray-400 font-mono">Loading lesson...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <div className="text-red-400 font-mono text-lg">{error}</div>
        <a href="/learn" className="mt-4 inline-block px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all">
          ← Back to Learn
        </a>
      </div>
    </div>
  );

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
        
        {/* Header */}
        <div className="mb-8">
          <a href="/learn" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 font-mono text-sm">
            <span>←</span>
            <span>Back to Learn</span>
          </a>
          
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold font-mono mb-3">
                <span className="text-gray-400">&gt;&gt;&gt; </span>
                {lesson?.title || 'Lesson'}
              </h1>
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-full">
                  Level {lesson?.level_id}
                </span>
                <span className="text-gray-400">
                  Lesson {lesson?.lesson_number}
                </span>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2">
              <button className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all">
                <span className="text-xl">🔖</span>
              </button>
              <button className="p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs Navigation */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-2 flex gap-2 overflow-x-auto">
              {['overview', 'notes', 'syntax', 'questions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-mono text-sm font-semibold capitalize transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 min-h-[400px]">
              
              {activeTab === 'overview' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">📚</div>
                    <h2 className="text-2xl font-bold font-mono">
                      <span className="text-blue-400"># </span>Overview
                    </h2>
                  </div>
                  
                  {lesson?.content ? (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                        {lesson.content}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No overview available
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">📝</div>
                    <h2 className="text-2xl font-bold font-mono">
                      <span className="text-green-400"># </span>Key Notes
                    </h2>
                  </div>
                  
                  {lesson?.key_notes ? (
                    <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-6">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-base">
                        {lesson.key_notes}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No key notes available
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'syntax' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">⚙️</div>
                    <h2 className="text-2xl font-bold font-mono">
                      <span className="text-purple-400"># </span>Syntax
                    </h2>
                  </div>
                  
                  {lesson?.syntax ? (
                    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-4 text-gray-400 text-sm font-mono">syntax.py</span>
                      </div>
                      <pre className="p-6 overflow-x-auto">
                        <code className="text-green-400 font-mono text-sm">{lesson.syntax}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No syntax examples available
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'questions' && (
                <div className="animate-fadeIn">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-3xl">❓</div>
                    <h2 className="text-2xl font-bold font-mono">
                      <span className="text-orange-400"># </span>Important Questions
                    </h2>
                  </div>
                  
                  {lesson?.important_questions ? (
                    <div className="space-y-4">
                      {lesson.important_questions.split('\n').map((q, i) => (
                        q.trim() && (
                          <div key={i} className="p-4 bg-gradient-to-br from-orange-600/10 to-red-600/10 border border-orange-500/30 rounded-lg">
                            <div className="flex items-start gap-3">
                              <span className="text-orange-400 font-mono font-bold">{i + 1}.</span>
                              <p className="text-gray-300 flex-1">{q.trim()}</p>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      No questions available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <a
                href="/solve-problem"
                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-mono font-semibold text-center hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105"
              >
                Practice Problems →
              </a>
              <button
                onClick={fetchMcqs}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-mono font-semibold hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
              >
                Take Quiz 📝
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            
            {/* Video Resource */}
            {lesson?.youtube_link && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-red-600/20 to-pink-600/20 border-b border-gray-700">
                  <h3 className="font-mono font-bold flex items-center gap-2">
                    <span className="text-xl">🎥</span>
                    <span>Video Tutorial</span>
                  </h3>
                </div>
                
                <div className="p-4">
                  {(() => {
                    try {
                      const url = new URL(lesson.youtube_link);
                      let vid = null;
                      if (url.hostname.includes('youtu.be')) vid = url.pathname.slice(1);
                      else if (url.hostname.includes('youtube.com')) vid = url.searchParams.get('v');
                      
                      if (vid) {
                        const thumb = `https://img.youtube.com/vi/${vid}/hqdefault.jpg`;
                        return (
                          <div>
                            {!videoPreview ? (
                              <div className="space-y-3">
                                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black group cursor-pointer" onClick={() => setVideoPreview(true)}>
                                  <img src={thumb} alt="video thumbnail" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                      <span className="text-2xl ml-1">▶️</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => setVideoPreview(true)} 
                                    className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-mono transition-all"
                                  >
                                    Play Video
                                  </button>
                                  <a 
                                    href={lesson.youtube_link} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-mono transition-all"
                                  >
                                    YouTube
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full aspect-video rounded-lg overflow-hidden">
                                <iframe 
                                  className="w-full h-full" 
                                  src={`https://www.youtube.com/embed/${vid}`} 
                                  title="YouTube video" 
                                  allowFullScreen 
                                  frameBorder="0"
                                ></iframe>
                              </div>
                            )}
                          </div>
                        );
                      }
                    } catch (e) {
                      console.error(e);
                    }
                    return (
                      <a 
                        href={lesson.youtube_link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="block px-4 py-3 bg-red-600 hover:bg-red-500 rounded-lg text-sm text-center font-mono transition-all"
                      >
                        Watch on YouTube →
                      </a>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Progress Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
              <h3 className="font-mono font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                <span>Your Progress</span>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span className="text-gray-400 font-mono">Completion</span>
                    <span className="text-white font-mono">0%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700 space-y-2 text-sm font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Quiz Score</span>
                    <span className="text-gray-300">—</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Time Spent</span>
                    <span className="text-gray-300">0 min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
              <h3 className="font-mono font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">🔗</span>
                <span>Quick Links</span>
              </h3>
              
              <div className="space-y-2">
                <a href="/learn" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-mono transition-all">
                  ← Previous Lesson
                </a>
                <a href="/learn" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-mono transition-all">
                  Next Lesson →
                </a>
                <a href="/dashboard" className="block px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-mono transition-all">
                  Dashboard 📊
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Quiz Modal */}
        {showQuiz && mcqs && (
          <div ref={quizRef} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn" onContextMenu={(e) => { if(!isLocked){ e.preventDefault(); return false; } }}>
            <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              
              {/* Quiz Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-mono flex items-center gap-3">
                      <span className="text-3xl">📝</span>
                      <span>Quiz Time!</span>
                    </h3>
                    <p className="text-sm text-gray-400 font-mono mt-1">
                      {mcqs.length} question{mcqs.length !== 1 ? 's' : ''} • Test your knowledge
                    </p>
                  </div>
                  <button 
                    onClick={() => { setShowQuiz(false); setScore(null); }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-all"
                  >
                    <span className="text-2xl">✕</span>
                  </button>
                </div>
              </div>

              {/* Warning area for anti-cheat */}
              {warningMessage && (
                <div className="p-3 bg-yellow-900/60 border-l-4 border-yellow-500 text-yellow-200 font-mono mb-4 rounded">
                  <strong>Warning:</strong> {warningMessage}
                </div>
              )}



              {/* Quiz Content */}
              <div className="p-6 space-y-6">
                {mcqs.map((q, idx) => (
                  <div key={q.id} className="bg-gray-900/50 rounded-lg border border-gray-700 p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-mono font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-mono font-semibold text-lg">{q.question}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 ml-11">
                      {['option_a','option_b','option_c','option_d'].map((optKey) => {
                        const optLetter = optKey.slice(-1).toUpperCase();
                        const isSelected = answers[q.id] === optLetter;
                        const isCorrect = score && q.correct_option?.toUpperCase() === optLetter;
                        const isWrong = score && isSelected && !isCorrect;
                        
                        return (
                          <label 
                            key={optKey} 
                            className={`group flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              isCorrect 
                                ? 'bg-green-500/20 border-green-500' 
                                : isWrong 
                                  ? 'bg-red-500/20 border-red-500'
                                  : isSelected 
                                    ? 'bg-blue-600/30 border-blue-500' 
                                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={`q-${q.id}`} 
                              className="w-4 h-4"
                              checked={isSelected} 
                              onChange={() => !score && !isLocked && handleAnswer(q.id, optLetter)}
                              disabled={!!score || isLocked}
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <span className="text-sm font-mono">{q[optKey]}</span>
                              {isCorrect && <span className="text-green-400">✓</span>}
                              {isWrong && <span className="text-red-400">✗</span>}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz Footer */}
              <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6">
                {!score ? (
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => { setShowQuiz(false); setScore(null); }}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-mono transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={submitQuiz}
                      disabled={Object.keys(answers).length !== mcqs.length}
                      className={`flex-1 px-6 py-3 rounded-lg font-mono font-semibold transition-all ${
                        Object.keys(answers).length === mcqs.length
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500'
                          : 'bg-gray-700 cursor-not-allowed'
                      }`}
                    >
                      Submit Answers ({Object.keys(answers).length}/{mcqs.length})
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-5xl mb-3">
                        {score.correct === score.total ? '🎉' : score.correct >= score.total * 0.7 ? '👏' : '📚'}
                      </div>
                      <div className="text-3xl font-bold font-mono mb-2">
                        {score.correct} / {score.total}
                      </div>
                      <div className="text-lg text-gray-300 font-mono">
                        {Math.round((score.correct/score.total)*100)}% correct
                      </div>
                      
                      {/* Save Status */}
                      <div className="mt-4">
                        {saving ? (
                          <div className="text-sm text-yellow-300 font-mono">💾 Saving result...</div>
                        ) : saveError ? (
                          <div className="text-sm text-red-400 font-mono">❌ {saveError}</div>
                        ) : savedId ? (
                          <div className="text-sm text-green-300 font-mono">✅ Result saved!</div>
                        ) : (
                          <div className="text-sm text-gray-400 font-mono">Result not saved</div>
                        )}
                      </div>
                    </div>

                    <button 
                      onClick={() => { setShowQuiz(false); setScore(null); setAnswers({}); }}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-mono font-semibold transition-all"
                    >
                      Close Quiz
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Anti-cheat: when quiz is shown, enable listeners */}
        
        {/* Anti-cheat effect: attach listeners while quiz is open */}
        {typeof window !== 'undefined' && (function(){
          // this IIFE is a placeholder so the code below is kept in the file but executed via a real useEffect
          return null;
        })()}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Anti-cheat helpers (not exported) — added below component for clarity

// We'll implement the exam-mode listeners inside a small effect using the global document.
// Because this file is already large, define the effect-adding logic here and call it
// from inside the component via a useEffect when `showQuiz` changes.
