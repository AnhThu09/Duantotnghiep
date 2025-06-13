import { useState } from 'react'
import './App.css'
import NavBar from './component/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <NavBar/>
      <Routes>
          {/* <Route path="/about" element={<CategoryManager />} /> */}
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
