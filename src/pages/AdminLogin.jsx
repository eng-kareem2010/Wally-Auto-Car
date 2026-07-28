import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // تم إضافة i18n هنا

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } else {
      toast.success('تم تسجيل الدخول بنجاح', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-900/80 border border-gray-800 p-8 rounded-2xl shadow-xl backdrop-blur-md">
      <h2 className="text-3xl font-bold mb-6 text-amber-500 text-center tracking-wide">{t('login')}</h2>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className={`block text-sm font-medium text-gray-300 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('email')}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium text-gray-300 mb-2 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
            {t('password')}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/10 cursor-pointer mt-2"
        >
          {t('loginBtn')}
        </button>
      </form>
    </div>
  );
}