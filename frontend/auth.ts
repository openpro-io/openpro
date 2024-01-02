import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { NextAuthOptions as NextAuthConfig } from 'next-auth';
import { getServerSession } from 'next-auth';
import { AdapterUser } from 'next-auth/adapters';
import { type JWT, getToken } from 'next-auth/jwt';
// @ts-ignore
import { type OAuthConfig } from 'next-auth/providers';
import GithubProvider from 'next-auth/providers/github';
import Keycloak, { type KeycloakProfile } from 'next-auth/providers/keycloak';

import {
  AUTH_KEYCLOAK_ID,
  AUTH_KEYCLOAK_ISSUER,
  AUTH_KEYCLOAK_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from '@/services/config';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation
declare module 'next-auth/jwt' {
  interface JWT {
    /** The user's role. */
    userRole?: 'admin';
    id_token?: string;
    provider?: string;
    subject?: string;
  }
}

declare module 'next-auth' {
  interface User {
    id: string;
  }

  interface Session {
    user: User;
    accessToken?: string;
    accessTokenError?: string;
  }
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
/**
 * @param  {JWT} token
 */
const refreshAccessToken = async (token: JWT) => {
  // TODO: Lets clean this up
  try {
    // @ts-ignore
    if (Date.now() > token.refreshTokenExpiresAt) {
      throw Error('RefreshTokenExpired');
    }

    console.log('Refreshing access token...');

    const details = {
      client_id: AUTH_KEYCLOAK_ID,
      client_secret: AUTH_KEYCLOAK_SECRET,
      grant_type: ['refresh_token'],
      refresh_token: token.refreshToken,
    };

    const formBody: string[] = [];

    Object.entries(details).forEach(([key, value]: [string, any]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      formBody.push(encodedKey + '=' + encodedValue);
    });

    const formData = formBody.join('&');
    const url = `${AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/token`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formData,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpiresAt:
        Date.now() + (refreshedTokens.expires_in - 15) * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      refreshTokenExpiresAt:
        Date.now() + (Number(refreshedTokens.refresh_expires_in) - 15) * 1000,
      refreshExpiresIn: Number(refreshedTokens.refresh_expires_in),
      error: undefined,
    };
  } catch (error: any) {
    return {
      ...token,
      error: error.message ?? 'RefreshAccessTokenError',
    };
  }
};

export const config = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    newUser: '/auth/new-user',
  },
  theme: {
    logo: 'https://next-auth.js.org/img/logo/logo-sm.png',
  },
  providers: [
    Keycloak({
      clientId: AUTH_KEYCLOAK_ID as string,
      clientSecret: AUTH_KEYCLOAK_SECRET as string,
      issuer: AUTH_KEYCLOAK_ISSUER as string,
    }),
    GithubProvider({
      clientId: GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // console.log({ session, user, token });
      if (token.sub) {
        session.user.id = `${token.provider}__${token.sub}`;
      }

      // console.log({ session, user, token });

      // @ts-ignore
      // session.accessToken = token?.accessToken;

      // @ts-ignore
      // session.accessTokenError = token.error ?? undefined;

      return session;
    },
    async jwt({ token, account, user, profile }) {
      // console.log('Token: ');
      // console.log(token);
      //
      // console.log('user: ');
      // console.log(user);
      //
      // console.log('Account: ');
      // console.log(account);
      //
      // console.log('Profile: ');
      // console.log(profile);

      if (account) {
        token.provider = account.provider;
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpiresAt =
          Date.now() + (Number(account.expires_in ?? 300) - 15) * 1000;
        token.refreshTokenExpiresAt =
          Date.now() + (Number(account.refresh_expires_in) - 15) * 1000;
        token.refreshExpiresIn = account.refresh_expires_in;

        // Some additional options we can use....
        // token.expires_at = account.expires_at;
        // expires_at: 1699311348,
        // refresh_expires_in: 1800,
        // providerAccountId: 'e04f42b0-0184-4009-a349-6bdff883000e',
      }

      // Return previous token if the access token has not expired yet
      if (
        token?.accessTokenExpiresAt &&
        // @ts-ignore
        Date.now() < token.accessTokenExpiresAt
      ) {
        return token;
      }

      // console.log({ token });

      // Access token has expired, try to update it
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  events: {
    async signOut({ token }: { token: JWT }) {
      if (token.provider === 'keycloak') {
        const issuerUrl = (
          config.providers.find(
            (p) => p.id === 'keycloak'
          ) as OAuthConfig<KeycloakProfile>
        ).options!.issuer!;

        const logOutUrl = new URL(
          `${issuerUrl}/protocol/openid-connect/logout`
        );

        logOutUrl.searchParams.set('id_token_hint', token.id_token!);

        await fetch(logOutUrl);
      }
    },
  },
} satisfies NextAuthConfig;

// Helper function to get session without passing config every time
// https://next-auth.js.org/configuration/nextjs#getserversession
export function auth(
  ...args:
    | [GetServerSidePropsContext['req'], GetServerSidePropsContext['res']]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, config);
}

// We recommend doing your own environment variable validation
declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      NEXTAUTH_SECRET: string;

      AUTH_KEYCLOAK_ID: string;
      AUTH_KEYCLOAK_SECRET: string;
      AUTH_KEYCLOAK_ISSUER: string;
    }
  }
}
