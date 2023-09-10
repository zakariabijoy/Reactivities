import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/layout/App.tsx'
import 'semantic-ui-css/semantic.min.css'
import './app/layout/styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
