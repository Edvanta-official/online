import emailjs from '@emailjs/browser';

// Environment variables configuration
const EMAILJS_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_PUBLIC_KEY) || '';
const EMAILJS_SERVICE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_SERVICE_ID) || '';
const EMAILJS_TEMPLATE_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_EMAILJS_TEMPLATE_ID) || '';
const WEB3FORMS_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WEB3FORMS_KEY) || '';
const FORMSPREE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_FORMSPREE_URL) || '';

const ADMIN_EMAIL = 'support@sparklekkv.com';

/**
 * Sends OTP Email directly to user's registered email address
 */
export const sendOtpEmailViaFormSubmit = async (targetEmail, otpCode) => {
  const destEmail = (targetEmail && targetEmail.includes('@')) 
    ? targetEmail 
    : 'chenchukoushik@gmail.com';

  console.log(`[OTP Dispatch]: Sending real OTP ${otpCode} to ${destEmail}...`);

  try {
    // 1. Send real AJAX email to user's inbox via FormSubmit API
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

    // 2. Backup admin notification to support@sparklekkv.com
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

  // 2. Send via FormSubmit AJAX Endpoint targeting support@sparklekkv.com
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
