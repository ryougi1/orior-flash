import supabaseClient from '@renderer/api/supabaseClient'
import { SessionCard } from '@renderer/models'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ImageCard from './ImageCard'

function Session(): JSX.Element {
  const { state } = useLocation()
  const [cards, setCards] = useState<SessionCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)

  useEffect(() => {
    const fetchDeckData = async (): Promise<void> => {
      const { data, error } = await supabaseClient
        .from('cards')
        .select('*')
        .eq('deck_id', state.deckId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching data:', error)
        return
      }
      const initialCards = data.map((card) => {
        return { ...card, isFlipped: false, hasBeenFlipped: false, submittedAnswer: '' }
      })
      setCards(initialCards)
      setCurrentCardIndex(0)
    }
    fetchDeckData().catch(console.error)
  }, [])

  useEffect(() => {
    console.log('Deck updated:', cards)
  }, [cards])
  useEffect(() => {
    console.log('Index updated', currentCardIndex)
  }, [currentCardIndex])

  const handleCardFlip = (): void => {
    console.log('SESSION: onCardFlip')
    setCards(
      cards.map((card, index) => {
        if (index === currentCardIndex) {
          card.isFlipped = !card.isFlipped
          card.hasBeenFlipped = true
        }
        return card
      })
    )
  }

  return (
    <>
      <span>Number of cards: {cards.length}</span>
      <span>Current card: {currentCardIndex + 1}</span>

      {cards.length > 0 ? (
        <ImageCard card={cards[currentCardIndex]} onCardFlip={() => handleCardFlip()} />
      ) : (
        <div></div>
      )}
      {/* <ul>
        {cards.map((item) => (
          <li key={item.id}>
            <div>Front: {item.front}</div>
            <div>Back: {item.back}</div>
            <div>Is flipped: {item.isFlipped ? 'true' : 'false'}</div>
            <div>Has been flipped: {item.hasBeenFlipped ? 'true' : 'false'}</div>
            <div>Answer: {item.submittedAnswer}</div>
          </li>
        ))}
      </ul> */}
    </>
  )
}

export default Session
