import {
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayInit,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server
	private logger: Logger = new Logger('EventsGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, message: { sender: string, room: string, message: string }): void {
		this.server.to(message.room).emit('chatToClient', message);
	}

	@SubscribeMessage('userJoined')
	handleRoomJoin(client: Socket, room: string ) {
		client.join(room);
		client.emit('joinedRoom', room);
	}

	handleConnection(client: Socket, args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		return client
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('leaveRoom')
	handleRoomLeave(client: Socket, room: string ) {
		client.leave(room);
		client.emit('leftRoom', room);
	}

}
