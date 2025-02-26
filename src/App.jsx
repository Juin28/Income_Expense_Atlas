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
        <Route path="/DH2321_Project" element={<EarnAndSpendPage />} />
        {/* <Route index element={<EarnAndSpendPage />} /> */}
        <Route path="/DH2321_Project/country-compare" element={<CountryComparePage />} />
        <Route path="/DH2321_Project/country-statistics/country?" element={<CountryStatisticPage />} />
        <Route path="/DH2321_Project/budget-visualizer" element={<BudgetVisualizerPage />} />
        <Route path="/DH2321_Project/information" element={<InformationPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default App