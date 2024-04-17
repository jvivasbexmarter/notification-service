import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationModule } from 'src/notification/notification.module';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [WebsocketGateway, WebsocketService],
  imports: [NotificationModule, AuthModule],
})
export class WebsocketModule {}
