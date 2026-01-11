import { useState } from 'react';
import { getToken } from "firebase/messaging";
import { messaging } from '@/lib/firebase';

export function useFcmToken() {
    const [token, setToken] = useState<string | null>(null);

    const requestToken = async () => {
        // Guard clause: Exit if on server or if messaging isn't supported
        if (typeof window === "undefined" || !messaging) {
            console.warn("Messaging is not supported in this environment.");
            return;
        }

        console.log('token requesting....');
        

        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                const currentToken = await getToken(messaging, { 
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_PUBLIC_KEY!
                });

                if (currentToken) {
                    setToken(currentToken);

                    await fetch("/api/fcm", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            token: currentToken,
                            deviceType: navigator.userAgent.includes("Mobile") ? "mobile_web" : "desktop_web"
                        }),
                    });

                    console.log('FCM Token saved to DB');
                    return currentToken;
                }
            }
        } catch (error) {
            console.error("FCM Error:", error);
        }
    };

    return { token, requestToken };
}
