importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBssnq74-MqEXIZmZo4-3ZqKudWmDSp61c",
  authDomain: "li-au-ap.firebaseapp.com",
  projectId: "li-au-ap",
  storageBucket: "li-au-ap.firebasestorage.app",
  messagingSenderId: "972275251739",
  appId: "1:972275251739:web:c104030a177a7173c356be",
  measurementId: "G-81MNT19XLD"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/next.svg',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});