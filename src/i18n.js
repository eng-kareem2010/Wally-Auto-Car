import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      shopTitle: "متجر كماليات السيارات",
      cart: "سلة المشتريات",
      admin: "لوحة التحكم",
      emptyCart: "السلة فارغة حالياً..",
      total: "الإجمالي الكلي:",
      checkoutWhatsApp: "إتمام الطلب عبر واتساب 💬",
      delete: "حذف ❌",
      login: "تسجيل دخول المشرف",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      loginBtn: "دخول",
      addProduct: "إضافة منتج جديد",
      productName: "اسم المنتج",
      price: "السعر",
      image: "صورة المنتج",
      save: "حفظ المنتج"
    }
  },
  en: {
    translation: {
      shopTitle: "Car Accessories Shop",
      cart: "Shopping Cart",
      admin: "Dashboard",
      emptyCart: "Your cart is empty..",
      total: "Total:",
      checkoutWhatsApp: "Checkout via WhatsApp 💬",
      delete: "Delete ❌",
      login: "Admin Login",
      email: "Email",
      password: "Password",
      loginBtn: "Login",
      addProduct: "Add New Product",
      productName: "Product Name",
      price: "Price",
      image: "Product Image",
      save: "Save Product"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar",
  interpolation: { escapeValue: false }
});

export default i18n;