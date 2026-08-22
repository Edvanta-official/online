import emailjs from '@emailjs/browser';

// Environment variables configuration
const EMAILJS_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_PUBLIC_KEY) || '';
const EMAILJS_SERVICE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_SERVICE_ID) || '';
const EMAILJS_TEMPLATE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_TEMPLATE_ID) || '';
const WEB3FORMS_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WEB3FORMS_KEY) || '';
const FORMSPREE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FORMSPREE_URL) || '';

const ADMIN_EMAIL = 'support@sparklekkv.com';

/**
 * Sends OTP Email directly to whatever email/phone target the user entered during sign in / sign up
 */
export const sendOtpEmailViaFormSubmit = async (targetDestination, otpCode) => {
  const destEmail = targetDestination && targetDestination.trim() 
    ? targetDestination.trim() 
    : 'registered email/phone';

  console.log(`[OTP Dispatch]: Processing real OTP ${otpCode} for ${destEmail}...`);

  try {
    // 1. Send via EmailJS SDK if configured
    if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY && destEmail.includes('@')) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            to_email: destEmail,
            otp_code: otpCode,
            user_email: destEmail,
            message: `Your 6-Digit Security OTP for Sparkle @ KKV authentication is: ${otpCode}`
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log('[EmailJS OTP Success]: OTP sent via EmailJS to', destEmail);
      } catch (emailjsErr) {
        console.warn('[EmailJS OTP Notice]:', emailjsErr);
      }
    }

    // 2. Send real AJAX email to user's inbox via FormSubmit API if an email was entered
    if (destEmail.includes('@')) {
      fetch(`https://formsubmit.co/ajax/${destEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: destEmail,
          name: 'Sparkle Customer',
          _subject: `🔑 Your Sparkle @ KKV Security OTP: ${otpCode}`,
          message: `Hello!\n\nYour 6-Digit Security OTP for Sparkle @ KKV authentication is:\n\n======================\n   OTP: ${otpCode}\n======================\n\nThis OTP is valid for 10 minutes.\n\nSteps to Verify:\n1. Copy your 6-digit code: ${otpCode}\n2. Enter this code into the verification modal on the website.\n3. Click "Verify OTP & Authenticate".\n\nIf you did not request this OTP, please ignore this email.\n\nBest regards,\nSparkle @ KKV Security Team\nsupport@sparklekkv.com`,
          _captcha: "false"
        })
      }).catch(err => console.log('FormSubmit OTP dispatch notice:', err));
    }

    // 3. Backup admin notification to support@sparklekkv.com
    fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: destEmail,
        _subject: `🔐 Security Alert: OTP ${otpCode} issued to ${destEmail}`,
        message: `Security OTP ${otpCode} was requested for user ${destEmail} on ${new Date().toLocaleString()}`,
        _captcha: "false"
      })
    }).catch(err => console.log('Admin OTP notification notice:', err));

    return true;
  } catch (err) {
    console.warn('[OTP Dispatch Error]:', err);
    return false;
  }
};

/**
 * Robust Multi-Provider Email Service
 * Sends notification emails to admin (support@sparklekkv.com)
 */
export const sendSubscriberEmailViaEmailJS = async (subscriberEmail) => {
  const templateParams = {
    to_name: 'Sparkle @ KKV Admin',
    to_email: ADMIN_EMAIL,
    subscriber_email: subscriberEmail,
    reply_to: subscriberEmail,
    coupon_code: 'SPARKLE10',
    subscription_date: new Date().toLocaleString(),
    message: `🎉 Congratulations!\n\nThis member is your new subscriber: ${subscriberEmail}\n\nSubscriber Email: ${subscriberEmail}\nSubscription Date: ${new Date().toLocaleString()}\nIssued Coupon: SPARKLE10 (10% OFF)`
  };

  const results = [];

  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log('[EmailJS Success]:', response.status, response.text);
      results.push('emailjs');
    } catch (emailjsError) {
      console.warn('[EmailJS Notice]:', emailjsError);
    }
  }

  try {
    const fsRes = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: subscriberEmail,
        name: 'VIP Subscriber',
        _subject: `🎉 New Subscriber Alert: ${subscriberEmail} is your new subscriber!`,
        message: `🎉 Congratulations!\n\nThis member is your new subscriber: ${subscriberEmail}\n\nSubscriber Email: ${subscriberEmail}\nSubscription Date: ${new Date().toLocaleString()}\nIssued Code: SPARKLE10`
      })
    });
    if (fsRes.ok) {
      console.log('[FormSubmit Success]: Email dispatched');
      results.push('formsubmit');
    }
  } catch (fsErr) {
    console.warn('[FormSubmit Notice]:', fsErr);
  }

  return { success: true, providersTriggered: results };
};

export const OWNER_NOTIFICATION_EMAIL = 'sparklekkvofficial@gmail.com';

/**
 * Dispatches customer signin / registration database entry directly to sparklekkvofficial@gmail.com
 */
export const sendCustomerSigninEmailToAdmin = async (userData) => {
  const userEmail = userData?.email || 'N/A';
  const userName = userData?.name || 'Customer';
  const userPhone = userData?.phone || 'N/A';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  console.log(`[Customer Signin Database Notification]: Dispatching ${userName} (${userEmail}) to ${OWNER_NOTIFICATION_EMAIL}...`);

  try {
    fetch(`https://formsubmit.co/ajax/${OWNER_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `👤 New Customer Sign-In Database Alert: ${userName} (${userEmail})`,
        name: userName,
        email: userEmail,
        phone: userPhone,
        signin_time: timestamp,
        account_type: userData?.role || 'Customer',
        message: `🎉 Customer Account Sign-In / Registration Logged!\n\nUser Name: ${userName}\nEmail Address: ${userEmail}\nPhone Number: ${userPhone}\nTimestamp: ${timestamp}\nAccount Type: ${userData?.role || 'Customer'}\n\nThis customer data has been saved to your Sparkle @ KKV customer database.`
      })
    }).catch(err => console.log('Owner signin notification error:', err));
  } catch (e) {
    console.warn('[Owner Signin Notification Error]:', e);
  }
};

/**
 * Dispatches Order Payment Done & Verified confirmation directly to sparklekkvofficial@gmail.com
 */
export const sendOrderPaymentConfirmationEmail = async (orderData) => {
  const customerEmail = orderData?.customerEmail || 'customer@sparklekkv.com';
  const customerName = orderData?.customerName || 'Customer';
  const orderId = orderData?.id || 'SPK-ORDER';
  const totalAmount = orderData?.total || orderData?.cartTotal || 0;
  const paymentMethod = orderData?.paymentMethod || 'PhonePe / Instant UPI';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  console.log(`[Order Payment Done Dispatch]: Sending payment verification for ${orderId} to ${OWNER_NOTIFICATION_EMAIL}...`);

  const itemsText = Array.isArray(orderData?.items) 
    ? orderData.items.map((i, index) => `• ${i.name} (Qty: ${i.quantity || 1}) - ₹${(i.price || 0) * (i.quantity || 1)}`).join('\n')
    : (orderData?.itemsListText || 'N/A');

  const fullAddress = typeof orderData?.shippingAddress === 'object' && orderData?.shippingAddress !== null
    ? `${orderData.shippingAddress.street || ''}, ${orderData.shippingAddress.city || ''} - ${orderData.shippingAddress.pincode || ''}`
    : (orderData?.address ? `${orderData.address}, ${orderData.city || ''} ${orderData.pincode || ''}` : 'N/A');

  const customerPhone = orderData?.phone || orderData?.shippingAddress?.phone || 'N/A';

  const orderAlertBody = {
    _subject: `💰 NEW ORDER & PAYMENT DONE: ${orderId} (₹${totalAmount})`,
    order_id: orderId,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone,
    total_paid: `₹${totalAmount}`,
    payment_status: "PAYMENT DONE & VERIFIED",
    payment_method: paymentMethod,
    ordered_items: itemsText,
    delivery_type: "Guaranteed 7-Day Express Delivery",
    order_date: timestamp,
    shipping_address: fullAddress,
    message: `🛍️ NEW CUSTOMER ORDER & PAYMENT RECEIVED!\n\n📌 Order ID: ${orderId}\n👤 Customer Name: ${customerName}\n📱 Customer Phone: ${customerPhone}\n✉️ Customer Email: ${customerEmail}\n📍 Full Delivery Address: ${fullAddress}\n\n💰 Total Amount Paid: ₹${totalAmount}\n💳 Payment Method: ${paymentMethod}\n✅ Payment Status: PAYMENT DONE & VERIFIED\n\n📦 PURCHASED ITEMS:\n${itemsText}\n\n🚚 Delivery Target: Guaranteed 7-Day Express Delivery`
  };

  try {
    // 1. Notify Owner Email: sparklekkvofficial@gmail.com
    fetch(`https://formsubmit.co/ajax/${OWNER_NOTIFICATION_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderAlertBody)
    }).catch(err => console.log('Owner payment notification notice:', err));

    // 2. Notify Support Email: support@sparklekkv.com
    fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderAlertBody)
    }).catch(err => console.log('Support payment notification notice:', err));

    // 3. Notify Customer Email if valid
    if (customerEmail.includes('@')) {
      fetch(`https://formsubmit.co/ajax/${customerEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `✅ Payment Received & Order Confirmed - ${orderId}`,
          message: `Hello ${customerName},\n\nThank you for shopping at Sparkle @ KKV!\n\nYour payment of ₹${totalAmount} via ${paymentMethod} has been RECEIVED & VERIFIED.\nOrder ID: ${orderId}\nStatus: Order Received / Dispatched in 24 Hours\nGuaranteed Delivery: 7 Days Pan-India\n\nBest regards,\nSparkle @ KKV Team\nsparklekkv.com`
        })
      }).catch(err => console.log('Customer payment confirmation notice:', err));
    }
  } catch (e) {
    console.warn('[Payment Notification Error]:', e);
  }
};
