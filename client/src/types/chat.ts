export interface ChatMessage {
    id: string;
    username: string;
    text: string;
    timestamp: number;
    isEphemeral?: boolean;
}

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';
