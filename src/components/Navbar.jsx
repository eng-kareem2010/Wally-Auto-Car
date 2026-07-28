import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import logoImg from '../assets/logo.jpg'; 

export default function Navbar({ cart }) {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav 
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} 
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 shadow-lg h-16"
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        
        <Link to="/" className="flex items-center h-full py-0 my-0">
          <img 
            src={logoImg} 
            alt="Car Shop Logo" 
            className="h-full w-auto object-cover m-0 p-0 block" 
          />
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/"
            className="text-gray-300 hover:text-white transition text-sm font-medium"
          >
            {i18n.language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>

          <Link 
            to="/cart"
            className="relative bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faBagShopping} className="text-amber-400" />
            <span>{i18n.language === 'ar' ? 'سلة المشتريات' : 'Cart'}</span>
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-gray-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </Link>

          <Link to="/admin/login" className="text-gray-300 hover:text-white transition text-sm">{t('admin')}</Link>
          
          <button 
            onClick={toggleLanguage}
            className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-700 transition cursor-pointer"
          >
            {i18n.language === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link 
            to="/cart"
            className="relative bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-sm text-amber-400 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faBagShopping} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-gray-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </Link>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-gray-800 border border-gray-700 p-2.5 rounded-lg text-gray-300 hover:text-white transition cursor-pointer"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} className="text-lg" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800 px-6 py-5 space-y-4 shadow-xl">
          <Link 
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white transition text-sm font-medium py-1"
          >
            {i18n.language === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>

          <Link 
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition text-sm font-medium py-1"
          >
            <FontAwesomeIcon icon={faBagShopping} className="text-amber-400" />
            <span>{i18n.language === 'ar' ? 'سلة المشتريات' : 'Cart'}</span>
          </Link>

          <Link 
            to="/admin/login"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-gray-300 hover:text-white transition text-sm py-1"
          >
            {t('admin')}
          </Link>

          <div className="pt-2 border-t border-gray-800">
            <button 
              onClick={() => { toggleLanguage(); setMobileMenuOpen(false); }}
              className="w-full bg-gray-800 border border-gray-700 px-3 py-2 rounded text-sm text-center hover:bg-gray-700 transition cursor-pointer text-gray-200"
            >
              {i18n.language === 'ar' ? 'English' : 'عربي'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}