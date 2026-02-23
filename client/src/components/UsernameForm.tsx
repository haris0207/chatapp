'use client';

import { useState, useCallback, KeyboardEvent } from 'react';
import styles from './UsernameForm.module.css';

interface UsernameFormProps {
    onSubmit: (username: string, roomId: string, password?: string) => void;
    prefilledRoomId?: string;
}

export default function UsernameForm({ onSubmit, prefilledRoomId }: UsernameFormProps) {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState(prefilledRoomId || '');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = useCallback(() => {
        const trimmedName = name.trim();
        const trimmedRoomId = roomId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');

        if (!trimmedName) {
            setError('Please enter a display name');
            return;
        }
        if (trimmedName.length < 2 || trimmedName.length > 20) {
            setError('Display name must be 2-20 characters');
            return;
        }
        if (!trimmedRoomId) {
            setError('Please enter a Room ID');
            return;
        }

        setError('');
        onSubmit(trimmedName, trimmedRoomId, password || undefined);
    }, [name, roomId, password, onSubmit]);

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
                    {prefilledRoomId ? `Join ${prefilledRoomId}` : 'Create or join a private room'}
                </p>

                <div className={styles.inputGroup}>
                    <label htmlFor="displayname" className={styles.label}>
                        Display Name
                    </label>
                    <input
                        type="text"
                        name="displayname"
                        id="displayname"
                        className={`input ${styles.field}`}
                        placeholder="e.g. Alex"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyDown={handleKeyDown}
                        maxLength={20}
                        autoFocus
                        autoComplete="off"
                    />
                </div>

                {!prefilledRoomId && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="roomid" className={styles.label}>
                            Room ID
                        </label>
                        <input
                            type="text"
                            name="roomid"
                            id="roomid"
                            className={`input ${styles.field}`}
                            placeholder="e.g. dev-chat"
                            value={roomId}
                            onChange={(e) => {
                                setRoomId(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                if (error) setError('');
                            }}
                            onKeyDown={handleKeyDown}
                            maxLength={30}
                            autoComplete="off"
                        />
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>
                        Room Password (Optional)
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        className={`input ${styles.field}`}
                        placeholder="Leave blank for public room"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    {error && <p className={styles.error}>{error}</p>}
                </div>

                <button
                    className={`btn btn-primary ${styles.button}`}
                    onClick={handleSubmit}
                    disabled={!name.trim() || !roomId.trim()}
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
            </div>
        </div>
    );
}
