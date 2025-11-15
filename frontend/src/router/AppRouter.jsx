import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'



//Pages
import LandingPage from '../pages/LandingPage.jsx'

const AppRouter = () => {
  return (
    <BrowserRouter>
        <Routes>

            {/*Public Routes*/}
            <Route path='/' element={<LandingPage />} />
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter