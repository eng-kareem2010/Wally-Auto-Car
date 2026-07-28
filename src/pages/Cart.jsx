import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Cart({ cart, setCart }) {
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const updateQuantity = (id, delta) => {
    setCart((prev) => prev.map((item) => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.info('تم إزالة المنتج من السلة', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    });
  };

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    const phoneNumber = "201063277506";
    let message = "مرحباً، أرغب في إتمام طلب الشراء التالي:%0A";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (الكمية: ${item.quantity}) - السعر: ${item.price * item.quantity} جنيه%0A`;
    });
    message += `%0Aالإجمالي الكلي: ${totalPrice} جنيه`;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-gray-100">سلة المشتريات</h2>
        <Link to="/" className="text-amber-400 hover:underline text-sm">← العودة للتسوق</Link>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">سلة المشتريات فارغة تماماً.</p>
          <Link to="/" className="inline-block bg-amber-600 hover:bg-amber-500 text-white px-6 py-2.5 rounded-xl transition font-medium">
            ابدأ التسوق الآن
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="divide-y divide-gray-800">
            {cart.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-gray-950" />
                  )}
                  <div>
                    <h4 className="font-bold text-base text-gray-100">{item.name}</h4>
                    <p className="text-sm text-amber-400 font-semibold mt-1">{item.price} جنيه</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="flex items-center border border-gray-700 rounded-lg bg-gray-950 overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1 text-gray-300 hover:bg-gray-800 cursor-pointer">-</button>
                    <span className="px-4 py-1 text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1 text-gray-300 hover:bg-gray-800 cursor-pointer">+</button>
                  </div>
                  <span className="font-bold text-gray-200 min-w-[80px] text-left">{item.price * item.quantity} ج</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-sm p-2 cursor-pointer">🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-6 mt-6 flex flex-col items-start gap-4">
            <div className="flex justify-between w-full max-w-xs text-lg font-bold">
              <span className="text-gray-300">الإجمالي الكلي:</span>
              <span className="text-amber-400">{totalPrice} جنيه</span>
            </div>

            <button
              onClick={checkoutWhatsApp}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl transition font-medium flex items-center justify-center gap-2 cursor-pointer shadow-lg text-base"
            >
              إتمام الشراء عبر واتساب 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}