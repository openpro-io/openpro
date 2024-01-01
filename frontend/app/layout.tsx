'use client';

import { ApolloProvider } from '@apollo/client';
import { PublicEnvScript } from 'next-runtime-env';
import { Inter } from 'next/font/google';

import NextAuthProvider from '@/app/context/NextAuthProvider';
import MainLayout, { ProtectedLayout } from '@/components/Layout';
import { apolloClient } from '@/services/apollo-client';

import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <PublicEnvScript />
        <title>OpenPro</title>
      </head>
      <body id='root' className={inter.className}>
        <ApolloProvider client={apolloClient}>
          <NextAuthProvider>
            <ProtectedLayout>
              <MainLayout>{children}</MainLayout>
            </ProtectedLayout>
          </NextAuthProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
