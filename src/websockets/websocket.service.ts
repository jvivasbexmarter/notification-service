import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { NotificationService } from 'src/notification/notification.service';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    userId: string;
  };
}
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
        client.disconnect(true);
        return this.removeClient(client);
      }

      const payload = await this.authService.validateToken(token);

      if (!payload || !payload.id) {
        client.disconnect(true);
        return this.removeClient(client);
      }

      const userId = payload.id.toString();

      this.checkUserConnected(userId);

      this.connectedClients[client.id] = {
        socket: client,
        userId,
      };

      this.emitNotification(userId, client);
    } catch (e) {
      client.emit('error', 'Failed to authenticate user');
    }
  }

  removeClient(client: Socket) {
    delete this.connectedClients[client.id];
  }

  async updateRead(userId: string, client: Socket, notificationId: string) {
    try {
      await this.notificationService.updateRead(notificationId);
      return this.emitNotification(userId, client);
    } catch (error) {
      throw error;
    }
  }

  private getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }

  private checkUserConnected(userId: string) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.userId === userId) {
        connectedClient.socket.disconnect();
        break;
      }
    }
  }

  private async emitNotification(userId: string, client?: Socket) {
    const notificationNotRead =
      await this.notificationService.findNotRead(userId);

    client.emit('notifications', notificationNotRead);
  }
}
