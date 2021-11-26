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
	wsClients=[]
	private logger: Logger = new Logger('EventsGateway');

	@SubscribeMessage('msgToServer')
	handleMessage(client: Socket, payload: string): void {
		this.server.emit('msgToClient', payload);
	}

	afterInit(server: Server) {
		this.logger.log('Init');
	}

	handleDisconnect(client: Socket) {
		for (let i = 0; i < this.wsClients.length; i++) {
			if (this.wsClients[i] === client) {
				this.wsClients.splice(i, 1);
				break;
			}
		}
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
		this.wsClients.push(client)
	}

	broadcast(event, message: any) {
		const broadCastMessage = JSON.stringify(message);
		for (let c of this.wsClients) {
			c.send(event, broadCastMessage);
		}
	}
}
