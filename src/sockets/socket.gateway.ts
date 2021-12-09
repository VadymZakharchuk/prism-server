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
		client.join(data.roomCode);
		this.wss.to(data.roomCode).emit('joinedRoom', data.userName)
		await this.chatsService.joinRoom(data.roomId, data.userName, data.userId)
	}

	@SubscribeMessage('type-start')
	handleUserStartTyping(client: Socket, room: string, userName: string ) {
		this.wss.to(room).emit('userStartTyping', userName)
	}

	@SubscribeMessage('type-end')
	handleUserFinishTyping(client: Socket, room: string, userName: string ) {
		this.wss.to(room).emit('userFinishTyping', userName)
	}

	@SubscribeMessage('base64 file')
	async handleUploadFile(client: Socket, msg) {
		const res = await msg
		console.log(res.fileName);
		this.wss.to(res.room).emit('userSentFile',{
			type: res.type,
			sender: res.sender,
			room: res.room,
			file: res.file,
			fileName: res.fileName,
			ets: res.ets,
			TimeZoneOffset: res.TimeZoneOffset
		})
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
