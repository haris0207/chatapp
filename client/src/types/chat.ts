export interface ChatMessage {
    id: string;
    username: string;
    text: string;
    timestamp: number;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';
