import { Socket } from 'socket.io';

export interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    userId: string;
  };
}
