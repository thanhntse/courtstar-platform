import Bell from './bell';

export interface Notification {
  id: number;
  content: string;
  date: string;
  type: string;
  status: boolean
}

export interface NotificationItemProps {
  notification: Notification;
  onNotificationClick: (notification: Notification) => void;
}

export interface NotificationProps {
  notifications?: Notification[];
}

export default Bell;
