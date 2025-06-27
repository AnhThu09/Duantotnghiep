import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import Home from './components/Home'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import NavBar from './components/Navbar'
import About from './pages/About'
import Account from './pages/Account'
import HeroSection from './components/HeroSection'
import CategoryList from './components/Category'
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
          {/* <Route path="/category" element={<CategoryGallery />} /> */}
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<ContactForm />} />
        </Routes>
        <CategoryList />
        <HeroSection />
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
