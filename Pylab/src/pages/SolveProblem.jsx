import { useEffect, useRef, useState } from "react";

export default function SolveProblem() {
  const [stageIndex, setStageIndex] = useState(0);
  const [stages, setStages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('py');
  const [output, setOutput] = useState('');
  const [lastResultStatus, setLastResultStatus] = useState(null); // 'correct' | 'wrong' | null
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [isRunning, setIsRunning] = useState(false);
  const iframeRef = useRef(null);
  const pyodideRef = useRef(null);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    const API_BASE = 'http://localhost:4000';
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/problems?limit=200`);
        if (!res.ok) throw new Error('Failed to load problems');
        const problems = await res.json();
        if (cancelled) return;
        
        const perStage = Math.max(1, Math.ceil(problems.length / 5));
        const stageIcons = ['🌱', '📚', '🔀', '📦', '🚀'];
        const newStages = Array.from({ length: 5 }).map((_, i) => ({
          id: i + 1,
          icon: stageIcons[i],
          title: ['Getting Started','Basics','Control Flow','Data Structures','Advanced'][i] || `Stage ${i+1}`,
          problems: problems.slice(i * perStage, (i + 1) * perStage).map(p => ({ 
            id: String(p.id), 
            title: p.title, 
            desc: p.description || '', 
            template: p.template || '# Write Python code here\n', 
            lang: 'py',
            difficulty: p.difficulty || ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
            expected: p.expected_output || p.expected || null
          }))
        }));
        setStages(newStages);
        setStageIndex(0);
        
        if (newStages[0] && newStages[0].problems[0]) {
          setSelected(newStages[0].problems[0]);
          setCode(newStages[0].problems[0].template || '');
          setLang('py');
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selected) return;
    setCode(selected.template || '');
    setLang(selected.lang || 'py');
    setOutput('');
    setLastResultStatus(null);
  }, [selected]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (pyodideRef.current) return;
      setPyodideLoading(true);
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        script.async = true;
        document.body.appendChild(script);
        await new Promise((res, rej) => { script.onload = res; script.onerror = rej; });
        const pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
        pyodideRef.current = pyodide;
      } catch (e) {
        console.error('Failed to load pyodide', e);
      } finally {
        if (!cancelled) setPyodideLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    setOutput('🔄 Running your code...\n');
    
    if (lang !== 'py') { 
      setOutput('⚠️ Only Python is supported in this environment.'); 
      setIsRunning(false);
      return; 
    }

    if (!pyodideRef.current) {
      setOutput('⏳ Python runtime is loading... Please wait and try again.');
      setIsRunning(false);
      return;
    }

    try {
      const pyodide = pyodideRef.current;
      const userCode = code || '';
      const indented = userCode.split('\n').map(line => '    ' + line).join('\n');
      const wrapper = `import sys, io, traceback\nbuf = io.StringIO()\nold = sys.stdout\nsys.stdout = buf\ntry:\n${indented}\nexcept Exception:\n    traceback.print_exc()\nfinally:\n    sys.stdout = old\nresult = buf.getvalue()`;
      
      const result = await pyodide.runPythonAsync(wrapper + '\nresult');
      const normalized = (result || '').toString().trim();
      setOutput(normalized || '✅ Code executed successfully (no output)');

      // If problem provides expected output, compare and set status
      if (selected && (selected.expected !== null && selected.expected !== undefined)) {
        const expected = String(selected.expected).trim();
        if (expected === normalized) {
          setLastResultStatus('correct');
        } else {
          setLastResultStatus('wrong');
        }
      } else {
        setLastResultStatus(null);
      }
    } catch (err) {
      console.error(err);
      setOutput('❌ Error:\n' + (err.message || String(err)));
    } finally {
      setIsRunning(false);
    }
  };

  const submitAttempt = () => {
    const attempts = JSON.parse(localStorage.getItem('problem_attempts') || '[]');
    const rawUser = localStorage.getItem('user');
    let userId = null; 
    try { userId = rawUser ? JSON.parse(rawUser).id : null; } catch(e){ userId = null; }
    
    const record = { 
      id: Date.now(), 
      problemId: selected.id, 
      userId, 
      lang, 
      code, 
      createdAt: new Date().toISOString(),
      correct: lastResultStatus === 'correct'
    };
    attempts.unshift(record);
    localStorage.setItem('problem_attempts', JSON.stringify(attempts));

    // attempt to persist to backend
    (async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        // map correctness to a numeric score (100 for correct, 0 for wrong)
        const score = record.correct ? 100 : 0;
        const res = await fetch(`${API_BASE}/api/problems/${selected.id}/attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: record.userId, score })
        });
        if (!res.ok) {
          console.warn('Failed to save attempt to server');
          setOutput('✅ Attempt saved locally. Failed to save to server.');
        } else {
          setOutput('✅ Attempt saved successfully (local + server).');
        }
      } catch (err) {
        console.error('Persist attempt error', err);
        setOutput('✅ Attempt saved locally. Error saving to server.');
      }
    })();
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

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

      <div className="relative z-10 h-screen flex flex-col">
        
        {/* Top Bar */}
        <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold font-mono">
                <span className="text-gray-400">&gt;&gt;&gt; </span>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Code Arena
                </span>
              </h1>
              {pyodideLoading && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-mono text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span>Loading Python...</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-all" title="Settings">
                <span className="text-xl">⚙️</span>
              </button>
              <a href="/learn" className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-mono text-sm transition-all">
                ← Back to Learn
              </a>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Sidebar */}
          <aside className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-800 overflow-y-auto">
            
            {/* Stages */}
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-mono font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span>Learning Path</span>
              </h3>
              <div className="space-y-2">
                {stages.length === 0 ? (
                  <div className="text-sm text-gray-400 text-center py-4">Loading stages...</div>
                ) : (
                  stages.map((s, idx) => (
                    <button 
                      key={s.id} 
                      onClick={() => setStageIndex(idx)} 
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                        idx === stageIndex 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-2xl">{s.icon}</span>
                      <div className="flex-1 text-left">
                        <div className="font-mono font-semibold">{s.title}</div>
                        <div className="text-xs text-gray-400">{s.problems.length} problems</div>
                      </div>
                      {idx === stageIndex && <span>✓</span>}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Problems List */}
            <div className="p-4">
              <h3 className="font-mono font-bold mb-3 flex items-center gap-2">
                <span className="text-xl">📝</span>
                <span>Problems</span>
              </h3>
              <div className="space-y-2">
                {stages.length === 0 ? (
                  <div className="text-sm text-gray-400 text-center py-4">Loading problems...</div>
                ) : (
                  (stages[stageIndex]?.problems || []).map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => setSelected(p)} 
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selected && selected.id === p.id 
                          ? 'bg-green-600 text-white shadow-lg' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="font-mono font-semibold text-sm">{p.title}</div>
                        {selected && selected.id === p.id && <span className="text-xs">●</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded border ${getDifficultyColor(p.difficulty)}`}>
                          {p.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">#{p.id}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            
            {!selected ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-6">🚀</div>
                  <h2 className="text-3xl font-bold font-mono mb-3">Ready to Code?</h2>
                  <p className="text-gray-400 font-mono">Select a problem from the sidebar to begin</p>
                </div>
              </div>
            ) : (
              <>
                {/* Problem Header */}
                <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold font-mono">{selected.title}</h2>
                        <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(selected.difficulty)}`}>
                          {selected.difficulty}
                        </span>
                        {lastResultStatus === 'correct' && (
                          <span className="ml-3 text-xs px-3 py-1 rounded-full bg-green-600 text-white font-mono">✔ Correct</span>
                        )}
                        {lastResultStatus === 'wrong' && (
                          <span className="ml-3 text-xs px-3 py-1 rounded-full bg-red-600 text-white font-mono">✖ Wrong</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 font-mono">Problem ID: {selected.id}</div>
                    </div>
                    
                    <button 
                      onClick={() => setShowHints(!showHints)}
                      className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-all font-mono text-sm"
                    >
                      {showHints ? '🔒 Hide Hints' : '💡 Show Hints'}
                    </button>
                  </div>

                  {/* Problem Description */}
                  <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                    <h3 className="font-mono font-bold mb-2 text-sm text-gray-400">Problem Description:</h3>
                    <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {selected.desc || 'No description available for this problem.'}
                    </p>
                  </div>

                  {showHints && (
                    <div className="mt-4 bg-yellow-600/10 border border-yellow-500/30 rounded-lg p-4 animate-fadeIn">
                      <h3 className="font-mono font-bold mb-2 text-sm text-yellow-400">💡 Hints:</h3>
                      <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                        <li>Break down the problem into smaller steps</li>
                        <li>Consider edge cases and input validation</li>
                        <li>Test your code with sample inputs</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Code Editor & Output */}
                <div className="flex-1 grid lg:grid-cols-2 overflow-hidden">
                  
                  {/* Code Editor */}
                  <div className="flex flex-col border-r border-gray-800 overflow-hidden">
                    <div className="bg-gray-900/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <span className="text-sm font-mono text-gray-400">solution.py</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <select 
                          value={fontSize} 
                          onChange={(e) => setFontSize(Number(e.target.value))}
                          className="bg-gray-800 px-2 py-1 rounded text-xs font-mono"
                        >
                          <option value="12">12px</option>
                          <option value="14">14px</option>
                          <option value="16">16px</option>
                          <option value="18">18px</option>
                        </select>
                        
                        <select 
                          value={lang} 
                          onChange={(e) => setLang(e.target.value)} 
                          className="bg-gray-800 px-3 py-1 rounded text-sm font-mono"
                        >
                          <option value="py">🐍 Python</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <textarea 
                        value={code} 
                        onChange={(e) => setCode(e.target.value)} 
                        className="w-full h-full bg-gray-900 p-6 font-mono text-green-400 resize-none outline-none"
                        style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                        spellCheck="false"
                        placeholder="# Write your Python code here..."
                      />
                    </div>

                    {/* Editor Actions */}
                    <div className="bg-gray-900/50 backdrop-blur-sm px-4 py-3 flex items-center gap-3 border-t border-gray-800">
                      <button 
                        onClick={runCode}
                        disabled={isRunning}
                        className={`flex-1 px-6 py-2 rounded-lg font-mono font-semibold transition-all flex items-center justify-center gap-2 ${
                          isRunning 
                            ? 'bg-gray-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 transform hover:scale-105'
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Running...</span>
                          </>
                        ) : (
                          <>
                            <span>▶️</span>
                            <span>Run Code</span>
                          </>
                        )}
                      </button>
                      
                      <button 
                        onClick={submitAttempt}
                        className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded-lg font-mono font-semibold transition-all transform hover:scale-105"
                      >
                        ✓ Submit
                      </button>
                      
                      <button 
                        onClick={() => { setCode(selected.template || ''); setOutput(''); }}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-mono transition-all"
                        title="Reset code"
                      >
                        🔄
                      </button>
                    </div>
                  </div>

                  {/* Output Panel */}
                  <div className="flex flex-col overflow-hidden">
                    <div className="bg-gray-900/50 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-800">
                      <span className="text-sm font-mono text-gray-400">📤 Output</span>
                      <button 
                        onClick={() => setOutput('')}
                        className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded font-mono transition-all"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <pre className="h-full bg-black p-6 font-mono text-sm text-green-300 whitespace-pre-wrap" style={{ fontSize: `${fontSize}px` }}>
                        {output || '// Output will appear here after running your code\n// Click "Run Code" to execute'}
                      </pre>
                      {lastResultStatus === 'wrong' && selected && selected.expected && (
                        <div className="p-4 mt-2 bg-red-900/40 rounded border border-red-700 text-sm">
                          <div className="font-mono font-semibold text-sm text-red-200 mb-1">Expected Output:</div>
                          <pre className="whitespace-pre-wrap text-red-100 text-sm">{String(selected.expected)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-800 px-6 py-2 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4 text-gray-400">
            <span>Python Runtime: {pyodideLoading ? '⏳ Loading...' : '✅ Ready'}</span>
            <span>•</span>
            <span>Language: Python 3</span>
          </div>
          <div className="text-gray-500">
            💡 Tip: Use print() to debug your code
          </div>
        </div>
      </div>

      <iframe ref={iframeRef} title="runner" className="hidden" sandbox="allow-scripts"></iframe>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}