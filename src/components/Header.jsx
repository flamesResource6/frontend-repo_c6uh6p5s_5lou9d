import React from 'react'

function Header() {
  return (
    <header className="py-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <img src="/flame-icon.svg" alt="Flames" className="w-12 h-12 drop-shadow-[0_0_15px_rgba(59,130,246,0.45)]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">AI Resume Analyzer</h1>
        <p className="text-blue-200/80 mt-2">Paste your resume, add a job description, and get ATS-focused feedback</p>
      </div>
    </header>
  )
}

export default Header
