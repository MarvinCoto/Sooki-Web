import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Products from './pages/Products'
import Categories from './pages/Categories'
import Stores from './pages/Stores'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Nav />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/contactUs" element={<ContactUs />} />
            {/* Aquí irán las demás rutas conforme las vayas creando */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;