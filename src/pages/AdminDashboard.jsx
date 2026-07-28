import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [warranty, setWarranty] = useState('');
  const [category, setCategory] = useState('كماليات');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editWarranty, setEditWarranty] = useState('');
  const [editCategory, setEditCategory] = useState('كماليات');
  const [editImageFile, setEditImageFile] = useState(null);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    checkUser();
    fetchProducts();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate('/admin/login');
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (!error) setProducts(data || []);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, imageFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('products').insert([{ 
        name, 
        price: parseFloat(price), 
        stock: parseInt(stock) || 0,
        warranty: warranty.trim() || (isAr ? 'بدون ضمان' : 'No Warranty'),
        category,
        image_url: imageUrl 
      }]);
      
      if (error) throw error;

      toast.success(isAr ? 'تم إضافة المنتج بنجاح!' : 'Product added successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      setName('');
      setPrice('');
      setStock('');
      setWarranty('');
      setCategory('كماليات');
      setImageFile(null);
      fetchProducts();
    } catch (err) {
      toast.error('Error: ' + err.message, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) return;

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      toast.error('Error: ' + error.message, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } else {
      toast.info(isAr ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      fetchProducts();
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditPrice(product.price);
    setEditStock(product.stock || '');
    setEditWarranty(product.warranty || '');
    setEditCategory(product.category || 'كماليات');
    setEditImageFile(null);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingProduct.image_url;

      if (editImageFile) {
        const fileName = `${Date.now()}-${editImageFile.name}`;
        const { error: uploadError } = await supabase.storage.from('products').upload(fileName, editImageFile);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from('products')
        .update({ 
          name: editName, 
          price: parseFloat(editPrice), 
          stock: parseInt(editStock) || 0,
          warranty: editWarranty.trim() || (isAr ? 'بدون ضمان' : 'No Warranty'),
          category: editCategory,
          image_url: imageUrl 
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast.success(isAr ? 'تم تحديث المنتج بنجاح!' : 'Product updated successfully!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error('Error: ' + err.message, {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-950 pt-28 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-amber-500 border-b border-gray-800 pb-4">
            {isAr ? 'إضافة منتج جديد' : 'Add New Product'}
          </h2>
          <form onSubmit={handleAddProduct} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isAr ? 'اسم المنتج' : 'Product Name'}
                </label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isAr ? 'السعر' : 'Price'}
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isAr ? 'الكمية في المخزن' : 'Stock Quantity'}
                </label>
                <input 
                  type="number" 
                  value={stock} 
                  onChange={(e) => setStock(e.target.value)} 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isAr ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition cursor-pointer"
                >
                  <option value="ليد">{isAr ? 'ليد' : 'LED'}</option>
                  <option value="عدسات">{isAr ? 'عدسات' : 'lenses'}</option>
                  <option value="كماليات">{isAr ? 'كماليات' : 'Accessories'}</option>
                  <option value="اكسسورات">{isAr ? 'اكسسورات' : 'Extra Accessories'}</option>
                  <option value="قطع غيار">{isAr ? 'قطع غيار' : 'Spare Parts'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isAr ? 'مدة الضمان' : 'Warranty'}
                </label>
                <input 
                  type="text" 
                  value={warranty} 
                  onChange={(e) => setWarranty(e.target.value)} 
                  placeholder={isAr ? 'مثال: سنة أو بدون ضمان' : 'e.g. 1 Year, None'} 
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {isAr ? 'صورة المنتج' : 'Product Image'}
              </label>
              <input 
                type="file" 
                onChange={(e) => setImageFile(e.target.files[0])} 
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-gray-950 hover:file:bg-amber-600 cursor-pointer bg-gray-950 border border-gray-800 rounded-xl"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3 rounded-xl transition duration-200 disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/10"
            >
              {loading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ المنتج' : 'Save Product')}
            </button>
          </form>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-amber-500 border-b border-gray-800 pb-4">
            {isAr ? 'إدارة المنتجات' : 'Manage Products'}
          </h2>
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
            <table className={`w-full min-w-[650px] text-white ${isAr ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-sm">
                  <th className="pb-3 px-3">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="pb-3 px-3">{isAr ? 'السعر' : 'Price'}</th>
                  <th className="pb-3 px-3">{isAr ? 'التصنيف' : 'Category'}</th>
                  <th className="pb-3 px-3">{isAr ? 'الكمية' : 'Stock'}</th>
                  <th className="pb-3 px-3">{isAr ? 'الضمان' : 'Warranty'}</th>
                  <th className="pb-3 px-3 text-center">{isAr ? 'التحكم' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-800/50 transition">
                      <td className="py-4 px-3 flex items-center gap-3">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-gray-700 shrink-0" />
                        )}
                        <span className="font-medium text-sm md:text-base line-clamp-1">{product.name}</span>
                      </td>
                      <td className="py-4 px-3 text-amber-400 font-semibold whitespace-nowrap">{product.price} {isAr ? 'ج.م' : 'EGP'}</td>
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="bg-gray-800 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-gray-700">
                          {product.category || 'كماليات'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-gray-300 whitespace-nowrap">{product.stock ?? 0}</td>
                      <td className="py-4 px-3 text-gray-400 text-sm whitespace-nowrap">{product.warranty || (isAr ? 'بدون ضمان' : 'None')}</td>
                      <td className="py-4 px-3 text-center space-x-2 space-x-reverse whitespace-nowrap">
                        <button 
                          onClick={() => startEditing(product)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                        >
                          {isAr ? 'تعديل' : 'Edit'}
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs transition cursor-pointer"
                        >
                          {isAr ? 'حذف' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-400">
                      {isAr ? 'لا توجد منتجات مضافة بعد.' : 'No products added yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div dir={isAr ? 'rtl' : 'ltr'} className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
              <h3 className="text-xl font-bold text-amber-500 border-b border-gray-800 pb-3">
                {isAr ? 'تعديل المنتج' : 'Edit Product'}
              </h3>
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {isAr ? 'اسم المنتج' : 'Product Name'}
                  </label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {isAr ? 'السعر' : 'Price'}
                    </label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={editPrice} 
                      onChange={(e) => setEditPrice(e.target.value)} 
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      {isAr ? 'الكمية' : 'Stock'}
                    </label>
                    <input 
                      type="number" 
                      value={editStock} 
                      onChange={(e) => setEditStock(e.target.value)} 
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="ليد">{isAr ? 'ليد' : 'LED'}</option>
                    <option value="كماليات">{isAr ? 'كماليات' : 'Accessories'}</option>
                    <option value="اكسسورات">{isAr ? 'اكسسورات' : 'Extra Accessories'}</option>
                    <option value="قطع غيار">{isAr ? 'قطع غيار' : 'Spare Parts'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {isAr ? 'مدة الضمان' : 'Warranty'}
                  </label>
                  <input 
                    type="text" 
                    value={editWarranty} 
                    onChange={(e) => setEditWarranty(e.target.value)} 
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {isAr ? 'صورة جديدة (اختياري)' : 'New Image (Optional)'}
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => setEditImageFile(e.target.files[0])} 
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-gray-950 hover:file:bg-amber-600 cursor-pointer bg-gray-950 border border-gray-800 rounded-xl"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    {loading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التعديلات' : 'Save Changes')}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setEditingProduct(null)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}