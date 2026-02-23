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

const urlRegex = /(https?:\/\/[^\s]+)/g;
const imageRegex = /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i;

function renderTextWithLinks(text: string) {
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
        if (part.match(urlRegex)) {
            if (part.match(imageRegex)) {
                return (
                    <div key={i} className={styles.imageAttachmentWrapper}>
                        <a href={part} target="_blank" rel="noopener noreferrer">
                            <img src={part} alt="Attached image" className={styles.imageAttachment} loading="lazy" />
                        </a>
                    </div>
                );
            }
            return (
                <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {part}
                </a>
            );
        }
        return <span key={i}>{part}</span>;
    });
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    const ephemeralStyle = message.isEphemeral ? {
        border: '1px dashed rgba(255, 100, 100, 0.5)',
        background: isOwn ? 'rgba(50, 0, 0, 0.4)' : 'rgba(30, 0, 0, 0.3)'
    } : {};

    return (
        <div
            className={`${styles.wrapper} ${isOwn ? styles.own : styles.other} animate-fade-in-up`}
        >
            <div className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`} style={ephemeralStyle}>
                {!isOwn && (
                    <span className={styles.username}>{message.username}</span>
                )}
                {message.isEphemeral && (
                    <span style={{ fontSize: '0.8rem', color: '#ff6666', marginBottom: '4px', display: 'block' }}>
                        👻 Ephemeral Message
                    </span>
                )}
                <div className={styles.text}>{renderTextWithLinks(message.text)}</div>
                <time className={styles.time}>{formatTime(message.timestamp)}</time>
            </div>
        </div>
    );
}

