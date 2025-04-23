import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MotivationApp from './MotivationApp.jsx'

const rootElement = document.getElementById('root')
const reactRoot = createRoot(rootElement)

reactRoot.render(
  <StrictMode>
    <MotivationApp />
  </StrictMode>,
)