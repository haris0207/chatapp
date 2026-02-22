'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import styles from './UsernameForm.module.css';

interface UsernameFormProps {
    onSubmit: (username: string) => void;
}

export default function UsernameForm({ onSubmit }: UsernameFormProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = useCallback(() => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Please enter a username');
            return;
        }
        if (trimmed.length < 2) {
            setError('Username must be at least 2 characters');
            return;
        }
        if (trimmed.length > 20) {
            setError('Username must be 20 characters or less');
            return;
        }
        setError('');
        onSubmit(trimmed);
    }, [name, onSubmit]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
            }
        },
        [handleSubmit],
    );

    return (
        <div className={styles.backdrop}>
            <div className={`card card--glow ${styles.card} animate-slide-up`}>
                <div className={styles.iconWrapper}>
                    <span className={styles.icon}>💬</span>
                </div>
                <h1 className={styles.title}>
                    <span className="text-gradient">ChatApp</span>
                </h1>
                <p className={styles.subtitle}>Enter a username to join the chatroom</p>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        className={`input ${styles.field}`}
                        placeholder="Your username…"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyDown={handleKeyDown}
                        maxLength={20}
                        autoFocus
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <button
                    className={`btn btn-primary ${styles.button}`}
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                >
                    Join Chat
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
