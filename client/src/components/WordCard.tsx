import { useState } from 'react'
import './WordCard.css'

interface WordCardProps {
  word: string
  translation: string
}

const WordCard = ({ word, translation }: WordCardProps) => {
  const [showTranslation, setShowTranslation] = useState(false)

  return (
    <div 
      className={`word-card ${showTranslation ? 'flipped' : ''}`}
      onClick={() => setShowTranslation(!showTranslation)}
    >
      <div className="card-inner">
        <div className="card-front">
          <h3>{word}</h3>
        </div>
        <div className="card-back">
          <h3>{translation}</h3>
        </div>
      </div>
    </div>
  )
}

export default WordCard 