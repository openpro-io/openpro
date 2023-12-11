import { env } from 'next-runtime-env';

export const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
export const OPENAI_API_BASE = process.env.OPENAI_API_BASE;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const GPT_ENGINE = process.env.GPT_ENGINE;
export const PUBLIC_NEXTAUTH_URL = env('NEXT_PUBLIC_NEXTAUTH_URL');
export const NEXT_PUBLIC_API_URL = env('NEXT_PUBLIC_API_URL');
export const PUBLIC_DEFAULT_LOGIN_PROVIDER = env(
  'NEXT_PUBLIC_DEFAULT_LOGIN_PROVIDER'
);

export const AUTH_KEYCLOAK_ID = process.env.AUTH_KEYCLOAK_ID;

export const AUTH_KEYCLOAK_SECRET = process.env.AUTH_KEYCLOAK_SECRET;

export const AUTH_KEYCLOAK_ISSUER = process.env.AUTH_KEYCLOAK_ISSUER;

export const PUBLIC_NFTY_HTTP_SSL = env('NEXT_PUBLIC_NFTY_HTTP_SSL') === 'true';
export const NFTY_WS_SSL = (process.env.NFTY_WS_SSL ?? 'false') === 'true';
export const NFTY_WS_HOST = process.env.NFTY_WS_HOST ?? 'localhost:8093';

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// TODO: These might be required
export const PUBLIC_KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;
export const PUBLIC_KEYCLOAK_URL = process.env.NEXT_PUBLIC_KEYCLOAK_URL;

export const PUBLIC_KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM;
