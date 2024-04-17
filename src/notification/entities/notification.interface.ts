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
  readonly userId: string;

  @ApiProperty({
    type: String,
    description: 'Notification title',
    example: 'Notification title',
  })
  readonly title: string;

  @ApiProperty({
    type: String,
    description: 'Notification content',
    example: 'Notification content',
  })
  readonly content: string;

  @ApiPropertyOptional({
    type: String,
  })
  readonly url: string;

  @ApiPropertyOptional({
    enumName: 'NotificationType',
    enum: NotificationType,
    description: 'Notification type',
    example: 'info',
  })
  readonly type: NotificationType;

  @ApiProperty({
    type: Boolean,
    description: 'Notification read status',
    example: 'true',
  })
  readonly read: boolean;

  @ApiProperty({
    type: String,
    description: 'Notification origen',
    example: 'uuid',
  })
  readonly from: string;

  @ApiProperty({
    type: Date,
    description: 'Notification created date',
  })
  readonly createdAt?: Date;
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
