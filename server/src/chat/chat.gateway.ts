import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface ChatMessage {
    id: string;
    username: string;
    text: string;
    timestamp: number;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private messages: ChatMessage[] = [];
    private readonly MAX_MESSAGES = 100;

    handleConnection(client: Socket): void {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody() data: { username: string; text: string },
        @ConnectedSocket() client: Socket,
    ): void {
        const message: ChatMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            username: data.username,
            text: data.text,
            timestamp: Date.now(),
        };

        this.messages.push(message);

        // Keep only the last MAX_MESSAGES
        if (this.messages.length > this.MAX_MESSAGES) {
            this.messages = this.messages.slice(-this.MAX_MESSAGES);
        }

        this.server.emit('newMessage', message);
    }

    @SubscribeMessage('getMessages')
    handleGetMessages(
        @ConnectedSocket() client: Socket,
    ): void {
        client.emit('messageHistory', this.messages);
    }

    @SubscribeMessage('clearMessages')
    handleClearMessages(): void {
        this.messages = [];
        this.server.emit('messagesCleared');
    }
}
