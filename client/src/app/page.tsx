'use client';

import { useRouter } from 'next/navigation';
import UsernameForm from '@/components/UsernameForm';

export default function Home() {
  const router = useRouter();

  const handleJoin = (username: string, roomId: string, password?: string, action?: 'create' | 'join') => {
    // Navigate to the room URL, passing username and password via query or sessionStorage.
    // For simplicity stringifying into sessionStorage, but query params allow direct sharing link
    sessionStorage.setItem('chatUsername', username);
    if (password) {
      sessionStorage.setItem(`chatPwd_${roomId}`, password);
    }
    if (action) {
      sessionStorage.setItem(`chatAction_${roomId}`, action);
    }

    router.push(`/room/${roomId}`);
  };

  return <UsernameForm onSubmit={handleJoin} />;
}
