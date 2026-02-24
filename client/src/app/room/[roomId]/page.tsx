'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UsernameForm from '@/components/UsernameForm';
import ChatRoom from '@/components/ChatRoom';

export default function RoomPage() {
    const params = useParams();
    const router = useRouter();
    const [roomId, setRoomId] = useState<string>('');
    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | undefined>();
    const [action, setAction] = useState<'create' | 'join'>('join');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (params.roomId) {
            const rid = params.roomId as string;
            setRoomId(rid);

            // Check if we already have username/password in sessionStorage from landing page
            const savedUsername = sessionStorage.getItem('chatUsername');
            const savedPwd = sessionStorage.getItem(`chatPwd_${rid}`);
            const savedAction = sessionStorage.getItem(`chatAction_${rid}`) as 'create' | 'join' | null;

            if (savedUsername) {
                setUsername(savedUsername);
                if (savedPwd) setPassword(savedPwd);
                if (savedAction) setAction(savedAction);
            }
        }
    }, [params]);

    if (!isClient) return null; // Avoid hydration mismatch

    const handleJoin = (name: string, rid: string, pwd?: string, act?: 'create' | 'join') => {
        sessionStorage.setItem('chatUsername', name);
        if (pwd) sessionStorage.setItem(`chatPwd_${rid}`, pwd);
        if (act) sessionStorage.setItem(`chatAction_${rid}`, act);

        setUsername(name);
        setPassword(pwd);
        if (act) setAction(act);

        // If they changed the room ID in the form, route there
        if (rid !== roomId) {
            router.push(`/room/${rid}`);
        }
    };

    const handleLeave = () => {
        sessionStorage.removeItem('chatUsername');
        setUsername(null);
        router.push('/');
    };

    if (!username) {
        return <UsernameForm onSubmit={handleJoin} prefilledRoomId={roomId} />;
    }

    return (
        <ChatRoom
            username={username}
            roomId={roomId}
            password={password}
            action={action}
            onLeave={handleLeave}
        />
    );
}
