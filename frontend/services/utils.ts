import { cloneDeep, set } from 'lodash';
import {
  NEXT_PUBLIC_API_URL,
  PUBLIC_KEYCLOAK_CLIENT_ID,
  PUBLIC_KEYCLOAK_REALM,
  PUBLIC_KEYCLOAK_URL,
  PUBLIC_NEXTAUTH_URL,
} from '@/services/config';
import { User } from '@/gql/__generated__/graphql';

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

  const publicUrl = `${NEXT_PUBLIC_API_URL}${avatarUrl}`;

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
  // @ts-ignore
  name: user?.name ?? formatUserFullName(user),
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

// BEGIN: helper util for generating consistent colors from a string
export const getHashOfString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  return hash;
};

export const normalizeHash = (hash: number, min: number, max: number) => {
  return Math.floor((hash % (max - min)) + min);
};

const hRange = [0, 360];
const sRange = [0, 100];
const lRange = [0, 100];

type HSL = [number, number, number];
type RGB = [number, number, number];
type HEX = string;

const generateHSL = (name: string): HSL => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, hRange[0], hRange[1]);
  const s = normalizeHash(hash, sRange[0], sRange[1]);
  const l = normalizeHash(hash, lRange[0], lRange[1]);
  return [h, s, l];
};

const HSLtoString = (hsl: HSL) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

// Function to convert HSL to RGB
const HSLtoRGB = (hsl: HSL): RGB => {
  let [h, s, l] = hsl;
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Function to convert RGB to HEX
const RGBtoHex = (rgb: RGB): HEX => {
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return '#' + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
};

// Function to convert HSL to HEX
const HSLtoHex = (hsl: HSL): HEX => {
  const rgb = HSLtoRGB(hsl);
  return RGBtoHex(rgb);
};

export const getUserColor = (userId: string, format?: 'hsl' | 'hex') => {
  const hsl = generateHSL(userId);
  // TODO: implement other color formats
  if (format === 'hex') return HSLtoHex(hsl);
  if (format === 'hsl') return HSLtoString(hsl);

  return HSLtoString(hsl);
};

// END: helper util for generating consistent colors from a string
