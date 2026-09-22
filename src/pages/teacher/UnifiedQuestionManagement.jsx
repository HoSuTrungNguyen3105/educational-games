import { useState, useEffect } from 'react'
import { useRoute } from '../../lib/router.js'
import QuestionManagement from './QuestionManagement.jsx'
import AllQuestionsManagement from './AllQuestionsManagement.jsx'

export default function UnifiedQuestionManagement({ showToast }) {
  const route = useRoute()
  const initial = route.name === 'admin-all-questions' ? 'all' : 'byGame'
  const [tab, setTab] = useState(initial) // 'byGame' | 'all'
  useEffect(() => {
    setTab(route.name === 'admin-all-questions' ? 'all' : 'byGame')
  }, [route.name])

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-ink/5 w-fit">
        <button
          onClick={() => setTab('byGame')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'byGame' ? 'bg-white shadow text-ink border border-ink/10' : 'text-ink/60 hover:text-ink'}`}
        >
          Theo game
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${tab === 'all' ? 'bg-white shadow text-ink border border-ink/10' : 'text-ink/60 hover:text-ink'}`}
        >
          Tất cả câu hỏi
        </button>
      </div>
      {tab === 'byGame' ? (
        <QuestionManagement showToast={showToast} />
      ) : (
        <AllQuestionsManagement showToast={showToast} />
      )}
    </div>
  )
}
