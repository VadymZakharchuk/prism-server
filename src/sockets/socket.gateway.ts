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

@WebSocketGateway({ namespace: '/chat' })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() 	wss: Server

	private logger: Logger = new Logger('EventsGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	@SubscribeMessage('msgToServer')
	handleMessage(
		client: Socket,
		mesObj: { sender: string, room: string, message: string }): any {
		this.logger.log(mesObj);
		this.wss.to(mesObj.room).emit('chatToClient', mesObj);
	}

	@SubscribeMessage('joinRoom')
	handleRoomJoin(client: Socket, room: string ) {
		client.join(room);
		this.wss.to(room).emit('joinedRoom', room)
		return room
	}

	@SubscribeMessage('leaveRoom')
	handleRoomLeave(client: Socket, room: string ) {
		client.leave(room);
		client.emit('leftRoom', room);
	}

	handleConnection(client: Socket, args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		return client
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}
}
