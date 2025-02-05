import { useState } from 'react'
import './AddWord.css'

const AddWord = () => {
  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:5000/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, translation }),
      })
      
      if (response.ok) {
        setWord('')
        setTranslation('')
        setMessage('Word added successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      setMessage('Error adding word. Please try again.')
      console.error('Error adding word:', error)
    }
  }

  return (
    <div className="add-word">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter word"
          required
        />
        <input
          type="text"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Enter translation"
          required
        />
        <button type="submit">Add Word</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  )
}

export default AddWord
