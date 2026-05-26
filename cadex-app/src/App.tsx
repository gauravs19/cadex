import { useEffect } from 'react'
import { useDealStore } from './store/dealStore'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import { decodeDealFromUrl, clearDealFromUrl } from './lib/dealIO'

export default function App() {
  const { getActiveDeal, importDeal } = useDealStore()

  // On first load, check if URL contains a shared deal
  useEffect(() => {
    if (window.location.hash.includes('deal=')) {
      const deal = decodeDealFromUrl()
      if (deal) {
        importDeal(deal)
        clearDealFromUrl()
      }
    }
  }, [importDeal])

  return getActiveDeal() ? <Assessment /> : <Home />
}
