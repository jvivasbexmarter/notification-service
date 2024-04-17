import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from './notification/notification.module';
import { WebsocketModule } from './websockets/websocket.module';

const envFilePath = `./environments/.${process.env.NODE_ENV}.env`;

const uri =
  process.env.NODE_ENV === 'production'
    ? process.env.MONGODB
    : 'mongodb://localhost:27017/notification-service';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB'),
      }),
      inject: [ConfigService],
    }),
    WebsocketModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
