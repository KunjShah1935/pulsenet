import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RoleProvider } from './context/RoleContext'
import { ThemeProvider } from './context/ThemeContext' // ✅ ADD

if (window.location.pathname === "/") {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "/landing.html";
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>      
      <RoleProvider>
        <App />
      </RoleProvider>
    </ThemeProvider>
  </StrictMode>,
)