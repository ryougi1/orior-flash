import Versions from './Versions'
import electronLogo from '../assets/electron.svg'
import { useEffect, useState } from 'react'
import { ApiDeck } from '@renderer/models'
import supabaseClient from '@renderer/api/supabaseClient'
import { Link } from 'react-router-dom'

function Home(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
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
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>

      <ul>
        {decks.map((item) => (
          <li key={item.id}>
            <Link to="/session" state={{ deckId: item.id }}>
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Versions></Versions>
    </>
  )
}

export default Home
