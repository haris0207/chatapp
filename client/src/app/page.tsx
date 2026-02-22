'use client';

import { useState } from 'react';
import UsernameForm from '@/components/UsernameForm';
import ChatRoom from '@/components/ChatRoom';

export default function Home() {
  const [username, setUsername] = useState('');

  if (!username) {
    return <UsernameForm onSubmit={setUsername} />;
  }

  return <ChatRoom username={username} onLeave={() => setUsername('')} />;
}
