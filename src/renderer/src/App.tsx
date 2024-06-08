import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './routes/Home'
import Session from './routes/Session'

function App(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
      </Routes>
    </HashRouter>
  )
}

export default App
