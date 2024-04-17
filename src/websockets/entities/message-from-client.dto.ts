import { IsString } from 'class-validator';

export class MessageFromClientDto {
  @IsString()
  notificationId: string;
  userId: string;
}
