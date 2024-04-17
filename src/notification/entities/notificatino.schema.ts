import * as mongoose from 'mongoose';
import { Notification, NotificationType } from './notification.interface';

export const NotificationSchema = new mongoose.Schema<Notification>(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      enum: NotificationType,
      default: NotificationType.INFO,
    },
    read: {
      type: Boolean,
      default: false,
    },
    from: {
      type: String,
      default: null,
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  {
    timestamps: true,
  },
);
