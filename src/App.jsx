import { Routes, Route } from 'react-router-dom'
import EarnAndSpendPage from './pages/EarnAndSpendPage'
import CountryComparePage from './pages/CountryComparePage'
import CountryStatisticPage from './pages/CountryStatisticPage'
import BudgetVisualizerPage from './pages/BudgetVisualizerPage'
import InformationPage from './pages/InformationPage'
import Layout from './Layout'
import { useContext } from 'react'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<EarnAndSpendPage />} />
        <Route path="/country-compare" element={<CountryComparePage />} />
        <Route path="/country-statistics/country?" element={<CountryStatisticPage />} />
        <Route path="/budget-visualizer" element={<BudgetVisualizerPage />} />
        <Route path="/information" element={<InformationPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default App