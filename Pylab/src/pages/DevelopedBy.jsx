import React from 'react';

export default function DevelopedBy(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16">
      <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 rounded-lg p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold">SG</div>
          <div>
            <h1 className="text-3xl font-bold font-mono">Sandhosh G</h1>
            <p className="text-sm text-gray-400">Full-stack developer • Python & Web • Creator of PyLearn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="font-mono font-semibold text-lg">About</h3>
            <p className="text-gray-300 text-sm">I build learning tools and interactive experiences focused on teaching programming. PyLearn is a lightweight platform I created to help beginners learn Python with lessons, quizzes and coding challenges.</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-mono font-semibold text-lg">Contact & Links</h3>
            <div className="flex flex-col gap-2">
              <a className="text-blue-400 hover:underline" href="https://github.com/SANDHOSH02" target="_blank" rel="noreferrer">GitHub: github.com/SANDHOSH02</a>
              <a className="text-blue-400 hover:underline" href="https://sandhosh.vercel.app/" target="_blank" rel="noreferrer">Portfolio</a>
              <a className="text-blue-400 hover:underline" href="https://www.linkedin.com/in/sandhosh-g-884b7b279/" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/40 border border-gray-700 rounded-lg p-4">
          <h4 className="font-mono font-semibold mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {['React', 'Vite', 'Node.js', 'Express', 'MySQL', 'Pyodide', 'Tailwind-like'].map(t => (
              <span key={t} className="px-3 py-1 bg-gray-900/30 border border-gray-700 rounded text-sm">{t}</span>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">Thanks for trying out PyLearn — feel free to reach out on GitHub or LinkedIn for collaborations, feedback or opportunities.</div>
      </div>
    </div>
  );
}
