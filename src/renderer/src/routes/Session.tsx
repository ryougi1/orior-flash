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
      const { data: deckCards, error: deckCardsError } = await supabaseClient
        .from('decks_cards')
        .select('card_id')
        .eq('deck_id', state.deckId)

      if (deckCardsError) {
        console.error('Error fetching deck:', deckCardsError)
        return
      } else if (deckCards.length === 0) {
        console.error('No cards found for the given deck', state.deckId)
      }

      const cardIds = deckCards.map((deckCard) => deckCard.card_id)
      const { data: cards, error: cardsError } = await supabaseClient
        .from('cards')
        .select('*')
        .in('id', cardIds)

      if (cardsError) {
        console.error('Error fetching cards:', cardsError)
        return
      }

      let initialCards = cards.map((card) => {
        return { ...card, isFlipped: false, hasBeenFlipped: false, isCorrectAnswer: null }
      })
      initialCards = shuffle(initialCards)
      setCards(initialCards)
      setCurrentCardIndex(0)
    }
    fetchDeckData().catch(console.error)
  }, [])

  const navigate = (nav: number): void => {
    const newIndex = currentCardIndex + nav
    if (newIndex <= cards.length - 1 && newIndex >= 0) {
      setCurrentCardIndex(currentCardIndex + nav)
      console.log(cards[currentCardIndex + nav])
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

  const shuffle = (cards: SessionCard[]): SessionCard[] => {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cards[i], cards[j]] = [cards[j], cards[i]]
    }
    return cards
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
          {/* <ul>
            {cards.map((item, index) => (
              <li key={item.id}>
                <div>Question: {index}</div>
                <div>{item.back}</div>
                <div>Answer: {item.isCorrectAnswer ? 'Correct' : 'Incorrect'}</div>
              </li>
            ))}
          </ul> */}
        </div>
      ) : (
        <div className="body">
          {cards.length > 0 ? (
            <ImageCardComponent card={cards[currentCardIndex]} onCardFlip={() => flipCard()} />
          ) : (
            <div></div>
          )}

          <p>
            Card: {currentCardIndex + 1}/{cards.length}
          </p>

          {/* MARK CORRECT/INCORRECT SECTION */}
          {cards?.length > 0 && cards[currentCardIndex].isCorrectAnswer === null ? (
            <div className="marking-section">
              <div>Mark as correct?</div>
              <div className="button-container">
                <button onClick={() => markAnswer(true)}>Yes</button>
                <button onClick={() => markAnswer(false)}>No</button>
              </div>
            </div>
          ) : (
            <></>
          )}

          {/* NAVIGATION SECTION */}
          <div className="navigation-section">
            <button onClick={() => navigate(-1)} disabled={currentCardIndex === 0}>
              Back
            </button>
            <button onClick={() => navigate(1)} disabled={currentCardIndex === cards.length - 1}>
              Next
            </button>
          </div>

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
