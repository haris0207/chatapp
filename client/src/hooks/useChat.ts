'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ConnectionStatus } from '@/types/chat';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useChat(username: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!username) return;

        setStatus('connecting');

        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setStatus('connected');
            socket.emit('getMessages');
        });

        socket.on('disconnect', () => {
            setStatus('disconnected');
        });

        socket.on('messageHistory', (history: ChatMessage[]) => {
            setMessages(history);
        });

        socket.on('newMessage', (message: ChatMessage) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [username]);

    const sendMessage = useCallback(
        (text: string) => {
            if (!socketRef.current || !text.trim()) return;
            socketRef.current.emit('sendMessage', {
                username,
                text: text.trim(),
            });
        },
        [username],
    );

    return { messages, sendMessage, status };
}
