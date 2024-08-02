import { SessionCard } from '@renderer/models'
import { useRef } from 'react'

interface IProps {
  card: SessionCard
  onCardFlip: () => void
}

function ImageCardComponent({ card, onCardFlip }: IProps): JSX.Element {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  if (frontRef.current && backRef.current) {
    const frontImageElement = frontRef.current.querySelector('img')
    if (frontImageElement) {
      if (card.isFlipped) {
        const frontHeight = frontImageElement.offsetHeight
        const frontWidth = frontImageElement.offsetWidth
        if (frontHeight > 0 && frontWidth > 0) {
          backRef.current.style.width = `${frontImageElement.offsetWidth}px`
          backRef.current.style.height = `${frontImageElement.offsetHeight}px`
        }
        frontRef.current.style.display = 'none'
        backRef.current.style.display = 'flex'
      } else {
        frontRef.current.style.display = 'block'
        backRef.current.style.display = 'none'
      }
    }
  }

  const onClick = (event): void => {
    onCardFlip()
    event.preventDefault()
  }

  return (
    <>
      <div onClick={onClick} className="card">
        <div className="back" ref={backRef}>
          <span>{card.back.toLocaleUpperCase()}</span>
        </div>
        <div className="front" ref={frontRef}>
          <img src={card.front} />
        </div>
      </div>
    </>
  )
}

export default ImageCardComponent
