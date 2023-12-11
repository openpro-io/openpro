import { User } from '@/constants/types';
import { cloneDeep, set } from 'lodash';
import {
  PUBLIC_KEYCLOAK_CLIENT_ID,
  PUBLIC_KEYCLOAK_REALM,
  PUBLIC_KEYCLOAK_URL,
  PUBLIC_NEXTAUTH_URL,
} from '@/services/config';

const registrationEndpoint = `${PUBLIC_KEYCLOAK_URL}/realms/${PUBLIC_KEYCLOAK_REALM}/protocol/openid-connect/registrations`;

export const createRegistrationUrl = (redirectUri: string) => {
  // href="https://auth.oauthd.me/realms/oauthd/protocol/openid-connect/registrations?client_id=main-website&response_type=code&response_mode=fragment&scope=openid profile email&redirect_uri=http://localhost:3000/auth/signup/callback?type=post_register&kc_locale=en"
  const params = new URLSearchParams();
  params.set('client_id', `${PUBLIC_KEYCLOAK_CLIENT_ID}`);
  params.set('redirect_uri', redirectUri);
  params.set('scope', 'openid profile email');
  params.set('response_type', 'code');
  params.set('response_mode', 'fragment');
  return `${registrationEndpoint}?${params.toString()}`;
};

// @ts-ignore
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatUserAvatarUrl = (avatarUrl: string | undefined | null) => {
  if (avatarUrl?.startsWith('http') || !avatarUrl) return avatarUrl;

  const publicUrl = `${PUBLIC_NEXTAUTH_URL}/api${avatarUrl}`;

  // console.log({ publicUrl });

  return avatarUrl ? publicUrl : '';
};

export const formatUserFullName = (user: User): string => {
  if (!user) return '';

  return `${user?.firstName} ${user?.lastName}`;
};

export const formatUser = (user: User): User => ({
  ...user,
  avatarUrl: formatUserAvatarUrl(user?.avatarUrl),
  name: formatUserFullName(user),
});

// TODO: use nanoid
export const generateRandomAlphanumeric = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const getDomainName = () => {
  if (typeof window === 'undefined') return null;

  return (
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '')
  );
};

export const startsWithLetter = (string: string) => {
  return /^[a-zA-Z]/.test(string);
};

export const setBoardSetting = (
  settings: string | object | undefined | null,
  keyPath: Array<string> | string,
  value: any
) => {
  let data = {};

  if (settings) {
    data =
      typeof settings === 'string' ? JSON.parse(settings) : cloneDeep(settings);
  }

  // { user: {firstName: 'John', lastName: 'Doe'} }, 'user.firstName', 'Jane'
  set(data, keyPath, value);

  return JSON.stringify(data);
};

export const base64toBlob = (base64Data: string, contentType: string): Blob => {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
};
