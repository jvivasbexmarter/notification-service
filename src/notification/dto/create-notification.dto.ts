import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../entities/notification.interface';

export class CreateNotificationDto {
  @ApiProperty({
    type: String,
    description: 'Notification content',
    example: 'Notification content',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    type: String,
    description: 'Notification title',
    example: 'Notification title',
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
    description: 'User ID to send the notification',
    example: 'uuid',
    required: true,
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    enumName: 'NotificationType',
    enum: NotificationType,
    description: 'Notification type',
    example: 'info',
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;

  @ApiPropertyOptional({
    type: String,
    description: 'User ID origen of the notification',
    example: 'uuid',
    required: true,
  })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({
    type: String,
  })
  @IsOptional()
  @IsString()
  url?: string;
}
