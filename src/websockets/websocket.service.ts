import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import {
  Notification,
  NotificationType,
} from 'src/notification/entities/notification.interface';
import { NotificationService } from 'src/notification/notification.service';
import { ConnectedClients } from './entities/connected-clients.interface';

@Injectable()
export class WebsocketService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) {}

  private connectedClients: ConnectedClients = {};

  async registerClient(client: Socket) {
    try {
      const token = client.handshake.headers.authentication as string;

      if (!token) {
        return this.removeClient(client);
      }

      const payload = await this.authService.validateToken(token);

      if (!payload || !payload.id) {
        return this.removeClient(client);
      }

      const userId = payload.id.toString();

      this.checkUserConnected(userId);

      this.connectedClients[client.id] = {
        socket: client,
        userId,
      };

      this.emitNotificationNotRead(userId, client);
    } catch (e) {
      client.emit('error', 'Failed to authenticate user');
      this.removeClient(client);
    }
  }

  removeClient(client: Socket) {
    client.disconnect(true);
    delete this.connectedClients[client.id];
  }

  async updateRead(userId: string, client: Socket, notificationId: string) {
    try {
      await this.notificationService.updateRead(notificationId);
      return this.emitNotificationNotRead(userId, client);
    } catch (error) {
      throw error;
    }
  }

  async generateNotification(client: Socket, payload: CreateNotificationDto) {
    const notification: Notification = {} as Notification;

    if (!payload.userId || !payload.content || !payload.title) {
      client.emit('error', 'Failed to save notification');
      return;
    }
    notification.userId = payload.userId;
    notification.content = payload.content;
    notification.title = payload.title;
    notification.url = payload?.url || '';
    notification.type = payload?.type || NotificationType.INFO;
    notification.from = payload?.from || '';
    notification.createdAt = new Date();

    const userDestination = this.searchClientByUserId(payload.userId);
    if (userDestination) {
      userDestination.socket.emit('new-notification', payload);
    }
    try {
      await this.notificationService.create(payload);
      await this.emitNotificationNotRead(
        payload.userId,
        userDestination.socket,
      );
    } catch (error) {
      client.emit('error', 'Failed to save notification');
    }
  }

  private getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

  private checkUserConnected(userId: string) {
    const connectedClient = this.searchClientByUserId(userId);
    if (connectedClient) {
      connectedClient.socket.disconnect();
    }
  }

  private searchClientByUserId(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.userId === userId) {
        return connectedClient;
      }
    }

    return null;
  }

  private async emitNotificationNotRead(userId: string, client?: Socket) {
    const notificationNotRead =
      await this.notificationService.findNotRead(userId);
    client.emit('notifications', notificationNotRead);
  }
}
