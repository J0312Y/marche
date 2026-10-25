import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Tester from './Tester'
import './site.css'

const page = window.location.pathname.replace(/\/+$/, '') === '/tester' ? <Tester /> : <App />
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {page}
  </React.StrictMode>
)
