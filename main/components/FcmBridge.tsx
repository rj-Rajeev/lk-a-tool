'use client';

import { useFcmToken } from '@/hooks/useFcmToken';

export default function EnableNotificationsButton() {
  const { token, requestPermissionAndToken, loading } = useFcmToken();

  console.log(token);
  

  return (
    <button onClick={requestPermissionAndToken} disabled={loading}>
      Enable Notifications
    </button>
  );
}
