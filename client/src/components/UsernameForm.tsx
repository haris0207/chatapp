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
            setError('Please enter a display name');
            return;
        }
        if (trimmed.length < 2) {
            setError('Display name must be at least 2 characters');
            return;
        }
        if (trimmed.length > 20) {
            setError('Display name must be 20 characters or less');
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
                <p className={styles.subtitle}>
                    Join the public chatroom — pick a display name to get started
                </p>

                <div className={styles.features}>
                    <span className={styles.featureTag}>🌐 Real-time</span>
                    <span className={styles.featureTag}>👥 Multi-user</span>
                    <span className={styles.featureTag}>🔓 No login required</span>
                </div>

                <div className={styles.inputGroup} role="search">
                    <label htmlFor="displayname" className={styles.label}>
                        Display Name
                    </label>
                    <input
                        type="text"
                        name="displayname"
                        id="displayname"
                        className={`input ${styles.field}`}
                        placeholder="e.g. Alex, CoolCat99…"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyDown={handleKeyDown}
                        maxLength={20}
                        autoFocus
                        autoComplete="off"
                        data-1p-ignore
                        data-lpignore="true"
                        data-form-type="other"
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <button
                    className={`btn btn-primary ${styles.button}`}
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                    type="button"
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

                <p className={styles.disclaimer}>
                    No account needed — just pick a name and start chatting.
                </p>
            </div>
        </div>
    );
}
