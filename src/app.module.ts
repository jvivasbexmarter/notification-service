import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from './notification/notification.module';
import { WebsocketModule } from './websockets/websocket.module';

const envFilePath = `./environments/.${process.env.NODE_ENV}.env`;
const environmet = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          environmet === 'dev'
            ? configService.get<string>('MONGODB_DEV')
            : configService.get<string>('MONGODB_PROD'),
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
