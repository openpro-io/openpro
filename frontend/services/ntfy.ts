import axios from 'axios';
import { PUBLIC_NFTY_HTTP_SSL } from '@/services/config';

type Headers = {
  'Content-Type': string;
};

type Action =
  | { type: 'view'; label: string; url: string }
  | { type: 'broadcast'; label: string; extras: any }
  | {
      type: 'http';
      label: string;
      url: string;
      method: 'POST' | 'GET' | 'PUT';
      headers: { [key: string]: string };
      body: string;
    };

type Priority = 1 | 2 | 3 | 4 | 5;

type OpenproTags = 'openpro.notificationDuration' | 'openpro.notificationIcon';

type Notification = {
  topic: string; // Required
  message?: string;
  title?: string;
  tags?: Array<string | OpenproTags>;
  priority?: Priority;
  actions?: Action[];
  click?: string;
  attach?: string;
  markdown?: boolean;
  icon?: string;
  filename?: string;
  delay?: string;
  email?: string;
  call?: string | 'yes';
};

export const notify = async ({
  topic,
  title,
  message,
  priority,
  tags,
  click,
}: Notification) => {
  let url = '';

  if (PUBLIC_NFTY_HTTP_SSL) {
    url = 'https://';
  } else {
    url = 'http://';
  }

  url += process.env.NFTY_HTTP_HOST || 'localhost:8093';

  const headers: Headers = {
    'Content-Type': 'text/plain',
  };

  const postData: Notification = { topic, message };

  if (priority) postData.priority = Number(priority) as Priority;
  if (title) postData.title = title;
  if (tags) postData.tags = tags;
  if (click) postData.click = click;

  const { data } = await axios.post(`${url}`, postData, { headers });

  return data;
};
