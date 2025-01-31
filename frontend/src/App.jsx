import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'

function App() {

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  )
}

export default App
