import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PaginationNotificationDto } from './dto/pagination-notification.dto';
import { Notification } from './entities/notification.interface';
import { NotificationService } from './notification.service';

@Auth()
@ApiTags('Notifications')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiOkResponse({
    description: 'Notification created successfully',
    type: Notification,
    isArray: false,
  })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications paginated for user' })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Notification',
          },
        },
        pageNo: {
          type: 'number',
        },
        pageSize: {
          type: 'number',
        },
        totalElements: {
          type: 'number',
        },
        totalPages: {
          type: 'number',
        },
        last: {
          type: 'boolean',
        },
      },
    },
  })
  findAll(
    @GetUser() userId: string,
    @Query() paginationDto: PaginationNotificationDto,
  ) {
    const pageNo = Number(paginationDto.pageNo);
    const pageSize = Number(paginationDto.pageSize);
    return this.notificationService.findAll(userId, pageNo, pageSize);
  }

  @Get('new')
  @ApiOperation({
    summary: 'Get 5 first notifications not read and total not read for user',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        notifications: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Notification',
          },
        },
        totalNotRead: {
          type: 'number',
        },
      },
    },
  })
  findNotRead(@GetUser() userId: string) {
    return this.notificationService.findNotRead(userId);
  }

  @Get('new-number')
  @ApiOperation({ summary: 'Get all notifications number for user' })
  @ApiOkResponse({
    type: Number,
  })
  findNotReadNumber(@GetUser() userId: string) {
    return this.notificationService.findNotReadNumber(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by id' })
  @ApiOkResponse({
    type: Notification,
  })
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update notification as read' })
  @ApiOkResponse({
    type: Notification,
  })
  update(@Param('id') id: string) {
    return this.notificationService.updateRead(id);
  }

  @ApiOperation({ summary: 'Delete notification by id' })
  @ApiOkResponse({
    type: Boolean,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(id);
  }
}
