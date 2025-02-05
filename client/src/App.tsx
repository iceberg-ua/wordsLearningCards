import { useState } from 'react'
import AddWord from './components/AddWord'
import LearningMode from './components/LearningMode'
import './App.css'

function App() {
  const [mode, setMode] = useState<'add' | 'learn'>('add')
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  return (
    <div className="app">
      <aside className={`sidebar ${isPanelCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-content">
          <button 
            className={`mode-button ${mode === 'add' ? 'active' : ''}`}
            onClick={() => setMode('add')}
          >
            Add Words
          </button>
          <button 
            className={`mode-button ${mode === 'learn' ? 'active' : ''}`}
            onClick={() => setMode('learn')}
          >
            Learning Mode
          </button>
        </div>
        <button 
          className="collapse-button"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          aria-label={isPanelCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        />
      </aside>
      <main className="content">
        {mode === 'add' ? <AddWord /> : <LearningMode />}
      </main>
    </div>
  )
}

export default App
