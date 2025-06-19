import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Home from './components/Home'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import NavBar from './components/Navbar'
import About from './pages/About'
import Account from './pages/Account'
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
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
