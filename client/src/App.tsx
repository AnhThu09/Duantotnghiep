import { useState } from 'react'
import './App.css'
import NavBar from './component/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CategoryManager from '../../admin/src/component/CategoryManager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <NavBar/>
      <Routes>
          {/* <Route path="/about" element={< />} /> */}
            <Route path="/categories" element={<CategoryManager/>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
