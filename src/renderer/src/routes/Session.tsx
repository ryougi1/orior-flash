import supabaseClient from '@renderer/api/supabaseClient'
import { SessionCard } from '@renderer/models'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ImageCardComponent from '../components/ImageCardComponent'

function Session(): JSX.Element {
  const { state } = useLocation()
  const [cards, setCards] = useState<SessionCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)
  const [isFinished, setIsFinished] = useState<boolean>(false)

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
        return { ...card, isFlipped: false, hasBeenFlipped: false, isCorrectAnswer: null }
      })
      setCards(initialCards)
      setCurrentCardIndex(0)
    }
    fetchDeckData().catch(console.error)
  }, [])

  const navigate = (nav: number): void => {
    const newIndex = currentCardIndex + nav
    if (newIndex <= cards.length - 1 && newIndex >= 0) {
      console.log('setting new index to', newIndex)
      setCurrentCardIndex(currentCardIndex + nav)
    }
  }

  const flipCard = (): void => {
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

  const markAnswer = (isCorrectAnswer: boolean): void => {
    setCards(
      cards.map((card, index) => {
        if (index === currentCardIndex) {
          card.isCorrectAnswer = isCorrectAnswer
        }
        return card
      })
    )
    navigate(1)
  }

  return (
    <div className="session">
      <div className="header">
        <Link to="/">
          <p>Back to home</p>
        </Link>
      </div>

      {isFinished ? (
        <div className="post-session body">
          RESULTS:
          {cards.filter((card) => card.isCorrectAnswer === true).length} / {cards.length}
          <ul>
            {cards.map((item, index) => (
              <li key={item.id}>
                <div>Question: {index}</div>
                <div>{item.back}</div>
                <div>Answer: {item.isCorrectAnswer ? 'Correct' : 'Incorrect'}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="body">
          <p>
            Card: {currentCardIndex + 1}/{cards.length}
          </p>

          <div>
            <button onClick={() => navigate(-1)} disabled={currentCardIndex === 0}>
              Back
            </button>
            <button onClick={() => navigate(1)} disabled={currentCardIndex === cards.length - 1}>
              Next
            </button>
          </div>

          {cards.length > 0 ? (
            <ImageCardComponent card={cards[currentCardIndex]} onCardFlip={() => flipCard()} />
          ) : (
            <div></div>
          )}

          {cards?.length > 0 && cards[currentCardIndex].isCorrectAnswer === null ? (
            <div>
              <p>Mark as correct?</p>
              <button onClick={() => markAnswer(true)}>Yes</button>
              <button onClick={() => markAnswer(false)}>No</button>
            </div>
          ) : (
            <></>
          )}

          {cards?.length > 0 &&
          cards.filter((card) => card.isCorrectAnswer === null).length === 0 ? (
            <button onClick={() => setIsFinished(true)}> Finish</button>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  )
}

export default Session
