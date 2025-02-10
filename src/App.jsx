import { Routes, Route } from 'react-router-dom'
import EarnAndSpendPage from './pages/EarnAndSpendPage'
import CountryComparePage from './pages/CountryComparePage'
import CountryStatisticPage from './pages/CountryStatisticPage'
import Layout from './Layout'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<EarnAndSpendPage />} />
        <Route path="/country-compare" element={<CountryComparePage />} />
        <Route path="/country-statistics" element={<CountryStatisticPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default App