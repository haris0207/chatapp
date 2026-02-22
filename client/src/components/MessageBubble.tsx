'use client';

import { ChatMessage } from '@/types/chat';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
    message: ChatMessage;
    isOwn: boolean;
}

function formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    return (
        <div
            className={`${styles.wrapper} ${isOwn ? styles.own : styles.other} animate-fade-in-up`}
        >
            <div className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}>
                {!isOwn && (
                    <span className={styles.username}>{message.username}</span>
                )}
                <p className={styles.text}>{message.text}</p>
                <time className={styles.time}>{formatTime(message.timestamp)}</time>
            </div>
        </div>
    );
}
