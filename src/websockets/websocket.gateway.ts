import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { MessageFromClientDto } from './entities/message-from-client.dto';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(private readonly websocketService: WebsocketService) {}

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      this.websocketService.registerClient(socket);

      socket.on('disconnect', () => {
        this.websocketService.removeClient(socket);
      });
    });
  }

  @SubscribeMessage('read-notification')
  readNotification(client: Socket, payload: MessageFromClientDto) {
    this.websocketService.updateRead(
      payload.userId,
      client,
      payload.notificationId,
    );
  }

  @SubscribeMessage('generate-notification')
  generateNotification(client: Socket, payload: CreateNotificationDto) {
    this.websocketService.generateNotification(client, payload);
  }
}
