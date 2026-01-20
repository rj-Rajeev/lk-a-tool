// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

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

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  // console.log("Notification received:", JSON.stringify(payload, null, 2));
  
  const notificationTitle = payload.notification?.title || payload.data?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "You have a new message.",
    icon: payload.notification?.icon || payload.data?.icon || "/next.svg", // Fallback icon
    image: payload.notification?.image || payload.data?.image, // Big picture preview
    badge: "/window.svg", // Small icon shown in the status bar
    tag: payload.data?.tag || "default-tag", // Groups notifications; same tag overwrites previous one
    data: {
      url: payload.data?.url || "/", // Custom data to use when the user clicks
    },
    vibrate: [200, 100, 200],
  };
  

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
