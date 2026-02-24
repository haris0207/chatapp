'use client';

import { useChat } from '@/hooks/useChat';
import StatusIndicator from './StatusIndicator';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ActiveUsersSidebar from './ActiveUsersSidebar'; // Warning: ActiveUsersSidebar may not work perfectly with rooms yet if we didn't implement it cleanly on server side, but we'll ignore for now or remove it.
import styles from './ChatRoom.module.css';

interface ChatRoomProps {
    username: string;
    roomId: string;
    password?: string;
    action?: 'create' | 'join';
    onLeave: () => void;
}

export default function ChatRoom({ username, roomId, password, action = 'join', onLeave }: ChatRoomProps) {
    const { messages, onlineUsers, typingUsers, sendMessage, clearMessages, sendTyping, status, joinError } = useChat(username, roomId, password, action);

    const handleSendMessage = (text: string, isEphemeral?: boolean) => {
        let finalText = text.trim();

        if (finalText === '/clear') {
            clearMessages();
            return;
        }

        if (finalText.includes('/shrug')) {
            finalText = finalText.replace(/\/shrug/g, '¯\\_(ツ)_/¯');
        }

        if (finalText.startsWith('/roll')) {
            const match = finalText.match(/^\/roll\s*(\d+)?$/);
            const max = match && match[1] ? parseInt(match[1], 10) : 100;
            const roll = Math.floor(Math.random() * max) + 1;
            finalText = `🎲 rolled ${roll} (out of ${max})`;
        }

        sendMessage(finalText, isEphemeral);
    };

    if (joinError) {
        return (
            <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Access Denied</h2>
                    <p>{joinError}</p>
                    <button className={`btn btn-primary`} style={{ marginTop: '1rem' }} onClick={onLeave}>Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>
                            <span className="text-gradient">{roomId.toUpperCase()}</span>
                        </h1>
                        <StatusIndicator status={status} />
                    </div>
                    <div className={styles.headerRight}>
                        <span className={styles.user}>
                            👤 {username}
                        </span>
                        <button
                            className={styles.clearBtn}
                            onClick={clearMessages}
                            disabled={messages.length === 0}
                        >
                            Clear
                        </button>
                        <button className={styles.leaveBtn} onClick={onLeave}>
                            Leave
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className={styles.mainArea}>
                {/* Chat Column */}
                <div className={styles.chatArea}>
                    <MessageList messages={messages} currentUsername={username} />

                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                        <div className={styles.typingIndicator}>
                            <span className={styles.typingDots}>
                                {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing<span className={styles.dot1}>.</span><span className={styles.dot2}>.</span><span className={styles.dot3}>.</span>
                            </span>
                        </div>
                    )}

                    <MessageInput
                        onSend={handleSendMessage}
                        onTyping={sendTyping}
                        disabled={status !== 'connected'}
                    />
                </div>
            </div>
        </div>
    );
}
