import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faTruckFast, 
  faHeadset, 
  faShoppingCart,
  faLocationDot,
  faClock,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { 
  faWhatsapp, 
  faFacebook, 
  faTiktok 
} from '@fortawesome/free-brands-svg-icons';

export default function Home({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const categories = [
    { id: 'all', nameAr: 'الكل', nameEn: 'All' },
    { id: 'ليد', nameAr: 'مصابيح ليد و عدسات', nameEn: 'LED Head Lights & Lenses' },
    { id: 'كماليات', nameAr: 'كماليات وإكسسوارات', nameEn: 'Accessories & Extra' },
    { id: 'قطع غيار', nameAr: 'قطع غيار', nameEn: 'Spare Parts' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  const filterByCategory = (product, catId) => {
    if (catId === 'all') return true;
    if (catId === 'ليد' ) {
      return product.category === 'ليد' || product.category === 'عدسات';
    }
    if (catId === 'كماليات') {
      return product.category === 'كماليات' || product.category === 'اكسسورات';
    }
    return product.category === catId;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterByCategory(product, selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingIndex > -1) {
        return prevCart.map((item, index) => 
          index === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    toast.success(isAr ? 'تم إضافة المنتج إلى السلة بنجاح' : 'Product added to cart successfully! 🛒', {
      position: isAr ? 'bottom-left' : 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark',
    });
  };

  if (loading) {
    return (
      <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <FontAwesomeIcon icon={faSpinner} className="text-amber-500 text-4xl animate-spin" />
        <p className="text-gray-400 font-medium text-lg">
          {isAr ? 'جاري تحميل المنتجات' : 'Loading products...'}
        </p>
      </div>
    );
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-950 text-white space-y-16">
      
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder={isAr ? 'ابحث عن أي منتج...' : 'Search for any product...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 bg-gray-800 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
        />
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-gray-950 font-bold shadow-lg shadow-amber-500/10'
                  : 'bg-gray-950 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {isAr ? cat.nameAr : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {(searchQuery || selectedCategory !== 'all') ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-amber-500 border-b border-gray-800 pb-3">
            {isAr ? 'نتائج البحث / التصفية' : 'Search & Filter Results'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} isAr={isAr} onAddToCart={handleAddToCart} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-400 py-10">
                {isAr ? 'لا توجد منتجات مطابقة للبحث.' : 'No matching products found.'}
              </p>
            )}
          </div>
        </div>
      ) : (
        categories.filter(c => c.id !== 'all').map((cat) => {
          const catProducts = products.filter(p => filterByCategory(p, cat.id)).slice(0, 4);

          return (
            <div key={cat.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <h2 className="text-2xl font-bold text-amber-500">
                  {isAr ? cat.nameAr : cat.nameEn}
                </h2>
                <button
                  onClick={() => setSelectedCategory(cat.id)}
                  className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition flex items-center gap-1 cursor-pointer"
                >
                  {isAr ? 'استكشف المزيد ←' : 'Explore More →'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {catProducts.length > 0 ? (
                  catProducts.map((product) => (
                    <ProductCard key={product.id} product={product} isAr={isAr} onAddToCart={handleAddToCart} />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 py-6 text-sm">
                    {isAr ? 'لا توجد منتجات في هذا القسم حالياً.' : 'No products in this category yet.'}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* باقي أقسام الموقع (Why Choose Us, Contact Us, Map) */}
      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-md mt-12">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-500">
            {isAr ? 'لماذا تختار التعامل معنا؟' : 'Why Choose Us?'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isAr ? 'نسعى دائماً لتوفير أفضل تجربة تسوق وخدمة متكاملة لراحة سيارتك' : 'We always strive to provide the best shopping experience'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-950/60 border border-gray-800 p-6 rounded-xl flex flex-col items-center text-center space-y-3 hover:border-amber-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <h3 className="font-bold text-lg text-white">
              {isAr ? 'ضمان شامل على المنتجات' : 'Products Warranty'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isAr ? 'بنديك ضمان حقيقي ومضمون على كل منتجاتنا عشان تشتري وأنت متطمن تماماً.' : 'We provide a reliable warranty on all our products.'}
            </p>
          </div>

          <div className="bg-gray-950/60 border border-gray-800 p-6 rounded-xl flex flex-col items-center text-center space-y-3 hover:border-amber-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
              <FontAwesomeIcon icon={faTruckFast} />
            </div>
            <h3 className="font-bold text-lg text-white">
              {isAr ? 'توصيل لأي مكان في مصر' : 'Delivery All Over Egypt'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isAr ? 'متاح خدمة الشحن والتوصيل السريع لجميع محافظات ومدن الجمهورية.' : 'Fast shipping service available to all governorates.'}
            </p>
          </div>

          <div className="bg-gray-950/60 border border-gray-800 p-6 rounded-xl flex flex-col items-center text-center space-y-3 hover:border-amber-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
              <FontAwesomeIcon icon={faHeadset} />
            </div>
            <h3 className="font-bold text-lg text-white">
              {isAr ? 'خدمة عملاء طوال الوقت' : '24/7 Customer Support'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {isAr ? 'فريق دعم فني وخدمة عملاء جاهز لمساعدتك والرد على استفساراتك في أي وقت.' : 'Support team ready to help you at any time.'}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-md">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-500">
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isAr ? 'يسعدنا تواصلك معنا ومتابعة صفحاتنا لمعرفة كل جديد وعروضنا المستمرة' : 'We are glad to connect with you'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <a 
            href="https://wa.me/201062977664" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-950/80 border border-gray-800 hover:border-green-500/50 p-4 rounded-xl flex items-center justify-center gap-3 transition group cursor-pointer shadow-md"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-green-500 text-2xl group-hover:scale-110 transition" />
            <span className="font-bold text-white group-hover:text-green-400 transition">
              {isAr ? 'واتساب' : 'WhatsApp'}
            </span>
          </a>

          <a 
            href="https://www.facebook.com/wallycars2023/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-950/80 border border-gray-800 hover:border-blue-500/50 p-4 rounded-xl flex items-center justify-center gap-3 transition group cursor-pointer shadow-md"
          >
            <FontAwesomeIcon icon={faFacebook} className="text-blue-500 text-2xl group-hover:scale-110 transition" />
            <span className="font-bold text-white group-hover:text-blue-400 transition">
              {isAr ? 'فيسبوك' : 'Facebook'}
            </span>
          </a>

          <a 
            href="https://www.tiktok.com/@mohammed.ramadan01/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-950/80 border border-gray-800 hover:border-pink-500/50 p-4 rounded-xl flex items-center justify-center gap-3 transition group cursor-pointer shadow-md"
          >
            <FontAwesomeIcon icon={faTiktok} className="text-white text-2xl group-hover:scale-110 transition" />
            <span className="font-bold text-white group-hover:text-pink-400 transition">
              {isAr ? 'تيك توك' : 'TikTok'}
            </span>
          </a>
        </div>
      </section>

      <section className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 md:p-10 shadow-xl backdrop-blur-md mb-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-amber-500">
            {isAr ? 'موقعنا على الخريطة' : 'Our Location'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isAr 
              ? 'تفضل بزيارتنا في مقر المحل لمعاينة المنتجات واختيار ما يناسب سيارتك مباشرة.' 
              : 'Visit our store to check out products and choose what suits your car directly.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="bg-gray-950 border border-gray-800 p-6 rounded-xl space-y-6 lg:col-span-1 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400 text-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">
                  {isAr ? 'العنوان بالتفصيل' : 'Detailed Address'}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {isAr 
                    ? 'الغربية - المحلة الكبرى - أبو شاهين بجوار شركة الزيت و الصابون' 
                    : 'Gharbia – El Mahalla El Kubra – Abu Shahin'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400 text-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <h3 className="text-white font-bold mb-1">
                  {isAr ? 'أوقات العمل' : 'Working Hours'}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {isAr 
                    ? 'السبت - الخميس:12 صباحاً - 12 مساءً' 
                    : 'Sat - Thu: 12:00 AM - 12:00 PM'}
                </p>
              </div>
            </div>

            <a 
              href="https://maps.google.com/?q=El-Mahalla+El-Kubra" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {isAr ? 'فتح الاتجاهات على خرائط جوجل' : 'Open Directions on Google Maps'}
            </a>
          </div>
          <div className="lg:col-span-2 h-[350px] rounded-xl overflow-hidden border border-gray-800 shadow-xl">
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3420.925003462305!2d31.1834614!3d30.972575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f7a300716c55d3%3A0x4e2f18d73c8b665e!2z2KfZhNmI2KfZhNmK!5e0!3m2!1sen!2seg!4v1784950693911!5m2!1sen!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}

function ProductCard({ product, isAr, onAddToCart }) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/50 transition shadow-md">
      <div>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-800" />
        ) : (
          <div className="w-full h-48 bg-gray-900 rounded-xl mb-4 flex items-center justify-center text-gray-600">
            {isAr ? 'بدون صورة' : 'No Image'}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-gray-900 text-amber-400 border border-gray-800 px-2.5 py-1 rounded-full truncate">
            {product.category || 'كماليات'}
          </span>
          <span className={`text-xs px-2.5 py-1 rounded-full border ${product.stock > 0 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {product.stock > 0 ? (isAr ? `متاح (${product.stock})` : `In Stock (${product.stock})`) : (isAr ? 'سيتوفر قريبا' : 'Out of Stock')}
          </span>
        </div>

        <h3 className="font-bold text-lg mt-2 text-white truncate">{product.name}</h3>

        <div className="mt-2 text-xs text-gray-400 bg-gray-900/60 border border-gray-800/80 px-3 py-1.5 rounded-lg flex items-center justify-between">
          <span>{isAr ? 'الضمان:' : 'Warranty:'}</span>
          <span className="font-medium text-amber-400">{product.warranty || (isAr ? 'بدون ضمان' : 'No warranty')}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-900 flex items-center justify-between gap-2">
        <span className="text-amber-400 font-bold text-lg">{product.price} {isAr ? 'ج.م' : 'EGP'}</span>
        
        <button 
          onClick={() => onAddToCart(product)}
          disabled={product.stock <= 0}
          className={`font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
            product.stock > 0 
              ? 'bg-amber-500 hover:bg-amber-600 text-gray-950' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          <FontAwesomeIcon icon={faShoppingCart} />
          <span>{isAr ? 'إضافة للسلة' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
}
