'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import MessageBubble from './MessageBubble';
import styles from './MessageList.module.css';

interface MessageListProps {
    messages: ChatMessage[];
    currentUsername: string;
}

export default function MessageList({ messages, currentUsername }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={styles.container}>
            {messages.length === 0 ? (
                <div className={styles.empty}>
                    <p className={styles.emptyIcon}>💬</p>
                    <p className={styles.emptyText}>No messages yet</p>
                    <p className={styles.emptyHint}>Be the first to say something!</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isOwn={msg.username === currentUsername}
                        />
                    ))}
                </div>
            )}
            <div ref={bottomRef} />
        </div>
    );
}
