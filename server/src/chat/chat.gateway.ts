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
    isEphemeral?: boolean;
}

interface RoomData {
    password?: string;
    messages: ChatMessage[];
    users: Map<string, string>; // socketId -> username
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Room ID -> Room Data
    private rooms: Map<string, RoomData> = new Map();
    // Socket ID -> Room ID they are currently in
    private clientRooms: Map<string, string> = new Map();

    private readonly MAX_MESSAGES = 100;
    private readonly EPHEMERAL_TIMEOUT = 10000; // 10 seconds

    handleConnection(client: Socket): void {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);
        const roomId = this.clientRooms.get(client.id);
        if (roomId) {
            client.leave(roomId);
            this.clientRooms.delete(client.id);
            const room = this.rooms.get(roomId);
            if (room) {
                room.users.delete(client.id);
                this.broadcastActiveUsers(roomId);
            }
        }
    }

    private broadcastActiveUsers(roomId: string) {
        const room = this.rooms.get(roomId);
        if (!room) return;
        const users = Array.from(new Set(room.users.values()));
        this.server.to(roomId).emit('usersOnline', users);
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @MessageBody() data: { roomId: string; password?: string; username: string; action?: 'create' | 'join' },
        @ConnectedSocket() client: Socket,
    ): void {
        const { roomId, password, username, action = 'join' } = data;
        let room = this.rooms.get(roomId);

        if (action === 'create') {
            if (room) {
                client.emit('joinError', 'Room already exists');
                return;
            }
            room = { password, messages: [], users: new Map() };
            this.rooms.set(roomId, room);
        } else if (action === 'join') {
            if (!room) {
                client.emit('joinError', 'Room does not exist');
                return;
            }
            // Check password if joining an existing protected room
            if (room.password && room.password !== password) {
                client.emit('joinError', 'Invalid password');
                return;
            }
        }

        // Safety check to appease TypeScript, though logic guarantees room is defined here
        if (!room) return;

        // Leave previous room if any
        const prevRoom = this.clientRooms.get(client.id);
        if (prevRoom) {
            client.leave(prevRoom);
            const pRoom = this.rooms.get(prevRoom);
            if (pRoom) {
                pRoom.users.delete(client.id);
                this.broadcastActiveUsers(prevRoom);
            }
        }

        // Join new room
        client.join(roomId);
        this.clientRooms.set(client.id, roomId);
        room.users.set(client.id, username || 'Anonymous');

        client.emit('roomJoined', roomId);
        client.emit('messageHistory', room.messages);
        this.broadcastActiveUsers(roomId);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(
        @MessageBody() data: { username: string; text: string; isEphemeral?: boolean },
        @ConnectedSocket() client: Socket,
    ): void {
        const roomId = this.clientRooms.get(client.id);
        if (!roomId) return; // User must be in a room

        const room = this.rooms.get(roomId);
        if (!room) return;

        const message: ChatMessage = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            username: data.username,
            text: data.text,
            timestamp: Date.now(),
            isEphemeral: data.isEphemeral,
        };

        room.messages.push(message);

        if (room.messages.length > this.MAX_MESSAGES) {
            room.messages = room.messages.slice(-this.MAX_MESSAGES);
        }

        this.server.to(roomId).emit('newMessage', message);

        // Handle ephemeral self-destruct
        if (message.isEphemeral) {
            setTimeout(() => {
                // Delete from memory
                room.messages = room.messages.filter((m) => m.id !== message.id);
                // Tell clients to remove it
                this.server.to(roomId).emit('messageExpired', message.id);
            }, this.EPHEMERAL_TIMEOUT);
        }
    }

    @SubscribeMessage('typing')
    handleTyping(
        @MessageBody() data: { isTyping: boolean },
        @ConnectedSocket() client: Socket,
    ): void {
        const roomId = this.clientRooms.get(client.id);
        if (!roomId) return;

        const room = this.rooms.get(roomId);
        if (!room) return;

        const username = room.users.get(client.id);
        if (username) {
            client.broadcast.to(roomId).emit('userTyping', { username, isTyping: data.isTyping });
        }
    }

    @SubscribeMessage('getMessages')
    handleGetMessages(
        @ConnectedSocket() client: Socket,
    ): void {
        const roomId = this.clientRooms.get(client.id);
        if (roomId && this.rooms.has(roomId)) {
            client.emit('messageHistory', this.rooms.get(roomId)?.messages || []);
        }
    }

    @SubscribeMessage('clearMessages')
    handleClearMessages(
        @ConnectedSocket() client: Socket,
    ): void {
        const roomId = this.clientRooms.get(client.id);
        if (roomId && this.rooms.has(roomId)) {
            const room = this.rooms.get(roomId);
            if (room) {
                room.messages = [];
                this.server.to(roomId).emit('messagesCleared');
            }
        }
    }
}
