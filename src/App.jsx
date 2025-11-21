import Header from './components/Header'
import AnalyzerForm from './components/AnalyzerForm'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <Header />
        <main className="pb-8">
          <AnalyzerForm />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
