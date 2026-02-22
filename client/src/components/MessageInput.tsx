'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import styles from './MessageInput.module.css';

interface MessageInputProps {
    onSend: (text: string) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSend, disabled = false }: MessageInputProps) {
    const [text, setText] = useState('');

    const handleSend = useCallback(() => {
        if (!text.trim() || disabled) return;
        onSend(text);
        setText('');
    }, [text, disabled, onSend]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend],
    );

    return (
        <div className={styles.container}>
            <div className={styles.inputRow}>
                <input
                    type="text"
                    className={`input ${styles.field}`}
                    placeholder="Type a message…"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    autoFocus
                />
                <button
                    className="btn btn-icon"
                    onClick={handleSend}
                    disabled={disabled || !text.trim()}
                    aria-label="Send message"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
