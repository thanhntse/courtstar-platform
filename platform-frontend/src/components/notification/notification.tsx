import React, { useState } from 'react';
import { NotificationItemProps } from "./index";
import notify from '../../assets/images/icon-notify.svg';
import check from '/images/check-check.svg';
import request from '/images/git-pull-request-arrow.svg';
import denied from '/images/git-pull-request-closed.svg';
import ticket from '/images/ticket-check.svg';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const NotificationItem: React.FC<NotificationItemProps> = (props) => {
  const { t } = useTranslation();
  const [notification, setNotification] = useState(props.notification);
  let icon: string = "";
  if (notification.type === 'REGISTERED') icon = check;
  else if (notification.type === 'ADD_CENTRE') icon = request;
  else if (notification.type === 'DENIED_CENTRE') icon = denied;
  else if (notification.type === 'BOOKING') icon = ticket;
  else icon = notify;

  return (
    <li className={`flex items-center justify-between gap-2 hover:rounded-md transition-all ease-in-out duration-300 p-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200`}
      onClick={() => {
        setNotification(
          (prev) => ({
            ...prev,
            status: true
          })
        );
        props.onNotificationClick(notification);

      }}>
      <img src={icon} alt="" className='w-7 h-7 mr-2' />
      <div className="flex-1 flex flex-col items-start">
        <span className="text-gray-700">{notification.content ? t(notification.content) : t('noReason')}</span>
        <span className="text-gray-500 text-sm flex items-end gap-3">
          {!notification.status && (
            <span className="inline-flex items-center justify-center p-1 mb-0.5 h-2 w-2 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full" />
          )}
          {moment(notification.date).fromNow()}
        </span>
      </div>
    </li>
  );
};

export default NotificationItem;
