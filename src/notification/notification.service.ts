import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  Notification,
  NotificationResponse,
} from './entities/notification.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.notificationModel.create(
        createNotificationDto,
      );
      return this.mapNotificationResponse(notification);
    } catch (error) {
      throw error;
    }
  }

  async findNotRead(userId: string) {
    try {
      const totalNotRead = await this.findNotReadNumber(userId);
      const notifications = await this.notificationModel
        .find({
          userId: userId,
          read: false,
        })
        .sort({ createdAt: -1 })
        .limit(5);
      return {
        notifications: notifications.map((notification) => {
          return this.mapNotificationResponse(notification);
        }),
        totalNotRead,
      };
    } catch (error) {
      throw error;
    }
  }

  async findNotReadNumber(userId: string) {
    try {
      return await this.notificationModel.countDocuments({
        userId: userId,
        read: false,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: string, pageNo: number, pageSize: number) {
    try {
      if (!userId) throw new BadRequestException('userId is required');
      const notifications = await this.notificationModel
        .find({
          userId: userId,
        })
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip((pageNo - 1) * Number(pageSize))
        .lean()
        .exec();
      const totalElements = await this.notificationModel.countDocuments({
        userId: userId,
      });
      const totalPages = Math.ceil(totalElements / pageSize);
      return {
        content: notifications.map((notification) => {
          return this.mapNotificationResponse(notification);
        }),
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages,
        totalElements: totalElements,
        last: pageNo === totalPages,
      };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const notification = await this.notificationModel.findById(id).lean();
      if (!notification) throw new NotFoundException('Notification not found');
      return this.mapNotificationResponse(notification);
    } catch (error) {
      throw error;
    }
  }

  async updateRead(id: string) {
    try {
      const updateNotification = await this.notificationModel.findByIdAndUpdate(
        id,
        { read: true },
        { new: true },
      );

      if (!updateNotification)
        throw new NotFoundException('Notification not found');

      return this.mapNotificationResponse(updateNotification);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.notificationModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private mapNotificationResponse(
    notification: Notification,
  ): NotificationResponse {
    return {
      id: notification._id,
      title: notification.title,
      content: notification.content,
      type: notification.type,
      read: notification.read,
      from: notification.from,
      url: notification.url,
      userId: notification.userId,
      createdAt: notification.createdAt,
    };
  }
}
