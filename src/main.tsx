import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Apply saved theme before first render to prevent flash
const saved = localStorage.getItem('grc:ui:theme')
const theme = saved ? (JSON.parse(saved) as string) : 'dark'
document.documentElement.classList.remove('dark', 'light')
document.documentElement.classList.add(theme)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
