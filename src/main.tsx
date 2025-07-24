import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SocketProvider } from './components/socketProvider.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>,
)
