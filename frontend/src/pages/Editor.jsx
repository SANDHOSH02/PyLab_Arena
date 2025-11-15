import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import io from 'socket.io-client';
import '../App.css';

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roomId = searchParams.get('roomId') || '';
  const userName = searchParams.get('userName') || '';

  const socketRef = useRef(null);
  const [codeMirror, setCodeMirror] = useState(null);
  const [code, setCode] = useState(`# Python starter\ndef greet(name):\n    print(f"Hello, {name}")\n\ngreet("World")`);
  const [language, setLanguage] = useState('python');
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [pyodide, setPyodide] = useState(null);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);

  useEffect(() => {
    if (!roomId || !userName) {
      navigate('/');
      return;
    }

    const socket = io('https://realtime-code-editor-zwp3.onrender.com');
    socketRef.current = socket;

    socket.emit('join', { roomId, userName });

    socket.on('userJoined', (u) => setUsers(u || []));
    socket.on('codeUpdate', (c) => typeof c === 'string' && setCode(c));
    socket.on('userTyping', (u) => {
      setTyping(u ? `${String(u).slice(0,8)}... is Typing` : '');
      setTimeout(() => setTyping(''), 2000);
    });
    socket.on('languageUpdate', (l) => l && setLanguage(l));

    return () => { socket.emit('leaveRoom'); socket.disconnect(); socketRef.current = null; };
  }, [roomId, userName, navigate]);

  useEffect(() => {
    // Load Pyodide in background to support Python execution
    let mounted = true;
    const loadPy = async () => {
      try {
        setPyodideLoading(true);
        if (!window.loadPyodide) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
          script.async = true;
          document.body.appendChild(script);
          await new Promise((res) => { script.onload = res; });
        }
        const p = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/' });
        if (!mounted) return;
        setPyodide(p);
        setPyodideLoaded(true);
      } catch (err) {
        console.warn('Pyodide failed to load', err);
      } finally {
        setPyodideLoading(false);
      }
    };
    loadPy();
    return () => { mounted = false; };
  }, []);

  const handleCodeChange = (v) => {
    const safe = typeof v === 'string' ? v : code;
    setCode(safe);
    if (socketRef.current) socketRef.current.emit('codeChange', { roomId, code: safe });
    if (socketRef.current) socketRef.current.emit('typing', { roomId, userName });
  };
  const runCode = async () => {
    setError(''); setAiFeedback('');
    if (language === 'javascript') {
      try {
        const logs = [];
        const orig = console.log;
        console.log = (...a) => { logs.push(a.join(' ')); orig(...a); };
        // eslint-disable-next-line no-eval
        eval(code);
        console.log = orig;
        setOutput(logs.join('\n') || 'Write some code');
      } catch (err) {
        setOutput(''); setError(String(err.message || err));
      }
      return;
    }

    if (language === 'python') {
      if (!pyodideLoaded) {
        setOutput(pyodideLoading ? 'Loading Python runtime, please wait...' : 'Python runtime unavailable.');
        return;
      }

      try {
        // Wrap code to capture stdout
        const indent = code.split('\n').map(l => '    ' + l).join('\n');
        const wrapped = `import sys, io\nbuf = io.StringIO()\nsys.stdout = buf\ntry:\n${indent}\nexcept Exception as e:\n    import traceback; traceback.print_exc()\n_out = buf.getvalue()\n_out`;
        const res = await pyodide.runPythonAsync(wrapped);
        setOutput(String(res || '').trim() || 'No output');
      } catch (err) {
        setOutput('');
        setError(String(err.message || err));
      }
      return;
    }
    setOutput('Run not supported for selected language.');
  };

  return (
    <div className="editor-container">
      <div className="sidebar">
        <div className="room-info">
          <h2>Collaborative Coding Room</h2>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{roomId}</div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 6 }}>{userName}</div>
        </div>

        <h3>Participants</h3>
        <ul>
          {users.map((u, i) => <li key={i}>{String(u).slice(0,8)}...</li>)}
        </ul>

        <p className="typing-indicator">{typing}</p>

        <select className="language-selector" value={language} onChange={(e) => { setLanguage(e.target.value); if (socketRef.current) socketRef.current.emit('languageChange', { roomId, language: e.target.value }); }}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button className="leave-button" onClick={() => { if (socketRef.current) socketRef.current.emit('leaveRoom'); navigate('/'); }}>Leave Room</button>
      </div>

      <div className="editor-wrapper">
        <Editor height={'90vh'} language={language} value={code} onChange={handleCodeChange} />
      </div>

      <div className="output-box">
        <h3>Output:</h3>
        <pre>{output}</pre>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="run-button" onClick={runCode}>Run Code</button>
          <button className="run-button" onClick={() => { setOutput(''); setError(''); }}>Clear</button>
        </div>
        <button className="open-btn" onClick={() => { document.getElementById('error-card')?.classList.add('visible'); setTimeout(() => document.getElementById('error-card')?.classList.remove('visible'), 4000); }}>Show Error</button>

        <div id="error-card" className="card-overlay" style={{ display: error ? 'flex' : 'none' }}>
          <div className="card">
            <button className="close-btn" onClick={() => { document.getElementById('error-card').style.display = 'none'; }}>&times;</button>
            <div>
              <h3>Error Details</h3>
              <pre className="pre-error">{error}</pre>
              <h3>AI Feedback:</h3>
              <pre className="pre-ai">{aiFeedback}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
