import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES, COUPONS, BRAND_INFO } from '../data/mockData';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('sparkel_cart');
    return saved ? JSON.parse(saved) : [
      { product: PRODUCTS[0], quantity: 1, selectedColor: "Rose Gold" },
      { product: PRODUCTS[1], quantity: 1, selectedColor: "Rose Gold" }
    ];
  });
  
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('sparkel_wishlist');
    return saved ? JSON.parse(saved) : [PRODUCTS[0].id, PRODUCTS[3].id];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('sparkel_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: "ORD-98241",
        customerName: "Ananya Sharma",
        items: [
          { name: "Premium Swarovski Butterfly Hair Clip", price: 179, quantity: 2, image: "images/butterfly_clip.jpg" }
        ],
        finalAmount: 358,
        paymentMethod: "Razorpay / UPI",
        paymentStatus: "Paid",
        orderStatus: "Shipped",
        trackingNumber: "SPK-IN-9812489",
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }
    ];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [user, setUser] = useState({
    name: "Ananya Sharma",
    email: "ananya@example.com",
    role: "customer", // 'customer' or 'admin'
    isLoggedIn: true,
    savedAddresses: [
      {
        id: "addr1",
        fullName: "Ananya Sharma",
        phone: "+91 98765 12345",
        street: "Flat 402, Rosewood Heights, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        isDefault: true
      }
    ]
  });

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('sparkel_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sparkel_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('sparkel_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart Management
  const addToCart = (product, quantity = 1, color = null) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity, selectedColor: color || product.colors?.[0] || 'Default' }];
    });
    showToast(`✨ Added "${product.name}" to your luxury cart!`);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast("Item removed from cart.", "info");
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Management
  const toggleWishlist = (product) => {
    const isWishlisted = wishlist.includes(product.id);
    if (isWishlisted) {
      setWishlist(prev => prev.filter(id => id !== product.id));
      showToast(`Removed from wishlist`, "info");
    } else {
      setWishlist(prev => [...prev, product.id]);
      showToast(`💖 Saved "${product.name}" to wishlist!`);
    }
  };

  // Coupon Manager
  const applyCoupon = (code) => {
    setCouponError("");
    const found = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (!found) {
      setCouponError("Invalid coupon code. Try SPARKEL10 or LUXURY20.");
      showToast("Invalid promo coupon code.", "error");
      return false;
    }

    if (cartSubtotal < found.minAmount) {
      setCouponError(`Code '${found.code}' requires min order of ₹${found.minAmount}`);
      showToast(`Min purchase of ₹${found.minAmount} required`, "error");
      return false;
    }

    setAppliedCoupon(found);
    showToast(`🎉 Code ${found.code} applied! You saved ${found.discountPercent}%!`);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    showToast("Coupon code removed.", "info");
  };

  // Subtotals and totals
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const auto30PercentDiscount = cartSubtotal >= 999 ? 30 : 0;
  const effectiveDiscountPercent = appliedCoupon 
    ? Math.max(appliedCoupon.discountPercent, auto30PercentDiscount) 
    : auto30PercentDiscount;
  const discountAmount = Math.round((cartSubtotal * effectiveDiscountPercent) / 100);
  const shippingFee = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 70;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  // Order Placement
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderDetails.shippingAddress.fullName || user.name,
      email: user.email,
      items: cart.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.images[0]
      })),
      totalAmount: cartSubtotal,
      discount: discountAmount,
      shippingFee,
      finalAmount: cartTotal,
      paymentMethod: orderDetails.paymentMethod,
      paymentStatus: orderDetails.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      orderStatus: 'Placed',
      trackingNumber: `SPK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      shippingAddress: orderDetails.shippingAddress,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    return newOrder;
  };

  // Toggle user role between Customer and Admin for live preview!
  const switchUserRole = (role) => {
    setUser(prev => ({
      ...prev,
      role,
      name: role === 'admin' ? "Sparkel Admin @kkv" : "Ananya Sharma"
    }));
    showToast(`Switched view to ${role.toUpperCase()} mode!`, "info");
  };

  // Product CRUD for Admin
  const addProduct = (newProd) => {
    const prod = {
      id: `p${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      ...newProd
    };
    setProducts(prev => [prod, ...prev]);
    showToast(`New product "${prod.name}" created!`);
  };

  const updateProduct = (id, updatedData) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
    showToast(`Product updated successfully!`);
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast(`Product deleted`, "info");
  };

  return (
    <ShopContext.Provider value={{
      brandInfo: BRAND_INFO,
      products,
      categories,
      cart,
      wishlist,
      orders,
      user,
      appliedCoupon,
      couponError,
      cartSubtotal,
      auto30PercentDiscount,
      effectiveDiscountPercent,
      discountAmount,
      shippingFee,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      isWishlistOpen,
      setIsWishlistOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      quickViewProduct,
      setQuickViewProduct,
      toast,
      showToast,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      applyCoupon,
      removeCoupon,
      placeOrder,
      switchUserRole,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
