import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDealStore } from './store/dealStore'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import { decodeDealFromUrl, clearDealFromUrl } from './lib/dealIO'

function DealRoute() {
  const { getActiveDeal, importDeal } = useDealStore()

  useEffect(() => {
    const hash = window.location.hash
    if (hash.includes('share=') || hash.match(/^#deal=/)) {
      const deal = decodeDealFromUrl()
      if (deal) {
        importDeal(deal)
        clearDealFromUrl()
      }
    }
  }, [importDeal])

  if (!getActiveDeal()) return <Navigate to="/" replace />
  return <Assessment />
}

function HomeRoute() {
  return <Home />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/deal" element={<DealRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
