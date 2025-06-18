import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Home from './components/Home'
import Footer from './components/Footer'
import Header from './components/Header'
import NavBar from './components/Navbar'
import Account from './pages/Account'
import About from './pages/About'
import ContactForm from './components/ContactForm'
function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
            <Route path="/about" element={<About />} />
            {/* <Route path="/brand" element={<ThuongHieu />} /> */}
            {/* <Route path="/km" element={<KhuyenMai />} /> */}
            {/* <Route path="/contact" element={<Blog />} /> */}
            {/* <Route path="/categories" element={<Contact />} /> */}
            {/* <Route path="/favorites" element={<Favorites />} /> */}
            {/* <Route path="/cart" element={<Cart />} /> */}
            <Route path="/account" element={<Account />} />
            <Route path="/contact" element={<ContactForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
