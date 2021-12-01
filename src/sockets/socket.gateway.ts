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

const m = (name, text ) => ({ name, text })

@WebSocketGateway()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server
	private logger: Logger = new Logger('EventsGateway');

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, payload: string): void {
		this.server.emit('msgToClient', payload);
	}

	@SubscribeMessage('userJoined')
	handleUserJoin(client: Socket, payload): void {
		const handShake = `Welcome on board, ${payload.userName}`
		console.log(handShake);
		this.server.emit('handShakeClient', m('Admin', handShake));
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		return client
	}
}
