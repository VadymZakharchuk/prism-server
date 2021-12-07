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
		this.wss.to(mesObj.room).emit('chatToClient', mesObj);
	}

	@SubscribeMessage('joinRoom')
	handleRoomJoin(client: Socket, room: string, userName: string ) {
		client.join(room);
		this.wss.to(room).emit('joinedRoom', room)
		return userName
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
	handleUploadFile(client: Socket, msg) {
		console.log(msg.fileName);
		this.wss.to(msg.room).emit('userSentFile',{
			type: msg.type,
			sender: msg.sender,
			room: msg.room,
			file: msg.file,
			fileName: msg.fileName,
			ets: msg.ets,
			TimeZoneOffset: msg.TimeZoneOffset
		})
	}

	@SubscribeMessage('leaveRoom')
	handleRoomLeave(client: Socket, room: string ) {
		console.log(room);
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
