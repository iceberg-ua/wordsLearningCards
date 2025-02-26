import { useState } from 'react'
import AddWord from './components/AddWord'
import LearningMode from './components/LearningMode'
import LanguageSelector from './components/LanguageSelector'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import MatchingGame from './components/MatchingGame'
import './App.css'

function AppContent() {
  const [mode, setMode] = useState<'add' | 'learn' | 'game'>('add')
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const { selectedLanguage } = useLanguage()
  const [isAddingLanguage, setIsAddingLanguage] = useState(false)

  const handleModeChange = (newMode: 'add' | 'learn' | 'game') => {
    if ((newMode === 'learn' || newMode === 'add' || newMode === 'game') && !selectedLanguage) {
      return;
    }
    setMode(newMode);
  };

  const renderContent = () => {
    if (!selectedLanguage) {
      return (
        <div className="no-language-message">
          Please select or add a language to start
        </div>
      );
    }
    if (mode === 'add') return <AddWord />;
    if (mode === 'learn') return <LearningMode />;
    return <MatchingGame />;
  };

  return (
    <div className="app">
      <aside className={`sidebar ${isPanelCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-top">
          <LanguageSelector 
            isAddingLanguage={isAddingLanguage} 
            setIsAddingLanguage={setIsAddingLanguage}
          />
          <div className="mode-buttons">
            <button 
              className={`mode-button ${mode === 'add' ? 'active' : ''}`}
              onClick={() => handleModeChange('add')}
              disabled={!selectedLanguage}
              title={!selectedLanguage ? "Please select or add a language first" : ""}
            >
              Add Words
            </button>
            <button 
              className={`mode-button ${mode === 'learn' ? 'active' : ''}`}
              onClick={() => handleModeChange('learn')}
              disabled={!selectedLanguage}
              title={!selectedLanguage ? "Please select or add a language first" : ""}
            >
              Learning Mode
            </button>
            <button 
              className={`mode-button ${mode === 'game' ? 'active' : ''}`}
              onClick={() => handleModeChange('game')}
              disabled={!selectedLanguage}
              title={!selectedLanguage ? "Please select or add a language first" : ""}
            >
              Matching Game
            </button>
          </div>
        </div>
        <div className="sidebar-bottom">
          <button 
            className="add-language-button"
            onClick={() => setIsAddingLanguage(true)}
          >
            + Add Language
          </button>
        </div>
        <button 
          className="collapse-button"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          aria-label={isPanelCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        />
      </aside>
      <main className={`content ${isPanelCollapsed ? 'expanded' : ''}`}>
        {renderContent()}
      </main>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
