import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/alert' })
export class ChatAlertGateway {

  @WebSocketServer() wss: Server;

  sendToAll(msg: string) {
    this.wss.emit('alertToClient', { type: 'Alert', message: msg });
  }
}
