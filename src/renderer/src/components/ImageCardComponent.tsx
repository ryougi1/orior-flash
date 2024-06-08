import { SessionCard } from '@renderer/models'

interface IProps {
  card: SessionCard
  onCardFlip: () => void
}

function ImageCardComponent({ card, onCardFlip }: IProps): JSX.Element {
  const onClick = (event): void => {
    onCardFlip()
    event.preventDefault()
  }

  return (
    <>
      <div onClick={onClick} className="card">
        {card.isFlipped ? (
          <div className="back">
            <div>{card.back} </div>
          </div>
        ) : (
          <img src={card.front} width={400} height={400} />
        )}
      </div>
    </>
  )
}

export default ImageCardComponent
