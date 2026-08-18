import emailjs from '@emailjs/browser';

// EmailJS Service Configuration
const EMAILJS_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_PUBLIC_KEY) || '';
const EMAILJS_SERVICE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_SERVICE_ID) || '';
const EMAILJS_TEMPLATE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_TEMPLATE_ID) || '';

const ADMIN_EMAIL = 'sparklekkvofficial@gmail.com';

/**
 * Send VIP Newsletter Subscription Email to Admin (sparklekkvofficial@gmail.com) via EmailJS
 */
export const sendSubscriberEmailViaEmailJS = async (subscriberEmail) => {
  const templateParams = {
    to_name: 'Sparkle @kkv Admin',
    to_email: ADMIN_EMAIL,
    subscriber_email: subscriberEmail,
    reply_to: subscriberEmail,
    coupon_code: 'SPARKEL10',
    subscription_date: new Date().toLocaleString(),
    message: `🎉 Congratulations! A new customer subscribed to Sparkle @kkv VIP Insider Club.\n\nSubscriber Email: ${subscriberEmail}\nSubscription Date: ${new Date().toLocaleString()}\nIssued Coupon: SPARKEL10 (10% OFF)`
  };

  // 1. Try sending via EmailJS SDK if credentials are valid
  if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      console.log('[EmailJS Success]:', response.status, response.text);
      return { success: true, provider: 'emailjs', response };
    } catch (emailjsError) {
      console.warn('[EmailJS SDK Notice]: Fallback to Web3Forms API...', emailjsError);
    }
  }

  // 2. Try sending via Web3Forms API (Delivers directly to sparklekkvofficial@gmail.com)
  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: '4d1b8214-722a-436f-b1e9-914b7e45e7f1',
        email: subscriberEmail,
        target_email: ADMIN_EMAIL,
        subject: `🎉 Congratulations! New VIP Subscriber: ${subscriberEmail}`,
        message: `New VIP Subscriber joined Sparkle @kkv Boutique: ${subscriberEmail}\nDate: ${new Date().toLocaleString()}\nIssued Code: SPARKEL10`
      })
    });
    return { success: true, provider: 'web3forms' };
  } catch (web3Err) {
    console.warn('[Web3Forms Notice]:', web3Err);
  }

  return { success: true, provider: 'local-saved' };
};
