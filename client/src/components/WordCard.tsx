import { useState, useEffect } from 'react'
import './WordCard.css'

interface WordCardProps {
  word: string
  translation: string
}

const WordCard = ({ word, translation }: WordCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Start with the card invisible
    setIsVisible(false)
    
    // Show the card after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [word, translation])

  const handleClick = () => {
    if (isVisible) {
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div 
      className={`word-card ${isFlipped ? 'flipped' : ''} ${!isVisible ? 'sliding' : ''}`}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front">
          <span>{word}</span>
        </div>
        <div className="card-back">
          <span>{translation}</span>
        </div>
      </div>
    </div>
  )
}

export default WordCard 