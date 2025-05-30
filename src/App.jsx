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
        <Route path="/Income_Expense_Atlas" element={<EarnAndSpendPage />} />
        {/* <Route index element={<EarnAndSpendPage />} /> */}
        <Route path="/Income_Expense_Atlas/country-compare" element={<CountryComparePage />} />
        <Route path="/Income_Expense_Atlas/country-statistics/country?" element={<CountryStatisticPage />} />
        <Route path="/Income_Expense_Atlas/budget-visualizer" element={<BudgetVisualizerPage />} />
        <Route path="/Income_Expense_Atlas/information" element={<InformationPage />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Route>
    </Routes>
  )
}

export default App