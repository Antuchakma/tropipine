import React from 'react'
import { Routes,Route } from 'react-router'
import HomePage from './pages/UserPages/HomePage.jsx'
import AboutPage from './pages/UserPages/AboutPage.jsx'



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}/> 
        <Route path="/about" element={<AboutPage/>}/> 
         
      </Routes>
    </div>
  )
}

export default App
