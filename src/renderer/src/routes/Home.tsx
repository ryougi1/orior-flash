import { useEffect, useState } from 'react'
import { ApiDeck } from '@renderer/models'
import supabaseClient from '@renderer/api/supabaseClient'
import { Link } from 'react-router-dom'

function Home(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [decks, setDecks] = useState<ApiDeck[]>([])

  useEffect(() => {
    fetchAllDecks()
  }, [])

  const fetchAllDecks = async (): Promise<void> => {
    const { data: decks, error } = await supabaseClient
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) console.error('Error fetching data:', error)
    else setDecks(decks || [])
  }

  return (
    <>
      <div className="main-menu-container">
        <div className="title">AVAILABLE DECKS</div>
        <ul>
          {decks.map((item) => (
            <li key={item.id}>
              <Link to="/session" state={{ deckId: item.id }}>
                <span className="deck-title">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Home
