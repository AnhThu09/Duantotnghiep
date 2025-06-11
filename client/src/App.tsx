import { useState } from 'react'
import './App.css'
import NavBar from './component/Navbar'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './component/Mau'
import ProductCategories from './component/Danhmuc'
import CategoryList from './component/CategoryList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <NavBar/>
      <Routes>
          <Route path="/about" element={<ProductCategories />} />
          <Route path="/about" element={<About />} />
          <Route path="/duan" element={<CategoryList />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
