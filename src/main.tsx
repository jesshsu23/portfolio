import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/montserrat'
import './index.css'
import App from './App.tsx'

// Noto Sans TC is ~100 unicode-range faces; loading its CSS async keeps it
// out of the render-blocking stylesheet (text swaps in once it arrives).
void import('@fontsource-variable/noto-sans-tc')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
