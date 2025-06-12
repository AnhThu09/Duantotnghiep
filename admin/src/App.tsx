import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CategoryManager from './component/CategoryManager'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <CategoryManager/>
    </>
  )
}

export default App
