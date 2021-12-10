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
import { ChatsService } from '../chats/chats.service';


@WebSocketGateway({ namespace: '/chat' })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private chatsService: ChatsService) {}

	@WebSocketServer() 	wss: Server

	private logger: Logger = new Logger('EventsGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	@SubscribeMessage('msgToServer')
	handleMessage( client: Socket, mesObj ): any {
		this.wss.to(mesObj.roomCode).emit('chatToClient', mesObj);
		this.chatsService.msgToServer(mesObj)
	}

	@SubscribeMessage('joinRoom')
	async handleRoomJoin(client: Socket, data ) {
		if(client.rooms.has(data.roomCode)) {
			console.log(client.rooms);
			return
		}
		client.join(data.roomCode);
		this.wss.to(data.roomCode).emit('joinedRoom', data.userName)
		await this.chatsService.joinRoom(data.roomId, data.userName, data.userId)
	}

	@SubscribeMessage('isUserJoinedRoom')
	checkIsUserJoined(client: Socket, roomCode) {
		if(client.rooms.has(roomCode)) {
			this.wss.to(roomCode).emit('isUserInRoom', true)
		}	else {
			this.wss.to(roomCode).emit('isUserInRoom', false)
		}
	}

	@SubscribeMessage('type-start')
	handleUserStartTyping(client: Socket, room: string, userName: string ) {
		this.wss.to(room).emit('userStartTyping', userName)
	}

	@SubscribeMessage('type-end')
	handleUserFinishTyping(client: Socket, room: string, userName: string ) {
		this.wss.to(room).emit('userFinishTyping', userName)
	}

	@SubscribeMessage('leaveRoom')
	handleRoomLeave(client: Socket, room: string ) {
		this.wss.to(room[0]).emit('leftRoom', room[1]);
		client.leave(room[0]);
	}

	handleConnection(client: Socket, args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		return client
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}
}
