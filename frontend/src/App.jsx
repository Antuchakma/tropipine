import React from 'react'
import { Routes,Route } from 'react-router'
import HomePage from './pages/UserPages/HomePage.jsx'
import AboutPage from './pages/UserPages/AboutPage.jsx'
import GalleryPage from './pages/UserPages/GalleryPage.jsx'



const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage/>}/> 
        <Route path="/about" element={<AboutPage/>}/> 
        <Route path="/gallery" element={<GalleryPage/>}/> 
        
         
      </Routes>
    </div>
  )
}

export default App
