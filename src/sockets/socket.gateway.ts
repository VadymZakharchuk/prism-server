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
import { SocketsService } from './sockets.service';


@WebSocketGateway({ namespace: '/chat' })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private socketService: SocketsService,
		private chatsService: ChatsService
	) {}

	@WebSocketServer() 	wss: Server

	private logger: Logger = new Logger('EventsGateway');

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	@SubscribeMessage('msgToServer')
	async handleMessage( client: Socket, mesObj ) {
		this.wss.to(mesObj.roomCode).emit('chatToClient', mesObj);
		const res = await this.chatsService.msgToServer(mesObj)
		await this.chatsService.msgToClient(res.id, mesObj.roomId, mesObj.user.id)
	}

	@SubscribeMessage('joinRoom')
	async handleRoomJoin(client: Socket, data ) {
		if(client.rooms.has(data.roomCode)) {
			return
		}
		const res = await this.chatsService.joinRoom(data.roomId, data.userName, data.userId)
		if (res === false ) {
			client.emit('joinRefused', data.userName)
			return
		}
		client.join(data.roomCode);
		this.wss.to(data.roomCode).emit('joinedRoom', data.userName)
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

	async handleConnection(client: Socket, args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		const userId = client.handshake.query.userId.toString()
		await this.socketService.setUserStatus(userId, true);
		return client
	}

	async handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		const userId = client.handshake.query.userId.toString()
		await this.socketService.setUserStatus(userId, false);
	}
}
