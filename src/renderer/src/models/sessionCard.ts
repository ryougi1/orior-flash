import ApiCard from './apiCard'

interface SessionCard extends ApiCard {
  isFlipped: boolean
  hasBeenFlipped: boolean
  submittedAnswer: string
}

export default SessionCard
