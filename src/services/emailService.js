import emailjs from '@emailjs/browser';

// Environment variables configuration
const EMAILJS_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_PUBLIC_KEY) || '';
const EMAILJS_SERVICE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_SERVICE_ID) || '';
const EMAILJS_TEMPLATE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_TEMPLATE_ID) || '';
const WEB3FORMS_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WEB3FORMS_KEY) || '';
const FORMSPREE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FORMSPREE_URL) || '';

const ADMIN_EMAIL = 'support@sparklekkv.com';

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

  // 1. Send via EmailJS SDK if credentials exist
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

  // 2. Send via FormSubmit AJAX Endpoint targeting sparklekkvofficial@gmail.com
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
        message: `🎉 Congratulations!\n\nThis member is your new subscriber: ${subscriberEmail}\n\nSubscriber Email: ${subscriberEmail}\nSubscription Date: ${new Date().toLocaleString()}\nIssued Code: SPARKEL10`
      })
    });
    if (fsRes.ok) {
      console.log('[FormSubmit Success]: Email dispatched');
      results.push('formsubmit');
    }
  } catch (fsErr) {
    console.warn('[FormSubmit Notice]:', fsErr);
  }

  // 3. Send via Web3Forms API if key exists
  if (WEB3FORMS_KEY) {
    try {
      const w3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          email: subscriberEmail,
          subject: `🎉 New Subscriber Alert: ${subscriberEmail} is your new subscriber!`,
          message: `🎉 Congratulations!\n\nThis member is your new subscriber: ${subscriberEmail}\n\nDate: ${new Date().toLocaleString()}\nIssued Code: SPARKEL10`
        })
      });
      if (w3Res.ok) {
        console.log('[Web3Forms Success]: Email dispatched');
        results.push('web3forms');
      }
    } catch (w3Err) {
      console.warn('[Web3Forms Notice]:', w3Err);
    }
  }

  // 4. Send via Formspree URL if configured
  if (FORMSPREE_URL) {
    try {
      await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: subscriberEmail,
          message: `🎉 Congratulations! This member is your new subscriber: ${subscriberEmail}`
        })
      });
      results.push('formspree');
    } catch (fspErr) {
      console.warn('[Formspree Notice]:', fspErr);
    }
  }

  // 5. Send via Local Express Backend API
  try {
    await fetch('http://localhost:5000/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: subscriberEmail })
    });
    results.push('express-backend');
  } catch (backendErr) {
    console.log('[Express Backend Notice]:', backendErr.message);
  }

  return { success: true, providersTriggered: results };
};
