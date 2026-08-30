import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const ToastNotification = () => {
  const { toast } = useShop();
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
      <div className="bg-[#2C2C2C] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#D4AF7F]/40 flex items-center gap-3 font-poppins text-xs font-semibold">
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#D4AF7F]" />}
        {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-[#F48FB1]" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {}
    return { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Session error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <ShopProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col justify-between selection:bg-[#FCE4EC] selection:text-[#C89B3C]">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/success" element={<PaymentSuccessPage />} />
                <Route path="/payment-failed" element={<PaymentFailedPage />} />
                <Route path="/failed" element={<PaymentFailedPage />} />
              </Routes>
            </main>

            <Footer />

            {/* Interactive Modals & Drawers */}
            <CartDrawer />
            <WishlistDrawer />
            <ProductQuickViewModal />
            <CheckoutModal />
            <ToastNotification />
          </div>
        </Router>
      </ShopProvider>
    </ErrorBoundary>
  );
}

export default App;
