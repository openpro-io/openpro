import useNtfy from '@/hooks/useNtfy';
import { useEffect } from 'react';
import { Alert } from '@/components/Alert';
import { toast } from 'react-hot-toast';
import { priorityToIcon } from '@/components/Icons';
import { PUBLIC_NEXTAUTH_URL } from '@/services/config';
import { notificationsTable } from '@/database/database.config';

type ProcessTagsReturn = {
  otherTags: string[];
  openpro: Record<string, string>;
};

const processTags = (tags: any | undefined): ProcessTagsReturn => {
  if (!tags) return { otherTags: [], openpro: {} };

  const openpro = tags
    .filter((tag: string) => tag.startsWith('openpro.'))
    .reduce((obj: Record<string, string>, tag: string) => {
      const [key, value] = tag.replace('openpro.', '').split('=');
      obj[key] = value;
      return obj;
    }, {});

  const otherTags = tags.filter((tag: string) => !tag.startsWith('openpro.'));

  return { otherTags, openpro };
};

const Notifications = () => {
  const ntfy = useNtfy();

  useEffect(() => {
    // console.log(ntfy.lastJsonMessage);
    const event: any = ntfy?.lastJsonMessage;
    // message, title, topic, time, id, priority: 5 (max)

    if (event?.event === 'message') {
      event.subscriptionId = `http://${PUBLIC_NEXTAUTH_URL}/${event.topic}`;
      event.new = 1;

      notificationsTable.add(event).catch((error) => {
        if (
          !error.toString().includes('Key already exists in the object store.')
        ) {
          return Promise.reject(error);
        }
      });

      const { otherTags, openpro } = processTags(event?.tags);

      toast.success(
        JSON.stringify({
          title: event?.title,
          message: event?.message,
          tags: otherTags,
          priority: event?.priority,
          click: event?.click,
        }),
        {
          duration: openpro?.notificationDuration
            ? Number(openpro?.notificationDuration)
            : 10000,
          icon: priorityToIcon(event?.priority),
        }
      );
    }
  }, [ntfy.lastJsonMessage]);

  return <Alert />;
};

export default Notifications;
