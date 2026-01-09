// hooks/useFcmToken.ts
'use client';

import { useState } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';

export function useFcmToken() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermissionAndToken = async () => {
    if (!messaging) return;

    try {
      setLoading(true);

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (currentToken) {
        setToken(currentToken);
      }
    } finally {
      setLoading(false);
    }
  };

  return { token, loading, requestPermissionAndToken };
}
