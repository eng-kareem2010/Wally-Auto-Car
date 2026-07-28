import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import bgVideo from './assets/bgVideo.mp4';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('car_shop_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('car_shop_cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <Router>
      <div className="relative min-h-screen w-full bg-gray-950 text-white overflow-x-hidden">
        
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-95">
            <source src={bgVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gray-950/85"></div>
        </div>

        <Navbar cart={cart} />

        <main className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-12 w-full">
          <Routes>
            <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
            <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}