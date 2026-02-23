'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ConnectionStatus } from '@/types/chat';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export function useChat(username: string, roomId?: string, password?: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [joinError, setJoinError] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

    useEffect(() => {
        if (!username || !roomId) return;

        setStatus('connecting');
        setJoinError(null);

        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setStatus('connected');
            socket.emit('joinRoom', { roomId, password, username });
        });

        socket.on('roomJoined', () => {
            setJoinError(null);
            // We get messageHistory right after joining
        });

        socket.on('joinError', (errorMsg: string) => {
            setJoinError(errorMsg);
            socket.disconnect();
            setStatus('disconnected');
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

        socket.on('messageExpired', (messageId: string) => {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        });

        socket.on('messagesCleared', () => {
            setMessages([]);
        });

        socket.on('usersOnline', (users: string[]) => {
            setOnlineUsers(users);
        });

        socket.on('userTyping', ({ username: typingUsername, isTyping }: { username: string; isTyping: boolean }) => {
            if (isTyping) {
                setTypingUsers((prev) => prev.includes(typingUsername) ? prev : [...prev, typingUsername]);

                if (typingTimeouts.current[typingUsername]) {
                    clearTimeout(typingTimeouts.current[typingUsername]);
                }

                // Auto-clear after 3 seconds of no updates
                typingTimeouts.current[typingUsername] = setTimeout(() => {
                    setTypingUsers((prev) => prev.filter(u => u !== typingUsername));
                    delete typingTimeouts.current[typingUsername];
                }, 3000);
            } else {
                setTypingUsers((prev) => prev.filter((u) => u !== typingUsername));
                if (typingTimeouts.current[typingUsername]) {
                    clearTimeout(typingTimeouts.current[typingUsername]);
                    delete typingTimeouts.current[typingUsername];
                }
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [username, roomId, password]);

    const sendMessage = useCallback(
        (text: string, isEphemeral?: boolean) => {
            if (!socketRef.current || !text.trim()) return;
            socketRef.current.emit('sendMessage', {
                username,
                text: text.trim(),
                isEphemeral,
            });
        },
        [username],
    );

    const clearMessages = useCallback(() => {
        if (!socketRef.current) return;
        socketRef.current.emit('clearMessages');
    }, []);

    const sendTyping = useCallback((isTyping: boolean) => {
        if (!socketRef.current) return;
        socketRef.current.emit('typing', { isTyping });
    }, []);

    return { messages, onlineUsers, typingUsers, sendMessage, clearMessages, sendTyping, status, joinError };
}
