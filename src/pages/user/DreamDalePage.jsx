import { lazy, Suspense } from 'react'
import { navigate } from '../../lib/router.js'
import { Loader } from '../../components/ui.jsx'
import { ArrowLeft } from 'lucide-react'
import '../../components/dreamdale-react/src/DreamDale.css'

const DreamDaleApp = lazy(() => import('../../components/dreamdale-react/src/DreamDale.jsx'))

export default function DreamDalePage({ userAuth, onUserLogout }) {
  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-900 to-indigo-900 text-white shrink-0 z-10">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-sm font-bold">DreamDale</h1>
      </div>
      <div className="flex-1 min-h-0">
        <Suspense fallback={<div className="h-full flex items-center justify-center bg-black"><Loader label="Đang tải DreamDale..." /></div>}>
          <DreamDaleApp />
        </Suspense>
      </div>
    </div>
  )
}
