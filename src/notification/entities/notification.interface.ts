import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
// import { User } from 'src/auth/user.entity/user.interface';

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  CUSTOM = 'custom',
}

export class Notification extends Document {
  @ApiProperty({
    type: String,
    description: 'User ID to send the notification',
    example: 'uuid',
  })
  userId: string;

  @ApiProperty({
    type: String,
    description: 'Notification title',
    example: 'Notification title',
  })
  title: string;

  @ApiProperty({
    type: String,
    description: 'Notification content',
    example: 'Notification content',
  })
  content: string;

  @ApiPropertyOptional({
    type: String,
  })
  url: string;

  @ApiPropertyOptional({
    enumName: 'NotificationType',
    enum: NotificationType,
    description: 'Notification type',
    example: 'info',
  })
  type: NotificationType;

  @ApiProperty({
    type: Boolean,
    description: 'Notification read status',
    example: 'true',
  })
  read: boolean;

  @ApiProperty({
    type: String,
    description: 'Notification origen',
    example: 'uuid',
  })
  from: string;

  @ApiProperty({
    type: Date,
    description: 'Notification created date',
  })
  createdAt?: Date;
  // readonly user: PopulatedDoc<User & Document>;
}

export interface NotificationResponse {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  read: boolean;
  from: string;
  url: string;
  userId: string;
  createdAt?: Date;
}
