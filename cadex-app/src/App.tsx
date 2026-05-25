import { useDealStore } from './store/dealStore'
import Home from './pages/Home'
import Assessment from './pages/Assessment'

export default function App() {
  const { getActiveDeal } = useDealStore()
  return getActiveDeal() ? <Assessment /> : <Home />
}
