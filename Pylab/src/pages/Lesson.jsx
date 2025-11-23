import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Lesson() {
  const { id } = useParams();
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

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
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
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
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

    // Save to backend
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-gray-400">Loading lesson...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="text-center text-red-400">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto bg-gray-800/60 rounded-xl border border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-mono">{lesson.title}</h1>
            <div className="text-sm text-gray-400 mt-1">Level {lesson.level_id} • Lesson {lesson.lesson_number}</div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/learn" className="text-sm text-gray-300 hover:text-white">← Back to Learn</Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {lesson.content && (
              <section className="mb-6">
                <h3 className="font-mono text-sm text-gray-400 mb-2">Overview</h3>
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{lesson.content}</p>
              </section>
            )}

            {lesson.key_notes && (
              <section className="mb-6">
                <h4 className="font-semibold font-mono mb-2">Key Notes</h4>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{lesson.key_notes}</p>
              </section>
            )}

            {lesson.syntax && (
              <section className="mb-6">
                <h4 className="font-semibold font-mono mb-2">Syntax</h4>
                <pre className="bg-gray-900 p-3 rounded text-sm overflow-auto">{lesson.syntax}</pre>
              </section>
            )}

            {lesson.important_questions && (
              <section className="mb-6">
                <h4 className="font-semibold font-mono mb-2">Important Questions</h4>
                <p className="text-sm text-gray-200 whitespace-pre-wrap">{lesson.important_questions}</p>
              </section>
            )}

            <div className="pt-4 border-t border-gray-700 text-right">
              <Link to="/solve-problem" className="px-4 py-2 bg-blue-600 rounded text-sm font-mono">Practice Problem</Link>
            </div>
          </div>

          {/* Resources / Links Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-gray-900/30 rounded p-4 border border-gray-700 space-y-4">
              <h4 className="font-mono font-semibold">Resources</h4>

              {/* Resources: show only available items; if none, show subtle message */}
              {lesson.youtube_link || lesson.document_link ? (
                <div>
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
                              <div className="space-y-2">
                                <div className="w-full aspect-video rounded overflow-hidden bg-black">
                                  <img src={thumb} alt="video thumbnail" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => setVideoPreview(true)} className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-sm">Preview Video</button>
                                  <a href={lesson.youtube_link} target="_blank" rel="noreferrer" className="px-3 py-2 bg-gray-700 rounded text-sm">Open YouTube</a>
                                </div>
                              </div>
                            ) : (
                              <div className="w-full aspect-video rounded overflow-hidden">
                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${vid}`} title="YouTube video" allowFullScreen frameBorder="0"></iframe>
                              </div>
                            )}
                          </div>
                        );
                      }
                    } catch (e) {}
                    return (
                      <a href={lesson.youtube_link} target="_blank" rel="noreferrer" className="block px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-sm text-center">Watch Video</a>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No resources available for this lesson</div>
              )}

              <div className="pt-2">
                <button onClick={fetchMcqs} className="w-full px-4 py-2 bg-green-600 rounded text-sm font-mono hover:bg-green-500">Solve MCQ</button>
              </div>
            </div>
          </aside>
        </div>

        {/* MCQ Quiz Section */}
        {showQuiz && mcqs && (
          <div className="mt-6 bg-gray-900/40 p-4 rounded border border-gray-700">
            <h4 className="font-mono font-semibold mb-3">Quiz — {mcqs.length} question{mcqs.length !== 1 ? 's' : ''}</h4>
            {mcqs.map((q, idx) => (
              <div key={q.id} className="mb-4">
                <div className="font-mono mb-2">{idx + 1}. {q.question}</div>
                <div className="flex flex-col gap-2">
                  {['option_a','option_b','option_c','option_d'].map((optKey) => (
                    <label key={optKey} className={`p-3 rounded border ${answers[q.id] === (optKey.slice(-1).toUpperCase()) ? 'bg-blue-700 border-transparent' : 'bg-gray-800/50 border-gray-700'}`}>
                      <input type="radio" name={`q-${q.id}`} className="mr-2" checked={answers[q.id] === optKey.slice(-1).toUpperCase()} onChange={() => handleAnswer(q.id, optKey.slice(-1).toUpperCase())} />
                      <span className="text-sm">{q[optKey]}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-2 justify-end mt-4">
              <button onClick={() => { setShowQuiz(false); setScore(null); }} className="px-3 py-2 bg-gray-700 rounded">Close</button>
              <button onClick={submitQuiz} className="px-3 py-2 bg-blue-600 rounded">Submit Answers</button>
            </div>

            {score && (
              <div className="mt-4 text-center font-mono">
                <div className="text-lg">Score: {score.correct} / {score.total}</div>
                <div className="text-sm text-gray-300">{Math.round((score.correct/score.total)*100)}% correct</div>
                <div className="mt-2">
                  {saving ? (
                    <div className="text-sm text-yellow-300">Saving result...</div>
                  ) : saveError ? (
                    <div className="text-sm text-red-400">Save error: {saveError}</div>
                  ) : savedId ? (
                    <div className="text-sm text-green-300">Result saved (id: {savedId})</div>
                  ) : (
                    <div className="text-sm text-gray-400">Result not saved</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
