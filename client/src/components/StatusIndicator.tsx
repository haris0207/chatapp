'use client';

import { ConnectionStatus } from '@/types/chat';
import styles from './StatusIndicator.module.css';

interface StatusIndicatorProps {
    status: ConnectionStatus;
}

const STATUS_LABELS: Record<ConnectionStatus, string> = {
    connected: 'Connected',
    connecting: 'Connecting…',
    disconnected: 'Disconnected',
};

export default function StatusIndicator({ status }: StatusIndicatorProps) {
    return (
        <span className={`badge ${styles.indicator}`}>
            <span className={`${styles.dot} ${styles[status]}`} />
            {STATUS_LABELS[status]}
        </span>
    );
}
