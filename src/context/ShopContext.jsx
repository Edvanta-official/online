import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES, COUPONS, BRAND_INFO } from '../data/mockData';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(PRODUCTS);
  const [categories, setCategories] = useState(CATEGORIES);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // Clean and validate items against stock limit:
      return parsed
        .filter(item => item && item.product && typeof item.product.price === 'number')
        .map(item => {
          const foundProd = PRODUCTS.find(p => p.id === item.product.id) || item.product;
          const maxStock = typeof foundProd.stock === 'number' ? foundProd.stock : 999;
          return {
            ...item,
            product: foundProd,
            quantity: Math.min(item.quantity || 1, maxStock)
          };
        });
    } catch (e) {
      return [];
    }
  });
  
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_wishlist');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const defaultOrders = [
    {
      id: "ORD-98241",
      customerName: "Ananya Sharma",
      items: [
        { name: "Premium Swarovski Butterfly Hair Clip", price: 179, quantity: 2, image: "images/plumeria_flower.jpg" }
      ],
      finalAmount: 358,
      paymentMethod: "Razorpay / UPI",
      paymentStatus: "Paid",
      orderStatus: "Shipped",
      trackingNumber: "SPK-IN-9812489",
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  ];

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_orders');
      if (!saved) return defaultOrders;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaultOrders;
    } catch (e) {
      return defaultOrders;
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const defaultUser = {
    name: "Ananya Sharma",
    email: "ananya@example.com",
    role: "customer",
    isLoggedIn: false,
    savedAddresses: [
      {
        id: "addr1",
        fullName: "Ananya Sharma",
        phone: "+91 9949157771",
        street: "Flat 402, Rosewood Heights, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        isDefault: true
      }
    ]
  };

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_user');
      if (!saved) return defaultUser;
      const parsed = JSON.parse(saved);
      return (parsed && typeof parsed === 'object') ? parsed : defaultUser;
    } catch (e) {
      return defaultUser;
    }
  });

  // UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('sparkel_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_user', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cart Management
  const addToCart = (product, quantity = 1, color = null) => {
    if (!product || !product.id) return false;
    const maxStock = typeof product.stock === 'number' ? product.stock : 999;
    
    if (maxStock <= 0) {
      showToast(`Sorry, "${product.name}" is currently Out of Stock!`, "error");
      return false;
    }

    let addedSuccessfully = true;

    setCart(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existingIndex = safePrev.findIndex(item => item && item.product && item.product.id === product.id);
      if (existingIndex > -1) {
        const currentQty = safePrev[existingIndex].quantity || 0;
        const totalRequested = currentQty + quantity;
        const finalQty = Math.min(totalRequested, maxStock);
        
        if (currentQty >= maxStock) {
          showToast(`Stock limit reached! Maximum ${maxStock} units already in your cart for "${product.name}".`, "warning");
          addedSuccessfully = false;
          return safePrev;
        } else if (totalRequested > maxStock) {
          showToast(`Stock limit reached! Cart updated to maximum ${maxStock} units for "${product.name}".`, "warning");
        } else {
          showToast(`✨ Added "${product.name}" to your luxury cart!`);
        }

        const updated = [...safePrev];
        updated[existingIndex].quantity = finalQty;
        return updated;
      }
      
      const finalQty = Math.min(quantity, maxStock);
      if (quantity > maxStock) {
        showToast(`Stock limit reached! Maximum ${maxStock} units available for "${product.name}".`, "warning");
      } else {
        showToast(`✨ Added "${product.name}" to your luxury cart!`);
      }

      return [...safePrev, { product, quantity: finalQty, selectedColor: color || product.colors?.[0] || 'Default' }];
    });

    return addedSuccessfully;
  };

  const buyNow = (product, quantity = 1, color = null) => {
    if (!product || !product.id) return false;
    const foundProd = PRODUCTS.find(p => p.id === product.id) || product;
    const maxStock = typeof foundProd.stock === 'number' ? foundProd.stock : 999;
    
    if (maxStock <= 0) {
      showToast(`Sorry, "${foundProd.name}" is currently Out of Stock!`, "error");
      return false;
    }

    const finalQty = Math.min(quantity, maxStock);
    if (quantity > maxStock) {
      showToast(`Stock limit reached! Set to maximum ${maxStock} available units.`, "warning");
    }

    const singleItemCart = [{
      product: foundProd,
      quantity: finalQty,
      selectedColor: color || foundProd.colors?.[0] || 'Default'
    }];

    setCart(singleItemCart);
    try {
      localStorage.setItem('sparkel_cart', JSON.stringify(singleItemCart));
    } catch (e) {}

    setIsCheckoutOpen(true);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const itemToRemove = safePrev.find(item => item && item.product && item.product.id === productId);
      if (itemToRemove && itemToRemove.product) {
        showToast(`Removed "${itemToRemove.product.name}" from cart`, "info");
      }
      return safePrev.filter(item => item && item.product && item.product.id !== productId);
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => (Array.isArray(prev) ? prev.map(item => {
      if (item && item.product && item.product.id === productId) {
        const maxStock = typeof item.product.stock === 'number' ? item.product.stock : 999;
        if (newQuantity > maxStock) {
          showToast(`Maximum available stock for this item is ${maxStock}.`, "warning");
          return { ...item, quantity: maxStock };
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }) : []));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Management
  const toggleWishlist = (product) => {
    if (!product || !product.id) return;
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    const isWishlisted = safeWishlist.includes(product.id);
    if (isWishlisted) {
      setWishlist(prev => (Array.isArray(prev) ? prev.filter(id => id !== product.id) : []));
      showToast(`Removed from wishlist`, "info");
    } else {
      setWishlist(prev => [...(Array.isArray(prev) ? prev : []), product.id]);
      showToast(`💖 Saved "${product.name}" to wishlist!`);
    }
  };

  // Coupon Manager
  const applyCoupon = (code) => {
    setCouponError("");
    const found = COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    const cartSubtotal = Array.isArray(cart) ? cart.reduce((sum, item) => {
      if (!item || !item.product || typeof item.product.price !== 'number') return sum;
      return sum + (item.product.price * (item.quantity || 1));
    }, 0) : 0;

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
  const cartSubtotal = Array.isArray(cart) ? cart.reduce((sum, item) => {
    if (!item || !item.product || typeof item.product.price !== 'number') return sum;
    return sum + (item.product.price * (item.quantity || 1));
  }, 0) : 0;

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

  const loginUser = (name, phone, password) => {
    const role = name.toLowerCase().includes('admin') ? 'admin' : 'customer';
    const email = `${name.toLowerCase().replace(/\s+/g, '')}@example.com`;

    setUser({
      name,
      email,
      phone,
      role,
      isLoggedIn: true,
      savedAddresses: [
        {
          id: "addr1",
          fullName: name,
          phone: phone,
          street: "Flat 402, Rosewood Heights, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          isDefault: true
        }
      ]
    });
    showToast(`👋 Welcome, ${name}!`);
    return true;
  };

  const logoutUser = () => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    showToast("Logged out successfully.", "info");
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

  const defaultSubscribers = [
    { id: 'SUB-101', email: 'chenchukoushik@gmail.com', subscribedAt: '2026-08-18T22:45:00.000Z', couponCode: 'SPARKEL10', status: 'active' },
    { id: 'SUB-102', email: 'ananya@example.com', subscribedAt: '2026-08-17T14:20:00.000Z', couponCode: 'SPARKEL10', status: 'active' },
    { id: 'SUB-103', email: 'priya.sharma@gmail.com', subscribedAt: '2026-08-16T09:15:00.000Z', couponCode: 'SPARKEL10', status: 'active' }
  ];

  const [subscribers, setSubscribers] = useState(() => {
    try {
      const saved = localStorage.getItem('sparkel_subscribers');
      if (!saved) return defaultSubscribers;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : defaultSubscribers;
    } catch (e) {
      return defaultSubscribers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sparkel_subscribers', JSON.stringify(subscribers));
    } catch (e) {}
  }, [subscribers]);

  const addSubscriber = (email) => {
    if (!email) return;
    setSubscribers(prev => {
      if (prev.some(s => s && s.email && s.email.toLowerCase() === email.toLowerCase())) return prev;
      return [
        {
          id: `SUB-${Date.now()}`,
          email,
          subscribedAt: new Date().toISOString(),
          couponCode: 'SPARKEL10',
          status: 'active'
        },
        ...prev
      ];
    });
  };

  const deleteSubscriber = (id) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
    showToast("Subscriber removed from database", "info");
  };

  return (
    <ShopContext.Provider value={{
      brandInfo: BRAND_INFO,
      products,
      categories,
      COUPONS,
      cart,
      wishlist,
      orders,
      subscribers,
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
      isLoginModalOpen,
      setIsLoginModalOpen,
      quickViewProduct,
      setQuickViewProduct,
      toast,
      showToast,
      addToCart,
      buyNow,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      applyCoupon,
      removeCoupon,
      placeOrder,
      switchUserRole,
      loginUser,
      logoutUser,
      addProduct,
      updateProduct,
      deleteProduct,
      addSubscriber,
      deleteSubscriber
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
