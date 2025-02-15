import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './MatchingGame.css';

interface Card {
  id: string;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'word' | 'translation';
  pairId: string;
}

const MatchingGame = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    if (selectedLanguage) {
      fetchWords();
    }
  }, [selectedLanguage]);

  const fetchWords = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/words/${selectedLanguage?.id}`);
      const words = await response.json();
      
      // Take first 6 words for the game (12 cards total)
      const gameWords = words.slice(0, 6);
      
      const gameCards: Card[] = [];
      gameWords.forEach(word => {
        // Add word card
        gameCards.push({
          id: `word-${word.id}`,
          content: word.word,
          isFlipped: false,
          isMatched: false,
          type: 'word',
          pairId: word.id
        });
        // Add translation card
        gameCards.push({
          id: `translation-${word.id}`,
          content: word.translation,
          isFlipped: false,
          isMatched: false,
          type: 'translation',
          pairId: word.id
        });
      });

      // Shuffle cards
      const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching words:', error);
      setIsLoading(false);
    }
  };

  const handleCardClick = (clickedCard: Card) => {
    if (clickedCard.isMatched || clickedCard.isFlipped || flippedCards.length >= 2) {
      return;
    }

    // Flip the card
    const updatedCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(updatedCards);

    const newFlippedCards = [...flippedCards, clickedCard];
    setFlippedCards(newFlippedCards);

    // If we have 2 cards flipped, check for a match
    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      
      if (firstCard.pairId === secondCard.pairId) {
        // Match found
        setTimeout(() => {
          setCards(cards =>
            cards.map(card =>
              card.pairId === firstCard.pairId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          
          // Check if game is won
          const allMatched = updatedCards.every(card => 
            card.isMatched || card.pairId === firstCard.pairId
          );
          if (allMatched) {
            setGameWon(true);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(cards =>
            cards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setGameWon(false);
    setFlippedCards([]);
    fetchWords();
  };

  if (isLoading) {
    return <div className="message">Loading...</div>;
  }

  return (
    <div className="matching-game">
      {gameWon ? (
        <div className="game-won">
          <h2>Congratulations!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map(card => (
            <div
              key={card.id}
              className={`game-card ${card.isFlipped ? 'flipped' : ''} ${
                card.isMatched ? 'matched' : ''
              }`}
              data-type={card.type}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-front" />
                <div className="card-back">
                  <span>{card.content}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchingGame; 