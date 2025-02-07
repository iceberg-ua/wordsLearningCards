import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import WordCard from './WordCard'
import './LearningMode.css'

interface Word {
  id: string;
  word: string;
  translation: string;
}

const LearningMode = () => {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { selectedLanguage } = useLanguage()

  useEffect(() => {
    if (selectedLanguage) {
      fetchWords()
    }
  }, [selectedLanguage])

  const shuffleArray = (array: Word[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const fetchWords = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/words/${selectedLanguage?.id}`)
      const data = await response.json()
      const shuffledWords = shuffleArray(data)
      setWords(shuffledWords)
      setCurrentIndex(0)
      setLoading(false)
    } catch (error) {
      setError('Error loading words. Please try again later.')
      setLoading(false)
      console.error('Error fetching words:', error)
    }
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < words.length - 1 ? prev + 1 : prev))
  }

  if (loading) return <div className="message">Loading...</div>
  if (error) return <div className="error">{error}</div>
  if (words.length === 0) return <div className="message">No words added yet. Add some words first!</div>

  return (
    <div className="learning-mode">
      <div className="card-container">
        <WordCard
          word={words[currentIndex].word}
          translation={words[currentIndex].translation}
        />
      </div>
      <div className="navigation-controls">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          Previous
        </button>
        <span className="card-counter">
          {currentIndex + 1} / {words.length}
        </span>
        <button 
          onClick={handleNext} 
          disabled={currentIndex === words.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default LearningMode 