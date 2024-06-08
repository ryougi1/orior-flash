import { SessionCard } from '@renderer/models'

interface IProps {
  card: SessionCard
  onCardFlip: () => void
}

function ImageCard({ card, onCardFlip }: IProps): JSX.Element {
  const onClick = (event): void => {
    onCardFlip()
    event.preventDefault()
  }

  return (
    <>
      <div onClick={onClick}>
        {card.isFlipped ? <div>{card.back}</div> : <img src={card.front} />}
      </div>
    </>
  )
}

export default ImageCard
