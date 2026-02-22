'use client';

import { useChat } from '@/hooks/useChat';
import StatusIndicator from './StatusIndicator';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import styles from './ChatRoom.module.css';

interface ChatRoomProps {
    username: string;
    onLeave: () => void;
}

export default function ChatRoom({ username, onLeave }: ChatRoomProps) {
    const { messages, sendMessage, status } = useChat(username);

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>
                            <span className="text-gradient">ChatApp</span>
                        </h1>
                        <StatusIndicator status={status} />
                    </div>
                    <div className={styles.headerRight}>
                        <span className={styles.user}>
                            👤 {username}
                        </span>
                        <button className={styles.leaveBtn} onClick={onLeave}>
                            Leave
                        </button>
                    </div>
                </div>
            </header>

            {/* Messages */}
            <MessageList messages={messages} currentUsername={username} />

            {/* Input */}
            <MessageInput
                onSend={sendMessage}
                disabled={status !== 'connected'}
            />
        </div>
    );
}
