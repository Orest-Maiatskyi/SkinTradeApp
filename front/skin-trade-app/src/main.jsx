import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

import { AppProvider } from './AppProvider.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
    <AppProvider>
      <App />
    </AppProvider>
)
