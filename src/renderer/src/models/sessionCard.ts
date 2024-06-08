import ApiCard from './apiCard'

interface SessionCard extends ApiCard {
  isFlipped: boolean
  hasBeenFlipped: boolean
  isCorrectAnswer: boolean | null
}

export default SessionCard
