// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyD4WRo04On41izRWoi11xqjS_G0LT_p2xs",
    authDomain: "book-store-1e463.firebaseapp.com",
    projectId: "book-store-1e463",  
    messagingSenderId: "1060024233909",
    appId: "1:1060024233909:web:54f0f3e578123476bd73fc"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermissionAndToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BMvnQWs8YZyn4VTCsIAwaFsoICbsKbI9mRRkL5LW9PsR32VLwCMBUXHT4m_TVXbu1imi4hp9S2tmP39-xreGc1A',
    });
    return token;
  } catch (err) {
    console.error('Permission denied or error occurred:', err);
    return null;
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
