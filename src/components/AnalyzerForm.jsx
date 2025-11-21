import React, { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function AnalyzerForm() {
  const [resume, setResume] = useState('')
  const [job, setJob] = useState('')
  const [email, setEmail] = useState('')
  const [premium, setPremium] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const analyze = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${BACKEND}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resume, job_description: job, email: email || undefined, premium })
      })
      if (!res.ok) throw new Error('Analysis failed')
      const data = await res.json()
      setResult(data)
      await loadHistory()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const loadHistory = async () => {
    try {
      const url = email ? `${BACKEND}/history?email=${encodeURIComponent(email)}` : `${BACKEND}/history`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setHistory(data)
      }
    } catch (e) {
      // ignore
    }
  }

  const premiumBadge = (
    <span className="ml-2 inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 ring-1 ring-amber-400/30">Premium</span>
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <label className="block text-sm text-blue-200 mb-2">Resume</label>
          <textarea value={resume} onChange={e => setResume(e.target.value)} placeholder="Paste your resume here..." rows={10} className="w-full bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-blue-50 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
          <label className="block text-sm text-blue-200 mb-2">Target Job Description (optional)</label>
          <textarea value={job} onChange={e => setJob(e.target.value)} placeholder="Paste the job description to tailor your analysis..." rows={6} className="w-full bg-slate-900/60 border border-slate-700 rounded-lg p-3 text-blue-50 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
          <div className="flex-1 w-full">
            <label className="block text-sm text-blue-200 mb-1">Email (optional)</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-slate-900/60 border border-slate-700 rounded-lg p-2.5 text-blue-50 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <label className="inline-flex items-center gap-2 text-blue-100 cursor-pointer select-none">
            <input type="checkbox" checked={premium} onChange={() => setPremium(!premium)} className="accent-amber-400" />
            <span className="font-medium">Enable premium analysis</span>
            {premiumBadge}
          </label>
        </div>

        <div className="flex gap-3">
          <button onClick={analyze} disabled={loading || !resume} className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/40 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">{loading ? 'Analyzing...' : 'Analyze Resume'}</button>
          <button onClick={loadHistory} className="px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-blue-100">Load History</button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg px-4 py-2">{error}</div>
        )}
      </div>

      <div className="space-y-4">
        {result ? (
          <div className="space-y-4">
            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-blue-100 font-semibold">Overall ATS Score</h3>
                <span className="text-2xl font-bold text-white">{result.ats_score}/100</span>
              </div>
              <div className="mt-2 h-2 w-full bg-slate-900 rounded">
                <div className="h-2 rounded bg-gradient-to-r from-amber-400 to-emerald-400" style={{ width: `${result.ats_score}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-100 font-semibold mb-2">Keywords</h4>
                <p className="text-sm text-blue-200/80">Match rate: {(result.keyword_match_rate*100).toFixed(0)}%</p>
                <div className="mt-2 text-sm text-blue-100">
                  <p className="mb-1"><span className="text-emerald-300 font-medium">Matched:</span> {result.matched_keywords?.join(', ') || '—'}</p>
                  <p><span className="text-rose-300 font-medium">Missing:</span> {result.missing_keywords?.join(', ') || '—'}</p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
                <h4 className="text-blue-100 font-semibold mb-2">Readability</h4>
                <ul className="text-sm text-blue-200/80 space-y-1">
                  <li>Words: {result.readability?.words}</li>
                  <li>Avg sentence length: {result.readability?.avg_sentence_len}</li>
                  <li>Avg word length: {result.readability?.avg_word_len}</li>
                  <li>Bullet points: {result.readability?.bullet_points}</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <h4 className="text-blue-100 font-semibold mb-2">Section Check</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                {Object.entries(result.sections || {}).map(([k, v]) => (
                  <div key={k} className={`px-2 py-1 rounded border text-center ${v === 'present' ? 'border-emerald-500/30 text-emerald-200 bg-emerald-500/10' : 'border-rose-500/30 text-rose-200 bg-rose-500/10'}`}>
                    {k}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <h4 className="text-blue-100 font-semibold mb-2">Recommendations {premium && premiumBadge}</h4>
              <ul className="list-disc pl-5 space-y-1 text-blue-100 text-sm">
                {result.recommendations?.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
              <h4 className="text-blue-100 font-semibold mb-2">Suggested Highlights</h4>
              <ul className="list-disc pl-5 space-y-1 text-blue-100 text-sm">
                {result.highlights?.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/40 border border-blue-500/10 rounded-xl p-6 text-blue-200/80">
            Results will appear here after analysis.
          </div>
        )}

        {history?.length > 0 && (
          <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-blue-100 font-semibold">Recent Analyses</h4>
              <span className="text-xs text-blue-300/60">{history.length} items</span>
            </div>
            <div className="space-y-2 max-h-64 overflow-auto pr-2">
              {history.map((h, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">Score: <span className="font-semibold text-white">{h.ats_score}</span></span>
                    <span className="text-blue-300/70">Match: {Math.round((h.keyword_match_rate||0)*100)}%</span>
                  </div>
                  <div className="mt-1 text-xs text-blue-300/70 truncate">Missing: {h.missing_keywords?.slice(0,6).join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalyzerForm
