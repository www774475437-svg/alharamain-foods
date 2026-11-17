// إعدادات Firebase للويب — هذه مفاتيح عامة (ليست أسراراً). Firebase web config — public identifiers, not secrets.
// Access is protected by firestore.rules and Authentication, not by hiding these values.
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAeT09q7GylcSQgMO63rS8kj5tiA6A7Fe4",
  authDomain: "alharamain-foods.firebaseapp.com",
  projectId: "alharamain-foods",
  storageBucket: "alharamain-foods.firebasestorage.app",
  messagingSenderId: "764340703207",
  appId: "1:764340703207:web:b9d2f7c178a2c008713742"
};

// مفتاح موقع reCAPTCHA v3 (عام، ليس سرياً). يُملأ بعد إنشائه من Google reCAPTCHA
export const RECAPTCHA_SITE_KEY = "6LfAJSUuAAAAANLskhWVtOfyAAUu7qRu92-kVZ6P";
