// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD4WRo04On41izRWoi11xqjS_G0LT_p2xs",
    authDomain: "book-store-1e463.firebaseapp.com",
    projectId: "book-store-1e463",
    storageBucket: "book-store-1e463.firebasestorage.app",
    messagingSenderId: "1060024233909",
    appId: "1:1060024233909:web:54f0f3e578123476bd73fc",
    measurementId: "G-Z7CSSD6KPT"  
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
